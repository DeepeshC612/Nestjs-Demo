import { Body, Controller, Post, HttpCode, HttpStatus, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, VerifyEmailDto } from 'src/validation/user.validation';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('accounts')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  verifyOtp(@Body() body: VerifyEmailDto) {
    return this.authService.verifyOtp(body);
  }
}