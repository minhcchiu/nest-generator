import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { EnvStatic } from "./configurations/static.env";
import { SeedService } from "./shared/seed/seed.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// set global prefix
	app.setGlobalPrefix("api");

	// enableCors
	app.enableCors({ origin: "*" });

	// Config swagger
	const config = new DocumentBuilder()
		.setTitle("NestA 2023")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	// Server run at port
	const appConfig = EnvStatic.getAppConfig();

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
