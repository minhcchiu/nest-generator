import { registerAs } from "@nestjs/config";

export const jwtConfigName = "jwt";

export interface JWTConfig {
	secretKey: string;
	expiresIn: number;
	accessToken: {
		expiresIn: number;
		secretKey: string;
	};
	refreshToken: {
		expiresIn: number;
		secretKey: string;
	};
	registerToken: {
		expiresIn: number;
		secretKey: string;
	};
	forgotPasswordToken: {
		expiresIn: number;
		secretKey: string;
	};
}

export const jwtEnv = registerAs(
	jwtConfigName,
	(): JWTConfig => ({
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
	}),
);
