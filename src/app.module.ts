import { join } from "path";
import { DatabaseModuleConfig } from "~config/database.module.config";
import { configurations } from "~config/environment";
import { AqpMiddleware } from "~middlewares/aqp.middleware";

import { CacheModule } from "@nestjs/cache-manager";
import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppGuard } from "./guards/app.guard";
import { CacheService } from "./shared/cache/cache.service.";
import { LoggingInterceptor } from "./shared/interceptors";
import { LoggerModule } from "./shared/logger/logger.module";
import { MailModule } from "./shared/mail/mail.module";
import { SeedModule } from "./shared/seed/seed.module";
import { SocketModule } from "~shared/socket/socket.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { RouteModules } from "~routes/route.modules";

@Module({
	imports: [
		// configs
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "../../", "public"),
			serveRoot: "/",
		}),

		ConfigModule.forRoot({
			isGlobal: true,
			load: configurations,
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

		DatabaseModuleConfig,
		SeedModule,
		LoggerModule,
		MailModule,
		SocketModule,

		// routes
		...RouteModules,
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
