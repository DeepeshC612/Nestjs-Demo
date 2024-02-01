import { Module } from '@nestjs/common';
import { MulterModule } from "@nestjs/platform-express";
import { multerConfig } from "../../config/multer";
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), MulterModule.register(multerConfig)],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
