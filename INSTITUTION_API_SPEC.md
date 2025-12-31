# Institution Portal API Specification

This document provides the complete API specification for the institution portal features. Share this with the backend team for API implementation.

---

## 1. Institution Login API

**Purpose:** Authenticate institution users with email and institution code.

### Endpoint
```
POST /v1/auth/institution-login
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```typescript
{
  email: string;          // Required, valid email format
  institutionCode: string; // Required, alphanumeric code (e.g., "SCH-2024-001")
}
```

### Success Response (200 OK)
```typescript
{
  success: boolean;       // Always true
  message: string;        // "Login successful"
  data: {
    accessToken: string;  // JWT access token
    refreshToken: string; // JWT refresh token
    expiresIn: number;    // Token expiry in seconds (e.g., 3600)
    user: {
      id: number;
      uuid: string;       // UUID v4
      name: string;
      email: string;
      role: "institution"; // Always "institution" for this endpoint
      institutionId: number;
      institutionName: string;
      institutionCode: string;
    }
  }
}
```

### Error Responses

**400 Bad Request - Validation Error**
```typescript
{
  success: false;
  error: string;          // "Validation failed"
  errors: {
    email?: string[];     // ["Invalid email format"]
    institutionCode?: string[]; // ["Institution code is required"]
  }
}
```

**401 Unauthorized - Invalid Credentials**
```typescript
{
  success: false;
  error: string;          // "Invalid email or institution code"
}
```

**404 Not Found - Institution Not Found**
```typescript
{
  success: false;
  error: string;          // "Institution not found or inactive"
}
```

---

## 2. Dashboard Data API

**Purpose:** Fetch dashboard statistics, phases, and institution info for logged-in institution.

### Endpoint
```
GET /v1/institutions/dashboard
```

### Request Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Query Parameters
None

### Success Response (200 OK)
```typescript
{
  success: boolean;
  message: string;
  data: {
    institution: {
      id: number;
      uuid: string;
      name: string;
      code: string;
      selectedTemplateId: number | null; // null if not selected yet
    };
    stats: {
      totalPhases: number;              // Total phases for this institution
      completedPhases: number;          // Phases with status "delivered"
      inProgressPhases: number;         // Phases in active statuses
      pendingPhases: number;            // Phases not started
      totalSubmissions: number;         // Total submissions
      completedSubmissions: number;     // Submissions with status "submitted"
      pendingSubmissions: number;       // Submissions with status "pending"
      completionPercentage: number;     // 0-100, calculated percentage
      lastActivity: string | null;      // ISO 8601 date or null
    };
    phases: Array<{
      id: number;
      uuid: string;
      name: string;
      description: string | null;
      status: "file-processing" | "photo-setup" | "in-photo-session" |
              "photo-editing" | "quality-check" | "ready-for-delivery" | "delivered";
      submissionCount: number;          // Number of submissions in this phase
      targetCount: number;              // Expected number of submissions
      startedAt: string | null;         // ISO 8601 date or null
      completedAt: string | null;       // ISO 8601 date or null (only for "delivered")
      createdAt: string;                // ISO 8601 date
    }>;
  }
}
```

### Error Responses

**401 Unauthorized**
```typescript
{
  success: false;
  error: string;          // "Unauthorized"
}
```

**403 Forbidden**
```typescript
{
  success: false;
  error: string;          // "Access denied - institution role required"
}
```

---

## 3. Template Selection API

**Purpose:** Allow institution to select a template (one-time selection).

### Endpoint
```
POST /v1/institutions/select-template
```

### Request Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Request Body
```typescript
{
  templateId: number;     // Required, must be positive integer
                          // Valid values: 1=School, 2=Office, 3=Medical, 4=Event, 5=Generic
}
```

### Success Response (200 OK)
```typescript
{
  success: boolean;
  message: string;        // "Template selected successfully"
  data: {
    institutionId: number;
    selectedTemplateId: number;
    templateName: string;  // "School Template", "Office Template", etc.
  }
}
```

### Error Responses

**400 Bad Request - Validation Error**
```typescript
{
  success: false;
  error: string;          // "Validation failed"
  errors: {
    templateId?: string[]; // ["Template ID must be positive"]
  }
}
```

**400 Bad Request - Already Selected**
```typescript
{
  success: false;
  error: string;          // "Template already selected"
}
```

**400 Bad Request - Invalid Template**
```typescript
{
  success: false;
  error: string;          // "Invalid template ID"
}
```

**401 Unauthorized**
```typescript
{
  success: false;
  error: string;          // "Unauthorized"
}
```

---

## 4. Institution Submissions API

**Purpose:** Fetch submissions for the logged-in institution with filtering and pagination.

### Endpoint
```
GET /v1/institutions/submissions
```

### Request Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Query Parameters
```typescript
page?: number;          // Default: 1
pageSize?: number;      // Default: 10, max: 100
search?: string;        // Search in personName, idNumber, loginCode
status?: "pending" | "submitted" | "expired";
phaseId?: string;       // Filter by phase UUID
sortBy?: string;        // Default: "createdAt"
sortOrder?: "asc" | "desc"; // Default: "desc"
```

### Example Request
```
GET /v1/institutions/submissions?page=1&pageSize=10&status=pending&search=john&sortBy=createdAt&sortOrder=desc
```

### Success Response (200 OK)
```typescript
{
  success: boolean;
  message: string;
  data: {
    submissions: Array<{
      id: number;
      uuid: string;
      personName: string;
      idNumber: string | null;
      loginCode: string;          // Unique login code for submission
      status: "pending" | "submitted" | "expired";
      category: string | null;
      imageUrl: string | null;    // Full URL to uploaded image
      institutionId: number;
      institutionName: string;    // Should match logged-in institution
      phaseId: number | null;
      phaseName: string | null;
      submittedAt: string | null; // ISO 8601 date
      createdAt: string;          // ISO 8601 date
      updatedAt: string;          // ISO 8601 date
    }>;
    pagination: {
      total: number;              // Total number of submissions
      page: number;               // Current page
      pageSize: number;           // Items per page
      totalPages: number;         // Total number of pages
    };
  }
}
```

### Error Responses

**401 Unauthorized**
```typescript
{
  success: false;
  error: string;          // "Unauthorized"
}
```

**403 Forbidden**
```typescript
{
  success: false;
  error: string;          // "Access denied - institution role required"
}
```

---

## Common Notes for Backend Implementation

### Authentication
- All institution endpoints (except login) require `Authorization: Bearer {accessToken}` header
- Token should contain institution ID and role
- Endpoints should verify the role is "institution"
- Endpoints should only return data for the authenticated institution (enforce data isolation)

### Data Filtering
- **Critical:** Institution should ONLY see their own data
- Backend must filter by `institutionId` from the JWT token, not from request params
- Never trust client-provided institution IDs for filtering

### Error Handling
- Use consistent error response format
- Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Include validation errors in structured format

### Validation
- Validate all request bodies using DTOs/validators
- Enforce required fields
- Check data types and formats
- Validate enum values (status, role, etc.)

### Pagination
- Implement cursor-based or offset-based pagination
- Default page size: 10
- Maximum page size: 100
- Return pagination metadata in all list responses

### Date Formats
- Use ISO 8601 format for all dates (e.g., "2024-01-15T10:30:00.000Z")
- Store dates in UTC
- Let frontend handle timezone conversions

### Status Enums
**Phase Statuses:**
```
file-processing
photo-setup
in-photo-session
photo-editing
quality-check
ready-for-delivery
delivered
```

**Submission Statuses:**
```
pending
submitted
expired
```

**User Roles:**
```
admin
institution
```

### Security Recommendations
1. Use bcrypt or argon2 for password hashing (if institutions have passwords)
2. Rate limit login attempts (max 5 per minute per IP)
3. Implement JWT refresh token rotation
4. Set appropriate token expiry times (access: 1 hour, refresh: 7 days)
5. Log all authentication attempts
6. Implement CORS restrictions
7. Use HTTPS in production

---

## Testing Checklist

### Institution Login
- [ ] Valid credentials return 200 with tokens
- [ ] Invalid email returns 400
- [ ] Invalid institution code returns 401
- [ ] Non-existent institution returns 404
- [ ] Inactive institution returns 404
- [ ] Role in response is always "institution"

### Dashboard
- [ ] Returns correct stats for logged-in institution
- [ ] Only shows phases belonging to institution
- [ ] Calculates completion percentage correctly
- [ ] Returns null for selectedTemplateId if not selected
- [ ] Unauthorized request returns 401
- [ ] Admin token returns 403

### Template Selection
- [ ] First-time selection succeeds (200)
- [ ] Second selection attempt returns 400 (already selected)
- [ ] Invalid templateId returns 400
- [ ] Updates institution's selectedTemplateId in database
- [ ] Unauthorized request returns 401

### Institution Submissions
- [ ] Returns only submissions for logged-in institution
- [ ] Pagination works correctly
- [ ] Search filters work (personName, idNumber, loginCode)
- [ ] Status filter works
- [ ] Phase filter works
- [ ] Sorting works (asc/desc)
- [ ] Empty results return empty array (not error)
- [ ] Unauthorized request returns 401
