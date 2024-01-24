import {
  Controller,
  Get,
  Post,
  Req,
  HttpException,
  HttpCode,
  Query,
  Body
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, LoginUserDto } from '../../validation/user.validation'

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

  // @Post('login')
  // @HttpCode(200)
  // async postUserLogin(@Body() req: LoginUserDto) {
  //   try {
  //     return await this.userService.postUserLogin(req);
  //   } catch (error) {
  //     throw new HttpException(
  //       error?.cause?.response ?? error?.response,
  //       error?.cause?.status ?? error?.response?.status,
  //     );
  //   }
  // }

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
