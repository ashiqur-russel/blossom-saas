export enum OrgRole {
  ORG_ADMIN = 'org_admin',
  ORG_MANAGER = 'org_manager',
  ORG_SUPERVISOR = 'org_supervisor',
  ORG_SALES = 'org_sales',
  ORG_USER = 'org_user',
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  role: string;
  organizationId?: string;
  orgRole: OrgRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  orgRole?: OrgRole;
}

export interface IUpdateUserRole {
  orgRole: OrgRole;
}

export const OrgRoleLabels: Record<OrgRole, string> = {
  [OrgRole.ORG_ADMIN]: 'Organization Admin',
  [OrgRole.ORG_MANAGER]: 'Manager',
  [OrgRole.ORG_SUPERVISOR]: 'Supervisor',
  [OrgRole.ORG_SALES]: 'Sales',
  [OrgRole.ORG_USER]: 'User',
};

