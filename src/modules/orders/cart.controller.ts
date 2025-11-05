import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { Cart } from './entities/cart.entity';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth('customer')
  @ApiOkResponse({ type: ApiResponseDto<Cart> })
  async getCart(@Request() req): Promise<ApiResponseDto<Cart>> {
    const userId = req.user.userId;
    const cart = await this.cartService.getCart(userId);
    return {
      statusCode: 200,
      message: 'Success',
      data: cart,
    };
  }

  @Post('items')
  @Auth('customer')
  @ApiOkResponse({ type: ApiResponseDto<Cart> })
  async addItem(
    @Request() req,
    @Body() dto: AddToCartDto,
  ): Promise<ApiResponseDto<Cart>> {
    const userId = req.user.userId;
    const cart = await this.cartService.addItem(userId, dto);
    return {
      statusCode: 200,
      message: 'Item added to cart',
      data: cart,
    };
  }

  @Patch('items/:id')
  @Auth('customer')
  @ApiOkResponse({ type: ApiResponseDto<Cart> })
  async updateItem(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<ApiResponseDto<Cart>> {
    const userId = req.user.userId;
    const cart = await this.cartService.updateItem(userId, parseInt(id), dto);
    return {
      statusCode: 200,
      message: 'Cart item updated',
      data: cart,
    };
  }

  @Delete('items/:id')
  @Auth('customer')
  @ApiOkResponse({ type: ApiResponseDto<Cart> })
  async removeItem(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ApiResponseDto<Cart>> {
    const userId = req.user.userId;
    const cart = await this.cartService.removeItem(userId, parseInt(id));
    return {
      statusCode: 200,
      message: 'Item removed from cart',
      data: cart,
    };
  }

  @Delete()
  @Auth('customer')
  @ApiOkResponse({ type: ApiResponseDto<null> })
  async clearCart(@Request() req): Promise<ApiResponseDto<null>> {
    const userId = req.user.userId;
    await this.cartService.clearCart(userId);
    return {
      statusCode: 200,
      message: 'Cart cleared',
      data: null,
    };
  }
}
