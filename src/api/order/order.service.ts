import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { OrderProduct } from 'src/models/order.product.entity';
import { ProductService } from '../products/product.service';
import { DbTransaction } from '../../config/transaction';
// import { cartSelect } from 'src/constant/constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    private productService: ProductService,
    private dbTransaction: DbTransaction,
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
        totalPrice: req?.product?.totalPrice,
      };
      await this.dbTransaction.start();
      const order = await this.orderRepository.save(payload);
      for (const item of body?.products) {
        const payload = {
          product: item?.productId,
          quantity: +item?.quantity,
          order: order?.id as unknown as () => string,
        };
        await this.orderProductRepository.insert(payload);
        const newQuantity = req?.product?.remainingQuantity?.find(
          (e) => e?.productId == item?.productId,
        );
        await this.productService.updateProduct(
          { quantity: newQuantity?.remainingQuantity },
          item?.productId,
          '',
        );
      }
      await this.dbTransaction.commitTransaction();
      return {
        status: true,
        data: {},
        message: 'Order placed successfully',
      };
    } catch (error) {
      await this.dbTransaction.rollbackTransaction();
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
    } finally {
      await this.dbTransaction.release();
    }
  }
  /**
   * get order
   * @req request
   * @returns
   */
  async getOrderDetails(body: any, req: any): Promise<object> {
    try {
      const subTotal = req?.product?.totalPrice;
      return {
        status: true,
        data: { product: req?.product?.result, subTotal: subTotal },
        message: 'Order details fetch successfully',
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
}
