# Use Case Diagram Guide

## 11 Use Cases cho Project II

---

## Actors

### User (Customer)
- Xem sản phẩm, mua hàng, xem đơn

### Admin
- Quản lý sản phẩm và đơn hàng

---

## Use Cases

### Auth Module

**UC-01: Đăng ký tài khoản**
- Actor: User
- Flow: Nhập username/password → System tạo tài khoản

**UC-02: Đăng nhập lấy JWT**  
- Actor: User
- Flow: Đăng nhập → Nhận JWT token

---

### Catalog Module (Product Management)

**UC-03: Khách xem danh sách whey**
- Actor: User
- Flow: Truy cập trang products → Xem danh sách

**UC-04: Khách xem chi tiết whey**
- Actor: User  
- Flow: Click sản phẩm → Xem chi tiết variants

**UC-05: Admin tạo sản phẩm**
- Actor: Admin
- Precondition: Đã đăng nhập admin
- Flow: Nhập thông tin → System lưu sản phẩm

**UC-06: Admin chỉnh sửa sản phẩm**
- Actor: Admin
- Flow: Mở form edit → Sửa thông tin → Lưu

**UC-07: Admin xóa sản phẩm**
- Actor: Admin
- Flow: Chọn xóa → Confirm → System xóa

---

### Order Module

**UC-08: User thêm whey vào giỏ hàng**
- Actor: User
- Precondition: Đã đăng nhập
- Flow: Chọn variant + số lượng → Add to cart

**UC-09: User tạo đơn hàng (checkout mở phòng)**
- Actor: User
- Flow: Vào cart → Nhập địa chỉ → Checkout → Tạo order

**UC-10: Admin xem & cập nhật trạng thái đơn**
- Actor: Admin  
- Flow: Xem danh sách orders → Cập nhật status

**UC-11: User xem lịch sử đơn hàng**
- Actor: User
- Flow: Vào "My Orders" → Xem danh sách orders

---

## Relationships

### Include (bắt buộc)
- UC-05, UC-06, UC-07 **include** UC-02 (phải đăng nhập admin)
- UC-08, UC-09, UC-11 **include** UC-02 (phải đăng nhập user)

### Extend (tùy chọn)
- UC-09 **extend** Apply Coupon

---

## Layout Diagram

```
                System: E-Commerce Whey Protein
    ┌──────────────────────────────────────────────┐
    │                                              │
    │  [Auth Module]                               │
    │    UC-01: Đăng ký                            │
User│    UC-02: Đăng nhập                          │Admin
 ○──│                                              │──○
    │  [Catalog Module]                            │
    │    UC-03: Xem danh sách (User)               │
    │    UC-04: Xem chi tiết (User)                │
    │    UC-05: Tạo sản phẩm (Admin)               │
    │    UC-06: Sửa sản phẩm (Admin)               │
    │    UC-07: Xóa sản phẩm (Admin)               │
    │                                              │
    │  [Order Module]                              │
    │    UC-08: Thêm vào giỏ (User)                │
    │    UC-09: Checkout (User)                    │
    │    UC-10: Cập nhật đơn (Admin)               │
    │    UC-11: Xem lịch sử (User)                 │
    │                                              │
    └──────────────────────────────────────────────┘
```

---

## Tools để vẽ
- **draw.io** (khuyên dùng - miễn phí)
- **Lucidchart**
- **PlantUML**

---

## Checklist
- [ ] 2 Actors: User, Admin
- [ ] 11 Use Cases đúng tên
- [ ] System boundary rõ ràng
- [ ] Relationships (include/extend)
- [ ] Layout dễ đọc
