# Product Images Guide

## 📁 Cấu trúc thư mục ảnh

Tất cả ảnh sản phẩm được lưu tại:
```
frontend/public/images/products/
```

## 📸 Quy tắc đặt tên file

Tên file ảnh phải đặt theo format: `product-{id}.jpg` hoặc `product-{id}.png`

**Ví dụ:**
- Product ID 1: `product-1.jpg`
- Product ID 2: `product-2.png`
- Product ID 3: `product-3.jpg`

## 🖼️ Yêu cầu ảnh

- **Kích thước:** 800x800px (tỷ lệ 1:1)
- **Format:** JPG, PNG, hoặc WebP
- **Dung lượng:** Dưới 500KB để tải nhanh
- **Tên file:** `product-{id}.jpg` (không viết hoa, không dấu)

## 📋 Danh sách sản phẩm cần ảnh

| ID | Tên sản phẩm | Tên file cần tạo |
|----|--------------|------------------|
| 1  | Whey Platinum Hydro | `product-1.jpg` |
| 2  | Whey Gold Standard | `product-2.jpg` |
| 3  | Whey Protein Professional | `product-3.jpg` |
| 4  | Whey Protein Isolate | `product-4.jpg` |

## 🎯 Cách thêm ảnh mới

### Bước 1: Chuẩn bị ảnh
- Resize ảnh về 800x800px (hoặc tỷ lệ 1:1)
- Đặt tên theo format: `product-{id}.jpg`

### Bước 2: Copy ảnh vào folder
```bash
# Copy ảnh từ Desktop vào project
cp ~/Desktop/my-product-image.jpg /Users/dpfam/projectii-be/frontend/public/images/products/product-1.jpg
```

Hoặc dùng Finder:
1. Mở folder: `/Users/dpfam/projectii-be/frontend/public/images/products/`
2. Drag & drop ảnh vào folder
3. Đổi tên file thành `product-{id}.jpg`

### Bước 3: Refresh trang web
- Không cần restart server
- Chỉ cần refresh trang (Cmd+R)
- Ảnh sẽ hiển thị ngay lập tức!

## 🎨 Placeholder hiện tại

Nếu không có ảnh, hệ thống sẽ hiển thị icon placeholder mặc định.

## 📝 Update code nếu cần

Nếu muốn thay đổi đường dẫn ảnh, sửa trong file:
- `/frontend/src/app/(admin)/products/page.tsx` (Product list)
- `/frontend/src/app/(admin)/products/[id]/page.tsx` (Product detail)

Tìm dòng: `/images/products/product-${product.id}.jpg`

## ✅ Test ảnh đã upload

1. Upload ảnh vào folder `public/images/products/`
2. Đặt tên: `product-1.jpg`
3. Mở browser: `http://localhost:3001/products`
4. Xem ảnh hiển thị!

---

**Lưu ý:** Ảnh trong folder `public/` được serve trực tiếp, không cần build lại!
