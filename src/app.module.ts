import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/users/users.module';
import { DataBaseModule } from './config/database.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { ProductModule } from './api/products/product.module';

@Module({
  controllers: [AppController],
  imports: [DataBaseModule, UserModule, AuthModule, ProductModule],
  providers: [AppService],
})
export class AppModule {}
