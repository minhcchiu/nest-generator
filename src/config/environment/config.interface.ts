import { ConfigName } from './config.enum';

export interface IConfiguration {
  [ConfigName.app]: AppConfig;
  [ConfigName.database]: DatabaseConfig;
  [ConfigName.cloudinary]: CloudinaryConfig;
  [ConfigName.otp]: OtpConfig;
  [ConfigName.upload]: UploadConfig;
  [ConfigName.jwt]: JWTConfig;
  [ConfigName.mailer]: MailerConfig;
}

export interface AppConfig {
  env: string;
  port: number;
  appUrl: string;
}

export interface DatabaseConfig {
  name: string;
  uri: string;
}

export interface CloudinaryConfig {
  config: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
  options: {
    folder: string;
  };
}

export interface OtpConfig {
  maximumSecondSendOtp: string;
}

export interface UploadConfig {
  imageMaxSize: number;
  rawMaxSize: number;
  videoMaxSize: number;
  audioMaxSize: number;

  imageMaxFiles: number;
  rawMaxFiles: number;
  videoMaxFiles: number;
  audioMaxFiles: number;

  imagesExt: string;
  rawExt: string;
  videoExt: string;
  audioExt: string;
}

export interface MailerConfig {
  isGmailServer: string;

  transport: {
    gmail: {
      host: string;
      secure: false;
      auth: {
        user: string;
        pass: string;
      };
    };

    sendgrid: {
      host: string;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
  defaults: { from: string };
  name: string;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  accessToken: {
    expiresIn: string;
    secret: string;
  };
  refreshToken: {
    expiresIn: string;
    secret: string;
  };
  registerToken: {
    expiresIn: string;
    secret: string;
  };
  resetPasswordToken: {
    expiresIn: string;
    // secret: string; // is access secret
  };
}
