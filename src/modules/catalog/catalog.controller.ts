import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';

class ValidateCouponDto {
  code: string;
  subtotal: number;
}

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Get('products')
  findAll() {
    return this.service.findAll();
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(parseInt(id, 10));
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.service.updateProduct(parseInt(id, 10), dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.service.deleteProduct(parseInt(id, 10));
  }

  @Post('coupons/validate')
  validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.service.validateCoupon(dto.code, dto.subtotal);
  }
}
