import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Product } from 'src/models/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/validation/product.validation';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * create product
   * @req request
   * @returns
   */
  async createProduct(req: any): Promise<object> {
    try {
      const isExists: Product = await this.productRepository.findOne({
        where: [{ productName: req.productName }],
      });
      if (isExists) {
        throw new HttpException(
          {
            status: false,
            error: 'Product already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        // body.user = req?.user?.id;
        await this.productRepository.insert(req);
        return { status: true, message: 'Product added successfully' };
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
   * product list
   * @req request
   * @returns
   */
  async productList(req: any): Promise<object> {
    try {
      const { limit, offset, sortBy, sortType, search } = req.query;
      let orderBy = {};
      if (sortBy) {
        orderBy[`${sortBy}`] = sortType ?? 'ASC';
      }
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .select([
          'product',
          'user.id AS userId',
          'user.name AS userName',
          'user.email AS userEmail',
        ])
        .where('user.id = :userId', { userId: req?.body?.user })
        .andWhere(
          search
            ? '(product.productName LIKE :search OR product.description LIKE :search)'
            : '1=1',
          { search: `%${search}%` },
        )
        .limit(limit ?? 10)
        .offset(offset ?? 0)
        .orderBy(orderBy ?? {})
        .getRawMany();
      if (product) {
        return { status: true, data: product, message: 'Product list.' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Products not found',
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
   * product delete api
   * @req request
   * @returns
   */
  async productDelete(req: any): Promise<object> {
    try {
      const product = await this.productRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id AND userId = :userId', { id: req?.params?.id, userId: req?.body?.user })
        .execute();
      if (product.affected == 1) {
        return { status: true, data: {}, message: 'Product deleted successfully.' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Products not found or can not deleted',
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
