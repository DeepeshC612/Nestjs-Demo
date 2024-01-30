import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Or, Repository } from 'typeorm';
import { provider } from '../../constant/provider';
import { Request } from "express";
import { Product } from 'src/models/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
  async createProduct(req): Promise<object> {
    const { body } = req;
    try {
      const isExists: Product = await this.productRepository.findOne({
        where: [
          { productName: body.productName }
        ],
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
        body.user = req?.user?.id
        await this.productRepository.insert(body);
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

}
