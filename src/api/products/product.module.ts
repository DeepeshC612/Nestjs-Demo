import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { DataBaseModule } from '../../config/database.module';
import { productProvider } from "./product.provider";
import { ProductService } from './product.service';

@Module({
  imports: [DataBaseModule],
  controllers: [ProductController],
  providers: [...productProvider, ProductService],
  exports: [ProductService]
})
export class ProductModule {}
