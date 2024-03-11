import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/models/cart.entity';
import { cartSelect } from 'src/constant/constants';

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
      const isProductExists = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.product = :productId AND cart.user = :userId', {
        productId: body.productId,
          userId: req.user.id,
        })
        .getRawOne();
        if (isProductExists) {
          await this.cartRepository
          .createQueryBuilder()
          .update()
          .set({ quantity: isProductExists.cart_quantity + body.quantity })
          .where('id = :cartId', { cartId: isProductExists.cart_id })
          .execute();
        } else {
          body.user = req.user.id;
          body.product = body.productId;
          await this.cartRepository.insert(body);
        }
        const cartData = await this.cartList(req);
        return {
        status: true,
        data: cartData?.data,
        message: 'Product added to cart successfully',
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
   * cart list api
   * @req request
   * @returns
   */
  async cartRemove(req: any): Promise<object> {
    try {
      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .delete()
        .where('cart.userId = :userId AND cart.productId = :productId', {
          userId: req?.user?.id,
          productId: req?.params?.id,
        })
        .execute();
      if (cart) {
        return {
          status: true,
          data: {},
          message: 'Product removed successfully.',
        };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Product not found',
          },
          HttpStatus.BAD_REQUEST,
        );
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

  /**
   * cart list api
   * @req request
   * @returns
   */
  async cartList(req: any): Promise<{ status: boolean, data: object, message: string }> {
    try {
      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.product', 'product')
        .leftJoinAndSelect('product.user', 'user')
        .select(cartSelect)
        .where('cart.user = :userId', {
          userId: req?.user?.id,
        })
        .getRawMany();
      if (cart) {
        return { status: true, data: cart, message: 'Cart list.' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Cart not found',
          },
          HttpStatus.BAD_REQUEST,
        );
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
