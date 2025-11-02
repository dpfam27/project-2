# 📚 Project Documentation

Bộ tài liệu đầy đủ cho **Project II E-Commerce Platform** để hỗ trợ team phát triển và vẽ use case diagram.

---

## 📄 Tài liệu có sẵn

### 1. **system-overview.md** 
📋 **Tổng quan hệ thống**

**Nội dung:**
- Kiến trúc tổng thể (Frontend, Backend, Database)
- Actors (Guest, Customer, Admin)
- Tech stack chi tiết
- Database schema với ERD
- Authentication & Authorization flow
- Shopping flow diagram
- Security measures
- Deployment architecture

**Dùng cho:**
- ✅ Hiểu tổng quan hệ thống
- ✅ Vẽ system architecture diagram
- ✅ Xác định actors cho use case
- ✅ Thiết kế database

---

### 2. **api-endpoints.md**
🔌 **Tài liệu API đầy đủ**

**Nội dung:**
- Tất cả REST API endpoints (30+ endpoints)
- Request/Response examples với JSON
- Authentication requirements
- Query parameters & path parameters
- Error codes và xử lý lỗi
- Authorization matrix (Guest/Customer/Admin)

**Dùng cho:**
- ✅ Frontend development
- ✅ API testing (Postman/Swagger)
- ✅ Vẽ sequence diagram
- ✅ Integration testing

**Quick Access:**
- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api`

---

### 3. **feature-list.csv**
📊 **Danh sách đầy đủ tính năng**

**Nội dung:** 70+ features được tổ chức theo:
- **Module:** Authentication, Product Catalog, Shopping Cart, Order Management, Payment, Customer, Coupon, Notification, Analytics, UI/UX, Security, Infrastructure, Testing
- **Feature ID:** Mã định danh duy nhất (ví dụ: AUTH-001, CAT-002)
- **Feature Name:** Tên ngắn gọn
- **Description:** Mô tả chi tiết bằng tiếng Việt
- **Actor:** Guest/Customer/Admin/System
- **Priority:** High/Medium/Low
- **Status:** ✅ Completed / 🔄 In Progress / 🔄 Planned
- **Backend Endpoint:** API tương ứng
- **Frontend Page:** Trang UI tương ứng
- **Dependencies:** Features phụ thuộc
- **Notes:** Ghi chú thêm

**Dùng cho:**
- ✅ **VẼ USE CASE DIAGRAM** ⭐️ (quan trọng nhất)
- ✅ Sprint planning
- ✅ Progress tracking
- ✅ Feature testing checklist

**Cách mở:**
- Mở bằng Excel/Google Sheets
- Hoặc import vào project management tools
- Hoặc xem bằng text editor (CSV format)

---

## 🎯 Hướng dẫn vẽ Use Case Diagram

### Bước 1: Xác định Actors (từ system-overview.md)
```
1. Guest (Khách vãng lai)
2. Customer (Khách hàng đã đăng ký)
3. Admin (Quản trị viên)
4. System (Hệ thống tự động)
```

### Bước 2: Lấy Use Cases (từ feature-list.csv)
**Filter theo Module và Actor để nhóm use cases:**

#### **Guest Use Cases** (Tìm trong CSV: Actor = Guest)
- View Product List (CAT-001)
- View Product Detail (CAT-002)
- User Registration (AUTH-001)
- User Login (AUTH-002)
- Guest Cart (CART-006)

#### **Customer Use Cases** (Actor = Customer)
- Tất cả Use Cases của Guest +
- Add to Cart (CART-002)
- View Cart (CART-001)
- Checkout (ORD-001)
- Apply Coupon (ORD-002)
- View Order History (ORD-003)
- View Order Detail (ORD-004)
- Initialize Payment (PAY-001)
- Customer Profile (CUS-007)

#### **Admin Use Cases** (Actor = Admin)
- Tất cả Use Cases của Customer +
- Create Product (CAT-005)
- Edit Product (CAT-006)
- Delete Product (CAT-007)
- Admin View Orders (ORD-006)
- Update Order Status (ORD-007)
- View Customers (CUS-001)
- Create Customer (CUS-003)
- Create Coupon (COU-001)
- Sales Dashboard (ANA-001)

#### **System Use Cases** (Actor = System)
- Payment Webhook (PAY-002)
- Order Confirmation Email (NOT-001)
- Low Stock Alert (NOT-003)

### Bước 3: Xác định quan hệ
**Trong CSV column "Dependencies":**
- `<<include>>`: Feature phụ thuộc (ví dụ: Checkout include Apply Coupon)
- `<<extend>>`: Feature mở rộng (ví dụ: Cancel Order extend từ View Order Detail)

**Ví dụ từ CSV:**
```
ORD-001 (Checkout) → Dependencies: CART-001
=> Checkout <<include>> View Cart

ORD-002 (Apply Coupon) → Dependencies: ORD-001
=> Apply Coupon <<extend>> Checkout

AUTH-003 (Get Current User) → Dependencies: AUTH-002
=> Get Current User <<include>> Login
```

### Bước 4: Phân nhóm theo Module
Dùng CSV column "Module" để tạo packages/subsystems:
- **Authentication Package**
- **Product Catalog Package**
- **Shopping Cart Package**
- **Order Management Package**
- **Payment Package**
- **Customer Management Package**

---

## 🗺️ Use Case Diagram Example

```
┌─────────────────────────────────────────────────────────┐
│          E-COMMERCE SYSTEM USE CASE DIAGRAM              │
└─────────────────────────────────────────────────────────┘

        Guest                Customer              Admin
          │                     │                    │
          │                     │                    │
    ┌─────▼─────┐         ┌─────▼─────┐      ┌─────▼─────┐
    │  Browse   │         │  Manage   │      │  Manage   │
    │ Products  │         │   Cart    │      │ Products  │
    └───────────┘         └───────────┘      └───────────┘
          │                     │                    │
          │                     │                    │
    ┌─────▼─────┐         ┌─────▼─────┐      ┌─────▼─────┐
    │ Register/ │         │ Checkout  │      │  Manage   │
    │   Login   │         │  & Pay    │      │  Orders   │
    └───────────┘         └───────────┘      └───────────┘
                                │                    │
                          ┌─────▼─────┐      ┌─────▼─────┐
                          │   View    │      │  Manage   │
                          │  Orders   │      │ Customers │
                          └───────────┘      └───────────┘

                    System
                      │
                ┌─────▼─────┐
                │  Process  │
                │  Payment  │
                │  Webhook  │
                └───────────┘
```

---

## 📊 Statistics từ Feature List

### By Status:
- ✅ **Completed:** 42 features (60%)
- 🔄 **In Progress:** 3 features (4%)
- 🔄 **Planned:** 25 features (36%)

### By Priority:
- **High:** 35 features
- **Medium:** 28 features
- **Low:** 7 features

### By Module:
- Authentication: 5 features
- Product Catalog: 10 features
- Shopping Cart: 7 features
- Order Management: 10 features
- Payment Processing: 6 features
- Customer Management: 7 features
- Coupon System: 5 features
- Others: 20 features

---

## 🔗 Related Files

### Backend Files:
- `/database-schema.sql` - Database structure
- `/src/modules/*/` - Source code modules
- `/test/*.spec.ts` - Test files
- `/STATUS.md` - Project status

### Frontend Files:
- `/frontend/src/app/` - Pages
- `/frontend/src/components/` - Components
- `/frontend/src/lib/api.ts` - API client

---

## 🛠️ Tools Recommended

### For Use Case Diagram:
- **Draw.io / diagrams.net** (Free, online)
- **Lucidchart** (Professional)
- **PlantUML** (Code-based)
- **Visual Paradigm** (Full-featured)
- **StarUML** (Desktop app)

### For Opening CSV:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- VS Code (với extension CSV)

---

## 📞 Support

Nếu cần thêm thông tin hoặc có câu hỏi về tài liệu:

1. **API Questions:** Check `api-endpoints.md` hoặc Swagger UI
2. **Architecture Questions:** Check `system-overview.md`
3. **Feature Details:** Check `feature-list.csv`
4. **Code Examples:** Check source code trong `/src` và `/frontend/src`

---

## 🚀 Quick Start cho QA/BA

### Để vẽ Use Case Diagram:

1. **Đọc `system-overview.md`** (15 phút)
   - Hiểu actors
   - Hiểu system architecture
   - Hiểu authentication flow

2. **Mở `feature-list.csv`** trong Excel (5 phút)
   - Filter theo Actor
   - Filter theo Module
   - Note dependencies

3. **Vẽ diagram** (30-60 phút)
   - Tạo 4 actors
   - Add use cases theo priority (High first)
   - Draw relationships dựa vào Dependencies column
   - Group theo Module

4. **Validate** (10 phút)
   - Check với `api-endpoints.md`
   - Verify flows với team

### Để Test API:

1. **Start backend:** `npm run start:dev`
2. **Open Swagger:** http://localhost:3000/api
3. **Reference:** `api-endpoints.md` cho examples
4. **Test các features** theo `feature-list.csv` (Status = ✅ Completed)

---

**Document Version:** 1.0  
**Created:** November 2, 2025  
**Maintained By:** Development Team

---

## 📝 Changelog

### v1.0 (2025-11-02)
- ✅ Tạo system-overview.md
- ✅ Tạo api-endpoints.md (30+ endpoints)
- ✅ Tạo feature-list.csv (70+ features)
- ✅ Tạo README.md (documentation index)
