import { Request } from 'express';
import { IS_PUBLIC_KEY } from '~decorators/public.decorator';
import { EndpointService } from '~pre-built/2-endpoints/endpoint.service';
import { TokenService } from '~pre-built/5-tokens/token.service';
import { CacheService } from '~shared/cache/cache.service.';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private endpointService: EndpointService,
    private cacheService: CacheService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { route, method } = request;
    const path = route.path;
    const start = Date.now();
    const cacheKey = `${path}-${method}`; // Create a unique cache key for the endpoint
    let endpoint = this.cacheService.get(cacheKey); // Check the cache for the endpoint data
    console.log({ endpointCache: endpoint });

    if (!endpoint) {
      const projection = { isPublic: 1, userRoles: 1 };
      endpoint = await this.endpointService.findOne({ path, method }, { projection });
      console.log({ endpointDB: endpoint });

      this.cacheService.set(cacheKey, endpoint); // Store the endpoint data in the cache
    }

    if (!endpoint) throw new UnauthorizedException('Endpoint not found!');

    if (endpoint.isPublic) return true;

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Authorization token not found!');

    try {
      const decoded = await this.tokenService.verifyAccessToken(token);
      console.log({ decoded });
      if (!this.isAccessAllowed(decoded.role, endpoint)) throw new UnauthorizedException();

      request.user = { _id: decoded._id, role: decoded.role };
      const duration = Date.now() - start;

      console.log({ duration });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or insufficient privileges!');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    return authHeader.slice(7);
  }

  private isAccessAllowed(userRole: string, endpoint: any): boolean {
    return endpoint.userRoles.includes(userRole);
  }
}
