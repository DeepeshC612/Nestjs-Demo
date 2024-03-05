import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, VerifyEmailDto } from 'src/validation/user.validation';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('accounts')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginUserDto) {
    try {
     return await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyEmailDto) {
    try {
      return await this.authService.verifyOtp(body);
    } catch (error) {
      throw new HttpException(
        error?.cause?.response ?? error?.response,
        error?.cause?.status ?? error?.response?.status,
      );
    }
  }
}
