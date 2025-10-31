import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OneToMany } from 'typeorm';
import { OrderItem } from './order_item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id', type: 'int' })
  customer_id: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'order_number', type: 'varchar', length: 50 })
  order_number: string;

  @Column({ name: 'order_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({
    name: 'status',
    type: 'simple-enum',
    enum: ['Pending', 'Paid', 'Shipped', 'Canceled'],
    default: 'Pending',
  })
  status: 'Pending' | 'Paid' | 'Shipped' | 'Canceled';

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column({ name: 'coupon_code', type: 'varchar', length: 50, nullable: true })
  coupon_code?: string;

  @Column({ name: 'coupon_id', type: 'int', nullable: true })
  coupon_id?: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
