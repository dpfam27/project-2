import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Coupon) private couponRepo: Repository<Coupon>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const p = this.productRepo.create(dto as any);
    return this.productRepo.save(p);
  }

  async findAll() {
    return this.productRepo.find({ relations: ['variants'] });
  }

  async findOne(id: number) {
    const p = await this.productRepo.findOne({ where: { id }, relations: ['variants'] });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async updateProduct(id: number, dto: Partial<CreateProductDto>) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await this.couponRepo.findOne({ where: { code, active: true } });
    if (!coupon) return { valid: false, reason: 'not_found' };

    const now = new Date();
    if (coupon.starts_at && coupon.starts_at > now) return { valid: false, reason: 'not_started' };
    if (coupon.ends_at && coupon.ends_at < now) return { valid: false, reason: 'expired' };

    if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) return { valid: false, reason: 'usage_limit' };

    // check min order value if provided
    // for simplicity assume coupon has value and type
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (Number(coupon.value) / 100) * subtotal;
    } else {
      discount = Number(coupon.value);
    }

    return { valid: true, discount: Number(discount.toFixed(2)), couponId: coupon.id };
  }
}
