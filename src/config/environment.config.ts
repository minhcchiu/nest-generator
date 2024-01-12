import { registerAs } from "@nestjs/config";
import { ConfigName } from "./enums/config.enum";
import {
	AppConfig,
	CloudinaryConfig,
	DatabaseConfig,
	JWTConfig,
	MailerConfig,
	OtpConfig,
	RedisConfig,
	UploadConfig,
	UrlConfig,
} from "./interfaces/config.interface";
import validateConfig from "~utils/src/utils/validate-config";
import { EnvDto } from "./dto/env.dto";

const nodeEnv = registerAs(ConfigName.App, (): AppConfig => {
	validateConfig(process.env, EnvDto);

	return {
		nodeEnv: process.env.NODE_ENV,
		port: +process.env.APP_PORT,
		appUrl: process.env.APP_URL,
	};
});

const databaseEnv = registerAs(ConfigName.Database, (): DatabaseConfig => {
	return {
		name: process.env.DATABASE_NAME,
		uri: process.env.DATABASE_URI,
	};
});

const cloudinaryEnv = registerAs(
	ConfigName.Cloudinary,
	(): CloudinaryConfig => {
		return {
			config: {
				cloud_name: process.env.CLOUD_NAME,
				api_key: process.env.CLOUD_API_KEY,
				api_secret: process.env.CLOUD_API_SECRET,
			},
			options: {
				folder: process.env.APP_NAME,
			},
		};
	},
);

const otpEnv = registerAs(ConfigName.Otp, (): OtpConfig => {
	return {
		expiresIn: eval(process.env.OTP_EXPIRATION),
	};
});

const uploadEnv = registerAs(ConfigName.Upload, (): UploadConfig => {
	return {
		imageMaxSize: +process.env.UPLOAD_IMAGE_MAX_SIZE,
		rawMaxSize: +process.env.UPLOAD_RAW_MAX_SIZE,
		videoMaxSize: +process.env.UPLOAD_VIDEO_MAX_SIZE,
		audioMaxSize: +process.env.UPLOAD_AUDIO_MAX_SIZE,

		imageMaxFiles: +process.env.UPLOAD_IMAGE_MAX_FILE,
		rawMaxFiles: +process.env.UPLOAD_RAW_MAX_FILE,
		videoMaxFiles: +process.env.UPLOAD_VIDEO_MAX_FILE,
		audioMaxFiles: +process.env.UPLOAD_AUDIO_MAX_FILE,

		imagesExt: process.env.UPLOAD_IMAGE_EXT,
		rawExt: process.env.UPLOAD_RAW_EXT,
		videoExt: process.env.UPLOAD_VIDEO_EXT,
		audioExt: process.env.UPLOAD_AUDIO_EXT,
	};
});

const jwtEnv = registerAs(
	ConfigName.Jwt,
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
	ConfigName.Mailer,
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
	ConfigName.UrlConfig,
	(): UrlConfig => ({
		resetPasswordUrl: process.env.RESET_PASSWORD_URL,
		verifyAccountUrl: process.env.VERIFY_ACCOUNT_URL,
	}),
);

const redisEnv = registerAs(
	ConfigName.RedisConfig,
	(): RedisConfig => ({
		redisUrl: process.env.REDIS_URL,
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
];
