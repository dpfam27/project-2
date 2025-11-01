import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Auth } from '../../common/decorators/auth.decorator';

class ValidateCouponDto {
  code: string;
  subtotal: number;
}

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Post('products')
  @Auth('admin')
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Get('products')
  findAll() {
    return this.service.findAll();
  }

  @Get('products/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put('products/:id')
  @Auth('admin')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateProductDto>) {
    return this.service.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @Auth('admin')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }

  @Post('coupons/validate')
  validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.service.validateCoupon(dto.code, dto.subtotal);
  }
}
