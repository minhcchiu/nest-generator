import { join } from 'path';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import {
  appCofig,
  cloudinaryCofig,
  databaseCofig,
  jwtCofig,
  mailerConfig,
  uploadConfig,
} from '~config/enviroment';
import { DatabaseModule } from '~config/database/database.module';
import { MailModule } from '~lazy-modules/mail/mail.module';
import { SeedModule } from '~lazy-modules/seed/seed.module';
import { LoggerModule } from '~lazy-modules/logger/logger.module';
import { AuthModule } from '~auths/a1-auth/auth.module';
import { OtpModule } from '~auths/a2-otp/otp.module';
import { UserModule } from '~common/c1-users/user.module';
import { ProvinceModule } from '~common/c2-provinces/province.module';
import { UploadModule } from '~common/c6-upload/upload.module';
import { FileModule } from '~common/c5-files/file.module';
import { NotificationModule } from '~common/c7-notifications/notification.module';
import { ApiQueryParamsMiddleware } from 'src/middlewares/api-query-params.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { otpCofig } from '~config/enviroment/otp.env';
import { LoggerMiddleware } from 'src/middlewares/logger.middelware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appCofig,
        databaseCofig,
        cloudinaryCofig,
        jwtCofig,
        mailerConfig,
        uploadConfig,
        otpCofig,
      ],
    }),
    DatabaseModule,
    UserModule,
    ProvinceModule,
    MailModule,
    OtpModule,
    AuthModule,
    SeedModule,
    LoggerModule,
    FileModule,
    UploadModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiQueryParamsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
