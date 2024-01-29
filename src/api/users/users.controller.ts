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
import { UserService } from './users.service';
import { CreateUserDto, LoginUserDto } from '../../validation/user.validation'
import { AuthGuard } from "../../auth/auth.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async postUser(@Body() req: CreateUserDto) {
    try {
      return await this.userService.postUser(req);
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
  async getUser(@Query('email') email: string) {
    try {
      return await this.userService.getUser(email);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
