import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApiQueryParamsMiddleware } from '~middleware/api-query-params.middleware';
import { LoggerMiddleware } from '~middleware/logger.middleware';
import { ApiCollection } from '~authorizations/a2-api-collections/schemas/api-collection.schema';
import { ApiResourceModule } from '~authorizations/a1-api-resources/api-resource.module';
import { AuthAccessModule } from '~authorizations/a4-auth-accesses/auth-access.module';
import { FreeApiModule } from '~authorizations/a3-free-apis/free-api.module';
import { RightsGroup } from '~authorizations/a5-rights-groups/schemas/rights-group.schema';
import { UserModule } from '~common/c1-users/user.module';
import { ProvinceModule } from '~common/c6-provinces/province.module';
import { FileModule } from '~common/c5-files/file.module';
import { UploadModule } from '~common/c4-upload/upload.module';
import { NotificationModule } from '~common/c11-notifications/notification.module';
import { DatabaseModule } from '~config/database/database.module';
import {
  appConfig,
  cloudinaryConfig,
  databaseConfig,
  jwtConfig,
  mailerConfig,
  uploadConfig,
} from '~config/environment';
import { otpConfig } from '~config/environment/otp.env';
import { LoggerModule } from '~lazy-modules/logger/logger.module';
import { MailModule } from '~lazy-modules/mail/mail.module';
import { SeedModule } from '~lazy-modules/seed/seed.module';

import { BannerModule } from '~features/f1-banners/banner.module';
import { OtpModule } from '~common/c3-otp/otp.module';
import { AuthModule } from '~common/c2-auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        cloudinaryConfig,
        jwtConfig,
        mailerConfig,
        uploadConfig,
        otpConfig,
      ],
    }),

    // Authorizations
    ApiResourceModule,
    ApiCollection,
    FreeApiModule,
    AuthAccessModule,
    RightsGroup,

    // Common
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
    BannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiQueryParamsMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
