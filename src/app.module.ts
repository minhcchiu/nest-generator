import { join } from "path";
import { AqpMiddleware } from "~middlewares/aqp.middleware";
import { RouteModules } from "~modules/route.modules";
import { FirebaseModule } from "~shared/firebase/firebase.module";
import { RedisFeatureService } from "~shared/redis-feature/redis-feature.service";
import { SocketModule } from "~shared/socket/socket.module";

import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
	ValidationPipe,
} from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AllExceptionsFilter } from "~exceptions/all-exception.filter";
import { LoggingInterceptor } from "~shared/interceptors";
import { CloudinaryModule } from "~shared/storage/cloudinary/cloudinary.module";
import { S3Module } from "~shared/storage/s3/s3.module";
import { VALIDATION_PIPE_OPTIONS } from "~utils/common.constants";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./common/database/database.module";
import { ConfigurationModule } from "./configurations/configuration.module";
import { AppGuard } from "./guards/app.guard";
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

		ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),

		ConfigurationModule,
		DatabaseModule,
		SeedModule,
		CustomLoggerModule,
		MailModule,
		SocketModule,
		FirebaseModule,
		LocalModule,
		S3Module,
		CloudinaryModule,

		// routes
		...RouteModules,
	],
	controllers: [AppController],
	providers: [
		AppService,
		CacheService,
		RedisFeatureService,
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
		consumer
			.apply(AqpMiddleware)
			.forRoutes({ path: "*", method: RequestMethod.GET });
	}
}
