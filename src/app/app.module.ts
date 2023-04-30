import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AqpMiddleware } from '~middleware/aqp.middleware';
import { LoggerMiddleware } from '~middleware/logger.middleware';

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

import { EndpointModule } from 'src/routes/endpoints/endpoint.module';

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
    // Common
    DatabaseModule,
    // SeedModule,
    LoggerModule,
    EndpointModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AqpMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
