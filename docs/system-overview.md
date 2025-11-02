# System Overview - Project II

## Tổng quan hệ thống E-Commerce Whey Protein

### Kiến trúc hệ thống
- **Frontend**: Next.js 14 (TypeScript)
- **Backend**: NestJS (TypeScript) 
- **Database**: MySQL 8.0
- **Authentication**: JWT

---

## 1. Services (Modules)

### Service A - Catalog & Inventory (cho Admin)
**Chức năng**: Quản lý danh mục Whey/Flavor/Size/Variant, tồn kho, giá, khuyến mãi/coupon.

- CRUD trọng tâm: Product, Variant, Stock, Price, Coupon
- Tính năng chính: Search/Filter, tính giá sau khuyến mãi, kiểm tra tồn kho

### Service B - Order & Payment (cho Customer)  
**Chức năng**: Cart → Checkout → Payment → Order lifecycle (confirm, ship, complete, cancel/refund).

- Tích hợp Payment Gateway: VNPay/MoMo (mock/webhook ở mức demo)
- Tính năng chính: Áp mã giảm giá, phí ship, trạng thái đơn, webhook thanh toán

---

## 2. Actors

### Admin
- Quản lý sản phẩm (tạo, sửa, xóa)
- Quản lý đơn hàng và cập nhật trạng thái
- Xem báo cáo và thống kê

### Customer (User)
- Xem danh sách và chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Tạo đơn hàng và thanh toán
- Xem lịch sử đơn hàng

---

## 3. Authentication & Authorization

**Auth (JWT)** đặt như cross-cutting module trong BE, dùng chung cho 2 services.

### Roles
- `admin`: Toàn quyền quản lý
- `customer`: Mua hàng và xem đơn của mình

### Flow đăng nhập
1. User login → Nhận JWT access_token
2. Token gửi trong header: `Authorization: Bearer <token>`
3. Backend verify token và role
4. Frontend lưu token trong localStorage

---

## 4. API Communication

**Next.js gọi API 2 services qua REST** (hoặc bạn gom trong một Nest app với 2 module lớn).

### Base URLs
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:3001`

### Main Endpoints
- `/auth/*` - Authentication
- `/catalog/products/*` - Product management
- `/cart/*` - Cart operations  
- `/orders/*` - Order management
- `/payments/*` - Payment processing

---

## 5. Database Schema (Simplified)

### Core Tables
```
users (id, username, password_hash, role)
customers (id, name, email, phone, address)
products (id, name, description, image_url, published)
variants (id, product_id, sku, attributes, price, stock)
carts (id, user_id)
cart_items (id, cart_id, variant_id, quantity, price)
orders (id, customer_id, total, status, payment_status)
order_items (id, order_id, variant_id, quantity, price)
coupons (id, code, type, value, active)
```

---

## 6. Key Features

### Catalog Management
- Danh sách sản phẩm với filter/search
- Chi tiết sản phẩm với variants (size, flavor)
- Admin CRUD operations
- Stock management

### Shopping Experience  
- Browse products
- Add to cart
- Apply coupon codes
- Checkout with payment

### Order Management
- Order creation and tracking
- Status updates (pending → confirmed → shipped → completed)
- Order history
- Admin order dashboard

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript, TailwindCSS |
| Backend | NestJS, TypeScript, TypeORM |
| Database | MySQL 8.0 |
| Auth | JWT (jsonwebtoken, passport-jwt) |
| Payment | VNPay/MoMo (Mock) |
| Development | Docker, Git |
