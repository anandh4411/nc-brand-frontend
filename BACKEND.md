# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready, layered Node.js backend boilerplate using **Fastify**, **Prisma ORM**, **TypeScript**, and **Inversify** for dependency injection. It's optimized for low-memory environments (512MB RAM) with built-in JWT authentication, RBAC, caching, rate limiting, and structured logging.

## Common Commands

### Development
```bash
npm run dev                 # Start dev server with hot reload (ts-node-dev)
npm run build              # Compile TypeScript to dist/
npm run typecheck          # Type check without emitting files
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix linting issues
npm run format             # Format code with Prettier
```

### Database (Prisma)
```bash
npm run prisma:generate         # Generate Prisma client (required after schema changes)
npm run prisma:migrate          # Create and apply migrations (dev)
npm run prisma:migrate:prod     # Apply migrations (production)
npm run prisma:studio           # Open Prisma Studio GUI
npm run prisma:seed             # Seed database with test data
```

### Production (PM2)
```bash
npm run prod:build         # Generate Prisma client + build
npm run prod:start         # Start with PM2 (fork mode, 400MB limit)
npm run prod:restart       # Restart PM2 process
npm run prod:stop          # Stop PM2 process
npm run prod:logs          # View PM2 logs
npm run prod:status        # Check PM2 status
npm run deploy             # Quick deploy: build + restart
npm run deploy:manual      # Full deployment with backup & verification
```

### Deployment Scripts
```bash
npm run setup:production   # First-time server setup (fresh Linux server)
npm run deploy:manual      # Update existing server (with auto-backup)
npm run logs:setup-cron    # Setup automated log cleanup
```

### Logging
```bash
npm run logs:view          # Tail application logs (logs/app.log)
npm run logs:error         # Tail error logs (logs/error.log)
npm run logs:clear         # Clear PM2 logs
npm run logs:cleanup       # Clean old logs (compress + delete when >2GB)
npm run logs:setup-cron    # Setup automated daily cleanup (production)
```

## Architecture

### Layered Structure
The codebase follows a strict **3-tier layered architecture**:

```
Controller → Service → Repository → Database
```

**Flow**: Routes define endpoints → Controllers handle HTTP → Services contain business logic → Repositories abstract data access

### Dependency Injection (Inversify)
- All dependencies are registered in `src/server.ts` (lines 46-56)
- Controllers, Services, and Repositories use `@injectable()` decorator
- Repositories are bound to interfaces (`"IUserRepository"` → `PrismaUserRepository`)
- Services are injected with `@inject("IUserRepository")` for repositories
- Controllers receive services via constructor injection

**Pattern**:
```typescript
// Service
@injectable()
export class AuthService {
  constructor(
    @inject("IUserRepository") private userRepo: IUserRepository,
    @inject(CacheService) private cache: CacheService
  ) {}
}

// Registration in server.ts
container.bind("IUserRepository").to(PrismaUserRepository);
container.bind(AuthService).toSelf();
```

### Error Handling
- Custom `AppError` class in `src/utils/app-error.ts` with factory methods
- Use static methods: `AppError.unauthorized()`, `AppError.notFound()`, `AppError.badRequest()`, etc.
- Global error handler in `src/middlewares/error.middleware.ts` catches all errors
- Errors include `statusCode`, `code`, `message`, `details`, and `requestId`
- Operational errors (4xx) are logged as warnings, server errors (5xx) as errors

**Usage**:
```typescript
throw AppError.unauthorized("Invalid credentials");
throw AppError.notFound("User not found");
throw AppError.badRequest("Invalid email format", { field: "email" });
```

### Authentication Flow
1. **Login** (`POST /auth/login`): Returns JWT `accessToken` (short-lived) + `refreshToken` (hashed in DB)
2. **Token Verification**: Use `app.authenticate` preHandler (see `src/middlewares/auth.middleware.ts`)
3. **Refresh** (`POST /auth/refresh`): Rotates tokens (invalidates old refresh token, returns new pair)
4. **Logout** (`POST /auth/logout`): Deletes refresh token from database
5. **Authorization**: Use `requireRoles(['admin'])` middleware for RBAC (see `src/middlewares/requireRoles.middleware.ts`)

**Token Structure**:
- Access tokens contain `{ userId, iat, exp }` signed with `JWT_SECRET`
- Refresh tokens are random UUIDs, hashed with bcrypt before storage
- Tokens are verified using `jose` library (see `src/utils/token.utils.ts`)

### Caching Strategy (LRU)
- **Service**: `CacheService` in `src/utils/cache.utils.ts`
- **Size Limit**: 50 MB hard cap with LRU eviction
- **Default TTL**: 5 minutes (configurable via `CACHE_TTL` env var)
- **Tag-based Invalidation**: Use tags to invalidate groups of keys

**Usage**:
```typescript
// Set with tags
cache.set("user:123", userData, 300, ["users"]);

// Get
const user = cache.get<User>("user:123");

// Invalidate all user caches
cache.invalidateTag("users");
```

### Database Patterns
- **Soft Deletes**: Use `deletedAt` field (set to `new Date()`, not hard delete)
- **Optimistic Locking**: `version` field exists for concurrency control
- **UUID**: All models have `uuid` field for external APIs (don't expose integer IDs)
- **Relationships**: Users ↔ UserRoles ↔ Roles, Users ↔ UserTokens
- **Connection Pooling**: Configured in `DATABASE_URL` with `connection_limit=10`

### Validation
- **Schema Validation**: Uses **Zod** for both request and response DTOs (see `src/dto/*.dto.ts`)
- **Request Validation**: `validateBody(schema)` preHandler validates incoming request bodies
- **Response Validation**: Fastify's `schema.response` validates outgoing responses (catches bugs, prevents data leaks)
- **Type Safety**: Fastify uses `ZodTypeProvider` for automatic type inference
- **Pattern**: Define request + response schemas in DTOs → Use both in route configuration

**DTO Pattern** (EXACT format used by generator):
```typescript
// DTO file (src/dto/user.dto.ts)
import { z } from "zod";
import { createSuccessResponse, SuccessMessageResponse } from "./common.dto";

// === REQUEST SCHEMAS ===
export const CreateUserRequest = z
  .object({
    name: z.string().min(1, "Name is required").meta({
      description: "User's full name",
      example: "John Doe",
    }),
    email: z.string().email("Invalid email format").meta({
      description: "User's email address",
      example: "john.doe@example.com",
    }),
    password: z.string().min(6, "Password must be at least 6 characters").meta({
      description: "User's password (minimum 6 characters)",
      example: "SecurePass123",
    }),
  })
  .meta({
    title: "Create User Request",
    description: "Data required to create a new user",
  });

export const UserIdParam = z
  .object({
    uuid: z.string().uuid().meta({
      description: "User UUID",
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .meta({
    title: "User UUID Parameter",
    description: "UUID parameter for user identification",
  });

// === DATA SCHEMAS ===
export const UserData = z
  .object({
    id: z.number().meta({
      description: "User ID",
      example: 1,
    }),
    uuid: z.string().meta({
      description: "User UUID (external identifier)",
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().meta({
      description: "User's full name",
      example: "John Doe",
    }),
    email: z.string().meta({
      description: "User's email address",
      example: "john.doe@example.com",
    }),
  })
  .meta({
    title: "User Data",
    description: "User information",
  });

// === RESPONSE SCHEMAS ===
export const CreateUserResponse = createSuccessResponse(UserData);
export const GetUserResponse = createSuccessResponse(UserData);

// === TYPE EXPORTS ===
export type CreateUserRequestType = z.infer<typeof CreateUserRequest>;
export type UserDataType = z.infer<typeof UserData>;
```

**Route with Validation**:
```typescript
// Route
app.post(
  "/users",
  {
    schema: {
      description: "Create a new user",
      tags: ["Users"],
      body: CreateUserRequest,
      security: [{ bearerAuth: [] }],
      response: {
        201: CreateUserResponse,
        400: BadRequestResponse,
        401: UnauthorizedResponse,
        409: ConflictResponse,
      },
    },
    preHandler: [
      app.authenticate,
      validateBody(CreateUserRequest),
    ],
  },
  controller.createUser
);
```

**Why Both?**
- Request validation = Catches **client errors** (invalid input)
- Response validation = Catches **your bugs** (wrong data shape, leaked fields)
- Together = Full API contract enforcement + accurate Swagger docs

### API Versioning
- **Strategy**: URL-based versioning (`/v1/`, `/v2/`, etc.)
- **Current Version**: v1 (all routes prefixed with `/v1`)
- **Configuration**: `src/config/api-version.ts` (centralized version management)
- **Routes Organization**: Routes grouped by version in `src/routes/v1/`, `src/routes/v2/`, etc.

**Why URL versioning?**
- Clear and explicit in URLs
- Cacheable (CDNs can cache different versions separately)
- Easy to test and route traffic
- Industry standard (used by Google, Stripe, GitHub, etc.)

**Example URLs**:
```
POST /v1/auth/login      → API v1 login
POST /v1/users           → API v1 users
POST /v2/users           → API v2 users (future - breaking changes)
GET  /health             → No version (always accessible)
```

**Adding a new version (v2)**:
1. Create `src/routes/v2/` directory
2. Copy v1 routes or create new ones
3. Modify DTOs for breaking changes
4. Register in `src/routes/index.ts` with `/v2` prefix
5. Old clients continue using `/v1`, new clients use `/v2`

## Key Files and Locations

### Entry Point
- `src/server.ts`: Application bootstrap, DI container setup, route registration, graceful shutdown

### Configuration
- `src/config/app-config.ts`: App-wide settings (PORT, CACHE_TTL, etc.)
- `src/config/api-version.ts`: API versioning configuration (versions, helpers)
- `src/config/env.validation.ts`: Environment variable validation on startup
- `src/config/prismaClient.ts`: Prisma client singleton
- `src/config/swagger.ts`: Swagger/OpenAPI documentation setup
- `ecosystem.config.js`: PM2 configuration (fork mode, 400MB limit, graceful shutdown)

### Error & Logging
- `src/utils/app-error.ts`: Custom error class with factory methods
- `src/utils/logger.ts`: Pino logger instance (structured JSON logging)
- `src/middlewares/error.middleware.ts`: Global error handler

### Middleware
- `src/middlewares/auth.middleware.ts`: JWT verification, attaches `user` to request
- `src/middlewares/requireRoles.middleware.ts`: RBAC authorization
- `src/middlewares/validation.middleware.ts`: Zod schema validation for request bodies
- `src/middlewares/rateLimit.middleware.ts`: DDoS protection via `@fastify/rate-limit`
- `src/middlewares/request-context.middleware.ts`: Adds request ID to all requests

### Routes (Versioned)
- `src/routes/index.ts`: Main router with version prefixes
- `src/routes/v1/index.ts`: v1 route registration
- `src/routes/v1/auth.routes.ts`: Auth routes for v1
- `src/routes/v1/user.routes.ts`: User routes for v1
- Future versions: `src/routes/v2/`, `src/routes/v3/`, etc.

### DTOs (Data Transfer Objects)
- `src/dto/common.dto.ts`: Generic response wrappers (`createSuccessResponse`, `ErrorResponse`)
- `src/dto/auth.dto.ts`: Auth request/response schemas (LoginRequest, LoginResponse, etc.)
- `src/dto/user.dto.ts`: User-related schemas
- `src/dto/role.dto.ts`: Role-related schemas

### Database Schema
- `prisma/schema.prisma`: PostgreSQL schema (Users, Roles, UserRoles, UserTokens)
- All models have: `id`, `createdAt`, `updatedAt`, `deletedAt`, `uuid`, `status`, `version`

## Adding New Features

### Manual Entity Creation (if not using generator)
1. Add model to `prisma/schema.prisma`
2. Run `npm run prisma:generate && npm run prisma:migrate`
3. Create interface in `src/repositories/interfaces/i<Entity>Repository.ts`
4. Implement repository in `src/repositories/prisma/<entity>.repository.ts`
5. Create service in `src/services/<entity>.service.ts` with `@injectable()`
6. Create controller in `src/controllers/<entity>.controller.ts`
7. Define DTOs in `src/dto/<entity>.dto.ts` using Zod
8. Create routes in `src/routes/v1/<entity>.routes.ts`
9. Register DI bindings in `src/infrastructure/di/container.ts`
10. Update controller resolver in `src/infrastructure/di/controller-resolver.ts`
11. Register routes in `src/routes/v1/index.ts`

### Route Definition Pattern (Versioned)
```typescript
// Version-specific routes (src/routes/v1/user.routes.ts)
export async function userRoutesV1(
  app: FastifyInstance,
  controller: UserController
) {
  // === CREATE USER ===
  app.post(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["Users"],
        body: CreateUserRequest,
        security: [{ bearerAuth: [] }],
        response: {
          201: CreateUserResponse,
          400: BadRequestResponse,
          401: UnauthorizedResponse,
          409: ConflictResponse,
        },
      },
      preHandler: [
        app.authenticate,
        requireRoles(["SUPER_ADMIN"]),
        validateBody(CreateUserRequest),
      ],
    },
    controller.createUser
  );

  // === GET USER BY UUID ===
  app.get(
    "/users/:uuid",
    {
      schema: {
        description: "Get user details by UUID",
        tags: ["Users"],
        params: UserIdParam,
        security: [{ bearerAuth: [] }],
        response: {
          200: GetUserResponse,
          401: UnauthorizedResponse,
          404: NotFoundResponse,
        },
      },
      preHandler: [app.authenticate],
    },
    controller.getUserById
  );
}

// Register in src/routes/v1/index.ts
export async function registerV1Routes(app: FastifyInstance, controllers) {
  await userRoutesV1(app, controllers.userController);
}

// Applied in src/routes/index.ts with /v1 prefix
await app.register(async (v1Instance) => {
  await registerV1Routes(v1Instance, controllers);
}, { prefix: '/v1' });
```

### Controller Pattern
```typescript
// Controllers use arrow functions assigned to class properties
@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  // === CREATE USER ===
  createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as CreateUserRequestType;
    const user = await this.userService.createUser(data);
    successResponse(reply, user, "User created successfully", 201);
  };

  // === GET USER BY UUID ===
  getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { uuid } = request.params as { uuid: string };
    const user = await this.userService.getUserByUuid(uuid);
    successResponse(reply, user);
  };

  // === UPDATE USER ===
  updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { uuid } = request.params as { uuid: string };
    const data = request.body as UpdateUserRequestType;
    const updated = await this.userService.updateUser(uuid, data);
    successResponse(reply, updated, "User updated successfully");
  };

  // === DELETE USER ===
  deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { uuid } = request.params as { uuid: string };
    await this.userService.deleteUser(uuid);
    successResponse(reply, null, "User deleted successfully");
  };
}
```

### Service Pattern
```typescript
// Services contain business logic, call repositories
@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository") private userRepo: IUserRepository,
    @inject(CacheService) private cache: CacheService
  ) {}

  // Transform Prisma model to DTO (REQUIRED pattern)
  private transformUserToDTO(user: UserWithRoles): UserDataType {
    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      roles: user.UserRoles.map(ur => ur.Roles.name),
    };
  }

  async createUser(data: any): Promise<UserDataType> {
    // Validation logic
    const existing = await this.userRepo.findUserByEmail(data.email);
    if (existing) {
      throw AppError.conflict("User with this email already exists");
    }

    const user = await this.userRepo.createUser(data);
    this.cache.invalidateTag("users");
    return this.transformUserToDTO(user);
  }

  async getUserByUuid(uuid: string): Promise<UserDataType> {
    const cacheKey = `user:uuid:${uuid}`;
    const cached = this.cache.get<UserDataType>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepo.findUserByUuid(uuid);
    if (!user) throw AppError.notFound("User not found");

    const userDTO = this.transformUserToDTO(user);
    this.cache.set(cacheKey, userDTO, appConfig.CACHE_TTL, ["users"]);
    return userDTO;
  }

  async updateUser(uuid: string, data: Partial<any>): Promise<UserDataType> {
    const existingUser = await this.userRepo.findUserByUuid(uuid);
    if (!existingUser) {
      throw AppError.notFound("User not found");
    }

    const updatedUser = await this.userRepo.updateUser(existingUser.id, data);
    this.cache.invalidateTag("users");
    return this.transformUserToDTO(updatedUser);
  }

  async deleteUser(uuid: string): Promise<void> {
    const user = await this.userRepo.findUserByUuid(uuid);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    await this.userRepo.deleteUser(user.id);
    this.cache.invalidateTag("users");
  }
}
```

## Environment Variables
Required variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string with pool settings
- `JWT_SECRET`: Access token secret (32+ chars)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: `development` or `production`
- `CACHE_TTL`: Cache TTL in seconds (default: 300)

## Production Deployment Notes
- PM2 runs in **fork mode** (1 instance) to stay under 400MB memory
- Auto-restart on crash, with 10 max restarts per minute
- Graceful shutdown: 5s timeout for `SIGTERM`/`SIGINT`
- Logs to `logs/pm2-*.log` (rotated via PM2 or logrotate)
- Database connection pool: 10 connections max
- Cache eviction: Automatic LRU when >50MB
- Request body limit: 1MB

## Testing Strategy
- Tests use Jest (configured but not implemented)
- Run `npm test` for unit tests
- Run `npm run test:coverage` for coverage report

## Repository Pattern (Prisma Implementation)

### Complete Repository Structure
```typescript
// Interface (src/repositories/interfaces/iUserRepository.ts)
import { Users } from "@prisma/client";

export type UserWithRoles = Users & {
  UserRoles: Array<{ Roles: { name: string } }>;
};

export interface IUserRepository {
  createUser(
    data: Omit<Users, "id" | "createdAt" | "updatedAt" | "uuid" | "deletedAt" | "version">
  ): Promise<UserWithRoles>;
  findUserById(id: number): Promise<UserWithRoles | null>;
  findUserByUuid(uuid: string): Promise<UserWithRoles | null>;
  findUserByEmail(email: string): Promise<UserWithRoles | null>;
  updateUser(id: number, data: Partial<Users>): Promise<UserWithRoles>;
  deleteUser(id: number): Promise<void>;
}

// Implementation (src/repositories/prisma/user.repository.ts)
export class PrismaUserRepository implements IUserRepository {
  // Helper to include relations (IMPORTANT: Define once, reuse)
  private readonly includeRoles = {
    UserRoles: {
      where: { Users: { deletedAt: null } },
      include: { Roles: true }
    }
  };

  // Helper to filter out soft-deleted records
  private readonly notDeletedWhere: Prisma.UsersWhereInput = {
    deletedAt: null
  };

  async createUser(
    data: Omit<Users, "id" | "createdAt" | "updatedAt" | "uuid" | "deletedAt" | "version">
  ): Promise<UserWithRoles> {
    return await prisma.users.create({
      data,
      include: this.includeRoles
    });
  }

  async findUserByUuid(uuid: string): Promise<UserWithRoles | null> {
    return await prisma.users.findFirst({
      where: { uuid, ...this.notDeletedWhere },
      include: this.includeRoles,
    });
  }

  async updateUser(id: number, data: Partial<Users>): Promise<UserWithRoles> {
    return await prisma.users.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 } // Optimistic locking
      },
      include: this.includeRoles
    });
  }

  async deleteUser(id: number): Promise<void> {
    await prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    }); // Soft delete
  }

  async getUsers(options: {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: UserWithRoles[]; total: number }> {
    const { page = 1, pageSize = 10, search, sortBy = "createdAt", sortOrder = "desc" } = options;

    const searchWhere: Prisma.UsersWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ],
        }
      : {};

    const where: Prisma.UsersWhereInput = {
      ...this.notDeletedWhere,
      ...searchWhere
    };

    const [data, total] = await Promise.all([
      prisma.users.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: this.includeRoles,
      }),
      prisma.users.count({ where }),
    ]);

    return { data, total };
  }
}
```

## Important Patterns to Follow
1. **Never expose Prisma models directly**: Use DTOs to shape responses via `transform${Model}ToDTO()` method
2. **Always use AppError for operational errors**: Ensures consistent error structure
3. **Response validation**: Always define response schemas in DTOs and add to route `schema.response`
4. **Cache invalidation**: Always invalidate tags when updating/deleting entities
5. **Soft deletes**: Set `deletedAt` instead of hard deletes
6. **Use UUIDs externally**: Never expose integer `id` in API responses (always use UUID in routes)
7. **Repository abstraction**: Always inject `IRepository` interfaces, not concrete classes
8. **Request + Response validation**: Validate both incoming (request) and outgoing (response) data
9. **Token rotation**: Refresh endpoint must invalidate old refresh token
10. **RBAC**: Use `requireRoles()` middleware for protected routes
11. **Logging**: Use `logger.info/warn/error` with structured objects, not plain strings
12. **Controller methods**: Use arrow functions assigned to properties (not traditional methods)
13. **Service transformation**: Always include `private transform${Model}ToDTO()` method in services
14. **Repository helpers**: Define `includeRoles` and `notDeletedWhere` as private readonly properties
15. **Cache keys**: Use descriptive patterns like `user:uuid:${uuid}` or `users:${JSON.stringify(options)}`
16. **Response utility**: Use `successResponse(reply, data, message?, statusCode?)` not `sendSuccess()`
