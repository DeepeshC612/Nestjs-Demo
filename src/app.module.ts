import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataBaseModule } from './config/database.module';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService, DataBaseModule],
})
export class AppModule {}
