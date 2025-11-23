# Authentication Module

Complete JWT-based authentication module following NestJS best practices.

## Features

- ✅ JWT Authentication with access tokens
- ✅ Refresh tokens stored in httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ User registration and login
- ✅ Token refresh endpoint
- ✅ Logout functionality
- ✅ Password change functionality
- ✅ Protected routes with guards
- ✅ Public route decorator
- ✅ Current user decorator

## Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
```

## Usage Examples

### Protecting Routes

#### Public Route (No Authentication Required)
```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('public')
export class PublicController {
  @Public()
  @Get()
  getPublicData() {
    return { message: 'This is public' };
  }
}
```

#### Protected Route (Authentication Required)
```typescript
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../auth/schemas/user.schema';

@Controller('protected')
export class ProtectedController {
  @Get('profile')
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }
}
```

#### Admin Only Route
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getAdminDashboard() {
    return { message: 'Admin dashboard' };
  }
}
```

### API Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Get Profile
```bash
GET /auth/profile
Authorization: Bearer <token>
```

#### Refresh Token
```bash
POST /auth/refresh
# Refresh token is automatically sent from httpOnly cookie

Response:
{
  "accessToken": "new-access-token"
}
```

#### Logout
```bash
POST /auth/logout
Authorization: Bearer <token>

Response:
{
  "message": "Logged out successfully"
}
```

#### Change Password
```bash
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

## User Roles

- `USER` - Regular user (default)
- `ADMIN` - Administrator

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- Access tokens expire after 15 minutes (configurable)
- Refresh tokens expire after 7 days (configurable)
- Refresh tokens stored in httpOnly cookies (not accessible via JavaScript)
- Cookies use `secure` flag in production (HTTPS only)
- Cookies use `sameSite: strict` to prevent CSRF attacks
- Passwords are excluded from user responses
- Email is stored in lowercase for consistency
- User accounts can be deactivated
- Last login tracking
- Refresh tokens are stored in database and validated on each refresh

