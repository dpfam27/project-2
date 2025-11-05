import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './product.service';
import { CatalogController } from './product.controller';
import { Product } from './entities/product.entity';
import { Variant } from './entities/variant.entity';
import { Coupon } from './entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant, Coupon])],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
