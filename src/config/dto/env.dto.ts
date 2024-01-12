import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NodeEnv } from "../enums/config.enum";

export class EnvDto {
	@IsNotEmpty()
	@IsEnum(NodeEnv)
	NODE_ENV: string;

	@IsNotEmpty()
	@IsString()
	APP_PORT: string;

	@IsNotEmpty()
	@IsString()
	APP_URL: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_NAME: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_URI: string;

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
	UPLOAD_IMAGE_MAX_SIZE;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_MAX_SIZE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_IMAGE_MAX_FILE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_MAX_FILE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_MAX_FILE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_MAX_FILE: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_IMAGE_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_RAW_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_VIDEO_EXT: string;

	@IsNotEmpty()
	@IsString()
	UPLOAD_AUDIO_EXT: string;

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

	@IsNotEmpty()
	@IsString()
	MAIL_SERVER: string;

	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_HOST: string;

	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_USERNAME: string;

	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_PASSWORD: string;

	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_HOST: string;

	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_USERNAME: string;

	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_PASSWORD: string;

	@IsNotEmpty()
	@IsString()
	MAILER_FROM_EMAIL: string;

	@IsNotEmpty()
	@IsString()
	MAILER_NAME_NAME: string;

	@IsNotEmpty()
	@IsString()
	RESET_PASSWORD_URL: string;

	@IsNotEmpty()
	@IsString()
	VERIFY_ACCOUNT_URL: string;

	@IsNotEmpty()
	@IsString()
	REDIS_URL: string;
}
