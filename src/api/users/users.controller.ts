import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  HttpException,
  HttpCode
} from '@nestjs/common';
import { UserService } from './users.service';
import { Request, Response } from 'express';

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
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Internal server error',
          errors: error,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
