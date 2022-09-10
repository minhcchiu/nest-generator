import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerConfig } from '~config/enviroment';
import { Logger } from '~lazy-modules/logger/logger.service';
// import { MailerEnv } from '~interface/mailer.interface';
// import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  private _mailConfig;
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {
    logger.setContext(MailerService.name);
    this._mailConfig = config.get<MailerConfig>('mailter');
  }

  /**
   * Send mail
   *
   * @param options
   * @returns
   */
  sendMail(options: any) {
    return this.mailerService.sendMail(options);
    // const mailerConfig = this.config.get<MailerEnv>("mailer")

    // const isGmailServer = mailerConfig.isGmailServer

    // console.log({ isGmailServer })

    // if (isGmailServer) {
    //   return this.mailerService.sendMail(params);
    // }

    // SendGrid.setApiKey(mailerConfig.transport.sendgrid.auth.pass)

    // return SendGrid.send(params)
  }

  /**
   * Send OTP
   *
   * @param verificationCode
   * @param to
   * @param subject
   * @param from
   */
  async sendOTP(
    verificationCode: string,
    to: string,
    subject: string,
    from?: string,
  ) {
    const params = {
      from:
        from ??
        `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
      to,
      subject,
      template: './otp/otp.template.hbs',
      context: { verificationCode },
    };

    // send mail
    return this.sendMail(params)
      .then((result) => {
        this.logger.log('SEND OTP TO EMAIL SUCCESS!');
        return result;
      })
      .catch((error) => this.logger.error((error as any).toString()));
  }

  /**
   * Send verify
   *
   * @param verificationLink
   * @param to
   * @param subject
   * @param from
   */
  async sendSignupToken(
    verificationLink: string,
    to: string,
    subject: string,
    from?: string,
  ) {
    // options
    const options = {
      from:
        from ??
        `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
      to,
      subject,
      template: './verify/verify.template.hbs',
      context: { verificationLink },
    };

    // Send
    return this.sendMail(options)
      .then((result) => {
        this.logger.log('SEND SIGNUP TOKEN SUCCESS!');
        return result;
      })
      .catch((error) => this.logger.error((error as any).toString()));
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
      from:
        from ??
        `"${this._mailConfig.name} ⭐" <${this._mailConfig.defaults.from}>`,
      to,
      subject,
      template: './verify/reset-password.template.hbs',
      context: { resetPasswordLink },
    };

    // Send
    return this.sendMail(options)
      .then((result) => {
        this.logger.log('SEND RESET PASSWORD TOKEN SUCCESS!');
        return result;
      })
      .catch((error) => this.logger.error((error as any).toString()));
  }
}
