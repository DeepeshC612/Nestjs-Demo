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
  ProductUserIdDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../validation/product.validation';
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
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(200)
  async updateProduct(
    @Body() body: UpdateProductDto,
    @Req() req: Request,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      return await this.productService.updateProduct(body, req, id, image);
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

  @Get(':id')
  @HttpCode(200)
  async productDetails(
    @Param('id') id: number,
    @Body() body: ProductUserIdDto,
  ) {
    try {
      return await this.productService.productDetails(id, body);
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
