# User Management Setup Guide

## Overview
This document describes the user management system where admins can create users, assign roles, and provide login credentials.

## Features

### ✅ Admin User Creation
- Admins can create new users from the dashboard
- Form includes:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated)
  - Password (required, min 6 characters)
  - Organization Role (dropdown selection)

### ✅ Role Assignment
Admins can assign any of these roles:
- **Organization Admin** (`ORG_ADMIN`) - Full control
- **Manager** (`ORG_MANAGER`) - Manage users, view all data
- **Supervisor** (`ORG_SUPERVISOR`) - Manage sales data
- **Sales** (`ORG_SALES`) - Create/manage own sales
- **User** (`ORG_USER`) - View-only access

### ✅ User List Management
- View all users in the organization
- Update user roles in real-time via dropdown
- Remove users (soft delete)
- User avatars with initials
- Responsive design

## Backend API

### Endpoints
- `POST /users` - Create new user (requires `canCreateUsers` permission)
- `GET /users` - List all users (requires `canViewUsers` permission)
- `PATCH /users/:id/role` - Update user role (requires `canManageRoles` permission)
- `DELETE /users/:id` - Remove user (requires `canDeleteUsers` permission)

### Security
- All endpoints require JWT authentication
- Role-based permission checks
- Users can only manage users in their own organization
- Users cannot change their own role

## Registration Flow

### New User Registration
When a user registers via `/auth/register`:
1. Organization is automatically created
2. User is assigned `ORG_ADMIN` role
3. User becomes the organization owner
4. Organization name defaults to business name or "{FirstName} {LastName}'s Organization"

### Admin-Created Users
When an admin creates a user:
1. User is created with provided email/password
2. User is assigned to admin's organization
3. User gets the role selected by admin
4. User can immediately login with provided credentials

## Migration Script

### For Existing Users
If you have existing users without organizations, run the migration:

```bash
cd apps/flower-api
npm run migrate:users
```

This script will:
1. Create an organization for each user without one
2. Assign users `ORG_ADMIN` role
3. Update all Week records with `organizationId`
4. Update all Withdrawal records with `organizationId`

### Migration Output
The script provides detailed output:
- Number of users processed
- Organizations created
- Records updated
- Any errors encountered

## Frontend Access

### Navigation
- Go to Dashboard → **Users** (in sidebar)
- Or navigate to `/dashboard/users`

### Creating a User
1. Click "Create New User" button
2. Fill in the form:
   - First Name
   - Last Name
   - Email (must be unique)
   - Password (min 6 characters, must contain uppercase, lowercase, and number)
   - Select Organization Role
3. Click "Create User"
4. User will appear in the list immediately

### Managing Users
- **Change Role**: Use the dropdown next to each user
- **Remove User**: Click "Remove" button (soft delete, user becomes inactive)

## Permissions Matrix

| Action | ORG_ADMIN | ORG_MANAGER | ORG_SUPERVISOR | ORG_SALES | ORG_USER |
|--------|-----------|-------------|----------------|-----------|----------|
| View Users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update User Roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |

## Troubleshooting

### User Creation Fails
- Check if email already exists
- Verify password meets requirements (6+ chars, uppercase, lowercase, number)
- Ensure admin has `canCreateUsers` permission

### Role Update Fails
- Verify admin has `canManageRoles` permission
- Cannot change own role (security feature)

### Migration Issues
- Ensure MongoDB connection is working
- Check that all required models are available
- Review migration script output for specific errors

## Next Steps

1. **Run Migration** (if you have existing users):
   ```bash
   npm run migrate:users
   ```

2. **Test User Creation**:
   - Login as admin
   - Navigate to Users page
   - Create a test user
   - Verify user can login

3. **Test Role Permissions**:
   - Create users with different roles
   - Verify permissions work as expected

