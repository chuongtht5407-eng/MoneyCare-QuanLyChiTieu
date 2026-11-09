# 📱 MoneyCare – Quản Lý Chi Tiêu Cá Nhân (Web App Mobile UI)

Dự án **MoneyCare** – Giai đoạn 1 (Phase 1): Phát triển giao diện Web App Mobile trên trình duyệt sử dụng React, TypeScript, Vite, React Router và Tailwind CSS.

---

## 🚀 Công Nghệ Sử Dụng

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Icons**: Lucide React
- **Font**: Be Vietnam Pro (Google Fonts)

---

## 🛠️ Hướng Dẫn Chạy Dự Án Trên Máy Khác

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0.0 trở lên (đã kiểm thử thành công trên Node v26.13.0).
- **npm**: Phiên bản 9.0.0 trở lên.

### 2. Cài đặt các thư viện
Mở Terminal / Command Prompt tại thư mục `web`:
```bash
cd web
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Màn hình Terminal sẽ hiển thị địa chỉ local server của Vite, ví dụ:
```text
  VITE v6.1.0  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Mở trình duyệt Google Chrome hoặc Microsoft Edge và truy cập địa chỉ `http://localhost:5173/`.

### 4. Kiểm thử tính toán tài chính
Chạy lệnh kiểm thử đơn vị tự động cho các hàm tính toán thu/chi/số dư/ngân sách:
```bash
npx tsx src/utils/finance.test.ts
```

### 5. Build bản Production
```bash
npm run build
```
Sản phẩm đóng gói lưu trữ tại thư mục `dist/`.

---

## 📌 Các Màn Hình Đã Hoàn Thành (Phase 1)

1. **Khởi động (`/splash`)**:
   - Giao diện nền tím gradient chuẩn Figma với logo chữ 'M' cách điệu và các đường sóng lavender.
   - Tự động chuyển hướng sang trang chủ `/home` sau khoảng 1.9s.

2. **Trang chủ Dashboard (`/home`)**:
   - **Header**: Avatar người dùng "Minh Hùng 👋" và chuông thông báo.
   - **Thẻ Số dư hiện tại**: Hiển thị `7.100.000 đ`, hỗ trợ bấm icon mắt để ẩn/hiện số dư (`•••••••• đ`).
   - **Thẻ Thu nhập & Chi tiêu**: Thu nhập `10.000.000 đ` (xanh) và Chi tiêu `2.900.000 đ` (đỏ).
   - **Ngân sách tháng**: Hạn mức `3.000.000 đ`, đã chi `2.900.000 đ` (chiếm `96.7%`), thanh tiến độ tím tự động tính toán.
   - **Giao dịch gần đây**: 3 giao dịch mới nhất (Ăn uống, Mua sắm, Di chuyển).
   - **Thanh điều hướng đáy (Bottom Navigation)**: 5 icon với nút bấm (+) nổi bật ở giữa. Cảnh báo thông báo toast đối với các tính năng thuộc Phase 2.
