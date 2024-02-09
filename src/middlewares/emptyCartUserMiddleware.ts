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
export class EmptyCartCheck implements CanActivate {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const isExists = await this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.user = :userId', {
          userId: request?.user?.id,
        })
        .getRawMany();
      if (!isExists.length) {
        throw new BadRequestException({
          status: false,
          message: 'Cart is empty',
        });
      }
    } catch {
      throw new BadRequestException({
        status: false,
        message: 'Cart is empty',
      });
    }
    return true;
  }
}
@Injectable()
export class CartProductCheck implements CanActivate {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const isExists = await this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.user = :userId AND cart.product = :productId', {
          userId: request?.user?.id,
          productId: request?.params?.id,
        })
        .getRawOne();
      if (!isExists) {
        throw new BadRequestException({
          status: false,
          message: 'Product not found in cart',
        });
      }
    } catch {
      throw new BadRequestException({
        status: false,
        message: 'Product not found in cart',
      });
    }
    return true;
  }
}
