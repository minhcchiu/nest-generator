import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { OtpConfig } from "./otp-config.type";

export const otpConfigName = "otp";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	OTP_EXPIRATION: string;
}

export const otpEnv = registerAs(otpConfigName, (): OtpConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		expiresIn: eval(process.env.OTP_EXPIRATION),
	};
});
