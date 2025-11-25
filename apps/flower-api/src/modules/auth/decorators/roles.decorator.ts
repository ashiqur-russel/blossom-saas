/**
 * Roles Decorator - Specifies required roles for a route
 * Follows NestJS best practices: Decorators in decorators folder
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../schemas/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);


