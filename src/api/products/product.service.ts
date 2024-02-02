import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from 'src/models/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles, productSelect } from '../../constant/constants';
import {
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
  async createProduct(body: any, req: any, image: Express.Multer.File): Promise<object> {
    try {
      const isExists: Product = await this.productRepository.findOne({
        where: [{ productName: body.productName }],
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
        body.user = req.user.id;
        body.image = image.path;
        await this.productRepository.insert(body);
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
  async updateProduct(body: UpdateProductDto, id: number, image: Express.Multer.File): Promise<object> {
    try {
      const { description, price, productName } = body;
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
      if(image) {
        updateProperties['image'] = image?.path
      }
      const result: UpdateResult = await this.productRepository
        .createQueryBuilder()
        .update()
        .set(updateProperties)
        .where('id = :productId', { productId: id })
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
    req: any
  ): Promise<object> {
    try {
      const { limit, offset, sortBy, sortType, search } = query;
      let isAdmin: string;
      let orderBy = {};
      if (sortBy) {
        orderBy[`${sortBy}`] = sortType ?? 'ASC';
      }
      if(req?.user?.role == UserRoles.ADMIN) {
        isAdmin = req?.user?.role
      }
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .select(productSelect)
        .where(isAdmin ? '1=1' : 'user.id = :userId', { userId: req?.user?.id })
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
  ): Promise<object> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .select(productSelect)
        .where('product.id = :productId', {
          productId: id,
        })
        .getRawOne();
      if (product) {
        return { status: true, data: product, message: 'Product details.' };
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
   * product delete api
   * @req request
   * @returns
   */
  async productDelete(
    id: number,
  ): Promise<object> {
    try {
      const product = await this.productRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', {
          id: id,
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
