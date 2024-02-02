import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoles } from 'src/constant/constants';

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

  @IsOptional()
  role: UserRoles;
}

export class LoginUserDto extends OmitType(CreateUserDto, [
  'name',
  'phoneNum',
  'profilePic',
  'role'
] as const) {}
