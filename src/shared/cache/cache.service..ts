import { Injectable } from "@nestjs/common";
import * as NodeCache from "node-cache";
import { UserPolicyType } from "src/guards/types/user-policy.type";

@Injectable()
export class CacheService {
	// const myCache = new NodeCache();
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache();
	}

	setUserPolices(key: string, value: UserPolicyType) {
		const ttl = 8 * 60 * 60; // 8 hours

		return this.cache.set(key, value, ttl);
	}

	getUserPolicies(key: string): UserPolicyType {
		return this.cache.get(key);
	}
}
