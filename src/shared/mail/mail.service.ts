import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { differenceInMinutes } from "date-fns";
import { AppConfig } from "src/configurations/app-config.type";
import { appConfigName } from "src/configurations/app.config";
import { MailerConfig } from "./config/mail-config.type";
import { mailerConfigName } from "./config/mail.config";

@Injectable()
export class MailService {
	private appConfig: AppConfig;
	private mailerConfig: MailerConfig;

	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
	) {
		this.mailerConfig = this.configService.get<MailerConfig>(mailerConfigName);
		this.appConfig = this.configService.get<AppConfig>(appConfigName);
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
		const { verifyAccountUrl } = this.appConfig;

		const expiresIn = differenceInMinutes(body.expiresAt, Date.now());
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
		const { resetPasswordUrl } = this.appConfig;

		const expiresIn = differenceInMinutes(body.expiresAt, Date.now());
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
