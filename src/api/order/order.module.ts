import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { OrderProduct } from 'src/models/order.product.entity';
import { ProductModule } from '../products/product.module';
import { Product } from 'src/models/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct, Product]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
