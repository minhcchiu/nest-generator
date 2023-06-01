import { join } from 'path';
import { DatabaseModuleConfig } from '~config/database.module.config';
import { configurations } from '~config/environment';
import { AqpMiddleware } from '~middlewares/aqp.middleware';
import { UserModule } from '~pre-built/1-users/user.module';
import { EndpointModule } from '~pre-built/2-endpoints/endpoint.module';
import { MenuModule } from '~pre-built/3-menus/menu.module';
import { AuthModule } from '~pre-built/4-auth/auth.module';
import { TokenModule } from '~pre-built/5-tokens/token.module';

import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGuard } from './guards/app.guard';
import { CacheService } from './shared/cache/cache.service.';
import { LoggingInterceptor } from './shared/interceptors';
import { LoggerModule } from './shared/logger/logger.module';
import { MailModule } from './shared/mail/mail.module';
import { SeedModule } from './shared/seed/seed.module';
import { OtpModule } from '~routes/pre-built/6-otp/otp.module';

@Module({
  imports: [
    // configs
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
    }),

    CacheModule.register({
      isGlobal: true,
    }),

    DatabaseModuleConfig,
    SeedModule,
    LoggerModule,

    // routes
    EndpointModule,
    MailModule,
    MenuModule,
    UserModule,
    TokenModule,
    AuthModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AqpMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
