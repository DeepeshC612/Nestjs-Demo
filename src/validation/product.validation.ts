import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

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