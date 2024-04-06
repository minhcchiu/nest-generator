import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { UploadConfig } from "./upload-config.type";

export const uploadConfigName = "upload";

class EnvironmentVariablesValidator {
	@IsNotEmpty()
	@IsString()
	UPLOAD_AUTO_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUTO_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_IMAGE_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_IMAGE_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_IMAGE_FOLDER: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_FOLDER: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_FOLDER: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_FOLDER: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUTO_FOLDER: string;
}

export const uploadEnv = registerAs(uploadConfigName, (): UploadConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		auto: {
			allowedExtensions: process.env.UPLOAD_AUTO_EXT.split("|"),
			maxSize: +process.env.UPLOAD_AUTO_MAX_SIZE,
		},
		audio: {
			allowedExtensions: process.env.UPLOAD_AUDIO_EXT.split("|"),
			maxSize: +process.env.UPLOAD_AUDIO_MAX_SIZE,
		},
		video: {
			allowedExtensions: process.env.UPLOAD_VIDEO_EXT.split("|"),
			maxSize: +process.env.UPLOAD_VIDEO_MAX_SIZE,
		},
		image: {
			allowedExtensions: process.env.UPLOAD_IMAGE_EXT.split("|"),
			maxSize: +process.env.UPLOAD_IMAGE_MAX_SIZE,
		},
		raw: {
			allowedExtensions: process.env.UPLOAD_RAW_EXT.split("|"),
			maxSize: +process.env.UPLOAD_RAW_MAX_SIZE,
		},
		storageFolders: {
			image: process.env.UPLOAD_IMAGE_FOLDER,
			video: process.env.UPLOAD_VIDEO_FOLDER,
			audio: process.env.UPLOAD_AUDIO_FOLDER,
			raw: process.env.UPLOAD_RAW_FOLDER,
			auto: process.env.UPLOAD_AUTO_FOLDER,
		},
	};
});
