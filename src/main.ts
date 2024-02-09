import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './constant/environment';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
    abortOnError: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use('/src/uploads', express.static('src/uploads'));
  await app.listen(getEnv('port'));
}
bootstrap();
