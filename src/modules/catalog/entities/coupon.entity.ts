import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'simple-enum', enum: ['percent', 'fixed'], default: 'percent' })
  type: 'percent' | 'fixed';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'datetime', nullable: true })
  starts_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  ends_at?: Date;

  @Column({ type: 'int', default: 0 })
  usage_limit: number;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
