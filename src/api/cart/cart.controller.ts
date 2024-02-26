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
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { CartService } from './cart.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AddToCartDto } from '../../validation/cart.validation';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import middlewares from "../../middlewares/index";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller('cart')
@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartServices: CartService) {}

  @Post('')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard, middlewares.QuantityCheck)
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

  @Get('')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard, middlewares.EmptyCartCheck)
  @HttpCode(200)
  async cartList(@Req() req: Request) {
    try {
      return await this.cartServices.cartList(req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
  @Delete(':id')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard, middlewares.CartProductCheck)
  @HttpCode(200)
  async removeFromCart(@Param('id') id: number, @Req() req: Request) {
    try {
      return await this.cartServices.cartRemove(req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
