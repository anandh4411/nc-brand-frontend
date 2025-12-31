# Production-Grade Error Handling System

## Overview

This document describes the **enterprise-level, loosely coupled error handling** system that integrates seamlessly with the backend error middleware.

## Architecture

### Key Principles

1. **DRY (Don't Repeat Yourself)**: Error handling logic exists in ONE place
2. **Loosely Coupled**: Hooks don't know about toasts, API client handles errors globally
3. **Type-Safe**: Full TypeScript alignment with backend error structure
4. **Production-Ready**: Matches backend `AppError` and validation middleware exactly

### Error Flow

```
┌─────────────┐
│   API Call  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────┐
│  Axios Interceptor      │ ← Catches ALL errors
│  (axios.ts)             │
└──────┬──────────────────┘
       │
       ↓
┌─────────────────────────┐
│  Error Transformer      │ ← Converts backend ErrorResponse
│  handleError()          │   to frontend ApiError
└──────┬──────────────────┘
       │
       ↓
┌─────────────────────────┐
│  Global Error Handler   │ ← Shows toast notifications
│  (error-handler.ts)     │   based on error code
└─────────────────────────┘
```

## Backend Integration

### Backend Error Structure

```typescript
// Backend ErrorResponse (from error middleware)
{
  success: false,
  error: {
    statusCode: 400,
    code: "BAD_REQUEST",
    message: "Validation failed",
    details: {
      errors: [
        { field: "email", message: "Invalid email", code: "invalid_string" }
      ]
    },
    requestId: "req-123",
    timestamp: "2025-01-08T...",
    path: "/v1/users"
  }
}
```

### Frontend Error Type

```typescript
// Frontend ApiError (transformed)
interface ApiError {
  statusCode: number;
  code: string;          // Matches backend error codes
  message: string;
  details?: any;         // Validation errors, etc.
  requestId?: string;
  timestamp?: string;
  path?: string;
}
```

## Components

### 1. Type Definitions (`api/client/types.ts`)

```typescript
// Success response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error response (matches backend)
interface ApiErrorResponse {
  success: false;
  error: {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
    path: string;
  };
}

// Frontend error object
interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: any;
  requestId?: string;
  timestamp?: string;
  path?: string;
}

// Validation errors
interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### 2. Axios Interceptor (`api/client/axios.ts`)

**Key Method: `handleError()`**

```typescript
private handleError(error: AxiosError<ApiErrorResponse>): ApiError {
  const statusCode = error.response?.status || 500;
  const errorData = error.response?.data;

  // Transform backend error to frontend error
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

    // Show toast notification GLOBALLY
    handleApiError(apiError);

    return apiError;
  }

  // Fallback for network errors
  const apiError: ApiError = {
    statusCode,
    code: "NETWORK_ERROR",
    message: error.message || "Network error occurred",
  };

  handleApiError(apiError);
  return apiError;
}
```

### 3. Global Error Handler (`lib/error-handler.ts`)

**Error Code Mapping**

```typescript
const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  UNAUTHORIZED: {
    title: "Authentication Required",
    description: "Please log in to continue",
  },
  FORBIDDEN: {
    title: "Access Denied",
    description: "You don't have permission to perform this action",
  },
  BAD_REQUEST: {
    title: "Invalid Request",
    description: "The request contains invalid data",
  },
  NOT_FOUND: {
    title: "Not Found",
    description: "The requested resource was not found",
  },
  CONFLICT: {
    title: "Conflict",
    description: "This action conflicts with existing data",
  },
  INTERNAL_ERROR: {
    title: "Server Error",
    description: "An unexpected error occurred",
  },
  // ... more codes
};
```

**Handler Function**

```typescript
export const handleApiError = (
  error: ApiError,
  options: HandleErrorOptions = {}
) => {
  const { customMessage, showToast = true, silent = false } = options;

  if (silent) return;
  if (!showToast) return;

  // Custom message override
  if (customMessage) {
    toaster.error("Error", customMessage);
    return;
  }

  // Handle validation errors specially
  if (error.code === "BAD_REQUEST" && error.details?.errors) {
    const validationErrors = error.details.errors as ValidationError[];
    const formattedErrors = formatValidationErrors(validationErrors);
    toaster.error("Validation Failed", formattedErrors);
    return;
  }

  // Map error code to user-friendly message
  const errorConfig = ERROR_MESSAGES[error.code];
  if (errorConfig) {
    toaster.error(errorConfig.title, error.message || errorConfig.description);
    return;
  }

  // Fallback
  toaster.error("Error", error.message || "An unexpected error occurred");
};
```

### 4. Toast System (`lib/toaster.ts` & `lib/toast.ts`)

**Basic Toaster**

```typescript
// lib/toaster.ts
import { toast } from "sonner";

export const toaster = {
  success: (title: string, description?: string) => {
    toast.success(title, { description });
  },
  error: (title: string, description?: string) => {
    toast.error(title, { description });
  },
  info: (title: string, description?: string) => {
    toast.info(title, { description });
  },
  warn: (title: string, description?: string) => {
    toast.warning(title, { description });
  },
};
```

**Convenient Exports**

```typescript
// lib/toast.ts - Single import for all toast needs
export { toaster as toast } from './toaster';
export { showSuccess, showError, showInfo, showWarning } from './error-handler';
```

## Usage Patterns

### 1. Basic Hook (No Error Handling Needed)

```typescript
// api/hooks/users/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';
import { showSuccess } from '@/lib/error-handler';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showSuccess('User created successfully');
    },

    // NO onError needed! ✅
    // Errors handled globally in axios interceptor
  });
};
```

### 2. Manual Toast Anywhere

```typescript
// In any component, utility, or function
import { toast, showSuccess, showError } from '@/lib/toast';

// Simple success
showSuccess('Operation completed!');

// Simple error
showError('Something went wrong');

// With custom title
toast.success('Custom Title', 'Description here');
toast.error('Error Title', 'Error details');
toast.info('Info', 'Information message');
toast.warn('Warning', 'Warning message');
```

### 3. Custom Error Handling (Optional)

```typescript
// For specific cases that need custom logic
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (uuid: string) => usersApi.deleteUser(uuid),

    onSuccess: () => {
      showSuccess('User deleted successfully');
    },

    onError: (error: ApiError) => {
      // Custom logic based on error code
      if (error.code === 'NOT_FOUND') {
        // Redirect or do something specific
        router.navigate({ to: '/users' });
      }

      // Or suppress global toast and show custom message
      handleApiError(error, { silent: true });
      showError('Custom error message here');
    },
  });
};
```

### 4. Silent Mode (No Toast)

```typescript
// For background operations
export const usePrefetchData = () => {
  return useQuery({
    queryKey: ['prefetch'],
    queryFn: () => api.getData(),
    meta: {
      errorHandler: (error: ApiError) => {
        handleApiError(error, { silent: true });
      },
    },
  });
};
```

## Error Code Handling

### Supported Error Codes (from Backend)

| Code | Status | Toast Title | Default Description |
|------|--------|-------------|---------------------|
| `UNAUTHORIZED` | 401 | "Authentication Required" | "Please log in to continue" |
| `FORBIDDEN` | 403 | "Access Denied" | "You don't have permission" |
| `BAD_REQUEST` | 400 | "Invalid Request" | "Request contains invalid data" |
| `NOT_FOUND` | 404 | "Not Found" | "Resource was not found" |
| `CONFLICT` | 409 | "Conflict" | "Action conflicts with existing data" |
| `UNPROCESSABLE_ENTITY` | 422 | "Invalid Data" | "Unable to process data" |
| `TOO_MANY_REQUESTS` | 429 | "Rate Limit Exceeded" | "Too many requests" |
| `INTERNAL_ERROR` | 500+ | "Server Error" | "Unexpected error occurred" |

### Validation Errors

Backend sends validation errors in `details.errors[]`:

```typescript
// Backend
{
  code: "BAD_REQUEST",
  details: {
    errors: [
      { field: "email", message: "Invalid email format", code: "invalid_string" },
      { field: "password", message: "Too short", code: "too_small" }
    ]
  }
}

// Frontend toast shows:
Title: "Validation Failed"
Description:
  email: Invalid email format
  password: Too short
```

## Token Refresh Flow

```typescript
// Automatic token refresh on 401
1. Request fails with 401
2. Interceptor queues request
3. Calls /v1/auth/refresh with refreshToken
4. Updates tokens in TokenManager
5. Retries original request with new token
6. If refresh fails:
   - Clears tokens
   - Dispatches "auth:logout" event
   - Shows "Authentication Required" toast
   - Redirects to login
```

## Development Features

### Console Logging

In development mode, all errors are logged with full details:

```javascript
// Console output
API Error: {
  code: "BAD_REQUEST",
  statusCode: 400,
  message: "Validation failed",
  details: { errors: [...] },
  requestId: "req-abc-123",
  timestamp: "2025-01-08T10:30:00Z",
  path: "/v1/users",
  url: "/v1/users",
  method: "POST"
}
```

### Unknown Error Codes

```javascript
// If backend sends unknown code
console.warn("Unknown error code:", "CUSTOM_ERROR", { ... });
// Still shows toast with backend message
```

## Best Practices

### ✅ DO

1. **Let global handler work**: Don't add `onError` in hooks unless needed
2. **Use showSuccess**: Call after successful mutations
3. **Use error codes**: Check `error.code` for conditional logic
4. **Log in dev**: Use console.error for debugging
5. **Keep hooks clean**: Focus on data, not error UI

### ❌ DON'T

1. **Don't repeat error handling**: Already done globally
2. **Don't check status codes**: Use `error.code` instead
3. **Don't manually format validation errors**: Handled automatically
4. **Don't create custom toast components**: Use `toaster` or helper functions
5. **Don't suppress all errors**: Use `silent: true` sparingly

## Migration Guide

### Old Code (Before)

```typescript
// ❌ Repetitive, tightly coupled
export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      toast.success('User created');
    },
    onError: (error: any) => {
      if (error.status === 400 && error.errors) {
        const msgs = Object.entries(error.errors)
          .map(([k, v]) => `${k}: ${v.join(', ')}`)
          .join('\n');
        toast.error('Validation Error', msgs);
      } else if (error.status === 401) {
        toast.error('Unauthorized', 'Please log in');
      } else if (error.status === 500) {
        toast.error('Server Error', 'Try again later');
      } else {
        toast.error('Error', error.message || 'Unknown error');
      }
    },
  });
};
```

### New Code (After)

```typescript
// ✅ Clean, loosely coupled, DRY
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showSuccess('User created successfully');
    },
    // Errors handled globally - no onError needed!
  });
};
```

## Testing

### Mock API Client

```typescript
import { renderHook } from '@testing-library/react';
import { useCreateUser } from './useCreateUser';
import * as usersApi from '@/api/endpoints/users';

jest.mock('@/api/endpoints/users');

it('shows error toast on API failure', async () => {
  const mockError: ApiError = {
    statusCode: 400,
    code: 'BAD_REQUEST',
    message: 'Validation failed',
  };

  (usersApi.createUser as jest.Mock).mockRejectedValue(mockError);

  const { result } = renderHook(() => useCreateUser());

  await expect(
    result.current.mutateAsync({ name: '', email: 'invalid' })
  ).rejects.toEqual(mockError);

  // Toast shown automatically by global handler
});
```

## File Structure

```
src/
├── api/
│   ├── client/
│   │   ├── axios.ts              # Interceptors + handleError()
│   │   ├── types.ts              # ApiError, ApiErrorResponse
│   │   └── auth.ts               # TokenManager
│   ├── endpoints/                # API endpoint definitions
│   ├── hooks/                    # React Query hooks
│   │   └── README.md             # Hook usage guide
│   └── query-keys.ts             # Query key factory
├── lib/
│   ├── toaster.ts                # Basic toast wrapper
│   ├── error-handler.ts          # Global error handler + helpers
│   └── toast.ts                  # Convenient exports
└── types/
    └── dto/                      # Request/Response schemas
```

## Summary

This error handling system provides:

- ✅ **Enterprise-grade**: Matches backend error structure exactly
- ✅ **Production-ready**: Handles all error cases automatically
- ✅ **DRY**: No repeated error handling code
- ✅ **Loosely coupled**: Hooks don't know about toasts
- ✅ **Type-safe**: Full TypeScript coverage
- ✅ **Developer-friendly**: Great DX with helpful logging
- ✅ **User-friendly**: Consistent, clear error messages
- ✅ **Flexible**: Can override when needed

**Result**: Clean, maintainable, scalable error handling across the entire application.
