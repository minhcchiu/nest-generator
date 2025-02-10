import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvStatic } from "./configurations/static.env";
import { SeedService } from "./shared/seed/seed.service";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set global prefix
  app.setGlobalPrefix("api");

  // enableCors
  app.enableCors({ origin: "*" });

  // Server run at port
  const appConfig = EnvStatic.getAppConfig();

  await app.listen(appConfig.port, "0.0.0.0", () =>
    Logger.log(`Server running in ${appConfig.nodeEnv} mode on port ${appConfig.port}`, "Main"),
  );

  // Get a list of all the registered routes
  const server = app.getHttpServer();
  const router = server._events.request._router;
  await app.get<SeedService>(SeedService).seedResourcesAndPolicies(router.stack);
  await app.get<SeedService>(SeedService).seedRolesDefault();
  await app.get<SeedService>(SeedService).seedSupperAdmin();
  // await app.get<SeedService>(SeedService).seedProvincesDistrictsWards();
}
