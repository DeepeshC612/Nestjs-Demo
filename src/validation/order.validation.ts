import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class PlaceOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of products to be ordered.',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'The quantity of the product to be ordered.',
          minimum: 1,
        },
        productId: {
          type: 'number',
          description: 'The ID of the product to be ordered.',
          minimum: 1,
        },
      },
    },
  })
  products: Array<{
    quantity: number,
    productId: number
  }>;
}
