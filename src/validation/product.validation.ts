import { OmitType, PickType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
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