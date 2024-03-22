import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../models/product.entity';
import { orderSelect } from 'src/constant/constants';

@Injectable()
export class ProductQuantityCheck implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const productIds = request?.body?.products?.map((e) => {
      return e?.productId;
    });
    const findProducts = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });
    if (findProducts?.length != productIds?.length) {
      throw new HttpException(
        {
          status: HttpStatus.RESET_CONTENT,
          data: findProducts,
          message: 'One or more product not found',
        },
        HttpStatus.OK,
      );
    }
    const query = request?.body?.products?.map(
      (item: { quantity: number; productId: number }) => {
        return this.productRepository
          .createQueryBuilder('')
          .select(orderSelect)
          .addSelect(`(price * ${item?.quantity}) AS totalPrice`)
          .addSelect(`(quantity - ${item?.quantity}) AS remainingQuantity`)
          .addSelect(`${item?.quantity} AS cartQuantity`)
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
    let remainingQuantity = [];
    let outOfStock = false;
    result?.map((e) => {
      totalPrice += +e?.totalPrice;
      remainingQuantity.push({
        productId: e?.id,
        remainingQuantity: +e?.remainingQuantity,
      });
      if (e?.outOfStock) {
        totalPrice -= +e?.totalPrice;
        outOfStock = true;
      }
    });
    request.product = {
      result: result,
      totalPrice: totalPrice,
      remainingQuantity: remainingQuantity,
    };
    if (outOfStock) {
      throw new HttpException(
        {
          status: HttpStatus.RESET_CONTENT,
          data: { product: result, subTotal: totalPrice },
          message: 'Product quantity is out of stock',
        },
        HttpStatus.OK,
      );
    }
    return true;
  }
}
