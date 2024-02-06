import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart.entity';

@Injectable()
export class QuantityCheck implements CanActivate {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const isExists = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.product', 'product')
        .where('cart.product = :productId AND cart.user = :userId', {
          productId: request?.body?.productId,
          userId: request?.user?.id,
        })
        .getRawOne();
      if (
        isExists?.product_quantity < request?.body?.quantity ||
        isExists?.cart_quantity >= isExists?.product_quantity
      ) {
        throw new BadRequestException({
          status: false,
          message: 'Product quantity is not sufficient or out of stock',
        });
      }
    } catch {
      throw new BadRequestException({
        status: false,
        message: 'Product quantity is not sufficient or out of stock',
      });
    }
    return true;
  }
}
