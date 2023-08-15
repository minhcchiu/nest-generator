import {
	AppConfig,
	ConfigName,
	MailerConfig,
	UrlConfig,
} from "~config/environment";
import { Logger } from "~shared/logger/logger.service";

import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
		private readonly logger: Logger,
	) {}

	sendMail(options: ISendMailOptions) {
		return this.mailerService.sendMail(options);
	}

	async sendOTP(
		verificationCode: string,
		to: string,
		subject: string,
		from?: string,
	) {
		const { name, defaults } = this.configService.get<MailerConfig>(
			ConfigName.mailer,
		);
		const params = {
			from: from ?? `"${name} ⭐" <${defaults.from}>`,
			to,
			subject,
			template: "./otp/otp.template.hbs",
			context: { verificationCode },
		};

		// send mail
		return this.sendMail(params).then((result) => {
			this.logger.log(
				MailService.name,
				`Send a OTP to email:"${to}" successfully!`,
			);
			return result;
		});
	}

	async sendRegisterToken(
		body: { token: string; expiresAt: number },
		to: string,
		from?: string,
	) {
		const { name, defaults } = this.configService.get<MailerConfig>(
			ConfigName.mailer,
		);
		const { appUrl } = this.configService.get<AppConfig>(ConfigName.app);
		const expiresAt = new Date(body.expiresAt);
		const verificationLink = `${appUrl}/auth/verify-register-token?token=${body.token}`;

		// options
		const options = {
			from: from ?? `"${name} ⭐" <${defaults.from}>`,
			to,
			subject: "Register account.",
			template: "./verify/verify.template.hbs",
			context: { verificationLink, expiresAt },
		};

		// Send
		return this.sendMail(options).then((result) => {
			this.logger.log(
				MailService.name,
				`Send a SIGNUP_TOKEN to email:"${to}" successfully!`,
			);
			return result;
		});
	}

	async sendForgotPasswordToken(
		body: { token: string; expiresAt: number },
		to: string,
		from?: string,
	) {
		const { name, defaults } = this.configService.get<MailerConfig>(
			ConfigName.mailer,
		);
		const { resetPasswordUrl } = this.configService.get<UrlConfig>(
			ConfigName.urlConfig,
		);
		const expiresAt = new Date(body.expiresAt);
		const resetPasswordLink = `${resetPasswordUrl}?token=${body.token}`;

		// options
		const options: ISendMailOptions = {
			to,
			subject: "Forgot Password - Reset Your Password",
			template: "./verify/forgot-password.template.hbs",
			context: { resetPasswordLink, expiresAt },
			from: from ?? `"${name}" <${defaults.from}>`,
		};

		// Send
		return this.sendMail(options).then((result) => {
			this.logger.log(
				MailService.name,
				`Send a FORGOT_PASSWORD_TOKEN to email:"${to}" successfully!`,
			);

			return result;
		});
	}
}
