import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './constant/environment';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", 'warn', 'debug'],
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
  await app.listen(getEnv('port'));
}
bootstrap();
