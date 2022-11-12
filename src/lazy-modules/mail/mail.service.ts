import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerConfig } from '~config/environment';
import { Logger } from '~lazy-modules/logger/logger.service';

@Injectable()
export class MailService {
  private _mailConfig: MailerConfig;
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {
    this._mailConfig = config.get<MailerConfig>('mailer');
  }

  /**
   * Send mail
   *
   * @param options
   * @returns
   */
  sendMail(options: any) {
    return this.mailerService.sendMail(options);
  }

  /**
   * Send OTP
   *
   * @param verificationCode
   * @param to
   * @param subject
   * @param from
   */
  async sendOTP(verificationCode: string, to: string, subject: string, from?: string) {
    const params = {
      from: from ?? `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
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

  /**
   * Send signup
   *
   * @param verificationLink
   * @param to
   * @param subject
   * @param from
   */
  async sendSignupToken(verificationLink: string, to: string, subject: string, from?: string) {
    // options
    const options = {
      from: from ?? `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
      to,
      subject,
      template: './verify/verify.template.hbs',
      context: { verificationLink },
    };

    // Send
    return this.sendMail(options).then((result) => {
      this.logger.log(MailService.name, `Send a SIGNUP_TOKEN to email:"${to}" successfully!`);
      return result;
    });
  }

  /**
   * Send verify
   *
   * @param resetPasswordLink
   * @param to
   * @param subject
   * @param from
   */
  async sendResetPasswordToken(
    resetPasswordLink: string,
    to: string,
    subject: string,
    from?: string,
  ) {
    // options
    const options = {
      from: from ?? `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
      to,
      subject,
      template: './verify/reset-password.template.hbs',
      context: { resetPasswordLink },
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
