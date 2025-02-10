import { Request } from "express";
import { IS_PUBLIC_KEY } from "~decorators/public.decorator";
import { HttpMethod } from "~pre-built/3-policies/enum/http-method";
import { PolicyService } from "~pre-built/3-policies/policy.service";
import { CacheService } from "~shared/cache/cache.service.";

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DecodedToken, TokenPayload } from "~modules/pre-built/5-tokens/interface";
import { TokenService } from "~modules/pre-built/5-tokens/token.service";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { UserPolicyType } from "./types/user-policy.type";

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private policyService: PolicyService,
    private cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const { route, method } = request;
    const endpoint = route.path;

    const policy = await this.getPolicy(endpoint, method);

    if (policy.isPublic) return true;

    return this.validate(request, policy);
  }

  private async validate(request: any, policy: UserPolicyType) {
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException("Authorization token not found!");

    try {
      const decoded = await this.tokenService.verifyAccessToken(token);

      const decodedToken: DecodedToken = {
        ...decoded,
        userId: stringIdToObjectId(decoded.userId.toString()),
        roleIds: decoded.roleIds?.map(roleId => stringIdToObjectId(roleId)),
      };

      request.user = decodedToken;

      if (!this.isAccessAllowed(policy, request.user)) throw new UnauthorizedException();

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    const textBearer = "Bearer ";

    if (!authHeader || !authHeader.startsWith(textBearer)) {
      return undefined;
    }

    return authHeader.slice(textBearer.length);
  }

  private isAccessAllowed(policy: UserPolicyType, user: TokenPayload) {
    const { roleIds, blockedRoleIds, isAuthenticated } = policy;

    const isHasBlockedRole = blockedRoleIds?.some(id =>
      user.roleIds.some(gid => gid.toString() === id.toString()),
    );

    if (isHasBlockedRole) return false; // block all users in blockedRoleIds

    if (isAuthenticated) return true; // allow all authenticated users

    const isHasRole = roleIds.some(id =>
      user.roleIds.some(gid => gid.toString() === id.toString()),
    );

    if (isHasRole) return true; // allow all users in roleIds

    return false;
  }

  private async getPolicy(endpoint: string, method: HttpMethod): Promise<UserPolicyType> {
    const cacheKey = `${method}:${endpoint}`;

    // check in cache
    const policyCached = this.cacheService.getUserPolicy(cacheKey);

    if (policyCached) return policyCached;

    // check in db
    const policy = await this.policyService.findOne({ endpoint, method });

    if (!policy) throw new UnauthorizedException("Policy not found!");

    const { isPublic, roleIds, blockedRoleIds, isAuthenticated } = policy;

    // save to cache
    this.cacheService.setUserPolices(cacheKey, {
      isPublic,
      roleIds,
      blockedRoleIds,
      isAuthenticated,
    });

    return policy;
  }
}
