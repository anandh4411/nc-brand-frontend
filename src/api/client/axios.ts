import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { TokenManager } from "./auth";
import { ApiError, ApiErrorResponse, ApiResponse, AuthTokens } from "./types";
import { env } from "@/config/env";
import { handleApiError } from "@/lib/error-handler";

// Extended request config for retry logic
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: env.apiTimeout,
      // Don't set default Content-Type - let axios handle it per request
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = TokenManager.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as RetryableRequestConfig;

        // Ensure we have a valid request config
        if (!originalRequest) {
          return Promise.reject(this.handleError(error));
        }

        // Handle 403 errors (forbidden) - force logout
        if (error.response?.status === 403) {
          TokenManager.clearTokens();
          this.handleAuthFailure();
          return Promise.reject(this.handleError(error));
        }

        // Handle 401 errors (token expired/invalid)
        if (error.response?.status === 401 && !originalRequest._retry) {
          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                // Update authorization header with new token
                const newToken = TokenManager.getAccessToken();
                if (newToken && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          // Mark request as retry attempt
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = TokenManager.getRefreshToken();

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Attempt to refresh token
            const newTokens = await this.refreshToken(refreshToken);
            TokenManager.setTokens(newTokens);

            // Process all queued requests with new token
            this.processQueue(null);

            // Update original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect
            this.processQueue(refreshError);
            TokenManager.clearTokens();

            // Emit logout event or redirect to login
            this.handleAuthFailure();

            return Promise.reject(this.handleError(error));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    this.failedQueue = [];
  }

  private getTokenType(token: string): 'admin' | 'customer' | 'outlet' | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.type || 'admin';
    } catch {
      return null;
    }
  }

  private async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Determine token type from current access token
      const currentToken = TokenManager.getAccessToken();
      const tokenType = currentToken ? this.getTokenType(currentToken) : 'admin';

      // Use appropriate refresh endpoint based on token type
      let refreshEndpoint = `${env.apiBaseUrl}${env.apiVersion}/auth/refresh`;
      if (tokenType === 'customer') {
        refreshEndpoint = `${env.apiBaseUrl}${env.apiVersion}/shop/auth/refresh`;
      } else if (tokenType === 'outlet') {
        refreshEndpoint = `${env.apiBaseUrl}${env.apiVersion}/auth/outlet-refresh`;
      }

      // Don't use the interceptor for refresh call to avoid infinite loops
      const response = await axios.post(
        refreshEndpoint,
        { refreshToken: refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          timeout: env.apiRefreshTimeout,
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  private handleAuthFailure(): void {
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }

  /**
   * Transform backend ErrorResponse to frontend ApiError
   * Matches backend error middleware structure
   */
  private handleError(error: AxiosError<ApiErrorResponse>): ApiError {
    try {
      const statusCode = error.response?.status || 500;
      const errorData = error.response?.data;

      // If backend returned structured error response
      if (errorData?.success === false && errorData.error) {
        const backendError = errorData.error;

        const apiError: ApiError = {
          statusCode: backendError.statusCode,
          code: backendError.code,
          message: backendError.message,
          details: backendError.details,
          requestId: backendError.requestId,
          timestamp: backendError.timestamp,
          path: backendError.path,
        };

        // Show toast notification globally
        handleApiError(apiError);

        // Dev logging
        if (import.meta.env.DEV) {
          console.error("[API] Error:", {
            ...apiError,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
          });
        }

        return apiError;
      }

      // Fallback for non-standard errors (network issues, etc.)
      const apiError: ApiError = {
        statusCode,
        code: "NETWORK_ERROR",
        message: error.message || "Network error occurred",
      };

      handleApiError(apiError);

      if (import.meta.env.DEV) {
        console.error("[API] Network Error:", {
          ...apiError,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
        });
      }

      return apiError;
    } catch (e) {
      // Failsafe - return basic error
      console.error("[API] handleError failed:", e);
      const fallbackError: ApiError = {
        statusCode: 500,
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      };
      return fallbackError;
    }
  }

  // Public methods for making requests
  public async get<T>(url: string, config: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<T>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    try {
      const response = await this.client.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<T>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async patch<T>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    try {
      const response = await this.client.patch<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T>(url: string, config: AxiosRequestConfig = {}) {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public setAuthToken(token: string): void {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  public clearAuthToken(): void {
    delete this.client.defaults.headers.common["Authorization"];
  }

  public async uploadFile<T>(
    url: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
  ) {
    try {
      // Use method from config (PUT for updates, POST for create)
      const method = (config.method?.toLowerCase() || 'post') as 'post' | 'put';

      console.log('📤 uploadFile - method:', method);
      console.log('📤 uploadFile - url:', url);

      // DO NOT set Content-Type header manually - browser will set it with boundary
      const response = await this.client[method]<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          // Let browser set Content-Type automatically for FormData
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async downloadFile(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<{ blob: Blob; filename: string }> {
    try {
      const response = await this.client.get(url, {
        ...config,
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || 'download';

      return {
        blob: response.data,
        filename,
      };
    } catch (error) {
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
