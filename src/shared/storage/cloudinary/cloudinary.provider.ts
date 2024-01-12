import { v2 } from "cloudinary";

import { ConfigService } from "@nestjs/config";
import { CloudinaryConfig } from "~config/interfaces/config.interface";

export const CloudinaryProvider = {
	provide: "Cloudinary",
	useFactory: (config: ConfigService) => {
		const cloudinaryConfig = config.get<CloudinaryConfig>("cloudinary").config;

		return v2.config(cloudinaryConfig);
	},
	inject: [ConfigService],
};
