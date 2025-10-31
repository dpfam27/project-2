import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';

@Entity('prices')
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, { onDelete: 'CASCADE', eager: true })
  variant: Variant;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sale_price?: number;

  @Column({ type: 'datetime', nullable: true })
  start_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  end_at?: Date;
}
