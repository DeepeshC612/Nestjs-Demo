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
import { OrderService } from './order.service';
import { AuthGuard } from '../../auth/auth.guard';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaceOrderDto } from 'src/validation/order.validation';
import middlewares from "../../middlewares/index";

@Controller('order')
@ApiTags('order')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderServices: OrderService) {}

  @Post('place-order')
  @Roles([UserRoles.USER])
  @UseGuards(RolesGuard, middlewares.ProductQuantityCheck)
  @HttpCode(201)
  async placeOrder(@Body() body: PlaceOrderDto, @Req() req: Request) {
    try {
      return await this.orderServices.placeOrder(body, req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
