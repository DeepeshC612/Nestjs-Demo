import {
  Controller,
  Get,
  Post,
  Req,
  HttpException,
  HttpCode,
  Query,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../../auth/auth.guard';
import {
  CreateProductDto,
  DetailProductDto,
  ProductUserIdDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../validation/product.validation';
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @HttpCode(201)
  async createProduct(@Body() req: CreateProductDto) {
    try {
      return await this.productService.createProduct(req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateProduct(@Body() body: UpdateProductDto, @Param('id') id: number) {
    try {
      return await this.productService.updateProduct(body, id);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Get('')
  @HttpCode(200)
  async productList(
    @Query() query: QueryProductDto,
    @Body() body: ProductUserIdDto,
  ) {
    try {
      return await this.productService.productList(query, body);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Get('details')
  @HttpCode(200)
  async productDetails(
    @Query() query: DetailProductDto,
    @Body() body: ProductUserIdDto,
  ) {
    try {
      return await this.productService.productDetails(query, body);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async productDelete(@Param('id') id: number, @Body() body: ProductUserIdDto) {
    try {
      return await this.productService.productDelete(id, body);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
