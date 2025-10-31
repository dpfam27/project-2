import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  @IsInt()
  variant_id: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 299.99, description: 'Price per unit' })
  @IsNumber()
  price: number;
}
