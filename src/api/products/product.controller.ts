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
    Param
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { AuthGuard } from "../../auth/auth.guard";
  import { CreateProductDto } from "../../validation/product.validation";
  @Controller('product')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(AuthGuard)
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

    @UseGuards(AuthGuard)
    @Get('')
    @HttpCode(200)
    async productList(@Req() req: Request) {
      try {
        return await this.productService.productList(req);
      } catch (error) {
        throw new HttpException(
          error?.cause?.response ?? error?.response,
          error?.cause?.status ?? error?.response?.status,
        );
      }
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
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
  