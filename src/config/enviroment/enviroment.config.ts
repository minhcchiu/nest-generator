import { CloudinaryConfig } from '~interface/cloudinary.interface';
import { DatabaseConfig } from '~interface/database.inteface';
import { JwtConfig } from '~interface/jwt.interface';
import { MailerConfig } from '~interface/mailer.interface';
import { cloudinaryConfig } from './cloudinary.config';
import { dataBaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { mailerConfig } from './mailer.config';

export const configuration = (): {
  env: string;
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  mailer: MailerConfig;
  cloudinary: CloudinaryConfig;
} => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: +process.env.PORT || 8888,

    // DATABSE
    database: dataBaseConfig,

    // JWT
    jwt: jwtConfig,

    // MAILER
    mailer: mailerConfig,

    // CLOUDINARY
    cloudinary: cloudinaryConfig,
  };
};
