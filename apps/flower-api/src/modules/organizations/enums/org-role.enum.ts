/**
 * Organization Role Enum
 * Defines roles within an organization
 */
export enum OrgRole {
  // Organization Administrator - Full control over organization
  ORG_ADMIN = 'org_admin',

  // Organization Manager - Can manage users and view all data
  ORG_MANAGER = 'org_manager',

  // Organization Supervisor - Can view and manage sales data
  ORG_SUPERVISOR = 'org_supervisor',

  // Organization Sales - Can create and manage sales entries
  ORG_SALES = 'org_sales',

  // Organization User - Basic access, view-only
  ORG_USER = 'org_user',
}

/**
 * Organization Role Permissions
 * Defines what each role can do
 */
export const OrgRolePermissions = {
  [OrgRole.ORG_ADMIN]: {
    // User Management
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canManageRoles: true,

    // Sales Data
    canViewSales: true,
    canCreateSales: true,
    canUpdateSales: true,
    canDeleteSales: true,

    // Withdrawals
    canViewWithdrawals: true,
    canCreateWithdrawals: true,
    canUpdateWithdrawals: true,
    canDeleteWithdrawals: true,

    // Analytics
    canViewAnalytics: true,
    canViewAllAnalytics: true,

    // Organization Settings
    canManageOrganization: true,
    canViewOrganizationSettings: true,
  },

  [OrgRole.ORG_MANAGER]: {
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: false, // Cannot delete users
    canManageRoles: true,

    canViewSales: true,
    canCreateSales: true,
    canUpdateSales: true,
    canDeleteSales: true,

    canViewWithdrawals: true,
    canCreateWithdrawals: true,
    canUpdateWithdrawals: true,
    canDeleteWithdrawals: false,

    canViewAnalytics: true,
    canViewAllAnalytics: true,

    canManageOrganization: false,
    canViewOrganizationSettings: true,
  },

  [OrgRole.ORG_SUPERVISOR]: {
    canViewUsers: true,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,

    canViewSales: true,
    canCreateSales: true,
    canUpdateSales: true,
    canDeleteSales: true,

    canViewWithdrawals: true,
    canCreateWithdrawals: false,
    canUpdateWithdrawals: false,
    canDeleteWithdrawals: false,

    canViewAnalytics: true,
    canViewAllAnalytics: true,

    canManageOrganization: false,
    canViewOrganizationSettings: false,
  },

  [OrgRole.ORG_SALES]: {
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,

    canViewSales: true,
    canCreateSales: true,
    canUpdateSales: true,
    canDeleteSales: false, // Can only delete own sales

    canViewWithdrawals: false,
    canCreateWithdrawals: false,
    canUpdateWithdrawals: false,
    canDeleteWithdrawals: false,

    canViewAnalytics: true,
    canViewAllAnalytics: false, // Only own analytics

    canManageOrganization: false,
    canViewOrganizationSettings: false,
  },

  [OrgRole.ORG_USER]: {
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,

    canViewSales: true,
    canCreateSales: false,
    canUpdateSales: false,
    canDeleteSales: false,

    canViewWithdrawals: false,
    canCreateWithdrawals: false,
    canUpdateWithdrawals: false,
    canDeleteWithdrawals: false,

    canViewAnalytics: true,
    canViewAllAnalytics: false,

    canManageOrganization: false,
    canViewOrganizationSettings: false,
  },
} as const;

