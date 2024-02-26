import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpCode,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  Req
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from '../../validation/user.validation'
import { AuthGuard } from "../../auth/auth.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constant/constants';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profilePic'))
  @HttpCode(201)
  async postUser(@Body() req: CreateUserDto, @UploadedFile() profilePic: Express.Multer.File) {
    try {
      return await this.userService.postUser(req, profilePic);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.ADMIN])
  @HttpCode(200)
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Get('')
  @UseGuards(AuthGuard)
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
