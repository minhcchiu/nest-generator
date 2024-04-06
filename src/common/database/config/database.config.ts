import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { DatabaseConfig } from "./database-config.type";

export const databaseConfigName = "database";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	DATABASE_NAME: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_URI: string;
}

export const databaseEnv = registerAs(
	databaseConfigName,
	(): DatabaseConfig => {
		validateConfig(process.env, EnvironmentVariablesValidator);

		return {
			name: process.env.DATABASE_NAME,
			uri: process.env.DATABASE_URI,
		};
	},
);
