import { Request } from "express";
import { IS_PUBLIC_KEY } from "~decorators/public.decorator";
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
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { EndpointPermissionType } from "./types/endpoint-permission.type";

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

		const endpoint = await this.getEndpointPermission(path, method);

		if (endpoint.isPublic) return true;

		return await this.validate(request, endpoint);
	}

	private async validate(request: any, endpoint: EndpointPermissionType) {
		const token = this.extractTokenFromHeader(request);

		if (!token)
			throw new UnauthorizedException("Authorization token not found!");

		try {
			const decoded = await this.tokenService.verifyAccessToken(token);

			if (!this.isAccessAllowed(decoded.roles, endpoint))
				throw new UnauthorizedException();

			request.user = {
				...decoded,
				_id: stringIdToObjectId(decoded._id),
			};

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

	private isAccessAllowed(
		userRoles: RoleEnum[],
		endpoint: EndpointPermissionType,
	) {
		return endpoint.userRoles.some((role) => userRoles.includes(role));
	}

	private async getEndpointPermission(
		path: string,
		method: HttpMethod,
	): Promise<EndpointPermissionType> {
		const cacheKey = `${path}-${method}`;

		// check in cache
		const endpointCached = this.cacheService.getEndpointPermission(cacheKey);

		if (endpointCached) return endpointCached;

		// check in db
		const endpoint = await this.endpointService.findOne({ path, method });

		if (!endpoint) throw new UnauthorizedException("Endpoint not found!");

		const { isPublic, userRoles } = endpoint;

		// save to cache
		this.cacheService.setEndpointPermission(cacheKey, { isPublic, userRoles });

		return { isPublic, userRoles };
	}
}
