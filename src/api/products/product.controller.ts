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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { AuthGuard } from '../../auth/auth.guard';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../validation/product.validation';
import { ProductCheck } from 'src/middlewares/checkProductUserMiddleware';
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(201)
  async createProduct(
    @Body() body: CreateProductDto,
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      return await this.productService.createProduct(body, req, image);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Put(':id')
  @UseGuards(ProductCheck)
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(200)
  async updateProduct(
    @Body() body: UpdateProductDto,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      return await this.productService.updateProduct(body, id, image);
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
    @Body() body
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

  @Get(':id')
  @UseGuards(ProductCheck)
  @HttpCode(200)
  async productDetails(
    @Param('id') id: number,
  ) {
    try {
      return await this.productService.productDetails(id);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Delete(':id')
  @UseGuards(ProductCheck)
  @HttpCode(200)
  async productDelete(@Param('id') id: number) {
    try {
      return await this.productService.productDelete(id);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
