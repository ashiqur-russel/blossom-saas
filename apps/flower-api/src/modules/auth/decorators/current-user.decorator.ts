/**
 * Current User Decorator - Extracts current user from request
 * Follows NestJS best practices: Decorators in decorators folder
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

