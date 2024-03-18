import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { OrderProduct } from 'src/models/order.product.entity';
import { ProductService } from '../products/product.service';
// import { cartSelect } from 'src/constant/constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    private productService: ProductService
  ) {}

  /**
   * place order
   * @req request
   * @returns
   */
  async placeOrder(body: any, req: any): Promise<object> {
    try {
      const payload = {
        user: req?.user?.id,
        totalPrice: req?.product?.totalPrice
      };
      const order = await this.orderRepository.save(payload);
      for (const item of body?.products) {
        const payload = {
          product: item?.productId,
          quantity: +item?.quantity,
          order: order?.id as unknown as (() => string),
        };
        await this.orderProductRepository.insert(payload)
        const newQuantity = req?.product?.remainingQuantity?.find((e) => e?.productId == item?.productId)
        await this.productService.updateProduct({quantity: newQuantity?.remainingQuantity}, item?.productId, "")
      }
      return {
        status: true,
        data: {},
        message: 'Order placed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
  /**
   * get order
   * @req request
   * @returns
   */
  async getOrderDetails(body: any, req: any): Promise<object> {
    try {
      const order = await this.orderRepository
        .createQueryBuilder('order')
        // .leftJoinAndSelect('order.user', 'user')
        // .select(cartSelect)
        .where('order.user = :userId', {
          userId: req?.user?.id,
        })
        .getRawMany();
      if (order) {
        return { status: true, data: order, message: 'Order List.' };
      } else {
        return { status: false, data: [], message: 'Order not found' };
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
