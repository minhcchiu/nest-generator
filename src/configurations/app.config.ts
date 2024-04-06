import { registerAs } from "@nestjs/config";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { AppConfig, NodeEnv, StorageServerEnum } from "./app-config.type";

export const appConfigName = "app";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsEnum(NodeEnv)
	SERVER_ENV: NodeEnv;

	@IsNotEmpty()
	@IsNumber()
	SERVER_PORT: number;

	@IsNotEmpty()
	@IsString()
	SERVER_URL: string;

	@IsNotEmpty()
	@IsString()
	SERVER_NAME: string;

	@IsNotEmpty()
	@IsEnum(StorageServerEnum)
	STORAGE_SERVER: StorageServerEnum;

	@IsNotEmpty()
	@IsString()
	RESET_PASSWORD_URL: string;

	@IsNotEmpty()
	@IsString()
	VERIFY_ACCOUNT_URL: string;
}

export const appEnv = registerAs(appConfigName, (): AppConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		nodeEnv: process.env.SERVER_ENV,
		port: +process.env.SERVER_PORT,
		serverUrl: process.env.SERVER_URL,
		serverName: process.env.SERVER_NAME,
		storageServer: process.env.STORAGE_SERVER as StorageServerEnum,
		resetPasswordUrl: process.env.RESET_PASSWORD_URL,
		verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL,
	};
});
