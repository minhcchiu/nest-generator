import { DatabaseConfig } from '~interface/database.inteface';
import { JwtConfig } from '~interface/jwt.interface';
import { MailerConfig } from '~interface/mailer.interface';

export const configuration = (): {
  env: string;
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  mailer: MailerConfig;
} => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: +process.env.PORT || 8888,

    // DATABSE
    database: {
      name: process.env.DATABASE_NAME,
      uri: process.env.DATABASE_URI,
    },

    // JWT
    jwt: {
      secret: process.env.JWT_SECRET || '?wOfl6_4Q_KeYS(#a{qGe+W2!L_q6H', // https://randomkeygen.com/
      expiresIn: process.env.JWT_EXPIRESIN || '30m',
      expirationTime: {
        accessToken: process.env.JWT_ACCESS_EXPIRATION || '88d',
        refreshToken: process.env.JWT_REFRESH_EXPIRATION || '1m',
        signupToken: process.env.JWT_SIGNUP_EXPIRATION || '10m',
      },
      secrets: {
        accessToken: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
        refreshToken: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
        signupToken: process.env.JWT_SIGNUP_SECRET || 'JWT_SIGNUP_SECRET',
      },
    },

    // MAILER
    mailer: {
      isGmailServer: process.env.MAIL_SERVER === 'gmail',

      transport: {
        // send by gmail
        gmail: {
          host: process.env.SMTP_GMAIL_HOST,
          secure: false,
          auth: {
            user: process.env.SMTP_GMAIL_USERNAME,
            pass: process.env.SMTP_GMAIL_PASSWORD,
          },
        },

        // send by sendgrid
        // sendgrid: {
        //   host: process.env.SMTP_SENDGRID_HOST,
        //   auth: {
        //     user: process.env.SMTP_SENDGRID_USERNAME,
        //     pass: process.env.SMTP_SENDGRID_PASSWORD,
        //   },
        // },
      },

      defaults: {
        from: process.env.EMAIL_FROM,
      },

      name: process.env.EMAIL_NAME,
    },
  };
};
