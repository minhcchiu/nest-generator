import { registerAs } from "@nestjs/config";

export const clientUrlConfigName = "urlConfig";

export interface ClientUrlConfig {
	resetPasswordUrl: string;
	verifyAccountUrl: string;
}

export const clientUrlEnv = registerAs(
	clientUrlConfigName,
	(): ClientUrlConfig => ({
		resetPasswordUrl: process.env.RESET_PASSWORD_URL,
		verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL,
	}),
);
