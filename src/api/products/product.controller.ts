import {
    Controller,
    Get,
    Post,
    Req,
    HttpException,
    HttpCode,
    Query,
    Body,
    UseGuards
  } from '@nestjs/common';
  import { Request } from "express";
  import { ProductService } from './product.service';
  import { AuthGuard } from "../../auth/auth.guard";
  
  @Controller('product')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(AuthGuard)
    @Post('create')
    @HttpCode(201)
    async createProduct(@Req() req) {
      try {
        return await this.productService.createProduct(req);
      } catch (error) {
        throw new HttpException(
          error?.cause?.response ?? error?.response,
          error?.cause?.status ?? error?.response?.status,
        );
      }
    }
  }
  