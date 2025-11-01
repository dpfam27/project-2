import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { plainToInstance } from 'class-transformer';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { PaymentInitDto } from './dto/payment-init.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Auth('user')
  @ApiOkResponse({ type: ApiResponseDto<OrderResponseDto> })
  async create(@Body() dto: CreateOrderDto): Promise<ApiResponseDto<OrderResponseDto>> {
    const order = await this.orderService.create(dto);
    return {
      statusCode: 200,
      message: 'Order created successfully',
      data: plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true }),
    };
  }

  @Post('checkout')
  @Auth('user')
  @ApiOkResponse({ type: ApiResponseDto })
  async checkout(@Body() dto: CheckoutDto, @Request() req: any) {
    // Get userId from JWT token
    const userId = req.user.userId;
    const res = await this.orderService.checkout({ ...dto, customer_id: userId });
    return { statusCode: 200, message: 'Checkout created', data: res };
  }

  @Post('payment/init')
  @Auth('user')
  async initPayment(@Body() dto: PaymentInitDto) {
    // For demo we just return a mock payment url
    return { statusCode: 200, message: 'Payment initiated', data: { payment_url: 'https://mockpay.example/pay?paymentId=' + dto.order_id } };
  }

  @Get()
  @Auth('user', 'admin')
  @ApiOkResponse({ type: ApiResponseDto<Order[]> })
  async findAll(): Promise<ApiResponseDto<Order[]>> {
    const orders = await this.orderService.findAll();
    return {
      statusCode: 200,
      message: 'Success',
      data: orders,
    };
  }

  @Get('search')
  @Auth('user', 'admin')
  @ApiOkResponse({ type: ApiResponseDto<Order[]> })
  async search(@Query('keyword') keyword: string): Promise<ApiResponseDto<Order[]>> {
    const results = await this.orderService.search(keyword);
    return {
      statusCode: 200,
      message: 'Success',
      data: results,
    };
  }

  @Get(':id')
  @Auth('user', 'admin')
  @ApiOkResponse({ type: ApiResponseDto<OrderResponseDto> })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<OrderResponseDto>> {
    const order = await this.orderService.findOne(id);
    return {
      statusCode: 200,
      message: 'Success',
      data: plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true }),
    };
  }

  @Patch(':id')
  @Auth('user')
  @ApiOkResponse({ type: ApiResponseDto<OrderResponseDto> })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto): Promise<ApiResponseDto<OrderResponseDto>> {
    const updated = await this.orderService.update(id, dto);
    return {
      statusCode: 200,
      message: 'Order updated successfully',
      data: plainToInstance(OrderResponseDto, updated, { excludeExtraneousValues: true }),
    };
  }

  @Patch(':id/status')
  @Auth('admin')
  @ApiOkResponse({ type: ApiResponseDto<OrderResponseDto> })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'Pending' | 'Paid' | 'Shipped' | 'Canceled' }
  ): Promise<ApiResponseDto<OrderResponseDto>> {
    const updated = await this.orderService.updateStatus(id, body.status);
    return {
      statusCode: 200,
      message: 'Order status updated',
      data: plainToInstance(OrderResponseDto, updated, { excludeExtraneousValues: true }),
    };
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOkResponse({ type: ApiResponseDto<null> })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    await this.orderService.remove(id);
    return { statusCode: 200, message: 'Order deleted', data: null };
  }
}
