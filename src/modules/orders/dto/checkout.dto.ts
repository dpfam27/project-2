import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

class CartItemDto {
  @IsInt()
  variant_id: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsInt()
  customer_id: number;

  @IsArray()
  items: CartItemDto[];

  @IsOptional()
  @IsString()
  coupon_code?: string;

  @IsNumber()
  @Min(0)
  shipping_fee: number;
}
