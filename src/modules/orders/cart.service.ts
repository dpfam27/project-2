import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user_id: userId });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addItem(userId: number, dto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.variant_id === dto.variant_id,
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      // Add new item
      const newItem = this.cartItemRepo.create({
        cart_id: cart.id,
        variant_id: dto.variant_id,
        quantity: dto.quantity,
        price: dto.price,
      });
      await this.cartItemRepo.save(newItem);
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepo.remove(item);

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepo.findOne({
      where: { user_id: userId },
    });

    if (cart) {
      await this.cartItemRepo.delete({ cart_id: cart.id });
    }
  }

  async calculateTotal(userId: number): Promise<number> {
    const cart = await this.getCart(userId);
    return cart.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }
}
