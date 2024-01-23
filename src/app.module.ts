import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "./api/users/users.module";
import { DataBaseModule } from './config/database.module';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [DataBaseModule,UserModule],
  providers: [AppService],
})
export class AppModule {}
