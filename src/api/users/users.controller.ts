import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  HttpException,
  HttpCode,
  Param,
  Query
} from '@nestjs/common';
import { UserService } from './users.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async postUser(@Req() req: Request) {
    try {
      return await this.userService.postUser(req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Post('login')
  @HttpCode(200)
  async postUserLogin(@Req() req: Request) {
    try {
      return await this.userService.postUserLogin(req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

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
