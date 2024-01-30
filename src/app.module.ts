import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/users/users.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './api/products/product.module';
import databaseConfig from "./config/database";
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot(databaseConfig), UserModule, AuthModule, ProductModule], //DataBaseModule
  providers: [AppService],
})
export class AppModule {}
