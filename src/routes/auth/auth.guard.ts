import { Request } from 'express';
import { IS_PUBLIC_KEY } from '~decorators/public.decorator';
import { EndpointService } from '~routes/endpoints/endpoint.service';
import { authSelect } from '~routes/users/select/auth.select';
import { UserService } from '~routes/users/user.service';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenPayload } from './interface';
import { TokenService } from './token.service';

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

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Authorization token not found!');

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.validate(payload, request);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Invalid token or insufficient privileges!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      return undefined;
    }

    return token;
  }

  private async validate(payload: TokenPayload, request: any) {
    const { _id, role } = payload;
    const { route, method } = request;

    const [user, endpoint] = await Promise.all([
      this.userService.findById(_id, { projection: authSelect }),
      this.endpointService.findOne({ path: route.path, method, userRoles: role }),
    ]);

    if (!user || !endpoint) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
