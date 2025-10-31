# 🚀 Setup Guide for Teammates

## 📋 Prerequisites
- Docker & Docker Compose
- Node.js 18+
- npm hoặc yarn
- DBeaver (optional, để xem database)

---

## 🗄️ Database Setup

### Option 1: Auto-sync (Recommended cho Dev)
```bash
# 1. Start MySQL container
docker-compose -f docker-compose.dev.yml up -d

# 2. Backend sẽ tự động tạo tables khi chạy lần đầu
cd projectii-be
npm install
npm run start:dev
```

### Option 2: Import Schema Manual (Nhanh hơn)
```bash
# 1. Start MySQL container
docker-compose -f docker-compose.dev.yml up -d

# 2. Import database schema
docker exec -i mysql-db mysql -uroot -p'Dpfam278@' projectii < database-schema.sql

# 3. (Optional) Import sample data
docker exec -i mysql-db mysql -uroot -p'Dpfam278@' projectii < sample-data.sql
```

### Option 3: Dùng DBeaver
1. Kết nối đến MySQL:
   - Host: `localhost`
   - Port: `3307`
   - Database: `projectii`
   - Username: `root`
   - Password: `Dpfam278@`

2. Chạy file `database-schema.sql` trong SQL Editor

---

## 🔧 Backend Setup

```bash
cd projectii-be

# Install dependencies
npm install

# Start development server (port 3000)
npm run start:dev
```

**Environment Variables:**
Backend đã có sẵn config trong code, không cần file `.env` riêng.

**API Documentation:**
- Swagger: `http://localhost:3000/api`
- Health check: `http://localhost:3000`

---

## 🎨 Frontend Setup

```bash
cd projectii-be/frontend

# Install dependencies
npm install

# Start development server (port 3001)
npm run dev
```

**Environment Variables:**
File `.env.local` (tự tạo nếu chưa có):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📊 Database Structure

### Service A - Catalog & Inventory
- `products` - Sản phẩm chính
- `variants` - Biến thể (size, flavor)
- `prices` - Giá base_price, sale_price
- `stocks` - Tồn kho & reserved
- `coupons` - Mã giảm giá

### Service B - Order & Payment
- `carts` - Giỏ hàng user
- `cart_items` - Items trong giỏ
- `orders` - Đơn hàng
- `order_items` - Items trong đơn
- `payments` - Thanh toán (VNPay/MoMo mock)

### Auth
- `users` - User accounts (JWT)
- `customers` - Thông tin khách hàng

---

## 🔑 Test Accounts

### Admin Account
```
Username: testadmin
Password: admin123
```

### Sample Customer
```
Name: Nguyen Van A
Email: nguyenvana@example.com
Phone: 0909123456
```

---

## 📡 API Endpoints (Quick Reference)

### Auth
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /whoami` - Thông tin user

### Catalog
- `GET /catalog/products` - Danh sách products
- `GET /catalog/products/:id` - Chi tiết product
- `POST /catalog/products` - Tạo product
- `PUT /catalog/products/:id` - Cập nhật product
- `DELETE /catalog/products/:id` - Xóa product
- `POST /catalog/coupons/validate` - Validate coupon

### Cart
- `GET /cart` - Lấy giỏ hàng
- `POST /cart/items` - Thêm vào giỏ
- `PATCH /cart/items/:id` - Cập nhật số lượng
- `DELETE /cart/items/:id` - Xóa item
- `DELETE /cart` - Xóa toàn bộ giỏ

### Orders
- `GET /orders` - Danh sách đơn hàng
- `GET /orders/:id` - Chi tiết đơn
- `POST /orders/checkout` - Checkout
- `PATCH /orders/:id/status` - Cập nhật trạng thái
- `POST /orders/payment/init` - Khởi tạo payment

### Customers
- `GET /customers` - Danh sách customers
- `POST /customers` - Tạo customer
- `PUT /customers/:id` - Cập nhật
- `DELETE /customers/:id` - Xóa

---

## 🎯 Workflow Development

### 1. Làm Backend Feature
```bash
# 1. Tạo entity trong src/modules/{module}/entities/
# 2. Tạo DTO trong src/modules/{module}/dto/
# 3. Implement service logic
# 4. Tạo controller endpoints
# 5. Update module imports
# 6. Test API với Postman/Thunder Client
```

### 2. Làm Frontend Feature
```bash
# 1. Thêm interface trong src/lib/api.ts
# 2. Thêm API function vào api.ts
# 3. Tạo page/component trong src/app hoặc src/components
# 4. Test trên browser
```

### 3. Integration
```bash
# 1. Backend chạy trên :3000
# 2. Frontend chạy trên :3001
# 3. Frontend tự động proxy request đến backend
# 4. Login để lấy JWT token
# 5. Token được lưu trong localStorage
```

---

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Kill process trên port 3000
lsof -ti:3000 | xargs kill -9

# Kill process trên port 3001
lsof -ti:3001 | xargs kill -9
```

### Database connection failed
```bash
# Restart MySQL container
docker restart mysql-db

# Check MySQL logs
docker logs mysql-db
```

### TypeORM sync issues
```bash
# Drop và recreate database
docker exec -it mysql-db mysql -uroot -p'Dpfam278@' -e "DROP DATABASE projectii; CREATE DATABASE projectii;"

# Restart backend để tự động tạo lại tables
```

---

## 📚 Resources

- **Backend Framework:** NestJS - https://docs.nestjs.com
- **Frontend Framework:** Next.js 15 - https://nextjs.org/docs
- **ORM:** TypeORM - https://typeorm.io
- **UI Library:** Tailwind CSS - https://tailwindcss.com

---

## 📝 Git Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes & commit
git add .
git commit -m "feat: add your feature"

# 4. Push to remote
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
```

---

## ⚠️ Important Notes

1. **Không commit** file `.env` lên git
2. **Luôn test** API trước khi integrate frontend
3. **Sync database schema** khi có thay đổi entity
4. **Document** API mới trong Swagger annotations
5. **Code review** trước khi merge vào main

---

## 🆘 Need Help?

- Check API docs: `http://localhost:3000/api`
- Read code examples trong `src/modules/`
- Ask team qua Slack/Discord
- Review `STATUS.md` để biết progress hiện tại
