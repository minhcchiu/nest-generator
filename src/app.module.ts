import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { join } from "path";
import { VALIDATION_PIPE_OPTIONS } from "src/common/constant";
import { AppGuard } from "src/guards/app.guard";
import { I18nConfigModule } from "src/i18n/i18n-config.module";
import { AllExceptionsFilter } from "~exceptions/all-exception.filter";
import { AqpMiddleware } from "~middlewares/aqp.middleware";
import { FeatureModules } from "~modules/feature.modules";
import { EventEmitterModule } from "~shared/event-emitters/event-emitter.module";
import { FirebaseModule } from "~shared/firebase/firebase.module";
import { LoggingInterceptor } from "~shared/interceptors";
import { RedisService } from "~shared/redis/redis.service";
import { SocketModule } from "~shared/socket/socket.module";
import { CloudinaryModule } from "~shared/storage/cloudinary/cloudinary.module";
import { S3Module } from "~shared/storage/s3/s3.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./common/database/database.module";
import { EnvStatic } from "./configurations/env.static";
import { CacheService } from "./shared/cache/cache.service.";
import { CustomLoggerModule } from "./shared/logger/custom-logger.module";
import { MailModule } from "./shared/mail/mail.module";
import { SeedModule } from "./shared/seed/seed.module";
import { LocalModule } from "./shared/storage/local-storage/local.module";

@Module({
  imports: [
    // configs
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public"),
      serveRoot: "/static",
    }),
    ThrottlerModule.forRoot([EnvStatic.getThrottlerConfig()]),
    DatabaseModule,
    SeedModule,
    CustomLoggerModule,
    MailModule,
    SocketModule,
    FirebaseModule,
    LocalModule,
    S3Module,
    CloudinaryModule,
    EventEmitterModule,
    I18nConfigModule,

    // Features
    ...FeatureModules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    RedisService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
    {
      provide: APP_FILTER,
      useValue: new AllExceptionsFilter(),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AqpMiddleware).forRoutes({ path: "*", method: RequestMethod.GET });
  }
}
