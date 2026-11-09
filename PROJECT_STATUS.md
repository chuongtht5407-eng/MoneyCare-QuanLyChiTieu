# 📱 MONEYCARE – MASTER DEVELOPMENT PROJECT STATUS

Dự án **MoneyCare** – Web App Quản Lý Chi Tiêu Cá Nhân chuẩn Figma Mobile App Design.

---

## 🗂️ Cấu Trúc Dự Án (Architecture & File Breakdown)

```text
web/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Root component
│   │   ├── router.tsx               # React Router config với đầy đủ 12 routes
│   │   └── ProtectedRoute.tsx       # Bằng chứng bảo vệ tài khoản người dùng
│   │
│   ├── pages/                       # ĐỦ 12 MÀN HÌNH TÁCH BIỆT THEO YÊU CẦU
│   │   ├── SplashPage.tsx           # 1. Splash Screen khởi động
│   │   ├── Onboarding1Page.tsx      # 2. Onboarding 1 - Kiểm soát chi tiêu
│   │   ├── Onboarding2Page.tsx      # 3. Onboarding 2 - Thiết lập ngân sách
│   │   ├── Onboarding3Page.tsx      # 4. Onboarding 3 - Thống kê trực quan
│   │   ├── LoginPage.tsx            # 5. Đăng nhập
│   │   ├── RegisterPage.tsx         # 6. Đăng ký tài khoản
│   │   ├── DashboardPage.tsx        # 7. Trang chủ Dashboard
│   │   ├── TransactionFormPage.tsx  # 8. Thêm / Chỉnh sửa giao dịch
│   │   ├── TransactionHistoryPage.tsx # 9. Lịch sử & Tìm kiếm giao dịch
│   │   ├── AnalyticsPage.tsx        # 10. Thống kê biểu đồ (Bar & Donut)
│   │   ├── BudgetPage.tsx           # 11. Quản lý & Thiết lập ngân sách
│   │   └── ProfilePage.tsx          # 12. Trang cá nhân & Đăng xuất
│   │
│   ├── components/
│   │   ├── common/                  # Component UI cơ bản dùng chung
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/
│   │   │   ├── PageHeader.tsx
│   │   │   └── BottomNavigation.tsx
│   │   └── finance/                 # Component biểu đồ & tài chính
│   │       ├── FinanceBarChart.tsx
│   │       └── ExpenseDonutChart.tsx
│   │
│   ├── services/                    # Tầng xử lý Firebase & Storage
│   │   ├── authService.ts           # Xử lý Đăng ký / Đăng nhập / Đăng xuất / Reset Pass
│   │   ├── transactionService.ts    # CRUD giao dịch với Firestore & LocalStorage fallback
│   │   ├── budgetService.ts         # Quản lý ngân sách với Firestore & LocalStorage fallback
│   │   └── categoryService.ts       # Quản lý danh mục thu/chi
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   └── useBudgets.ts
│   │
│   ├── lib/
│   │   └── firebase.ts              # Khởi tạo Firebase SDK (Auth & Firestore)
│   │
│   ├── types/                       # TypeScript Data Models
│   │   ├── auth.ts
│   │   ├── transaction.ts
│   │   ├── category.ts
│   │   └── budget.ts
│   │
│   └── utils/
│       └── finance.ts               # Các hàm tính toán số dư, thu/chi, % ngân sách
│
├── firestore.rules                  # Quy tắc bảo mật Firestore (Mỗi UID chỉ đọc/ghi dữ liệu của chính mình)
└── .env.example                     # File mẫu biến môi trường Firebase
```

---

## 📋 Trạng Thái 12 Màn Hình & Tính Năng

| # | Màn Hình / Tính Năng | File Tương Ứng | Trạng Thái | Ghi Chú |
|---|---|---|---|---|
| 1 | **Splash Screen** | `SplashPage.tsx` | **Hoàn thành** | Nền tím gradient, logo SVG, tự chuyển trang theo auth |
| 2 | **Onboarding 1** | `Onboarding1Page.tsx` | **Hoàn thành** | 3D Wallet illustration, nút Bỏ qua & Tiếp theo |
| 3 | **Onboarding 2** | `Onboarding2Page.tsx` | **Hoàn thành** | 3D Chart & Target illustration |
| 4 | **Onboarding 3** | `Onboarding3Page.tsx` | **Hoàn thành** | 3D Donut illustration, nút Bắt đầu ngay |
| 5 | **Login** | `LoginPage.tsx` | **Hoàn thành** | Firebase Auth / Local fallback, khôi phục mật khẩu |
| 6 | **Register** | `RegisterPage.tsx` | **Hoàn thành** | Đăng ký tài khoản mới & khởi tạo Firestore user doc |
| 7 | **Dashboard** | `DashboardPage.tsx` | **Hoàn thành** | Header, Số dư hiện tại (bật/tắt mắt), Thu/Chi, Ngân sách |
| 8 | **Thêm/Sửa Giao dịch** | `TransactionFormPage.tsx` | **Hoàn thành** | Tab Thu/Chi, phím tiền nhanh (50k..1M), chọn danh mục, xóa |
| 9 | **Lịch sử Giao dịch** | `TransactionHistoryPage.tsx` | **Hoàn thành** | Tìm kiếm, lọc theo loại, chọn tháng, gom nhóm theo ngày |
| 10 | **Thống kê** | `AnalyticsPage.tsx` | **Hoàn thành** | Biểu đồ cột thu/chi & Biểu đồ donut phân bổ chi tiêu |
| 11 | **Ngân sách** | `BudgetPage.tsx` | **Hoàn thành** | Thiết lập hạn mức tổng & hạn mức từng danh mục, cảnh báo 80%-100% |
| 12 | **Cá nhân** | `ProfilePage.tsx` | **Hoàn thành** | Thông tin tài khoản, đơn vị VND, đồng bộ & Đăng xuất thật |

---

## 🔒 Cấu Hình & Bảo Mật Firebase

1. **Firebase Configuration**:
   - File `.env.example` chứa các biến `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, v.v.
   - Khi chưa điền biến môi trường vào `.env.local`, ứng dụng tự động chạy ở chế độ **Offline / Local Storage Fallback** mượt mà.
   - Khi điền biến môi trường vào `.env.local`, ứng dụng kết nối trực tiếp **Firebase Auth & Cloud Firestore**.

2. **Security Rules (`firestore.rules`)**:
   - Áp dụng quy tắc phân quyền nghiêm ngặt: Mỗi người dùng chỉ truy cập được tài liệu `users/{userId}` khớp với UID của chính họ.

---

## ⚡ Kết Quả Kiểm Thử (Verification & Testing)

1. **Automated Unit Tests**: `npx tsx src/utils/finance.test.ts`
   - ✅ `totalIncome` = 10.000.000 đ
   - ✅ `totalExpense` = 2.900.000 đ
   - ✅ `currentBalance` = 7.100.000 đ
   - ✅ `budgetUsagePercentage` = 96.7%
   - ✅ `formatCurrency` = "7.100.000 đ"

2. **Production Build**: `npm run build`
   - ✅ Build thành công 100% (0 lỗi TypeScript, 0 warning bundler).

---

## 🚀 Hướng Dẫn Chạy Dự Án

```bash
cd web
npm install
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173/**
