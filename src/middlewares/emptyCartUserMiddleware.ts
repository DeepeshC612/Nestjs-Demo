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
