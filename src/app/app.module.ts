import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ApiQueryParamsMiddleware from 'src/utils/interceptor/query-params.middleware';
import { DatabaseConfig } from '~config/database/database.config';
import { UserModule } from '~common/c1-user/user.module';
import { ProvinceModule } from '~common/province/province.module';
import { MailModule } from 'src/lazy-modules/mail/mail.module';
import { OtpModule } from '~common/c2-otp/otp.module';
import { configuration } from '~config/config/configuration';
import AuthModule from '~authorizations/c1-auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseConfig,
    UserModule,
    ProvinceModule,
    MailModule,
    OtpModule,
    AuthModule,
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
