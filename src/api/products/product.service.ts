import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Or, Repository } from 'typeorm';
import { Product } from 'src/models/products/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/validation/product.validation';

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
        where: [
          { productName: req.productName }
        ],
      });
      console.log(isExists)
      if (isExists) {
        throw new HttpException(
          {
            status: false,
            error: 'Product already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        req.user = req?.user?.id
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

}
