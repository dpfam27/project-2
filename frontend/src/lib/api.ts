// API Client for Backend Communication
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  userId: number;
  username: string;
  role: string;
}

export interface WhoAmIResponse {
  user: User;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  published: boolean;
  variants?: any[];
}

export interface CartItem {
  id: number;
  cart_id: number;
  variant_id: number;
  variant?: {
    id: number;
    sku: string;
    attributes?: {
      size?: string;
      color?: string;
    };
    price: string | number;
    stock: number;
    product?: {
      id: number;
      name: string;
      description?: string;
      published: boolean;
    };
  };
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface AddToCartData {
  variant_id: number;
  quantity: number;
  price: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

// Order types
export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  variant?: {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes?: {
      size?: string;
      color?: string;
    };
    product?: Product;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  customer?: Customer;
  order_number: string;
  order_date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Canceled' | 'Refunded';
  total_amount: number;
  items?: OrderItem[];
  payment_method?: string;
  coupon_code?: string;
  coupon_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CheckoutData {
  customer_id: number;
  items: {
    variant_id: number;
    quantity: number;
  }[];
  shipping_fee?: number;
  coupon_code?: string;
}

export interface UpdateOrderStatusData {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Canceled' | 'Refunded';
}

// Helper to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Helper to set token
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

// Helper to remove token
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data: RegisterData) =>
    apiFetch<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: LoginData): Promise<string> => {
    const response = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.access_token);
    return response.access_token;
  },

  whoami: () => apiFetch<WhoAmIResponse>('/whoami'),

  logout: () => {
    removeToken();
  },
};

// Customers API
export const customersAPI = {
  getAll: () =>
    apiFetch<{ statusCode: number; message: string; data: Customer[] }>(
      '/customers'
    ),

  getById: (id: number) =>
    apiFetch<{ statusCode: number; message: string; data: Customer }>(
      `/customers/${id}`
    ),

  create: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<{ statusCode: number; message: string; data: Customer }>(
      '/customers',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  update: (id: number, data: Partial<Customer>) =>
    apiFetch<{ statusCode: number; message: string; data: Customer }>(
      `/customers/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),

  delete: (id: number) =>
    apiFetch(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

// Products API
export const productsAPI = {
  getAll: () => apiFetch<Product[]>('/catalog/products'),

  getById: (id: number) => apiFetch<Product>(`/catalog/products/${id}`),

  create: (data: Omit<Product, 'id' | 'published' | 'variants'>) =>
    apiFetch<Product>('/catalog/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Omit<Product, 'id' | 'variants'>>) =>
    apiFetch<Product>(`/catalog/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<{ statusCode: number; message: string }>(`/catalog/products/${id}`, {
      method: 'DELETE',
    }),
};

// Cart API
export const cartAPI = {
  get: () =>
    apiFetch<{ statusCode: number; message: string; data: Cart }>('/cart'),

  addItem: (data: AddToCartData) =>
    apiFetch<{ statusCode: number; message: string; data: Cart }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (id: number, data: UpdateCartItemData) =>
    apiFetch<{ statusCode: number; message: string; data: Cart }>(
      `/cart/items/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),

  removeItem: (id: number) =>
    apiFetch<{ statusCode: number; message: string; data: Cart }>(
      `/cart/items/${id}`,
      {
        method: 'DELETE',
      }
    ),

  clear: () =>
    apiFetch<{ statusCode: number; message: string; data: null }>('/cart', {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersAPI = {
  // Get all orders (customer or admin)
  getAll: () =>
    apiFetch<{ statusCode: number; message: string; data: Order[] }>('/orders'),

  // Get single order by ID
  getById: (id: number) =>
    apiFetch<{ statusCode: number; message: string; data: Order }>(`/orders/${id}`),

  // Search orders by keyword (admin only)
  search: (keyword: string) =>
    apiFetch<{ statusCode: number; message: string; data: Order[] }>(
      `/orders/search?keyword=${encodeURIComponent(keyword)}`
    ),

  // Checkout (create order from cart)
  checkout: (data: CheckoutData) =>
    apiFetch<{ statusCode: number; message: string; data: { order: Order; paymentId: number } }>(
      '/orders/checkout',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Admin: Update order status (Confirm/Cancel/Refund)
  updateStatus: (id: number, data: UpdateOrderStatusData) =>
    apiFetch<{ statusCode: number; message: string; data: Order }>(
      `/orders/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),

  // Admin: Delete order
  delete: (id: number) =>
    apiFetch<{ statusCode: number; message: string; data: null }>(
      `/orders/${id}`,
      {
        method: 'DELETE',
      }
    ),
};

// Export default client
export default {
  auth: authAPI,
  customers: customersAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
};
