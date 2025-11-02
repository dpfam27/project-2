# API Endpoints Documentation

## Base URL
```
http://localhost:3000
```

---

## 1. Authentication

### POST /auth/register - Đăng ký tài khoản
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:** `201 Created`

### POST /auth/login - Đăng nhập lấy JWT
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "access_token": "eyJhbGc..."
}
```

### GET /whoami - Lấy thông tin user
**Headers:** `Authorization: Bearer <token>`

---

## 2. Catalog Module

### GET /catalog/products - Danh sách sản phẩm
**Response:**
```json
[
  {
    "id": 1,
    "name": "Whey Platinum Hydro",
    "description": "...",
    "published": true,
    "variants": [
      {
        "id": 1,
        "sku": "PH-001",
        "attributes": { "size": "500g", "color": "Vanilla" },
        "price": "199990",
        "stock": 50
      }
    ]
  }
]
```

### GET /catalog/products/:id - Chi tiết sản phẩm

### POST /catalog/products - Tạo sản phẩm (Admin)
**Headers:** `Authorization: Bearer <admin_token>`
**Request:**
```json
{
  "name": "string",
  "description": "string",
  "image_url": "string",
  "published": true
}
```

### PUT /catalog/products/:id - Sửa sản phẩm (Admin)
**Headers:** `Authorization: Bearer <admin_token>`

### DELETE /catalog/products/:id - Xóa sản phẩm (Admin)
**Headers:** `Authorization: Bearer <admin_token>`

---

## 3. Order Module - Cart

### GET /cart - Lấy giỏ hàng
**Headers:** `Authorization: Bearer <token>`

### POST /cart/items - Thêm vào giỏ
**Request:**
```json
{
  "variant_id": 1,
  "quantity": 2,
  "price": 199990
}
```

### PATCH /cart/items/:id - Cập nhật số lượng
**Request:**
```json
{
  "quantity": 3
}
```

### DELETE /cart/items/:id - Xóa item
### DELETE /cart - Xóa toàn bộ giỏ

---

## 4. Order Module - Orders

### POST /orders/checkout - Tạo đơn hàng
**Request:**
```json
{
  "shipping_address": "string",
  "phone": "string",
  "coupon_code": "string (optional)"
}
```
**Response:**
```json
{
  "order_id": 1,
  "total": 399980,
  "status": "pending",
  "payment_url": "..."
}
```

### GET /orders - Danh sách đơn hàng
**Query:** `?status=pending|confirmed|shipped|completed`

### GET /orders/:id - Chi tiết đơn hàng

### PATCH /orders/:id/status - Cập nhật trạng thái (Admin)
**Request:**
```json
{
  "status": "confirmed" | "shipped" | "completed" | "cancelled"
}
```

---

## Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
