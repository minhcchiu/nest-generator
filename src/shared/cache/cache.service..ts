import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
	private cache: Map<string, any>;

	constructor() {
		this.cache = new Map();
	}

	set(key: string, value: any): void {
		this.cache.set(key, value);
	}

	get(key: string): any {
		return this.cache.get(key);
	}

	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	has(key: string): boolean {
		return this.cache.has(key);
	}
}
