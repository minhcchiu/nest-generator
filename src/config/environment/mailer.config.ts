import { registerAs } from "@nestjs/config";

export const mailerConfigName = "mailer";

export interface MailerConfig {
	isGmailServer: string;

	transport: {
		gmail: {
			host: string;
			secure: boolean;
			port: number;
			auth: {
				user: string;
				pass: string;
			};
		};

		sendgrid: {
			host: string;
			auth: {
				user: string;
				pass: string;
			};
		};
	};
	defaults: { from: string };
	name: string;
}

export const mailerEnv = registerAs(
	mailerConfigName,
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
