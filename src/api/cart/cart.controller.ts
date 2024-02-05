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
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { CartService } from './cart.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AddToCartDto } from '../../validation/cart.validation';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import { QuantityCheck } from 'src/middlewares/checkQuantityMiddleware';
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartServices: CartService) {}

  @Post('')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard, QuantityCheck)
  @HttpCode(201)
  async addToCart(@Body() body: AddToCartDto, @Req() req: Request) {
    try {
      return await this.cartServices.addToCart(body, req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
