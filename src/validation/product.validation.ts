import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

//   @IsNotEmpty()
//   user: {
//     id: number
//   }

}

