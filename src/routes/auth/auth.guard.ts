import { Request } from 'express';
import { IS_PUBLIC_KEY } from '~decorators/public.decorator';
import { EndpointService } from '~routes/endpoints/endpoint.service';
import { authSelect } from '~routes/users/select/auth.select';
import { UserService } from '~routes/users/user.service';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenService } from '~routes/tokens/token.service';
import { TokenPayload } from '~routes/tokens/interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private userService: UserService,
    private endpointService: EndpointService,
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

    const endpoint = await this.endpointService.findOne(
      { path, method },
      { projection: { isPublic: 1, userRoles: 1 } },
    );

    if (!endpoint) {
      throw new UnauthorizedException('Endpoint not found!');
    }

    if (endpoint.isPublic) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found!');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.validate(payload);

      if (!endpoint.userRoles.includes(payload.role)) {
        throw new UnauthorizedException('Invalid token or insufficient privileges!');
      }

      request.user = user;
    } catch {
      throw new UnauthorizedException('Invalid token or insufficient privileges!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    return authHeader.slice(7);
  }

  private async validate({ _id }: TokenPayload) {
    const user = await this.userService.findById(_id, { projection: authSelect });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
