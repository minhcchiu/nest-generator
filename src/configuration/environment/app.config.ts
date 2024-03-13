import { registerAs } from "@nestjs/config";

export const appConfigName = "app";

export enum NodeEnv {
	Production = "PRODUCTION",
	Development = "DEVELOPMENT",
}

export interface AppConfig {
	nodeEnv: string;
	port: number;
	appUrl: string;
	appName: string;
	storageServer: string;
}

export const appEnv = registerAs(
	appConfigName,
	(): AppConfig => ({
		nodeEnv: process.env.NODE_ENV,
		port: +process.env.APP_PORT,
		appUrl: process.env.APP_URL,
		appName: process.env.APP_NAME,
		storageServer: process.env.STORAGE_SERVER,
	}),
);
