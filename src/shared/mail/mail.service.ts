import * as dayjs from "dayjs";

import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	ClientUrlConfig,
	clientUrlConfigName,
} from "~configuration/environment/client-url.config";
import { MailerConfig } from "./config/mail-config.type";
import { mailerConfigName } from "./config/mail.config";

@Injectable()
export class MailService {
	private clientUrlConfig: ClientUrlConfig;
	private mailerConfig: MailerConfig;

	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
	) {
		this.mailerConfig = this.configService.get<MailerConfig>(mailerConfigName);
		this.clientUrlConfig =
			this.configService.get<ClientUrlConfig>(clientUrlConfigName);
	}

	sendMail(options: ISendMailOptions) {
		return this.mailerService.sendMail(options);
	}

	async sendOTP(
		verificationCode: string,
		to: string,
		subject: string,
		from?: string,
	) {
		const { name, defaults } = this.mailerConfig;
		const params = {
			from: from ?? `"${name} ⭐" <${defaults.from}>`,
			to,
			subject,
			template: "./otp/otp.template.hbs",
			context: { verificationCode },
		};

		// send mail
		return this.sendMail(params);
	}

	async sendRegisterToken(
		body: { token: string; expiresAt: number; fullName: string },
		to: string,
		from?: string,
	) {
		const { name, defaults } = this.mailerConfig;
		const { verifyAccountUrl } = this.clientUrlConfig;

		const expiresIn = dayjs(body.expiresAt).diff(dayjs(Date.now()), "minute");

		const verificationLink = `${verifyAccountUrl}?token=${body.token}`;

		// options
		const options = {
			from: from ?? `"${name} ⭐" <${defaults.from}>`,
			to,
			subject: "Register account.",
			template: "./verify/account-register.template.hbs",
			context: { verificationLink, expiresIn, fullName: body.fullName },
		};

		// Send
		return this.sendMail(options);
	}

	async sendForgotPasswordToken(
		body: { token: string; expiresAt: number; fullName: string },
		to: string,
		from?: string,
	) {
		const { name, defaults } = this.mailerConfig;
		const { resetPasswordUrl } = this.clientUrlConfig;

		const expiresIn = dayjs(body.expiresAt).diff(dayjs(Date.now()), "minute");
		const resetPasswordLink = `${resetPasswordUrl}?token=${body.token}`;

		// options
		const options: ISendMailOptions = {
			to,
			subject: "Forgot Password - Reset Your Password",
			template: "./verify/password-reset.template.hbs",
			context: { resetPasswordLink, expiresIn, fullName: body.fullName },
			from: from ?? `"${name}" <${defaults.from}>`,
		};

		// Send
		return this.sendMail(options);
	}
}
