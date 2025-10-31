import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE', eager: true })
  product: Product;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku?: string;

  @Column({ type: 'json', nullable: true })
  attributes?: Record<string, any>; // e.g., { flavor: 'vanilla', size: '1kg' }
}
