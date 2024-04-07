import { Injectable } from "@nestjs/common";
import * as NodeCache from "node-cache";
import { EndpointPermissionType } from "src/guards/types/endpoint-permission.type";

@Injectable()
export class CacheService {
	// const myCache = new NodeCache();
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache();
	}

	setEndpointPermission(key: string, value: EndpointPermissionType) {
		const ttl = 8 * 60 * 60; // 8 hours

		return this.cache.set(key, value, ttl);
	}

	getEndpointPermission(key: string): EndpointPermissionType | undefined {
		return this.cache.get(key);
	}
}
