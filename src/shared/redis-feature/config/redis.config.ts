import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { RedisConfig } from "./redis-config.type";

export const redisConfigName = "redis";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	REDIS_URL: string;
}

export const redisEnv = registerAs(redisConfigName, (): RedisConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		redisUrl: process.env.REDIS_URL,
	};
});
