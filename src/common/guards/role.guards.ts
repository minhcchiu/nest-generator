import { AtGuard } from './at.guard';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RoleEnum } from 'src/routes/users/enums/role.enum';

export const RoleGuard = (...roles: RoleEnum[]): Type<CanActivate> => {
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
