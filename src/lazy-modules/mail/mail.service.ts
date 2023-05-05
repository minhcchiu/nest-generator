import { AppConfig, ConfigName, MailerConfig } from '~config/environment';
import { Logger } from '~lazy-modules/logger/logger.service';

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  sendMail(options: any) {
    return this.mailerService.sendMail(options);
  }

  async sendOTP(verificationCode: string, to: string, subject: string, from?: string) {
    const { name, defaults } = this.configService.get<MailerConfig>(ConfigName.mailer);
    const params = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject,
      template: './otp/otp.template.hbs',
      context: { verificationCode },
    };

    // send mail
    return this.sendMail(params).then((result) => {
      this.logger.log(MailService.name, `Send a OTP to email:"${to}" successfully!`);
      return result;
    });
  }

  async sendRegisterToken(
    body: { token: string; expiresAt: number },
    to: string,
    subject: string,
    from?: string,
  ) {
    const { name, defaults } = this.configService.get<MailerConfig>(ConfigName.mailer);
    const { appUrl } = this.configService.get<AppConfig>(ConfigName.app);
    const expiresAt = new Date(body.expiresAt);
    const verificationLink = `${appUrl}/auth/verify-register-token?token=${body.token}`;

    // options
    const options = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject,
      template: './verify/verify.template.hbs',
      context: { verificationLink, expiresAt },
    };

    // Send
    return this.sendMail(options).then((result) => {
      this.logger.log(MailService.name, `Send a SIGNUP_TOKEN to email:"${to}" successfully!`);
      return result;
    });
  }

  async sendResetPasswordToken(
    body: { token: string; expiresAt: number },
    to: string,
    subject: string,
    from?: string,
  ) {
    const { name, defaults } = this.configService.get<MailerConfig>(ConfigName.mailer);
    const { appUrl } = this.configService.get<AppConfig>(ConfigName.app);
    const expiresAt = new Date(body.expiresAt);
    const resetPasswordLink = `${appUrl}/auth/reset-password?token=${body.token}`;

    // options
    const options = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject,
      template: './verify/reset-password.template.hbs',
      context: { resetPasswordLink, expiresAt },
    };

    // Send
    return this.sendMail(options).then((result) => {
      this.logger.log(
        MailService.name,
        `Send a RESET_PASSWORD_TOKEN to email:"${to}" successfully!`,
      );
      return result;
    });
  }
}
