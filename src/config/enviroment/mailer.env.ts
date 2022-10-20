import { registerAs } from '@nestjs/config';
import { defaultEnv } from './default.env';

export const mailerEnv = {
  isGmailServer:
    process.env.MAIL_SERVER === 'gmail' ||
    defaultEnv.mailer.mailServer === 'gmail',

  transport: {
    // send by gmail
    gmail: {
      host: process.env.SMTP_GMAIL_HOST || defaultEnv.mailer.gmailHost,
      secure: false,
      auth: {
        user:
          process.env.SMTP_GMAIL_USERNAME || defaultEnv.mailer.gmailUsername,
        pass:
          process.env.SMTP_GMAIL_PASSWORD || defaultEnv.mailer.gmailPassword,
      },
    },

    // send by sendgrid
    sendgrid: {
      host: process.env.SMTP_SENDGRID_HOST || defaultEnv.mailer.sendgridHost,
      auth: {
        user:
          process.env.SMTP_SENDGRID_USERNAME ||
          defaultEnv.mailer.sendgridUsername,
        pass:
          process.env.SMTP_SENDGRID_PASSWORD ||
          defaultEnv.mailer.sendgridUsername,
      },
    },
  },

  defaults: {
    from: process.env.EMAIL_FROM || defaultEnv.mailer.fromEmail,
  },

  name: process.env.EMAIL_NAME || defaultEnv.mailer.name,
};

export type MailerConfig = typeof mailerEnv;
export const mailerConfig = registerAs('mailer', () => mailerEnv);
