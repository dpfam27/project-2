import { Controller, Post, Body, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from './entities/order.entity';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(
    @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
  ) {}

  // simple webhook endpoint for mock providers
  @Post('webhook')
  async webhook(@Body() payload: any) {
    this.logger.debug('payment webhook received: ' + JSON.stringify(payload));

    const { provider_ref, order_id, status, payment_id } = payload;
    let payment: Payment | null = null as any;

    if (provider_ref) {
      payment = await this.paymentsRepo.findOne({ where: { provider_ref } });
    }

    if (!payment && payment_id) {
      payment = await this.paymentsRepo.findOne({ where: { id: payment_id } });
    }

    if (!payment) {
      this.logger.warn('Payment not found by provider_ref or id: ' + JSON.stringify({ provider_ref, payment_id }));
      return { ok: false };
    }

    if (payment.status === 'Success') {
      this.logger.debug('Payment already processed: ' + provider_ref);
      return { ok: true };
    }

    payment.status = status === 'success' ? 'Success' : 'Failed';
    await this.paymentsRepo.save(payment);

    if (payment.status === 'Success') {
      // finalize order, decrement stock and reserved, increment coupon usage
      const order = await this.ordersRepo.findOne({ where: { id: order_id }, relations: ['items'] });
      if (order) {
        order.status = 'Paid';
        await this.ordersRepo.save(order);

        // for each item, reduce stock quantity and reserved
        for (const it of order.items) {
          const stock = await this.paymentsRepo.manager.getRepository('stocks').findOne({ where: { variant: { id: it.variant_id } }, relations: [] as string[] });
          if (stock) {
            // use query builder for safety
            await this.paymentsRepo.manager.getRepository('stocks').createQueryBuilder()
              .update()
              .set({ quantity: () => 'quantity - ' + it.quantity, reserved: () => 'reserved - ' + it.quantity })
              .where('id = :id', { id: stock.id })
              .execute();
          }
        }

        // increment coupon used_count if any
        if (order.coupon_id) {
          await this.paymentsRepo.manager.getRepository('coupons')
            .createQueryBuilder()
            .update()
            .set({ used_count: () => 'used_count + 1' })
            .where('id = :id', { id: order.coupon_id })
            .execute();
        }
      }
    }

    return { ok: true };
  }
}
