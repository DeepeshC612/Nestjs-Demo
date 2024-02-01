import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNum: string;

  @IsOptional()
  profilePic: string;

  @IsNotEmpty()
  name: string;
}

export class LoginUserDto extends OmitType(CreateUserDto, [
  'name',
  'phoneNum',
  'profilePic'
] as const) {}
