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
import { CreateUserDto, ForgetPasswordDto, ResetPasswordDto, UpdateProfileDto } from '../../validation/user.validation'
import { AuthGuard } from "../../auth/auth.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constant/constants';
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from 'src/auth/roles.guard';
import { UserExistsCheck } from 'src/middlewares/checkUserExistsMiddleware';
import { ResetPassGuard } from 'src/middlewares/resetPasswordTokenMiddleware';

@Controller('user')
@ApiTags('accounts')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiConsumes('multipart/form-data')
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

  @Post('profile')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  @HttpCode(201)
  async updateUser(@Body() body: UpdateProfileDto, @Req() req: Request, @UploadedFile() profilePic: Express.Multer.File) {
    try {
      return await this.userService.updateUser(body, req, profilePic);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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

  @Post('forget-password')
  @UseGuards(UserExistsCheck)
  @HttpCode(200)
  async forgetPassword(@Body() body: ForgetPasswordDto, @Req() req: Request) {
    try {
      return await this.userService.forgetPassword(body, req);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @UseGuards(ResetPassGuard)
  @HttpCode(200)
  async resetPassword(@Req() req: Request, @Body() body: ResetPasswordDto) {
    try {
      return await this.userService.resetPassword(req, body);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
