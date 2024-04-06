import { registerAs } from "@nestjs/config";
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateIf,
} from "class-validator";
import { validateConfig } from "~utils/validate-config";
import { MailerConfig } from "./mail-config.type";

export const mailerConfigName = "mailer";

export const redisConfigName = "redis";

export enum MailServerEnum {
	Gmail = "gmail",
	Sendgrid = "sendgrid",
}

class EnvironmentVariablesValidator {
	@IsEnum(MailServerEnum)
	MAIL_SERVER: MailServerEnum;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Gmail)
	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_HOST: string;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Gmail)
	@IsNotEmpty()
	@IsNumber()
	SMTP_GMAIL_PORT: number;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Gmail)
	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_USERNAME: string;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Gmail)
	@IsNotEmpty()
	@IsString()
	SMTP_GMAIL_PASSWORD: string;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Gmail)
	@IsNotEmpty()
	@IsBoolean()
	SMTP_GMAIL_SECURE: boolean;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Sendgrid)
	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_HOST: string;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Sendgrid)
	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_USERNAME: string;

	@ValidateIf((o) => o.MAIL_SERVER === MailServerEnum.Sendgrid)
	@IsNotEmpty()
	@IsString()
	SMTP_SENDGRID_PASSWORD: string;

	@IsNotEmpty()
	@IsString()
	MAILER_FROM_EMAIL: string;

	@IsNotEmpty()
	@IsString()
	MAILER_NAME_NAME: string;
}

export const mailerEnv = registerAs(mailerConfigName, (): MailerConfig => {
	validateConfig(process.env, EnvironmentVariablesValidator);

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
});
