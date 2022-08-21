import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app/app.module';
import { ValidationExceptions } from './utils/exception/validation.exceptions';

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

  await app.listen(configService.get('port'), () => {
    console.log(
      `The server is running on ${configService.get(
        'port',
      )} port: http://localhost:${configService.get('port')}/api`,
    );
  });
}
bootstrap();
