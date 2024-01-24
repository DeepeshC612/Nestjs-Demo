import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './constant/environment';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(getEnv('port'));
}
bootstrap();
