import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { ValidationExceptions } from './utils/exceptions/validation.exceptions';
import { AllExceptionsFilter } from '~exception/all-exceptions.filter';
import { fileHelper } from '~helper/file.helper';
import { join } from 'path';

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
      exceptionFactory: (errors: ValidationError[]) => new ValidationExceptions(errors),
    }),
  );

  // Catch all Exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

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
    Logger.log(`The server is running on: http://localhost:${port}/api`, 'Main');
  });
}

bootstrap();
