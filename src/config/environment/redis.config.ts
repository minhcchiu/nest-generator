import { registerAs } from "@nestjs/config";

export const redisConfigName = "redis";

export interface RedisConfig {
	redisUrl: string;
}

export const redisEnv = registerAs(
	redisConfigName,
	(): RedisConfig => ({
		redisUrl: process.env.REDIS_URL,
	}),
);
