import { registerAs } from "@nestjs/config";

import { ConfigName } from "./config.enum";
import {
	AppConfig,
	AppleConfig,
	AwsConfig,
	CloudinaryConfig,
	DatabaseConfig,
	FacebookConfig,
	GoogleConfig,
	JWTConfig,
	MailerConfig,
	OtpConfig,
	RedisConfig,
	UploadConfig,
	UrlConfig,
} from "./config.interface";

const nodeEnv = registerAs(
	ConfigName.app,
	(): AppConfig => ({
		nodeEnv: process.env.NODE_ENV,
		port: +process.env.APP_PORT,
		appUrl: process.env.APP_URL,
		appName: process.env.APP_NAME,
		storageServer: process.env.STORAGE_SERVER,
	}),
);

const databaseEnv = registerAs(
	ConfigName.database,
	(): DatabaseConfig => ({
		name: process.env.DATABASE_NAME,
		uri: process.env.DATABASE_URI,
	}),
);

const cloudinaryEnv = registerAs(
	ConfigName.cloudinary,
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

const otpEnv = registerAs(
	ConfigName.otp,
	(): OtpConfig => ({
		expiresIn: eval(process.env.OTP_EXPIRATION),
	}),
);

const uploadEnv = registerAs(
	ConfigName.upload,
	(): UploadConfig => ({
		imageMaxSize: +process.env.UPLOAD_IMAGE_MAX_SIZE,
		rawMaxSize: +process.env.UPLOAD_RAW_MAX_SIZE,
		videoMaxSize: +process.env.UPLOAD_VIDEO_MAX_SIZE,
		autoMaxSize: +process.env.UPLOAD_AUTO_MAX_SIZE,

		imageMaxFiles: +process.env.UPLOAD_IMAGE_MAX_FILE,
		rawMaxFiles: +process.env.UPLOAD_RAW_MAX_FILE,
		videoMaxFiles: +process.env.UPLOAD_VIDEO_MAX_FILE,
		autoMaxFiles: +process.env.UPLOAD_AUTO_MAX_FILE,

		imagesExt: process.env.UPLOAD_IMAGE_EXT,
		rawExt: process.env.UPLOAD_RAW_EXT,
		videoExt: process.env.UPLOAD_VIDEO_EXT,
		autoExt: process.env.UPLOAD_AUTO_EXT,
		auto: {
			allowedExtensions: process.env.UPLOAD_AUTO_EXT.split("|"),
			maxSize: +process.env.UPLOAD_AUTO_MAX_SIZE,
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
			raw: process.env.UPLOAD_RAW_FOLDER,
			video: process.env.UPLOAD_VIDEO_FOLDER,
			auto: process.env.UPLOAD_AUTO_FOLDER,
		},
	}),
);

const jwtEnv = registerAs(
	ConfigName.jwt,
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

const mailerEnv = registerAs(
	ConfigName.mailer,
	(): MailerConfig => ({
		isGmailServer: process.env.MAIL_SERVER,

		transport: {
			gmail: {
				host: process.env.SMTP_GMAIL_HOST,
				secure: true,
				port: 465,
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
	}),
);

const urlEnv = registerAs(
	ConfigName.urlConfig,
	(): UrlConfig => ({
		resetPasswordUrl: process.env.RESET_PASSWORD_URL,
		verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL,
	}),
);

const redisEnv = registerAs(
	ConfigName.redis,
	(): RedisConfig => ({
		redisUrl: process.env.REDIS_URL,
	}),
);

const appleEnv = registerAs(
	ConfigName.apple,
	(): AppleConfig => ({
		appAudience: JSON.parse(process.env.APPLE_APP_AUDIENCE ?? "[]"),
	}),
);

const facebookEnv = registerAs(
	ConfigName.facebook,
	(): FacebookConfig => ({
		appId: process.env.FACEBOOK_APP_ID,
		appSecret: process.env.FACEBOOK_APP_SECRET,
	}),
);

const googleEnv = registerAs(
	ConfigName.google,
	(): GoogleConfig => ({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	}),
);

const awsEnv = registerAs(
	ConfigName.aws,
	(): AwsConfig => ({
		url: process.env.S3_URL,
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
		endpoint: process.env.S3_ENDPOINT,
		bucketName: process.env.S3_BUCKET_NAME,
		backupBucketName: process.env.S3_BUCKET_BACKUP_NAME,
	}),
);

export const configurations = [
	nodeEnv,
	databaseEnv,
	cloudinaryEnv,
	otpEnv,
	uploadEnv,
	jwtEnv,
	mailerEnv,
	urlEnv,
	redisEnv,
	appleEnv,
	facebookEnv,
	googleEnv,
	awsEnv,
];
