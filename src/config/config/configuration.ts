export const configuration = () => ({
  env: +process.env.NODE_ENV || 'development',
  port: +process.env.PORT || 8888,

  database: {
    name: process.env.DATABASE_NAME,
    uri: process.env.DATABASE_URI,
  },

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

  mailer: {
    transport: {
      host: process.env.SMTP_HOST,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    defaults: {
      from: process.env.EMAIL_FROM,
    },
    name: process.env.EMAIL_NAME,
  },
});
