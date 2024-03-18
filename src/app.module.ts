import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/users/users.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './api/products/product.module';
import databaseConfig from "./config/database";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './api/cart/cart.module';
import { OrderModule } from './api/order/order.module';
@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot(databaseConfig), UserModule, AuthModule, ProductModule, CartModule, OrderModule], //DataBaseModule
  providers: [AppService],
})
export class AppModule {}
