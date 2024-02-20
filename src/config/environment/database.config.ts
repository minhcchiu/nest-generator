import { registerAs } from "@nestjs/config";

export const databaseConfigName = "database";

export interface DatabaseConfig {
	name: string;
	uri: string;
}

export const databaseEnv = registerAs(
	databaseConfigName,
	(): DatabaseConfig => ({
		name: process.env.DATABASE_NAME,
		uri: process.env.DATABASE_URI,
	}),
);
