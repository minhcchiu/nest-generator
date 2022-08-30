import { CloudinaryConfig } from '~interface/cloudinary.interface';
import { DatabaseConfig } from '~interface/database.inteface';
import { JwtConfig } from '~interface/jwt.interface';
import { MailerConfig } from '~interface/mailer.interface';
import { cloudinaryConfigEnviroment } from './cloudinary-config.env';
import { databaseConfigEnviroment } from './database-config.env';
import { jwtConfigEnviroment } from './jwt-config.env';
import { mailerConfigEnviroment } from './mailer-config.env';

export const configuration = (): {
  env: string;
  port: number;
  clientUrl: string;
  database: DatabaseConfig;
  jwt: JwtConfig;
  mailer: MailerConfig;
  cloudinary: CloudinaryConfig;
} => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: +process.env.PORT || 8888,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:8888',
    // DATABSE
    database: databaseConfigEnviroment,

    // JWT
    jwt: jwtConfigEnviroment,

    // MAILER
    mailer: mailerConfigEnviroment,

    // CLOUDINARY
    cloudinary: cloudinaryConfigEnviroment,
  };
};
