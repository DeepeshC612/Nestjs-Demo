import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  productName: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: string;

  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class QueryProductDto {
  @IsOptional()
  @ApiPropertyOptional()
  limit?: number;
  
  @IsOptional()
  @ApiPropertyOptional()
  offset?: number;
  
  @IsOptional()
  @ApiPropertyOptional()
  sortBy?: string;
  
  @IsOptional()
  @ApiPropertyOptional()
  sortType?: string;
  
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;
}