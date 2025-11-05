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
  attributes?: Record<string, any>; // e.g., { flavor: 'vanilla', size: '1kg', color: 'red' }

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  // Convenience accessors for common attributes
  get size(): string | undefined {
    return this.attributes?.size;
  }

  get color(): string | undefined {
    return this.attributes?.color;
  }
}
