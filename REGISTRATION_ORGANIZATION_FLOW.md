# Registration & Organization Creation Flow

## Overview
When a user registers via the public registration URL (`/register`), they automatically become the **Organization Admin (ORG_ADMIN)** of a newly created organization.

## Registration Flow

### 1. User Fills Registration Form
The registration form includes:
- **First Name** (required)
- **Last Name** (required)
- **Email** (required)
- **Password** (required, min 6 chars)
- **Organization Name** (optional) - This is the key field!

### 2. Organization Name Handling

**If Organization Name is provided:**
- Organization name = `businessName` (user input)
- Organization `businessName` = `businessName` (user input)

**If Organization Name is NOT provided:**
- Organization name = `"{FirstName} {LastName}'s Organization"`
- Organization `businessName` = `"{FirstName} {LastName}'s Organization"`

### 3. Automatic Organization Creation

When the user submits the registration form:

```typescript
// Backend automatically:
1. Creates an Organization with the name (from businessName or default)
2. Creates the User account
3. Assigns user to the organization (organizationId)
4. Sets user's orgRole to ORG_ADMIN (organization admin)
5. Sets user's role to USER (system role - not admin)
6. Sets organization.createdBy = user._id
7. Sets organization.ownerId = user._id
```

### 4. User Becomes Organization Admin

The registered user:
- ✅ Belongs to their organization (`organizationId` is set)
- ✅ Has `ORG_ADMIN` role (can manage users, roles, all data)
- ✅ Is the organization owner
- ✅ Can immediately create other users in their organization

## Example Scenarios

### Scenario 1: User provides Organization Name
```
Input:
- First Name: "John"
- Last Name: "Doe"
- Email: "john@example.com"
- Organization Name: "Blossom Flowers"

Result:
- Organization name: "Blossom Flowers"
- User becomes ORG_ADMIN of "Blossom Flowers"
```

### Scenario 2: User doesn't provide Organization Name
```
Input:
- First Name: "John"
- Last Name: "Doe"
- Email: "john@example.com"
- Organization Name: (empty)

Result:
- Organization name: "John Doe's Organization"
- User becomes ORG_ADMIN of "John Doe's Organization"
```

## Important Notes

1. **All Users Get Organizations**: Every user who registers gets their own organization automatically
2. **First User = Admin**: The first user in an organization is always `ORG_ADMIN`
3. **System Admin vs Org Admin**: 
   - `UserRole.ADMIN` = System-level admin (rare, for platform management)
   - `OrgRole.ORG_ADMIN` = Organization admin (first user of each org)
4. **Organization Isolation**: Users can only see/manage data from their own organization

## Frontend Form

The registration form now clearly shows:
- Label: "Organization Name (Optional)"
- Help text: "This will be your organization name. If left empty, it will default to '{FirstName} {LastName}'s Organization'"
- Dynamic preview: Shows the default name based on entered first/last name

## Backend Logic

```typescript
// In auth.service.ts register() method:
const orgName = businessName?.trim() || `${firstName} ${lastName}'s Organization`.trim();

const organization = await this.organizationModel.create({
  name: orgName,
  businessName: businessName?.trim() || orgName,
  createdBy: user._id, // Set after user creation
  ownerId: user._id,   // Set after user creation
  isActive: true,
});

const user = await this.userModel.create({
  // ... other fields
  organizationId: organization._id.toString(),
  orgRole: OrgRole.ORG_ADMIN, // First user becomes org admin
  role: UserRole.USER,        // System role (not admin)
});
```

## Migration for Existing Users

If you have existing users without organizations, run:
```bash
npm run migrate:users
```

This will:
- Create an organization for each user
- Assign them `ORG_ADMIN` role
- Update all their Week and Withdrawal records with `organizationId`

