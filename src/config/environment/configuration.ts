export * from './cloudinary.env';
export * from './database.env';
export * from './jwt.env';
export * from './mailer.env';
export * from './upload.env';
export * from './app.env';

const env = process.env;

export const environmentConfig = {
  app: {
    env: env.APP_ENV,
    port: env.APP_PORT,
    appUrl: env.APP_URL,
  },

  database: {
    name: env.DATABASE_NAME,
    uri: env.DATABASE_URI,
  },

  cloudinary: {
    config: {
      cloud_name: env.CLOUD_NAME,
      api_key: env.CLOUD_API_KEY,
      api_secret: env.CLOUD_API_SECRET,
    },
    options: {
      folder: env.APP_NAME,
    },
  },

  otp: {
    maximumSecondSendOtp: env.MAXIMUM_SECOND_SEND_OTP,
  },

  upload: {
    imageMaxSize: +env.UPLOAD_IMAGE_MAX_SIZE,
    rawMaxSize: +env.UPLOAD_RAW_MAX_SIZE,
    videoMaxSize: +env.UPLOAD_VIDEO_MAX_SIZE,
    audioMaxSize: +env.UPLOAD_AUDIO_MAX_SIZE,

    imageMaxFiles: +env.UPLOAD_IMAGE_MAX_FILE,
    rawMaxFiles: +env.UPLOAD_RAW_MAX_FILE,
    videoMaxFiles: +env.UPLOAD_VIDEO_MAX_FILE,
    audioMaxFiles: +env.UPLOAD_AUDIO_MAX_FILE,

    imagesExt: env.UPLOAD_IMAGE_EXT,
    rawExt: env.UPLOAD_RAW_EXT,
    videoExt: env.UPLOAD_VIDEO_EXT,
    audioExt: env.UPLOAD_AUDIO_EXT,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRESIN,
    expirationTime: {
      access: env.JWT_ACCESS_EXPIRATION,
      refresh: env.JWT_REFRESH_EXPIRATION,
      signup: env.JWT_SIGNUP_EXPIRATION,
      resetPassword: env.JWT_RESET_PASSWORD_EXPIRATION,
    },
    secrets: {
      access: env.JWT_ACCESS_SECRET,
      refresh: env.JWT_REFRESH_SECRET,
      signup: env.JWT_SIGNUP_SECRET,
    },
  },

  mailer: {
    isGmailServer: env.MAIL_SERVER,

    transport: {
      gmail: {
        host: env.SMTP_GMAIL_HOST,
        secure: false,
        auth: {
          user: env.SMTP_GMAIL_USERNAME,
          pass: env.SMTP_GMAIL_PASSWORD,
        },
      },

      sendgrid: {
        host: env.SMTP_SENDGRID_HOST,
        auth: {
          user: env.SMTP_SENDGRID_USERNAME,
          pass: env.SMTP_SENDGRID_PASSWORD,
        },
      },
    },
    defaults: { from: env.EMAIL_FROM },
    name: env.EMAIL_NAME,
  },
};

export const configuration = () => environmentConfig;
