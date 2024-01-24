import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNum: string;

  @IsNotEmpty()
  name: string;
}

export class LoginUserDto extends OmitType(CreateUserDto, [
  'name',
  'phoneNum',
] as const) {}
