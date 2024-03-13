import { join } from "path";
import { AqpMiddleware } from "~middlewares/aqp.middleware";
import { RouteModules } from "~routes/route.modules";
import { FirebaseModule } from "~shared/firebase/firebase.module";
import { RedisFeatureService } from "~shared/redis-feature/redis-feature.service";
import { SocketModule } from "~shared/socket/socket.module";

import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { ConfigurationModule } from "~configuration/configuration.module";
import { DatabaseModule } from "~configuration/database/database.module";
import { CloudinaryModule } from "~shared/storage/cloudinary/cloudinary.module";
import { S3Module } from "~shared/storage/s3/s3.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { AppGuard } from "./guards/app.guard";
import { CacheService } from "./shared/cache/cache.service.";
import { LoggingInterceptor } from "./shared/interceptors";
import { CustomLoggerModule } from "./shared/logger/custom-logger.module";
import { MailModule } from "./shared/mail/mail.module";
import { SeedModule } from "./shared/seed/seed.module";
import { LocalModule } from "./shared/storage/local-storage/local.module";

@Module({
	imports: [
		// configs
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), "public"),
			serveRoot: "/public",
		}),

		ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),

		ConfigurationModule,
		CommonModule,
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
