# System Overview - E-Commerce Whey Protein

## Use Case Implementation Status

### ✅ Đã hoàn thành (100% theo diagram)

#### **Guest (Khách vãng lai)**
- ✅ View Product List - Xem danh sách sản phẩm
- ✅ View Product Details - Xem chi tiết sản phẩm
- ✅ Register Account - Đăng ký tài khoản

#### **User/Customer (Khách hàng)**
- ✅ Login - Đăng nhập
- ✅ Logout - Đăng xuất
- ✅ View Product List - Xem danh sách sản phẩm
- ✅ View Product Details - Xem chi tiết sản phẩm
- ✅ Add Product to Cart - Thêm sản phẩm vào giỏ
- ✅ Create Order - Tạo đơn hàng (Checkout)
- ✅ View Order History - Xem lịch sử đơn hàng

#### **Admin (Quản trị viên)**
- ✅ Login - Đăng nhập
- ✅ View Product List - Xem danh sách sản phẩm
- ✅ View Product Details - Xem chi tiết sản phẩm
- ✅ Create Product - Tạo sản phẩm mới
- ✅ Delete Product - Xóa sản phẩm
- ✅ Adjust Product - Chỉnh sửa sản phẩm (Edit variants, stock, price)
- ✅ View & Update Order Status - Xem và cập nhật trạng thái đơn hàng

### 🚀 Tính năng bổ sung (Không có trong diagram)

**Đã phát triển thêm:**
- ✅ Cart Management - Quản lý giỏ hàng (update quantity, remove items, clear cart)
- ✅ Coupon System - Hệ thống mã giảm giá
- ✅ Shipping Fee Calculation - Tính phí vận chuyển
- ✅ Payment Integration - Tích hợp thanh toán (VNPay/MoMo mock)
- ✅ Customer Management - Quản lý thông tin khách hàng (Admin)
- ✅ Product Variants - Quản lý biến thể sản phẩm (size, flavor)
- ✅ Stock Management - Quản lý tồn kho theo variant
- ✅ Search & Filter Products - Tìm kiếm và lọc sản phẩm
- ✅ Order Search - Tìm kiếm đơn hàng
- ✅ Responsive UI - Giao diện responsive, dark mode
- ✅ Toast Notifications - Thông báo bubble đẹp
- ✅ Login/Register Modals - Modal xác thực đẹp

### 📋 Kế hoạch phát triển tiếp theo

**Phase 1: Nâng cao trải nghiệm người dùng**
- ⏳ Product Reviews & Ratings - Đánh giá và xếp hạng sản phẩm
- ⏳ Wishlist/Favorites - Danh sách yêu thích
- ⏳ Product Comparison - So sánh sản phẩm
- ⏳ Advanced Filters - Bộ lọc nâng cao (price range, brand, flavor)
- ⏳ Product Recommendations - Gợi ý sản phẩm liên quan

**Phase 2: Tính năng thương mại**
- ⏳ Real Payment Gateway - Tích hợp thanh toán thật (VNPay, MoMo, PayPal)
- ⏳ Multiple Payment Methods - Đa phương thức thanh toán (COD, banking)
- ⏳ Email Notifications - Gửi email xác nhận đơn hàng, tracking
- ⏳ SMS Notifications - Thông báo SMS
- ⏳ Order Tracking - Theo dõi đơn hàng chi tiết
- ⏳ Return/Refund System - Hệ thống hoàn trả/hoàn tiền

**Phase 3: Quản lý nâng cao**
- ⏳ Inventory Alerts - Cảnh báo tồn kho thấp
- ⏳ Sales Analytics - Phân tích doanh thu, báo cáo
- ⏳ Revenue Dashboard - Dashboard doanh thu theo thời gian
- ⏳ Customer Analytics - Phân tích hành vi khách hàng
- ⏳ Bulk Product Import - Import sản phẩm hàng loạt (CSV/Excel)
- ⏳ Export Reports - Xuất báo cáo (PDF, Excel)

**Phase 4: Mở rộng**
- ⏳ Multi-language Support - Đa ngôn ngữ (EN/VI)
- ⏳ Multi-currency - Đa tiền tệ
- ⏳ Chat Support - Hỗ trợ chat trực tuyến
- ⏳ Blog/News - Tin tức, bài viết về sản phẩm
- ⏳ Loyalty Program - Chương trình tích điểm
- ⏳ Flash Sales - Giảm giá sốc theo thời gian

---

## Kiến trúc hệ thống
```
Frontend (Next.js 14) ←→ Backend (NestJS) ←→ Database (MySQL 8.0)
                         ↓
                    Auth (JWT)
```

## Tech Stack

| Thành phần | Công nghệ |
|------------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, TailwindCSS |
| **Backend** | NestJS, TypeScript, TypeORM, Passport |
| **Database** | MySQL 8.0 |
| **Auth** | JWT (jsonwebtoken, passport-jwt) |
| **Payment** | VNPay/MoMo (Mock) |
| **Tools** | Docker, Git, ESLint, Prettier |

## Cấu trúc Module

### 1. Auth Module
- JWT authentication & authorization
- Roles: `admin`, `customer`
- Login/Register/Logout

### 2. Catalog Module (Admin)
- CRUD: Products, Variants, Coupons
- Quản lý tồn kho, giá, khuyến mãi
- Search/Filter sản phẩm

### 3. Orders Module (Customer)
- Cart → Checkout → Payment
- Order lifecycle: pending → confirmed → shipped → completed
- Áp mã giảm giá, tính phí ship

## Actors & Permissions

| Role | Quyền hạn |
|------|-----------|
| **Admin** | Quản lý sản phẩm, đơn hàng, coupons, xem báo cáo |
| **Customer** | Xem/mua sản phẩm, quản lý giỏ hàng, xem đơn hàng |

## API Endpoints

```
Base URL: http://localhost:3000

Auth:
  POST   /auth/login
  POST   /auth/register
  GET    /auth/me

Catalog:
  GET    /catalog/products
  GET    /catalog/products/:id
  POST   /catalog/products (admin)
  PUT    /catalog/products/:id (admin)
  DELETE /catalog/products/:id (admin)

Cart & Orders:
  GET    /cart
  POST   /cart/items
  POST   /checkout
  GET    /orders
  PATCH  /orders/:id/status (admin)
```

## Database Schema

```sql
users (id, username, password, role)
customers (id, name, email, phone, address)
products (id, name, description, image_url)
variants (id, product_id, sku, price, stock)
carts (id, user_id)
cart_items (id, cart_id, variant_id, quantity)
orders (id, customer_id, total, status, payment_status)
order_items (id, order_id, variant_id, quantity, price)
coupons (id, code, type, value, active)
```

## Luồng hoạt động chính

### Customer Flow
1. Register/Login → Nhận JWT token
2. Browse products → Add to cart
3. Checkout → Apply coupon → Payment
4. Track order status

### Admin Flow
1. Login → Nhận JWT token
2. Manage products/variants/coupons
3. View/update order status
4. View statistics

## Development Setup

```bash
# Backend
PORT=3001 npm run dev

# Frontend  
cd frontend && npm run dev

# Database
docker-compose -f docker-compose.dev.yml up -d
```
