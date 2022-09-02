import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '~lazy-modules/logger/logger.service';
// import { MailerConfig } from '~interface/mailer.interface';
// import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {
    logger.setContext(MailerService.name);
  }

  /**
   * Send mail
   * @param params
   * @returns
   */
  sendMail(params: any) {
    return this.mailerService.sendMail(params);
    // const mailerConfig = this.config.get<MailerConfig>("mailer")

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
    try {
      const mailer = this.config.get('mailer');

      const params = {
        from: from ?? `"${mailer.name} ⭐" <${mailer.defaults.from}>`,
        to, // list of receivers like "bar@example.com, baz@example.com"
        subject, // Subject line
        template: './otp/otp.template.hbs',
        context: { verificationCode },
      };

      await this.sendMail(params);

      this.logger.log('SEND OTP TO EMAIL SUCCESS!');
    } catch (e) {
      this.logger.error((e as any).toString());
    }
  }

  /**
   * Send verify
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
    const mailer = this.config.get('mailer');

    const params = {
      from: from ?? `"${mailer.name} ⭐" <${mailer.defaults.from}>`,
      to,
      subject,
      template: './verify/verify.template.hbs',
      context: { verificationLink },
    };

    const result = await this.sendMail(params);

    this.logger.log('SEND SIGNUP TOKEN SUCCESS!');

    return result;
  }

  /**
   * Send verify
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
    const mailer = this.config.get('mailer');

    const params = {
      from: from ?? `"${mailer.name} ⭐" <${mailer.defaults.from}>`,
      to,
      subject,
      template: './verify/reset-password.template.hbs',
      context: { resetPasswordLink },
    };

    const result = await this.sendMail(params);

    this.logger.log('SEND RESET PASSWORD TOKEN SUCCESS!');

    return result;
  }
}
