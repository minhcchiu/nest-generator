import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AppConfig } from "./configurations/app-config.type";
import { appConfigName } from "./configurations/app.config";
import { SeedService } from "./shared/seed/seed.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// set global prefix
	app.setGlobalPrefix("api");

	// enableCors
	app.enableCors({ origin: "*" });

	// Validation pipe in global
	// app.useGlobalPipes(
	// 	new ValidationPipe({
	// 		whitelist: true,
	// 		forbidNonWhitelisted: true,
	// 		exceptionFactory: (errors: ValidationError[]) =>
	// 			new ValidationExceptions(errors),
	// 	}),
	// );

	// Catch all Exceptions
	// app.useGlobalFilters(new AllExceptionsFilter());

	// Config swagger
	const config = new DocumentBuilder()
		.setTitle("NestA 2023")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	// Server run at port
	const configService = app.get(ConfigService);
	const appConfig = configService.get<AppConfig>(appConfigName);

	await app.listen(appConfig.port, () =>
		Logger.log(
			`Server running in ${appConfig.nodeEnv} mode on port ${appConfig.port}`,
			"Main",
		),
	);

	// Get a list of all the registered routes
	const server = app.getHttpServer();
	const router = server._events.request._router;
	await app.get<SeedService>(SeedService).seedEndpoints(router.stack);
}

bootstrap();
