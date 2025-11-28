# Registration Flow - Public vs Private User Creation

## Overview

The system has two distinct flows for creating users:

1. **Public Registration** (`/auth/register`) - Creates both organization and user
2. **Private User Creation** (`/users` POST) - Creates user in existing organization (by org admin)

## Public Registration Flow

**Endpoint:** `POST /auth/register`

**Who can use:** Anyone (public endpoint)

**What happens:**
1. User provides: email, password, firstName, lastName, businessName (optional)
2. System generates sequential `orgId` (e.g., `org_1`, `org_2`)
3. **Organization is created FIRST** with:
   - `orgId`: Auto-generated sequential ID
   - `name`: Company name (from `businessName` or default)
   - `createdBy`: `null` initially (will be set after user creation)
   - `ownerId`: `null` initially (will be set after user creation)
4. **User is created** with:
   - `organizationId`: Set to the organization's `orgId`
   - `orgRole`: `ORG_ADMIN` (first user becomes admin)
5. **Organization is updated** with:
   - `createdBy`: Set to the new user's ID
   - `ownerId`: Set to the new user's ID

**Why `createdBy` is optional:**
- The organization must be created before the user exists
- We set `createdBy` after user creation
- This is why `createdBy` is `required: false` in the schema

## Private User Creation Flow

**Endpoint:** `POST /users`

**Who can use:** Organization admins/managers (authenticated, role-based)

**What happens:**
1. Org admin provides: email, password, firstName, lastName, orgRole
2. **No organization is created** - user is added to existing organization
3. **User is created** with:
   - `organizationId`: Set to the admin's organization ID
   - `orgRole`: Assigned by admin (e.g., `ORG_USER`, `ORG_SALES`, etc.)
   - `role`: Always `USER` (system role)

**Key differences:**
- Organization already exists
- `createdBy` is not relevant (organization was created during public registration)
- User is added to existing organization, not creating a new one

## Schema Design

```typescript
// Organization Schema
@Prop({ type: String, ref: 'User', required: false, index: true })
createdBy?: string; // Optional - set after user creation in public registration
```

**Why optional:**
- Public registration creates org before user exists
- Private user creation doesn't create organizations
- Migration scripts can set it immediately (user already exists)

## Example Flows

### Public Registration Example

```typescript
// 1. Create organization (createdBy is null)
const org = await organizationModel.create({
  orgId: 'org_1',
  name: 'Blossom Flowers',
  createdBy: null, // ✅ Allowed - will be set later
});

// 2. Create user
const user = await userModel.create({
  email: 'user@example.com',
  organizationId: 'org_1',
  orgRole: 'ORG_ADMIN',
});

// 3. Update organization
org.createdBy = user._id.toString();
org.ownerId = user._id.toString();
await org.save();
```

### Private User Creation Example

```typescript
// Admin creates user in existing organization
const user = await userModel.create({
  email: 'employee@example.com',
  organizationId: 'org_1', // Admin's existing org
  orgRole: 'ORG_SALES', // Assigned by admin
});
// No organization creation needed
```

## Security

- **Public Registration**: No authentication required, creates new organization
- **Private User Creation**: Requires JWT authentication + role-based permissions
  - Only `ORG_ADMIN`, `ORG_MANAGER`, `ORG_SUPERVISOR` can create users
  - Users are automatically added to the creator's organization

