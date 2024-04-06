import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { CloudinaryConfig } from "./cloudinary-config.type";

export const cloudinaryConfigName = "cloudinary";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	CLOUD_NAME: string;

	@IsNotEmpty()
	@IsString()
	CLOUD_API_KEY: string;

	@IsNotEmpty()
	@IsString()
	CLOUD_API_SECRET: string;

	@IsNotEmpty()
	@IsString()
	SERVER_NAME: string;
}

export const cloudinaryEnv = registerAs(
	cloudinaryConfigName,
	(): CloudinaryConfig => {
		validateConfig(process.env, EnvironmentVariablesValidator);

		return {
			config: {
				cloud_name: process.env.CLOUD_NAME,
				api_key: process.env.CLOUD_API_KEY,
				api_secret: process.env.CLOUD_API_SECRET,
			},
			options: {
				folder: process.env.SERVER_NAME,
			},
		};
	},
);
