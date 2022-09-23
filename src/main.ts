import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './app/app.module';
import { ValidationExceptions } from './utils/exceptions/validation.exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // set global prefix
  app.setGlobalPrefix('api');

  // enableCors
  app.enableCors();

  // Validation pipe in global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationExceptions(errors),
    }),
  );

  // Config swagger
  const config = new DocumentBuilder()
    .setTitle('Awesome NestJS Generator 2023')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Server run at port
  const port = configService.get('app.port');

  await app.listen(port, () => {
    console.log(`The server is running on: http://localhost:${port}/api`);
  });
}

bootstrap();
