import { ValidationError } from "class-validator";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./exceptions/all-exception.filter";
import { ValidationExceptions } from "./exceptions/validation.exceptions";
import { SeedService } from "./shared/seed/seed.service";
import { AppConfig } from "~config/interfaces/config.interface";
import { ConfigName } from "~config/enums/config.enum";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// set global prefix
	app.setGlobalPrefix("api");

	// enableCors
	app.enableCors({
		origin: "*",
	});

	// Validation pipe in global
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			exceptionFactory: (errors: ValidationError[]) =>
				new ValidationExceptions(errors),
		}),
	);

	// Catch all Exceptions
	app.useGlobalFilters(new AllExceptionsFilter());

	// Config swagger
	const config = new DocumentBuilder()
		.setTitle("NestA 2023")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	// Server run at port
	const port = configService.get<AppConfig>(ConfigName.App).port;
	const nodeEnv = configService.get<AppConfig>(ConfigName.App).nodeEnv;
	await app.listen(port, () => {
		Logger.log(`Server running in ${nodeEnv} mode on port ${port}`, "Main");
	});

	// Get a list of all the registered routes
	const server = app.getHttpServer();
	const router = server._events.request._router;
	await app.get<SeedService>(SeedService).seedEndpoints(router.stack);
}

bootstrap();
