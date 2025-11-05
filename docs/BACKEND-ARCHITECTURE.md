# Backend Architecture Analysis - `/src` Directory

## 📁 Cấu trúc tổng quan

```
src/
├── main.ts                 # Entry point - khởi tạo NestJS app
├── app.module.ts           # Root module - import tất cả modules
├── app.controller.ts       # Root controller - endpoints cơ bản
├── app.service.ts          # Root service
│
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── dto/                # Shared DTOs
│   ├── guards/             # Auth & permission guards
│   └── middlewares/        # Request logging, etc.
│
├── databases/              # Database configuration
│   └── database.module.ts  # TypeORM setup
│
├── modules/                # Business logic modules
│   ├── auth/               # Authentication & Authorization
│   ├── customers/          # Customer management
│   ├── orders/             # Orders, Cart, Payments
│   ├── product/            # Products, Variants, Coupons
│   └── tests/              # Test utilities
│
└── seeds/                  # Database seeding scripts
```

---

## 🚀 Entry Point: `main.ts`

**Chức năng:**
- Khởi tạo NestJS application
- Cấu hình CORS cho frontend (localhost:3001)
- Setup Swagger API documentation (/api)
- Enable JWT Bearer authentication
- Lắng nghe port 3000

**Key Code:**
```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 📦 Root Module: `app.module.ts`

**Vai trò:** Module gốc import và khởi tạo tất cả modules

**Imported Modules:**
1. **ConfigModule** - Quản lý environment variables (.env)
2. **DatabaseModule** - Kết nối MySQL qua TypeORM
3. **AuthModule** - Authentication & JWT
4. **CustomerModule** - Quản lý thông tin khách hàng
5. **OrderModule** - Orders, Cart, Payments
6. **CatalogModule** - Products, Variants, Coupons

**Middleware:**
- `LoggerMiddleware` - Log tất cả requests (method, URL, body, params, query)

---

## 🔐 Module 1: Auth Module (`modules/auth/`)

### Cấu trúc:
```
auth/
├── auth.module.ts          # Module configuration
├── auth.controller.ts      # POST /auth/register, /auth/login
├── auth.service.ts         # Business logic
├── jwt.strategy.ts         # JWT validation strategy
├── jwt-auth.guard.ts       # JWT authentication guard
├── entities/
│   └── user.entity.ts      # User model (username, password, role)
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

### Chức năng chính:

#### 1. **Registration Flow**
```typescript
POST /auth/register
{
  username: string,
  password: string,
  role?: 'admin' | 'customer' (default: customer)
}

Process:
1. Hash password với bcrypt
2. Tạo User record
3. Nếu role = 'customer' → tạo Customer record
4. Return JWT token
```

#### 2. **Login Flow**
```typescript
POST /auth/login
{
  username: string,
  password: string
}

Process:
1. Tìm user theo username
2. Verify password hash
3. Generate JWT token (expires in 1h)
4. Return token với user info
```

#### 3. **JWT Strategy**
- Validate JWT token từ header `Authorization: Bearer <token>`
- Extract payload: `{ sub: userId, username, role }`
- Attach user object vào request

#### 4. **Entities**

**User Entity:**
```typescript
@Entity('users')
class User {
  id: number;
  username: string (unique);
  password: string (hashed);
  role: 'admin' | 'customer' (default: customer);
  createdAt: Date;
}
```

---

## 🛍️ Module 2: Product/Catalog Module (`modules/product/`)

### Cấu trúc:
```
product/
├── product.module.ts       # Module configuration
├── product.controller.ts   # CRUD endpoints
├── product.service.ts      # Business logic
└── entities/
    ├── product.entity.ts   # Product model
    ├── variant.entity.ts   # Product variants
    └── coupon.entity.ts    # Discount coupons
```

### Entities & Relationships:

#### 1. **Product Entity**
```typescript
@Entity('products')
class Product {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  published: boolean (default: true);
  
  @OneToMany(() => Variant)
  variants: Variant[]; // 1 product -> many variants
}
```

#### 2. **Variant Entity**
```typescript
@Entity('variants')
class Variant {
  id: number;
  
  @ManyToOne(() => Product)
  product: Product;
  
  sku?: string;
  attributes?: JSON; // { size: '1kg', flavor: 'vanilla', color: 'red' }
  price?: number (decimal 10,2);
  stock: number (default: 0);
  
  // Convenience getters
  get size(): string;
  get color(): string;
}
```

**Thiết kế linh hoạt:**
- `attributes` là JSON object có thể chứa bất kỳ thuộc tính nào
- Getters cho size, color để truy cập dễ dàng
- Cascade delete: xóa product → xóa tất cả variants

#### 3. **Coupon Entity**
```typescript
@Entity('coupons')
class Coupon {
  id: number;
  code: string (unique);
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  valid_from?: Date;
  valid_to?: Date;
}
```

### API Endpoints:

**Public (Guest/Customer):**
```
GET  /catalog/products          # Danh sách sản phẩm
GET  /catalog/products/:id      # Chi tiết sản phẩm
POST /catalog/coupons/validate  # Validate mã giảm giá
```

**Admin Only:**
```
POST   /catalog/products        # Tạo sản phẩm mới
PUT    /catalog/products/:id    # Update sản phẩm
DELETE /catalog/products/:id    # Xóa sản phẩm
```

---

## 🛒 Module 3: Orders Module (`modules/orders/`)

### Cấu trúc:
```
orders/
├── order.module.ts             # Module configuration
├── order.controller.ts         # Order endpoints
├── order.service.ts            # Order logic
├── cart.controller.ts          # Cart endpoints
├── cart.service.ts             # Cart logic
├── payments.controller.ts      # Payment webhook
└── entities/
    ├── order.entity.ts         # Order model
    ├── order_item.entity.ts    # Order line items
    ├── cart.entity.ts          # Shopping cart
    ├── cart-item.entity.ts     # Cart items
    └── payment.entity.ts       # Payment records
```

### Entities & Workflows:

#### 1. **Cart System**

**Cart Entity:**
```typescript
@Entity('carts')
class Cart {
  id: number;
  user_id: number;
  
  @OneToMany(() => CartItem)
  items: CartItem[];
  
  created_at: Date;
  updated_at: Date;
}
```

**CartItem Entity:**
```typescript
@Entity('cart_items')
class CartItem {
  id: number;
  
  @ManyToOne(() => Cart)
  cart: Cart;
  
  @ManyToOne(() => Variant)
  variant: Variant;
  
  quantity: number;
  price: number; // Snapshot giá tại thời điểm add
  created_at: Date;
}
```

**Cart Endpoints:**
```typescript
@Auth('customer') // Require customer role
GET    /cart              # Lấy giỏ hàng hiện tại
POST   /cart/items        # Thêm sản phẩm vào giỏ
PATCH  /cart/items/:id    # Update số lượng
DELETE /cart/items/:id    # Xóa item khỏi giỏ
DELETE /cart              # Clear toàn bộ giỏ
```

#### 2. **Order System**

**Order Entity:**
```typescript
@Entity('orders')
class Order {
  id: number;
  
  @ManyToOne(() => Customer)
  customer: Customer;
  
  order_number: string (unique);
  order_date: Date;
  
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Canceled' | 'Refunded';
  
  total_amount: number (decimal 10,2);
  
  @OneToMany(() => OrderItem)
  items: OrderItem[];
  
  coupon_code?: string;
  coupon_id?: number;
  created_by?: number;
  created_at: Date;
}
```

**OrderItem Entity:**
```typescript
@Entity('order_items')
class OrderItem {
  id: number;
  
  @ManyToOne(() => Order)
  order: Order;
  
  @ManyToOne(() => Variant)
  variant: Variant;
  
  quantity: number;
  price: number; // Snapshot giá tại thời điểm đặt hàng
}
```

**Order Workflow:**
```
1. Customer adds items to cart
2. Checkout → POST /orders/checkout
   - Validate stock availability
   - Apply coupon if provided
   - Calculate shipping fee
   - Create order with status = 'Pending'
   - Lock stock (decrease variant.stock)
   - Clear cart
   
3. Payment → POST /orders/payment/init
   - Generate VNPay/MoMo payment URL
   - Return redirect URL
   
4. Payment webhook → POST /payments/webhook
   - Update payment status
   - Update order status
   
5. Admin manages order → PATCH /orders/:id/status
   - Update: Pending → Processing → Shipped → Completed
```

**Order Endpoints:**
```typescript
@Auth('customer')
POST   /orders              # Tạo đơn hàng manual
POST   /orders/checkout     # Checkout từ cart
POST   /orders/payment/init # Khởi tạo thanh toán
GET    /orders              # Xem đơn hàng của mình
GET    /orders/:id          # Chi tiết đơn hàng

@Auth('admin')
GET    /orders              # Xem tất cả đơn hàng
GET    /orders/search       # Tìm kiếm đơn hàng
PATCH  /orders/:id          # Update đơn hàng
PATCH  /orders/:id/status   # Update trạng thái
DELETE /orders/:id          # Xóa đơn hàng
```

#### 3. **Payment System**

**Payment Entity:**
```typescript
@Entity('payments')
class Payment {
  id: number;
  order_id: number;
  payment_method: 'vnpay' | 'momo' | 'cod';
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  amount: number;
  created_at: Date;
}
```

**Payment Flow (Mock):**
```
1. User clicks "Pay" → POST /orders/payment/init
   {
     order_id: number,
     payment_method: 'vnpay' | 'momo'
   }
   
2. Backend generates mock payment URL
3. User redirected to payment gateway (mock)
4. Payment gateway calls webhook → POST /payments/webhook
   {
     transaction_id: string,
     status: 'success' | 'failed',
     order_id: number
   }
   
5. Update payment & order status
```

---

## 👥 Module 4: Customer Module (`modules/customers/`)

### Cấu trúc:
```
customers/
├── customer.module.ts
├── customer.controller.ts
├── customer.service.ts
└── entities/
    └── customer.entity.ts
```

### Entity:

**Customer Entity:**
```typescript
@Entity('customers')
class Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}
```

**Relationship với User:**
- 1 User (role=customer) → 1 Customer record
- Admin users KHÔNG có customer record
- Tự động tạo khi register với role=customer

### Endpoints:

```typescript
@Auth('admin')
GET    /customers          # Danh sách khách hàng
GET    /customers/search   # Tìm kiếm khách hàng
GET    /customers/:id      # Chi tiết khách hàng
POST   /customers          # Tạo khách hàng mới
PUT    /customers/:id      # Update thông tin
DELETE /customers/:id      # Xóa khách hàng

@Auth('customer')
GET    /customers/:id      # Xem thông tin của mình
PUT    /customers/:id      # Update thông tin của mình
```

---

## 🔒 Common: Guards & Decorators (`common/`)

### 1. **Auth Decorator** (`@Auth(role)`)

**File:** `common/decorators/auth.decorator.ts`

**Chức năng:**
- Kết hợp JWT authentication + role-based authorization
- Áp dụng 2 guards: `JwtAuthGuard` + `RolesGuard`

**Usage:**
```typescript
@Auth('customer')  // Chỉ customer
@Get('/cart')
getCart() { ... }

@Auth('admin')     // Chỉ admin
@Delete('/products/:id')
deleteProduct() { ... }

@Auth('customer', 'admin')  // Cả 2 roles
@Get('/products')
getProducts() { ... }
```

**Implementation:**
```typescript
export function Auth(...roles: string[]) {
  if (process.env.NODE_ENV === 'test') {
    return applyDecorators(Roles(...roles)); // Skip guards in test
  }
  
  return applyDecorators(
    Roles(...roles),                    // Attach metadata
    UseGuards(JwtAuthGuard, RolesGuard) // Apply guards
  );
}
```

### 2. **JWT Auth Guard**

**File:** `modules/auth/jwt-auth.guard.ts`

**Chức năng:**
- Extend từ Passport's `AuthGuard('jwt')`
- Validate JWT token từ header
- Attach user object vào request

**Flow:**
```
1. Extract token từ "Authorization: Bearer <token>"
2. Verify token signature với JWT_SECRET
3. Decode payload → { sub, username, role }
4. Call JwtStrategy.validate()
5. Attach user vào request.user
```

### 3. **Roles Guard**

**File:** `common/guards/roles.guard.ts`

**Chức năng:**
- Kiểm tra user.role có match với required roles không
- Sử dụng Reflector để đọc metadata từ `@Roles()` decorator

**Implementation:**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredRoles) return true; // No role required
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### 4. **Logger Middleware**

**File:** `common/middlewares/logger/logger.middleware.ts`

**Chức năng:**
- Log mọi HTTP request
- Format: `[METHOD] URL`
- Log body, params, query string

**Example Output:**
```
[POST] /auth/login
Request body: {"username":"customer1","password":"***"} or params: {} or query: {}

[GET] /catalog/products
Request body: undefined or params: {} or query: {"page":"1","limit":"10"}
```

---

## 🗄️ Database Module (`databases/`)

### Configuration:

**File:** `databases/database.module.ts`

**Chức năng:**
- Cấu hình TypeORM connection
- Tự động load entities từ `**/*.entity.ts`
- Enable synchronize (auto-sync schema in dev)

**Key Settings:**
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3307,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'projectii',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,  // ⚠️ ONLY in development
  logging: false,
});
```

**Entity Loading:**
- Tự động scan và load tất cả `*.entity.ts` files
- Không cần import manual

---

## 📊 Data Flow Examples

### Example 1: Customer adds product to cart

```
1. Frontend: POST /cart/items
   Headers: Authorization: Bearer <JWT>
   Body: { variant_id: 1, quantity: 2, price: 199990 }
   
2. Backend:
   a. @Auth('customer') decorator checks:
      - JwtAuthGuard validates token
      - RolesGuard checks user.role === 'customer'
   
   b. CartService.addItem():
      - Find or create cart for user
      - Check variant stock
      - Create cart_item or update quantity
      - Save to database
   
   c. Return updated cart with items
   
3. Frontend: Display success toast
```

### Example 2: Admin updates order status

```
1. Frontend: PATCH /orders/6/status
   Headers: Authorization: Bearer <JWT>
   Body: { status: 'Shipped' }
   
2. Backend:
   a. @Auth('admin') decorator checks:
      - JwtAuthGuard validates token
      - RolesGuard checks user.role === 'admin'
   
   b. OrderService.updateStatus():
      - Find order by ID
      - Validate status transition
      - Update order.status
      - Save to database
   
   c. Return updated order
   
3. Frontend: Refresh orders list
```

### Example 3: Checkout flow

```
1. Frontend: POST /orders/checkout
   Headers: Authorization: Bearer <JWT>
   Body: {
     customer: { name, email, phone, address },
     items: [{ variant_id, quantity, price }],
     shipping_fee: 30000,
     coupon_code?: 'DISCOUNT10'
   }
   
2. Backend:
   a. Authentication check (@Auth('customer'))
   
   b. OrderService.checkout():
      - Start database transaction
      - Validate stock for all items
      - Calculate subtotal
      - Apply coupon discount if valid
      - Add shipping fee
      - Calculate total
      - Create order with items
      - Decrease variant stock
      - Clear user's cart
      - Commit transaction
   
   c. Return order object
   
3. Frontend:
   - Show success message
   - Redirect to /orders
```

---

## 🔑 Key Design Patterns

### 1. **Separation of Concerns**
- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic & database operations
- **Entities** - Data models
- **DTOs** - Data validation & transformation

### 2. **Dependency Injection**
```typescript
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}
}
```

### 3. **Guard Composition**
```typescript
@Auth('customer') = 
  @Roles('customer') + 
  @UseGuards(JwtAuthGuard, RolesGuard)
```

### 4. **Eager Loading**
```typescript
@ManyToOne(() => Product, { eager: true })
product: Product;
// Automatically load related product
```

### 5. **Cascade Operations**
```typescript
@OneToMany(() => Variant, { cascade: true })
variants: Variant[];
// Delete product → auto delete variants
```

---

## 📈 Performance Considerations

### Database Optimization:
1. **Indexes** - Trên username, order_number, coupon_code
2. **Eager Loading** - Load related entities khi cần
3. **Transaction** - Cho checkout để đảm bảo data consistency
4. **Decimal Precision** - Giá tiền dùng DECIMAL(10,2) thay vì FLOAT

### Caching Opportunities:
- Product list (rarely changes)
- Coupon validation (cache active coupons)
- User permissions (cache role checks)

### Security Best Practices:
1. **Password Hashing** - bcrypt với salt rounds
2. **JWT Expiration** - 1 hour
3. **Role-based Access** - Guard every sensitive endpoint
4. **SQL Injection Prevention** - TypeORM parameterized queries
5. **CORS Configuration** - Chỉ allow localhost:3001

---

## 🧪 Testing Infrastructure

### Test Module (`modules/tests/`)
- Mock data factories
- Test utilities
- E2E test helpers

### E2E Tests Available:
- `test/app.e2e-spec.ts` - Basic endpoints
- `test/checkout.e2e-spec.ts` - Checkout flow
- `test/whoami.e2e-spec.ts` - Auth endpoints

---

## 📝 Summary

### Modules Summary:

| Module | Entities | Controllers | Key Features |
|--------|----------|-------------|--------------|
| **Auth** | User | AuthController | JWT, Register, Login, Guards |
| **Product** | Product, Variant, Coupon | CatalogController | CRUD, Search, Validation |
| **Orders** | Order, OrderItem, Cart, CartItem, Payment | OrderController, CartController, PaymentsController | Checkout, Payment, Status tracking |
| **Customers** | Customer | CustomerController | Profile management |

### Request Flow:
```
HTTP Request 
  → CORS Middleware
  → Logger Middleware
  → Controller
  → @Auth() Decorator
    → JwtAuthGuard (validate token)
    → RolesGuard (check role)
  → Service (business logic)
  → Repository (database)
  → Response
```

### Database Schema:
```
users ─┐
       └─> customers ─┐
                      ├─> carts ─> cart_items ─> variants ─> products
                      └─> orders ─> order_items ─> variants
                                 └─> payments

coupons (standalone)
```

**Relationship Types:**
- One-to-One: User → Customer
- One-to-Many: Product → Variants, Cart → CartItems, Order → OrderItems
- Many-to-One: Variant → Product, CartItem → Variant, OrderItem → Variant

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Total Lines of Code (src/):** ~3000+ lines
