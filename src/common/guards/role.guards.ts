import { Role } from 'src/routes/users/enums/role.enum';

import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { AtGuard } from './at.guard';

export const RoleGuard = (...roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends AtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      if (!roles.length) return true;

      const request = context.switchToHttp().getRequest();

      const user = request.user;

      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};
