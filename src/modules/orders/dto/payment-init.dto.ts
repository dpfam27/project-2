import { IsEnum, IsInt, IsNumber } from 'class-validator';

export class PaymentInitDto {
  @IsInt()
  order_id: number;

  @IsEnum(['vnpay', 'momo'])
  provider: 'vnpay' | 'momo';

  @IsNumber()
  amount: number;
}
