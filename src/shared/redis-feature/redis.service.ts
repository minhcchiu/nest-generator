import { Redis } from "ioredis";

import { Injectable } from "@nestjs/common";
import { EnvStatic } from "src/configurations/static.env";

@Injectable()
export class RedisService {
	private redis: Redis;
	private publisher: Redis;
	private subscriber: Redis;

	isSubscribed = false;

	constructor() {
		this.init();
	}

	init() {
		if (!EnvStatic.getRedisConfig().isEnable) return;

		const redisUrl = EnvStatic.getRedisConfig().url;

		this.redis = new Redis(redisUrl);
		this.publisher = new Redis(redisUrl);
		this.subscriber = new Redis(redisUrl);
	}

	async setValue(key: string, value: string) {
		await this.redis.set(key, value);
	}

	async getValue(key: string): Promise<string | null> {
		return this.redis.get(key);
	}

	async publishMessage(channel: string, message: string) {
		await this.publisher.publish(channel, JSON.stringify(message));
	}

	async subscribeToChannel(
		channel: string,
		callback: (message: string) => void,
	) {
		if (this.isSubscribed) return;

		await this.subscriber.subscribe(channel);

		this.subscriber.on("message", (chnl, message) => {
			if (chnl === channel) {
				callback(message);
			}
		});

		this.isSubscribed = true;
	}
}
