import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/products/product.entity';

@Injectable()
export class ProductCheck implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const isExists: Product[] = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .where('product.id = :productId AND user.id = :userId', {
          productId: request?.params?.id,
          userId: request?.user?.id,
        })
        .getRawMany();
      if (!isExists.length) {
        throw new ForbiddenException({
          status: false,
          message: 'You do not have permission to access this product',
        });
      }
    } catch {
      throw new ForbiddenException({
        status: false,
        message: 'You do not have permission to access this product',
      });
    }
    return true;
  }
}
