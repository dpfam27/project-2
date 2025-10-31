# 🔗 Frontend-Backend Integration Guide

## ✅ Đã tích hợp xong!

### 📁 Files đã tạo:

**API & Auth:**
- ✅ `frontend/.env.local` - API URL configuration
- ✅ `frontend/src/lib/api.ts` - API client (auth, customers, products)
- ✅ `frontend/src/context/AuthContext.tsx` - Authentication context

**Pages:**
- ✅ `frontend/src/app/login/page.tsx` - Login page
- ✅ `frontend/src/app/(admin)/customers/page.tsx` - Customers list
- ✅ `frontend/src/app/(admin)/products/page.tsx` - Products grid

**Components:**
- ✅ `frontend/src/components/auth/UserWidget.tsx` - User info & logout

**Updated:**
- ✅ `frontend/src/app/layout.tsx` - Added AuthProvider
- ✅ `frontend/src/app/(admin)/page.tsx` - Added UserWidget to dashboard

---

## 🚀 Cách chạy Frontend + Backend

### Bước 1: Start Backend (Terminal 1)
```bash
cd /Users/dpfam/projectii-be
npm run start:dev
```

Chờ đến khi thấy: `Nest application successfully started`

### Bước 2: Start Frontend (Terminal 2)
```bash
cd /Users/dpfam/projectii-be/frontend
npm install  # Lần đầu tiên
npm run dev
```

### Bước 3: Mở Browser
```
http://localhost:3000  # Frontend Next.js
```

---

## 🎯 Test Flow

### 1. Login
- Mở: http://localhost:3000/login
- Credentials:
  - Username: `demo`
  - Password: `demo123`
- Click "Sign in"
- Sẽ redirect về dashboard

### 2. Check Dashboard
- Thấy UserWidget với thông tin user
- Username, Role, User ID
- Button Logout

### 3. View Customers
- Sidebar → Customers (hoặc trực tiếp: http://localhost:3000/customers)
- Xem danh sách customers từ backend

### 4. View Products  
- Sidebar → Products (hoặc trực tiếp: http://localhost:3000/products)
- Xem danh sách products dạng grid

### 5. Logout
- Click "Logout" button
- Redirect về /login

---

## 🔑 API Endpoints được sử dụng

**Backend (NestJS - Port 3000):**
- POST `/auth/login` - Login và lấy JWT token
- GET `/whoami` - Lấy thông tin user hiện tại
- GET `/customers` - Danh sách customers (protected)
- GET `/catalog/products` - Danh sách products

**Frontend (Next.js - Port 3001 theo mặc định):**
- `/login` - Login page
- `/` - Dashboard
- `/customers` - Customers page
- `/products` - Products page

---

## 📱 Features đã implement

### ✅ Authentication
- [x] Login form với validation
- [x] JWT token storage (localStorage)
- [x] Auto-attach Authorization header
- [x] Protected routes (redirect to login)
- [x] Logout functionality
- [x] User context globally

### ✅ Customers Page
- [x] Fetch customers from backend
- [x] Display in table format
- [x] Show: ID, Name, Email, Phone, Address
- [x] Error handling
- [x] Loading state

### ✅ Products Page
- [x] Fetch products from backend
- [x] Display in card grid
- [x] Show: Name, Description, Published status
- [x] Responsive layout

### ✅ Dashboard
- [x] User info widget
- [x] Logout button
- [x] Existing dashboard components

---

## 🎨 UI/UX

**Theme Support:**
- ✅ Dark mode compatible
- ✅ Tailwind CSS styling
- ✅ Responsive design

**User Experience:**
- ✅ Loading states
- ✅ Error messages
- ✅ Success feedback
- ✅ Auto-redirect khi chưa login

---

## 🔧 Configuration

### Backend CORS
File: `backend/src/main.ts`
```typescript
app.enableCors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Frontend API URL
File: `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### CORS Error
**Problem:** `Access-Control-Allow-Origin` error

**Solution:**
1. Check backend `main.ts` có CORS config
2. Restart backend server
3. Frontend URL phải match với origin trong CORS

### 401 Unauthorized
**Problem:** API trả về 401

**Solutions:**
1. Token expired → Login lại
2. Token không gửi → Check DevTools Network tab
3. Backend không chạy → Check `npm run start:dev`

### Cannot fetch data
**Problem:** Customers/Products không load

**Check:**
1. Backend running? → `curl http://localhost:3000/`
2. Logged in? → Check localStorage có `access_token`
3. Check Network tab trong DevTools

---

## 📝 Next Steps (Optional)

### Easy Improvements:
- [ ] Add "Create Customer" form
- [ ] Add "Create Product" form  
- [ ] Add search/filter
- [ ] Add pagination
- [ ] Add delete/edit actions

### Advanced:
- [ ] Real-time updates (WebSocket)
- [ ] File upload for product images
- [ ] Order management page
- [ ] Sales charts with real data
- [ ] Multi-language support

---

## 🎉 Summary

**Status:** ✅ **HOÀN TẤT!**

Frontend và Backend đã được kết nối thành công:
- Login/Logout hoạt động
- Protected routes working
- Data fetching từ backend OK
- CORS configured properly
- JWT authentication implemented

**Ready to test!** 🚀

---

## 📚 Related Documentation

- Backend API: `QUICKSTART.md`
- Backend Testing: `TESTING_GUIDE.md`
- Swagger UI: http://localhost:3000/api
