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

  @IsNotEmpty()
  user: {
    id: number
  }

}

export class ProductUserIdDto {
  @IsNotEmpty()
  user: number
}
export class QueryProductDto {
  @IsOptional()
  limit: number;
  
  @IsOptional()
  offset: number;
  
  @IsOptional()
  sortBy: string;
  
  @IsOptional()
  sortType: string;
  
  @IsOptional()
  search: string;
}