import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/models/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  /**
   * create product
   * @req request
   * @returns
   */
  async addToCart(body: any, req: any): Promise<object> {
    try {
      const isProductExists: Cart = await this.cartRepository.findOne({
        where: [{ product: body.productId, user: req.user.id }],
      });
      if (isProductExists) {
        await this.cartRepository
          .createQueryBuilder()
          .update()
          .set({ quantity: isProductExists.quantity + body.quantity })
          .where('id = :cartId', { cartId: isProductExists.id })
          .execute();
        return {
          status: true,
          data: {},
          message: 'Product added to cart successfully',
        };
      } else {
        body.user = req.user.id;
        await this.cartRepository.insert(body);
        return {
          status: true,
          data: {},
          message: 'Product added to cart successfully',
        };
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
