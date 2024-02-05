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
//   import {
//     CreateProductDto,
//   } from '../../validation/product.validation';
import { ProductCheck } from 'src/middlewares/checkProductUserMiddleware';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';
@Controller('cart')
@UseGuards(AuthGuard)
export class cartController {
  constructor(private readonly cartServices: CartService) {}

  @Post('')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard)
  @HttpCode(201)
  async addToCart(
    @Body() body,
    @Req() req: Request,
  ) {
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
