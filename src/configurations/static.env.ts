import { validateConfig } from "~utils/validate-config";
import { AppConfigDto } from "./dto/app.config.dto";
import { AwsConfigDto } from "./dto/aws.config.dto";
import { CloudinaryConfigDto } from "./dto/cloudinary.config.dto";
import { DatabaseConfigDto } from "./dto/database.config.dto";
import { JWTConfigDto } from "./dto/jwt.config.dto";
import { MailerConfigDto } from "./dto/mailer.config.dto";
import { RedisConfigDto } from "./dto/redis.config.dt";
import { UploadConfigDto } from "./dto/upload.config.dto";
import { StorageServerEnum } from "./enums/config.enum";

// eslint-disable-next-line
require("dotenv").config();

validateConfig(process.env, AppConfigDto);
validateConfig(process.env, DatabaseConfigDto);
validateConfig(process.env, RedisConfigDto);
validateConfig(process.env, UploadConfigDto);
validateConfig(process.env, AwsConfigDto);
validateConfig(process.env, CloudinaryConfigDto);
validateConfig(process.env, JWTConfigDto);
validateConfig(process.env, MailerConfigDto);

export class EnvStatic {
	static getAppConfig() {
		return {
			nodeEnv: process.env.SERVER_ENV,
			port: +process.env.SERVER_PORT,
			serverUrl: process.env.SERVER_URL,
			serverName: process.env.SERVER_NAME,
			storageServer: process.env.STORAGE_SERVER as StorageServerEnum,
			resetPasswordUrl: process.env.RESET_PASSWORD_URL,
			verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL,
			otpExpiration: +process.env.OTP_EXPIRATION,
		};
	}

	static getDatabaseConfig() {
		return {
			name: process.env.DATABASE_NAME,
			uri: process.env.DATABASE_URI,
		};
	}

	static getRedisConfig() {
		return {
			url: process.env.REDIS_URL,
			isEnable: process.env.IS_REDIS_ENABLE === "true",
		};
	}

	static getUploadConfig() {
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
			maxFileSize: +process.env.UPLOAD_MAX_FILE_SIZE,
			maxFilesSize: +process.env.UPLOAD_MAX_FILES_SIZE,
			filesLimit: +process.env.UPLOAD_FILES_LIMIT,
		};
	}

	static getAwsConfig() {
		return {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			region: process.env.S3_REGION,
			endpoint: process.env.S3_ENDPOINT,
			bucketName: process.env.S3_BUCKET_NAME,
			cloudFont: process.env.S3_CLOUD_FONT,
		};
	}

	static getCloudinaryConfig() {
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
	}

	static getJWTConfig() {
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
	}

	static getMailerConfig() {
		return {
			isGmailServer: process.env.MAIL_SERVER,

			transport: {
				gmail: {
					host: process.env.SMTP_GMAIL_HOST,
					secure: process.env.SMTP_GMAIL_SECURE === "true",
					port: +process.env.SMTP_GMAIL_PORT,
					auth: {
						user: process.env.SMTP_GMAIL_USERNAME,
						pass: process.env.SMTP_GMAIL_PASSWORD,
					},
				},

				sendgrid: {
					host: process.env.SMTP_SENDGRID_HOST,
					auth: {
						user: process.env.SMTP_SENDGRID_USERNAME,
						pass: process.env.SMTP_SENDGRID_PASSWORD,
					},
				},
			},

			defaults: { from: process.env.MAILER_FROM_EMAIL },
			name: process.env.MAILER_NAME_NAME,
		};
	}
}
