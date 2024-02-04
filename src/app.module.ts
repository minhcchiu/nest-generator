import { join } from "path";
import { DatabaseModuleConfig } from "~config/database.module.config";
import { AqpMiddleware } from "~middlewares/aqp.middleware";
import { RouteModules } from "~routes/route.modules";
import { FirebaseModule } from "~shared/firebase/firebase.module";
import { RedisFeatureService } from "~shared/redis-feature/redis-feature.service";
import { SocketModule } from "~shared/socket/socket.module";

import { CacheModule } from "@nestjs/cache-manager";
import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppGuard } from "./guards/app.guard";
import { CacheService } from "./shared/cache/cache.service.";
import { LoggingInterceptor } from "./shared/interceptors";
import { LoggerModule } from "./shared/logger/logger.module";
import { MailModule } from "./shared/mail/mail.module";
import { SeedModule } from "./shared/seed/seed.module";
import { S3Module } from "~shared/storage/s3/s3.module";
import { CloudinaryModule } from "~shared/storage/cloudinary/cloudinary.module";
import { appEnv } from "~config/environment/app.config";
import { redisEnv } from "~config/environment/redis.config";
import { mailerEnv } from "~config/environment/mailer.config";
import { awsEnv } from "~config/environment/aws.config";
import { clientUrlEnv } from "~config/environment/client-url.config";
import { cloudinaryEnv } from "~config/environment/cloudinary.config";
import { databaseEnv } from "~config/environment/database.config";
import { jwtEnv } from "~config/environment/jwt.config";
import { otpEnv } from "~config/environment/otp.config";
import { uploadEnv } from "~config/environment/upload.config";

@Module({
	imports: [
		// configs
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "../../", "public"),
			serveRoot: "/",
		}),

		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				appEnv,
				awsEnv,
				clientUrlEnv,
				cloudinaryEnv,
				databaseEnv,
				jwtEnv,
				mailerEnv,
				otpEnv,
				redisEnv,
				uploadEnv,
			],
		}),

		CacheModule.register({
			isGlobal: true,
		}),

		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10,
			},
		]),

		EventEmitterModule.forRoot({
			wildcard: false,
			delimiter: ".",
			newListener: false,
			removeListener: false,
			maxListeners: 10,
			verboseMemoryLeak: false,
			ignoreErrors: false,
		}),

		DatabaseModuleConfig,
		SeedModule,
		LoggerModule,
		MailModule,
		SocketModule,
		FirebaseModule,
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
