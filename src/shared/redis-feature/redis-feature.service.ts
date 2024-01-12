import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisConfig } from "~config/interfaces/config.interface";
import { ConfigName } from "~config/enums/config.enum";

@Injectable()
export class RedisFeatureService {
	private redis: Redis;
	private publisher: Redis;
	private subscriber: Redis;
	isSubscribed = false;

	constructor(readonly configService: ConfigService) {
		const url = configService.get<RedisConfig>(ConfigName.RedisConfig).redisUrl;
		this.redis = new Redis(url);
		this.publisher = new Redis(url);
		this.subscriber = new Redis(url);
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
