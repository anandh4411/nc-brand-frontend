import { AuthTokens } from "./types";
import { env } from "@/config/env";

export class TokenManager {
  static setTokens(tokens: AuthTokens): void {
    if (!tokens.accessToken || !tokens.refreshToken) {
      return;
    }

    localStorage.setItem(env.accessTokenKey, tokens.accessToken);
    localStorage.setItem(env.refreshTokenKey, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    const token = localStorage.getItem(env.accessTokenKey);
    return token && token !== "undefined" && token !== "null" ? token : null;
  }

  static getRefreshToken(): string | null {
    const token = localStorage.getItem(env.refreshTokenKey);
    return token && token !== "undefined" && token !== "null" ? token : null;
  }

  static clearTokens(): void {
    localStorage.removeItem(env.accessTokenKey);
    localStorage.removeItem(env.refreshTokenKey);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  static hasTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    if (!accessToken || !refreshToken) return false;
    if (this.isTokenExpired(accessToken)) {
      this.clearTokens();
      return false;
    }
    return true;
  }
}
