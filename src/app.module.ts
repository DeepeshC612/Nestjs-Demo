import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppDataSource } from './config/database';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService, AppDataSource],
})
export class AppModule {}
