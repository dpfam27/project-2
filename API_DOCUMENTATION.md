# 📡 API Documentation

Base URL: `http://localhost:3000`

## 🔐 Authentication

Tất cả endpoints (trừ `/auth/*`) yêu cầu JWT token trong header:
```
Authorization: Bearer {token}
```

### POST /auth/register
Đăng ký tài khoản mới

**Request:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Đăng nhập

**Request:**
```json
{
  "username": "testadmin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /whoami
Lấy thông tin user hiện tại

**Response:**
```json
{
  "user": {
    "userId": 1,
    "username": "testadmin",
    "role": "admin"
  }
}
```

---

## 📦 Catalog/Products

### GET /catalog/products
Lấy danh sách products

**Response:**
```json
[
  {
    "id": 1,
    "name": "Whey Protein",
    "description": "Premium whey protein supplement",
    "published": true,
    "variants": [...]
  }
]
```

### GET /catalog/products/:id
Chi tiết product

**Response:**
```json
{
  "id": 1,
  "name": "Whey Protein",
  "description": "Premium whey protein supplement",
  "published": true,
  "variants": [
    {
      "id": 1,
      "name": "Chocolate 1kg",
      "sku": "WP-CHOCO-1KG"
    }
  ]
}
```

### POST /catalog/products
Tạo product mới

**Request:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "published": true
}
```

### PUT /catalog/products/:id
Cập nhật product

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "published": false
}
```

### DELETE /catalog/products/:id
Xóa product

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### POST /catalog/coupons/validate
Validate coupon code

**Request:**
```json
{
  "code": "WELCOME10",
  "subtotal": 1000000
}
```

**Response:**
```json
{
  "valid": true,
  "discount": 100000,
  "couponId": 1
}
```

---

## 🛒 Cart

### GET /cart
Lấy giỏ hàng của user

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "variant_id": 1,
        "quantity": 2,
        "price": "499000.00",
        "created_at": "2025-01-31T10:00:00.000Z",
        "updated_at": "2025-01-31T10:00:00.000Z"
      }
    ],
    "created_at": "2025-01-31T10:00:00.000Z",
    "updated_at": "2025-01-31T10:00:00.000Z"
  }
}
```

### POST /cart/items
Thêm sản phẩm vào giỏ

**Request:**
```json
{
  "variant_id": 1,
  "quantity": 2,
  "price": 499000
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Item added to cart",
  "data": { /* cart object */ }
}
```

### PATCH /cart/items/:id
Cập nhật số lượng item

**Request:**
```json
{
  "quantity": 3
}
```

### DELETE /cart/items/:id
Xóa item khỏi giỏ

**Response:**
```json
{
  "statusCode": 200,
  "message": "Item removed from cart",
  "data": { /* cart object */ }
}
```

### DELETE /cart
Xóa toàn bộ giỏ hàng

**Response:**
```json
{
  "statusCode": 200,
  "message": "Cart cleared",
  "data": null
}
```

---

## 📋 Orders

### GET /orders
Lấy danh sách orders

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "order_number": "ORD-2025010001",
      "status": "Paid",
      "total_amount": "1698000.00",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "customer": {
        "id": 1,
        "name": "Nguyen Van A",
        "email": "nguyenvana@example.com"
      }
    }
  ]
}
```

### GET /orders/:id
Chi tiết order

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "customer_id": 1,
    "order_number": "ORD-2025010001",
    "status": "Paid",
    "total_amount": "1698000.00",
    "customer": { /* customer object */ }
  }
}
```

### POST /orders/checkout
Tạo order từ cart

**Request:**
```json
{
  "customer": {
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "phone": "0909123456",
    "address": "123 Le Loi, Q1, TPHCM"
  },
  "items": [
    {
      "variant_id": 1,
      "quantity": 2,
      "price": 499000
    }
  ],
  "coupon_code": "WELCOME10",
  "shipping_fee": 30000
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Checkout created",
  "data": {
    "order": { /* order object */ },
    "payment": { /* payment object */ }
  }
}
```

### PATCH /orders/:id/status
Cập nhật trạng thái order

**Request:**
```json
{
  "status": "Shipped"
}
```

**Valid status transitions:**
- `Pending` → `Paid` hoặc `Canceled`
- `Paid` → `Shipped` hoặc `Canceled`
- `Shipped` → (final state)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Order status updated",
  "data": { /* updated order */ }
}
```

### POST /orders/payment/init
Khởi tạo payment (Mock)

**Request:**
```json
{
  "order_id": 1
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Payment initiated",
  "data": {
    "payment_url": "https://mockpay.example/pay?paymentId=1"
  }
}
```

---

## 👥 Customers

### GET /customers
Lấy danh sách customers

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "nguyenvana@example.com",
      "phone": "0909123456",
      "address": "123 Le Loi, Q1, TPHCM",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /customers
Tạo customer mới

**Request:**
```json
{
  "name": "Tran Thi B",
  "email": "tranthib@example.com",
  "phone": "0909234567",
  "address": "456 Nguyen Hue, Q1, TPHCM"
}
```

### PUT /customers/:id
Cập nhật customer

**Request:**
```json
{
  "name": "Updated Name",
  "phone": "0909999999"
}
```

### DELETE /customers/:id
Xóa customer

---

## 💳 Payment Webhook (Internal)

### POST /payments/webhook
Webhook từ payment gateway (VNPay/MoMo)

**Request:**
```json
{
  "provider_ref": "VNPAY-2025010001-ABC123",
  "order_id": 1,
  "status": "success",
  "payment_id": 1
}
```

**Response:**
```json
{
  "ok": true
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🧪 Testing với cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"admin123"}'
```

### Get Products (với token)
```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:3000/catalog/products \
  -H "Authorization: Bearer $TOKEN"
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variant_id":1,"quantity":2,"price":499000}'
```

---

## 📝 Notes

1. **Authentication**: Lưu token vào localStorage sau khi login
2. **Timestamps**: Tất cả timestamp dùng ISO 8601 format
3. **Currency**: Giá tiền đang dùng VND (integer)
4. **Pagination**: Chưa implement, sẽ thêm sau
5. **File Upload**: Chưa implement, products chưa có hình ảnh
