import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './constant/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  await app.listen(getEnv('port'));
}
bootstrap();
