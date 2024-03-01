import { IsEmail, IsEnum, IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';
import { UserRoles } from 'src/constant/constants';
import { ApiProperty, PickType, ApiPropertyOptional, PartialType, } from '@nestjs/swagger';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNum: string;

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  profilePic: any;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: UserRoles, default: UserRoles.USER })
  @IsEnum(UserRoles)
  role: UserRoles;
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}

export class UpdateProfileDto extends PartialType(CreateUserDto) {}
export class ForgetPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string
}
export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  password: string

  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string
}
