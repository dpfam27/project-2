import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { OrderItem } from './entities/order_item.entity';
import { Variant } from '../product/entities/variant.entity';
import { Payment } from './entities/payment.entity';
import { Coupon } from '../product/entities/coupon.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentsController } from './payments.controller';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, OrderItem, Variant, Payment, Coupon, Cart, CartItem])],
  controllers: [OrderController, PaymentsController, CartController],
  providers: [OrderService, CartService],
  exports: [OrderService, CartService],
})
export class OrderModule {}
