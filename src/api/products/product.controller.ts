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
import { Roles } from "../../decorators/roles.decorator";
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { AuthGuard } from '../../auth/auth.guard';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../validation/product.validation';
import { ProductCheck } from 'src/middlewares/checkProductUserMiddleware';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
@Controller('product')
@ApiTags('product')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
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
  @ApiConsumes('multipart/form-data')
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
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async productList(
    @Query() query: QueryProductDto,
    @Req() req: Request
  ) {
    try {
      return await this.productService.productList(query, req);
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
