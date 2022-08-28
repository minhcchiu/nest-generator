export const mailerConfigEnviroment = {
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
};
