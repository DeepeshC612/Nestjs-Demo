import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @ApiProperty()
  productId: string;

  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}
