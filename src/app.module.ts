import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "./api/users/users.module";
import { DataBaseModule } from './config/database.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  imports: [DataBaseModule,UserModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
