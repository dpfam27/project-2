import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { OrderItem } from './entities/order_item.entity';
import { Stock } from '../catalog/entities/stock.entity';
import { Variant } from '../catalog/entities/variant.entity';
import { Price } from '../catalog/entities/price.entity';
import { Payment } from './entities/payment.entity';
import { Coupon } from '../catalog/entities/coupon.entity';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
    @InjectRepository(Price)
    private readonly priceRepo: Repository<Price>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customer_id } });
    if (!customer) throw new NotFoundException('Customer not found');

    const order = this.orderRepo.create({
      ...dto,
    });

    return this.orderRepo.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['customer'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['customer'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }

  async updateStatus(id: number, status: 'Pending' | 'Paid' | 'Shipped' | 'Canceled'): Promise<Order> {
    const order = await this.findOne(id);
    
    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'Pending': ['Paid', 'Canceled'],
      'Paid': ['Shipped', 'Canceled'],
      'Shipped': ['Canceled'],
      'Canceled': [],
    };

    const allowedStatuses = validTransitions[order.status] || [];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`
      );
    }

    order.status = status;
    return this.orderRepo.save(order);
  }

  // Checkout: reserve stock and create order + payment record in a transaction
  async checkout(dto: CheckoutDto) {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customer_id } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.dataSource.transaction(async (manager) => {
      // validate items and reserve stock
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const it of dto.items) {
        const stock = await manager.getRepository(Stock).findOne({ where: { variant: { id: it.variant_id } }, relations: ['variant'] });
        if (!stock || (stock.quantity - stock.reserved) < it.quantity) throw new BadRequestException('Insufficient stock for variant ' + it.variant_id);

        // reserve
        stock.reserved += it.quantity;
        await manager.getRepository(Stock).save(stock);

        // get price
        const price = await manager.getRepository(Price).findOne({ where: { variant: { id: it.variant_id } } });
        const unit = price?.sale_price ?? price?.base_price ?? 0;
        subtotal += Number(unit) * it.quantity;

        const orderItem = manager.getRepository(OrderItem).create({ variant_id: it.variant_id, quantity: it.quantity, price: unit });
        orderItems.push(orderItem);
      }

      // apply coupon if provided
      let discount = 0;
      if (dto.coupon_code) {
        const coupon = await manager.getRepository(Coupon).findOne({ where: { code: dto.coupon_code, active: true } });
        if (!coupon) throw new BadRequestException('Invalid coupon');
        if (coupon.type === 'percent') discount = (Number(coupon.value) / 100) * subtotal;
        else discount = Number(coupon.value);
      }

      const total = subtotal - discount + Number(dto.shipping_fee || 0);

      const order = manager.getRepository(Order).create({
        customer_id: dto.customer_id,
        order_number: 'ORD-' + Date.now(),
        status: 'Pending',
        total_amount: total,
        items: orderItems,
      });

      const savedOrder = await manager.getRepository(Order).save(order);

      // create payment record pending
      const payment = manager.getRepository(Payment).create({ order: savedOrder, provider: 'momo', amount: total, status: 'Pending' });
      await manager.getRepository(Payment).save(payment);

      return { order: savedOrder, paymentId: payment.id };
    });
  }

  async search(keyword: string): Promise<Order[]> {
    return this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.customer', 'c')
      .where('o.order_number LIKE :kw OR c.name LIKE :kw OR c.email LIKE :kw', {
        kw: `%${keyword}%`,
      })
      .getMany();
  }
}
