import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { JWTConfig } from "./jwt-config.type";

export const jwtConfigName = "jwt";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	JWT_SECRET: string;

	@IsNotEmpty()
	@IsString()
	JWT_EXPIRATION: string;

	@IsNotEmpty()
	@IsString()
	JWT_ACCESS_EXPIRATION: string;

	@IsNotEmpty()
	@IsString()
	JWT_ACCESS_SECRET: string;

	@IsNotEmpty()
	@IsString()
	JWT_REFRESH_EXPIRATION: string;

	@IsNotEmpty()
	@IsString()
	JWT_REFRESH_SECRET: string;

	@IsNotEmpty()
	@IsString()
	JWT_SIGNUP_EXPIRATION: string;

	@IsNotEmpty()
	@IsString()
	JWT_SIGNUP_SECRET: string;

	@IsNotEmpty()
	@IsString()
	JWT_RESET_PASSWORD_EXPIRATION: string;

	@IsNotEmpty()
	@IsString()
	JWT_SECRET_FORGOT_PASSWORD: string;
}

export const jwtEnv = registerAs(jwtConfigName, (): JWTConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		secretKey: process.env.JWT_SECRET,
		expiresIn: eval(process.env.JWT_EXPIRATION),
		accessToken: {
			expiresIn: eval(process.env.JWT_ACCESS_EXPIRATION),
			secretKey: process.env.JWT_ACCESS_SECRET,
		},
		refreshToken: {
			expiresIn: eval(process.env.JWT_REFRESH_EXPIRATION),
			secretKey: process.env.JWT_REFRESH_SECRET,
		},
		registerToken: {
			expiresIn: eval(process.env.JWT_SIGNUP_EXPIRATION),
			secretKey: process.env.JWT_SIGNUP_SECRET,
		},
		forgotPasswordToken: {
			expiresIn: eval(process.env.JWT_RESET_PASSWORD_EXPIRATION),
			secretKey: process.env.JWT_SECRET_FORGOT_PASSWORD,
		},
	};
});
