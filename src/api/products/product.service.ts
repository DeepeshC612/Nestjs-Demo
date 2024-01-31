import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from 'src/models/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { productSelect } from '../../constant/constants';
import {
  ProductUserIdDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../validation/product.validation';
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
        await this.productRepository.insert(req);
        return {
          status: true,
          data: {},
          message: 'Product added successfully',
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

  /**
   * update product
   * @req request
   * @returns
   */
  async updateProduct(body: UpdateProductDto, id: number): Promise<object> {
    try {
      const { description, price, productName, user } = body;
      let updateProperties = {};
      if (description) {
        updateProperties['description'] = description;
      }
      if (price) {
        updateProperties['price'] = price;
      }
      if (productName) {
        updateProperties['productName'] = productName;
      }
      const result: UpdateResult = await this.productRepository
        .createQueryBuilder()
        .update()
        .set(updateProperties)
        .where('id = :productId', { productId: id })
        .andWhere('user = :userId', { userId: user })
        .execute();
      if (result.affected == 1) {
        return {
          status: true,
          data: {},
          message: 'Product updated successfully',
        };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Product not found and can not be updated',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log('err', error);
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
  async productList(
    query: QueryProductDto,
    body: ProductUserIdDto,
  ): Promise<object> {
    try {
      const { limit, offset, sortBy, sortType, search } = query;
      let orderBy = {};
      if (sortBy) {
        orderBy[`${sortBy}`] = sortType ?? 'ASC';
      }
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .select(productSelect)
        .where('user.id = :userId', { userId: body?.user })
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
   * product detail api
   * @req request
   * @returns
   */
  async productDetails(
    id: number,
    body: ProductUserIdDto,
  ): Promise<object> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .select(productSelect)
        .where('user.id = :userId AND product.id = :productId', {
          userId: body?.user,
          productId: id,
        })
        .getRawOne();
      if (product) {
        return { status: true, data: product, message: 'Product details.' };
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
  async productDelete(
    id: number,
    body: ProductUserIdDto,
  ): Promise<object> {
    try {
      const product = await this.productRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id AND userId = :userId', {
          id: id,
          userId: body?.user,
        })
        .execute();
      if (product.affected == 1) {
        return {
          status: true,
          data: {},
          message: 'Product deleted successfully.',
        };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Products not found or can not be deleted',
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
