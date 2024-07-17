import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { differenceInMinutes } from "date-fns";
import { EnvStatic } from "src/configurations/static.env";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  async sendOTP(
    data: {
      otpCode: string;
      expiredAt: number;
    },
    to: string,
    subject: string,
    from?: string,
  ) {
    const { name, defaults } = EnvStatic.getMailerConfig();
    const params = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject,
      template: "./otp/otp.template.hbs",
      context: { verificationCode: data.otpCode },
    };

    // send mail
    return this.sendMail(params);
  }

  async sendUserToken(
    body: { token: string; expiresAt: number; fullName: string },
    to: string,
    from?: string,
  ) {
    const { name, defaults } = EnvStatic.getMailerConfig();
    const { verifyAccountUrl } = EnvStatic.getAppConfig();

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
    const { name, defaults } = EnvStatic.getMailerConfig();
    const { resetPasswordUrl } = EnvStatic.getAppConfig();

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
