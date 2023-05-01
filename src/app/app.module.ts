import { join } from 'path';
import { EndpointModule } from 'src/routes/endpoints/endpoint.module';
import { MenuModule } from 'src/routes/menus/menu.module';
import { DatabaseModule } from '~config/database/database.module';
import { LoggerModule } from '~lazy-modules/logger/logger.module';
import { AqpMiddleware } from '~middleware/aqp.middleware';
import { LoggerMiddleware } from '~middleware/logger.middleware';
import { UserModule } from '~routes/users/user.module';

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '~routes/auth/auth.module';
import { configuration } from '~config/environment';
import { MailModule } from '~lazy-modules/mail/mail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      serveRoot: '/',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Authorizations
    DatabaseModule,
    // SeedModule,
    LoggerModule,
    EndpointModule,
    MailModule,
    MenuModule,
    UserModule,
    AuthModule,
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
