import { registerAs } from "@nestjs/config";

export const cloudinaryConfigName = "cloudinary";

export interface CloudinaryConfig {
	config: {
		cloud_name: string;
		api_key: string;
		api_secret: string;
	};
	options: {
		folder: string;
	};
}

export const cloudinaryEnv = registerAs(
	cloudinaryConfigName,
	(): CloudinaryConfig => ({
		config: {
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		},
		options: {
			folder: process.env.APP_NAME,
		},
	}),
);
