import { registerAs } from "@nestjs/config";

export const otpConfigName = "otp";

export interface OtpConfig {
	expiresIn: number;
}

export const otpEnv = registerAs(
	otpConfigName,
	(): OtpConfig => ({
		expiresIn: eval(process.env.OTP_EXPIRATION),
	}),
);
