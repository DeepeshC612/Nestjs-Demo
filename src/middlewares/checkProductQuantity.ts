import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.entity';

@Injectable()
export class ProductQuantityCheck implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = request?.body?.products?.map(
      (item: { quantity: number; productId: number }) => {
        return this.productRepository
          .createQueryBuilder('')
          .addSelect(`(price * ${item?.quantity}) AS totalPrice`)
          .addSelect(
            `CASE WHEN ${item?.quantity} > quantity THEN true ELSE false END AS outOfStock`,
          )
          .where('id IN (:productId)', {
            productId: item?.productId,
          })
          .getRawOne();
      },
    );
    const result = await Promise.all(query);
    let totalPrice = 0;
    let outOfStock = false;
    result?.map((e) => {
      totalPrice += +e?.totalPrice;
      if (e?.outOfStock) {
        outOfStock = true;
      }
    });
    request.totalPrice = totalPrice;
    if (outOfStock) {
      throw new HttpException(
        {
          status: HttpStatus.OK,
          data: result,
          message: 'Product quantity is out of stock',
        },
        HttpStatus.OK,
      );
    }
    return true;
  }
}
