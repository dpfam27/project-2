import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, { onDelete: 'CASCADE', eager: true })
  variant: Variant;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  reserved: number;
}
