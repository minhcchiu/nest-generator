import { Request } from "express";
import { IS_PUBLIC_KEY } from "~decorators/public.decorator";
import { Role } from "~pre-built/1-users/enums/role.enum";
import { EndpointService } from "~pre-built/2-endpoints/endpoint.service";
import { HttpMethod } from "~pre-built/2-endpoints/enum/http-method";
import { TokenService } from "~pre-built/5-tokens/token.service";
import { CacheService } from "~shared/cache/cache.service.";

import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

interface IEndpoint {
	userRoles: Role[];
	isPublic: boolean;
}

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

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest();
		const { route, method } = request;
		const path = route.path;

		const endpoint = await this.getPermissionEndpoint(path, method);

		if (endpoint.isPublic) return true;

		return await this.validate(request, endpoint);
	}

	private async validate(request: any, endpoint: IEndpoint) {
		const token = this.extractTokenFromHeader(request);

		if (!token)
			throw new UnauthorizedException("Authorization token not found!");

		try {
			const decoded = await this.tokenService.verifyAccessToken(token);

			if (!this.isAccessAllowed(decoded.roles, endpoint))
				throw new UnauthorizedException();

			request.user = decoded;

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

	private isAccessAllowed(userRoles: Role[], endpoint: IEndpoint) {
		return endpoint.userRoles.some((role) => userRoles.includes(role));
	}

	private async getPermissionEndpoint(
		path: string,
		method: HttpMethod,
	): Promise<IEndpoint> {
		const cacheKey = `${path}-${method}`;

		// check in cache
		const endpointCache = this.cacheService.get(cacheKey);

		if (endpointCache) return endpointCache;

		// check in db
		const endpoint = await this.endpointService.findOne({ path, method });

		if (!endpoint) throw new UnauthorizedException("Endpoint not found!");

		const { isPublic, userRoles } = endpoint;

		// save to cache
		this.cacheService.set(cacheKey, { isPublic, userRoles });

		return { isPublic, userRoles };
	}
}
