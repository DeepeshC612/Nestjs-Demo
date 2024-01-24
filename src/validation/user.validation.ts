import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  phoneNum: number;

  @IsNotEmpty()
  name: string;
}

export class LoginUserDto extends OmitType(CreateUserDto, ['name', 'phoneNum'] as const) {}
