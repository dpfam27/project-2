// Guest cart management using localStorage

export interface GuestCartItem {
  variant_id: number;
  product_name: string;
  variant_name: string;
  quantity: number;
  price: number;
  sku: string;
}

const GUEST_CART_KEY = 'guest_cart';

export const guestCart = {
  // Get guest cart from localStorage
  get(): GuestCartItem[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save guest cart to localStorage
  save(items: GuestCartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  },

  // Add item to guest cart
  addItem(item: GuestCartItem): void {
    const items = this.get();
    const existingIndex = items.findIndex(i => i.variant_id === item.variant_id);
    
    if (existingIndex >= 0) {
      // Update quantity if item already exists
      items[existingIndex].quantity += item.quantity;
    } else {
      // Add new item
      items.push(item);
    }
    
    this.save(items);
  },

  // Update item quantity
  updateQuantity(variant_id: number, quantity: number): void {
    const items = this.get();
    const index = items.findIndex(i => i.variant_id === variant_id);
    
    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1); // Remove if quantity is 0
      } else {
        items[index].quantity = quantity;
      }
      this.save(items);
    }
  },

  // Remove item from cart
  removeItem(variant_id: number): void {
    const items = this.get().filter(i => i.variant_id !== variant_id);
    this.save(items);
  },

  // Clear guest cart
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_CART_KEY);
  },

  // Get total count
  getCount(): number {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get subtotal
  getSubtotal(): number {
    return this.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};
