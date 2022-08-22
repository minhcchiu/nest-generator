import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  /**
   * Send mail
   * @param params
   * @returns
   */
  public sendMail(params: any) {
    return this.mailerService.sendMail(params);
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

      console.log('Send email success');
    } catch (e) {
      console.log('MailerModule sendOTP', (e as any).toString());
    }
  }

  /**
   * Send verify
   * @param verificationLink
   * @param to
   * @param subject
   * @param from
   */
  public async sendSignupToken(
    verificationLink: string,
    to: string,
    subject: string,
    from?: string,
  ) {
    try {
      const mailer = this.config.get('mailer');

      const params = {
        from: from ?? `"${mailer.name} ⭐" <${mailer.defaults.from}>`,
        to,
        subject,
        template: './verify/verify.template.hbs',
        context: { verificationLink },
      };

      const result = await this.sendMail(params);

      console.log('Send email success');

      return result;
    } catch (e) {
      console.log('MailerModule sendOTP', (e as any).toString());
    }
  }
}
