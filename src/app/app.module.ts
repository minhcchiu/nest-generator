import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiQueryParamsMiddleware } from 'src/utils/interceptor/api-query-params.middleware';
import { DatabaseConfig } from '~config/database/database.config';
import { UserModule } from '~common/c1-user/user.module';
import { ProvinceModule } from '~common/c3-provinces/province.module';
import { MailModule } from '~lazy-modules/mail/mail.module';
import { OtpModule } from '~common/c2-otp/otp.module';
import { configuration } from '~config/config/configuration';
import { AuthModule } from '~authorizations/a1-auth/auth.module';
import { SeedModule } from '~lazy-modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseConfig,
    UserModule,
    ProvinceModule,
    MailModule,
    OtpModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiQueryParamsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
