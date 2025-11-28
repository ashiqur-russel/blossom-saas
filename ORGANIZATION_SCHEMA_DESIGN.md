# Organization & Multi-Tenant System Design

## Overview
This document describes the multi-tenant organization system for the flower business application. Each company/organization operates independently with role-based access control.

## Schema Design

### 1. Organization Schema
**Collection**: `organizations`

**Fields**:
- `name` (required): Organization name
- `businessName` (optional): Business/company name
- `description` (optional): Organization description
- `createdBy` (required): User ID who created the organization
- `ownerId` (optional): Primary owner/admin user ID
- `isActive` (default: true): Whether organization is active
- `settings` (optional): Organization-specific settings (currency, timezone, etc.)
- `metadata` (optional): Additional metadata
- `createdAt`, `updatedAt`: Timestamps

**Indexes**:
- `name`
- `createdBy`
- `ownerId`
- `isActive`

### 2. User Schema Updates
**New Fields**:
- `organizationId` (optional, indexed): Reference to Organization
- `orgRole` (enum, default: ORG_USER): Role within the organization

**Existing Fields** (kept):
- `role`: System-level role (ADMIN, USER) - for system-wide permissions
- `email`, `password`, `firstName`, `lastName`, etc.

**Indexes**:
- `organizationId`
- `organizationId + orgRole`
- `organizationId + isActive`

### 3. Week Schema Updates
**New Fields**:
- `organizationId` (required, indexed): Organization this week belongs to

**Existing Fields** (kept):
- `userId`: User who created/owns this record (for tracking)

**Indexes**:
- `organizationId + weekNumber + year` (unique) - Primary constraint
- `organizationId + year + weekNumber` (for queries)
- `organizationId` (for filtering)
- `userId` (kept for backward compatibility)

### 4. Withdrawal Schema Updates
**New Fields**:
- `organizationId` (required, indexed): Organization this withdrawal belongs to

**Existing Fields** (kept):
- `userId`: User who created/owns this record (for tracking)

**Indexes**:
- `organizationId`
- `organizationId + date`
- `organizationId + userId`
- `userId` (kept for backward compatibility)

## Role System

### System Roles (User.role)
- `ADMIN`: System administrator (full system access)
- `USER`: Regular system user

### Organization Roles (User.orgRole)
- `ORG_ADMIN`: Full control over organization
  - Can manage all users, roles, sales, withdrawals
  - Can manage organization settings
  
- `ORG_MANAGER`: Can manage users and view all data
  - Can view/create/update users (cannot delete)
  - Can manage all sales data
  - Can view/create/update withdrawals (cannot delete)
  - Can view all analytics
  
- `ORG_SUPERVISOR`: Can view and manage sales data
  - Can view users list
  - Can manage all sales data
  - Can view withdrawals (read-only)
  - Can view all analytics
  
- `ORG_SALES`: Can create and manage sales entries
  - Can view/create/update own sales
  - Can view own analytics only
  - Cannot manage users or withdrawals
  
- `ORG_USER`: Basic access, view-only
  - Can view sales data (read-only)
  - Can view own analytics only
  - Cannot create or modify anything

## Data Isolation Strategy

### Key Principle: **Both userId AND organizationId**

**Why keep both?**
1. **userId**: Tracks who created/owns the record (audit trail, personal accountability)
2. **organizationId**: Enables organization-wide filtering and multi-tenant isolation

**Query Strategy**:
- **Primary filter**: `organizationId` (for multi-tenant isolation)
- **Secondary filter**: `userId` (for user-specific data when needed)
- **Role-based access**: Use `orgRole` to determine what data a user can see

### Example Queries:

```typescript
// Get all weeks for an organization (ORG_ADMIN, ORG_MANAGER, ORG_SUPERVISOR)
const weeks = await weekModel.find({ organizationId: user.organizationId });

// Get user's own weeks (ORG_SALES, ORG_USER)
const weeks = await weekModel.find({ 
  organizationId: user.organizationId,
  userId: user._id 
});

// Get all withdrawals for organization (ORG_ADMIN, ORG_MANAGER)
const withdrawals = await withdrawalModel.find({ 
  organizationId: user.organizationId 
});
```

## Registration Flow

### Current Flow (to be updated):
1. User registers via public `/auth/register` endpoint
2. User is created with `role: USER`
3. **NEW**: Organization is automatically created
4. **NEW**: User is assigned `orgRole: ORG_ADMIN` and `organizationId`
5. User can now invite other users to their organization

### Future Flow:
1. User registers → Organization created → User becomes ORG_ADMIN
2. ORG_ADMIN logs in → Dashboard shows "Users" section
3. ORG_ADMIN creates users → Users get `organizationId` and appropriate `orgRole`
4. Users can only see data from their organization

## Migration Strategy

### Phase 1: Schema Updates (Current)
- Add `organizationId` to User, Week, Withdrawal schemas
- Make `organizationId` optional initially for backward compatibility
- Add indexes

### Phase 2: Registration Update
- Update registration to auto-create organization
- Assign new users to their organization with ORG_ADMIN role

### Phase 3: Service Layer Updates
- Update all service methods to filter by `organizationId`
- Add role-based permission checks
- Update queries to use organizationId as primary filter

### Phase 4: Data Migration
- Create organizations for existing users
- Assign existing users to organizations
- Update existing Week and Withdrawal records with organizationId

### Phase 5: Make organizationId Required
- After migration, make `organizationId` required
- Remove backward compatibility code

## Permission Matrix

| Action | ORG_ADMIN | ORG_MANAGER | ORG_SUPERVISOR | ORG_SALES | ORG_USER |
|--------|-----------|-------------|----------------|-----------|----------|
| View Users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Sales | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Sales | ✅ | ✅ | ✅ | ✅ | ❌ |
| Update Sales | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete Sales | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Withdrawals | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Withdrawals | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Own Analytics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Organization | ✅ | ❌ | ❌ | ❌ | ❌ |

## Security Considerations

1. **Always filter by organizationId**: Never allow cross-organization data access
2. **Role-based access control**: Check permissions before allowing actions
3. **Audit trail**: Keep userId for tracking who created/modified records
4. **JWT token**: Include `organizationId` and `orgRole` in token payload
5. **Guards**: Create organization-specific guards to enforce isolation

## Next Steps

1. ✅ Create Organization schema
2. ✅ Create OrgRole enum and permissions
3. ✅ Update User, Week, Withdrawal schemas
4. ⏳ Update registration service to create organization
5. ⏳ Update all service methods to filter by organizationId
6. ⏳ Create role-based guards and decorators
7. ⏳ Create migration script for existing data
8. ⏳ Update frontend to handle organization context

