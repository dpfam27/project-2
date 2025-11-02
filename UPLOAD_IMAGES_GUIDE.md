# 🖼️ Hướng Dẫn Upload và Quản Lý Ảnh Sản Phẩm

## 📁 Vị trí folder ảnh

```
/Users/dpfam/projectii-be/frontend/public/images/products/
```

**Trong VS Code:** Mở folder này ở sidebar bên trái

## 📸 Quy tắc đặt tên ảnh

Format: `product-{id}.jpg` hoặc `product-{id}.png`

| Product ID | Tên file |
|------------|----------|
| 1 | `product-1.jpg` |
| 2 | `product-2.jpg` |
| 3 | `product-3.jpg` |
| 4 | `product-4.jpg` |

## 🎯 Cách thêm ảnh (3 cách)

### Cách 1: Drag & Drop trong VS Code ✅ RECOMMENDED
1. Mở folder `public/images/products` trong VS Code
2. Drag ảnh từ Finder vào folder này
3. Đổi tên file thành `product-{id}.jpg`
4. Done! Refresh browser để thấy ảnh

### Cách 2: Dùng Finder
1. Mở Finder
2. Navigate đến: `/Users/dpfam/projectii-be/frontend/public/images/products/`
3. Copy/paste ảnh vào folder
4. Đổi tên thành `product-{id}.jpg`

### Cách 3: Terminal Command
```bash
# Copy ảnh từ Desktop
cp ~/Desktop/my-image.jpg /Users/dpfam/projectii-be/frontend/public/images/products/product-1.jpg

# Copy ảnh từ Downloads
cp ~/Downloads/protein-image.png /Users/dpfam/projectii-be/frontend/public/images/products/product-2.png
```

## 🎨 Yêu cầu kỹ thuật

- **Kích thước khuyến nghị:** 800x800px (tỷ lệ 1:1 vuông)
- **Kích thước tối thiểu:** 400x400px
- **Format:** JPG, PNG, WebP
- **Dung lượng:** < 500KB (để load nhanh)
- **Màu nền:** Nên dùng nền trắng hoặc trong suốt

## 📋 Danh sách sản phẩm

| ID | Tên sản phẩm | Tên file | Status |
|----|--------------|----------|--------|
| 1 | Whey Platinum Hydro | `product-1.jpg` | ⏳ Cần upload |
| 2 | Whey Gold Standard | `product-2.jpg` | ⏳ Cần upload |
| 3 | Whey Protein Professional | `product-3.jpg` | ⏳ Cần upload |
| 4 | Whey Protein Isolate | `product-4.jpg` | ⏳ Cần upload |

## ✅ Kiểm tra ảnh đã upload

1. Upload ảnh vào folder `public/images/products/`
2. Đặt tên đúng format: `product-1.jpg`
3. Mở browser: http://localhost:3001/products
4. Ảnh sẽ hiển thị ngay (không cần restart server!)

## 🔄 Thay đổi ảnh

Để thay ảnh cho sản phẩm:
1. Xóa file ảnh cũ (VD: `product-1.jpg`)
2. Upload ảnh mới với cùng tên file
3. Hard refresh browser: `Cmd+Shift+R` (Mac) hoặc `Ctrl+Shift+R` (Windows)

## 🎯 Tìm ảnh miễn phí

**Whey Protein Images:**
- Unsplash: https://unsplash.com/s/photos/whey-protein
- Pexels: https://www.pexels.com/search/protein-powder/
- Pixabay: https://pixabay.com/images/search/protein/

**Tips tìm ảnh:**
- Tìm từ khóa: "whey protein", "protein powder", "supplement"
- Chọn ảnh có nền trắng/sạch
- Download resolution cao (ít nhất 800px)

## 🛠️ Code đã được cập nhật

Ảnh được load từ đường dẫn:
```tsx
/images/products/product-${product.id}.jpg
```

**Files đã update:**
1. `/frontend/src/app/(admin)/products/page.tsx` - Product list
2. `/frontend/src/app/(admin)/products/[id]/page.tsx` - Product detail

## 💡 Fallback Behavior

Nếu không tìm thấy ảnh, hệ thống sẽ hiển thị:
- **Product List:** Icon camera placeholder
- **Product Detail:** Text "No Image Available"

## 🚀 Quick Start Example

```bash
# 1. Navigate to images folder
cd /Users/dpfam/projectii-be/frontend/public/images/products/

# 2. Check current files
ls -la

# 3. Copy your image
cp ~/Desktop/whey-protein.jpg product-1.jpg

# 4. Verify
ls -la

# 5. Open browser and check
# http://localhost:3001/products
```

## 📝 Notes

- Không cần restart frontend server sau khi upload ảnh
- Chỉ cần refresh browser (F5 hoặc Cmd+R)
- Ảnh trong folder `public/` được serve tự động
- Có thể dùng JPG, PNG, hoặc WebP format
- Nếu dùng PNG, đổi trong code từ `.jpg` thành `.png`

---

**Thắc mắc?** Xem README.md trong folder images/products/ hoặc hỏi AI!
