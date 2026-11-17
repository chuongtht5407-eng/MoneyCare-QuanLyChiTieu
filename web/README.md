# 📱 MoneyCare – Quản Lý Chi Tiêu Cá Nhân (Web App Mobile UI)

Dự án **MoneyCare** – Giai đoạn 1 (Phase 1): Phát triển giao diện Web App Mobile trên trình duyệt sử dụng React, TypeScript, Vite, React Router, Tailwind CSS và Firebase (Auth + Firestore).

---

## 🚀 Công Nghệ Sử Dụng

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Backend / Cloud**: Firebase Auth & Cloud Firestore (hỗ trợ Local Storage Fallback ngoại tuyến)
- **Icons**: Lucide React
- **Font**: Be Vietnam Pro (Google Fonts)

---

## 🔥 Cấu Hình Firebase (Hướng Dẫn Thiết Lập)

Hệ thống hỗ trợ cả chế độ đám mây (Firebase) và chế độ ngoại tuyến (Local Storage Fallback). Để kết nối với Firebase của bạn, vui lòng thực hiện các bước sau:

### 1. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và nhấn **Add project** (Tạo dự án mới, ví dụ: `moneycare`).
2. Chọn hoặc bỏ qua Google Analytics theo nhu cầu.

### 2. Kích hoạt Authentication
1. Tại menu bên trái, chọn **Build** -> **Authentication**.
2. Nhấn **Get Started**, chọn tab **Sign-in method**.
3. Chọn provider **Email/Password** -> Bật (Enable) tùy chọn **Email/Password** -> Nhấn **Save**.

### 3. Khởi tạo Cloud Firestore Database
1. Tại menu bên trái, chọn **Build** -> **Firestore Database** -> **Create database**.
2. Chọn vị trí lưu trữ máy chủ (ví dụ: `asia-southeast1` - Singapore) -> Chọn chế độ **Production mode**.

### 4. Công bố Security Rules (Publish Rules)
1. Trong Firestore Database, chuyển sang tab **Rules**.
2. Sao chép toàn bộ nội dung từ file [`web/firestore.rules`](./firestore.rules) và dán vào trình soạn thảo Rules.
3. Nhấn **Publish** để áp dụng bộ quy tắc bảo mật. (Có thể kiểm tra lại qua hướng dẫn [`web/firestore.rules.test.md`](./firestore.rules.test.md)).

### 5. Tạo file cấu hình môi trường `.env.local`
1. Đăng ký Web App trong project settings của Firebase Console để lấy thông số cấu hình.
2. Tạo file `web/.env.local` (nằm trong thư mục `web/`) với 6 biến môi trường như sau:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **LƯU Ý AN TOÀN QUAN TRỌNG:**
> - Tuyệt đối **KHÔNG** commit file `.env.local` lên Git repository. File này đã được thêm vào `.gitignore`.
> - Không chia sẻ file chứa API keys thực tế lên các diễn đàn công khai.

---

## 🛠️ Hướng Dẫn Chạy Dự Án

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0.0 trở lên.
- **npm**: Phiên bản 9.0.0 trở lên.

### 2. Cài đặt các thư viện
Mở Terminal tại thư mục `web`:
```bash
cd web
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Màn hình Terminal sẽ hiển thị địa chỉ local server:
```text
  ➜  Local:   http://localhost:5173/
```
Mở trình duyệt và truy cập `http://localhost:5173/`.

### 4. Kiểm thử tự động (Unit Tests)
Chạy kiểm thử đơn vị tài chính và ánh xạ lỗi xác thực tiếng Việt:
```bash
# Kiểm thử tính toán tài chính
npx tsx src/utils/finance.test.ts

# Kiểm thử thông điệp lỗi xác thực tiếng Việt
npx tsx src/utils/authErrors.test.ts
```

### 5. Build bản Production
```bash
npm run build
```
Sản phẩm đóng gói lưu trữ tại thư mục `dist/`.

---

## 📌 Các Màn Hình & Tính Năng Đã Hoàn Thành

1. **Khởi động (`/splash`)**:
   - Giao diện nền xanh UTH chuẩn Figma với logo chữ 'M' cách điệu.
   - Tự động kiểm tra phiên và chuyển hướng sau ~1.9s.

2. **Xác thực (`/login`, `/register`)**:
   - Đăng nhập, đăng ký tài khoản với Firebase Auth / Local fallback.
   - Báo lỗi tiếng Việt chuẩn xác (email đã dùng, sai mật khẩu, mật khẩu yếu...).
   - Tự động nhận diện phiên hết hạn với cảnh báo tiếng Việt.

3. **Hồ sơ cá nhân (`/profile`)**:
   - Hiển thị avatar, họ tên và email người dùng.
   - Hỗ trợ đổi tên hiển thị (DisplayName) đồng bộ Firestore & Auth.
   - Trạng thái sao lưu & đồng bộ trung thực (Cloud / Local / Degraded).
   - Đăng xuất tài khoản an toàn với dialog xác nhận.

4. **Trang chủ Dashboard (`/home`)**:
   - Thẻ Số dư hiện tại, Thu nhập & Chi tiêu, Ngân sách tháng, Giao dịch gần đây.
   - Tự động đồng bộ lại dữ liệu khi chuyển tab hoặc focus lại cửa sổ trình duyệt.

---

## 👤 Phần Người 1: Firebase, tài khoản và hệ thống

### 1. Phạm vi công việc phụ trách
- Quản lý tài khoản người dùng (Đăng ký, Đăng nhập, Đăng xuất, Đổi tên hiển thị).
- Xác thực tài khoản qua Firebase Authentication với thông báo lỗi tiếng Việt thân thiện.
- Tích hợp và lưu trữ dữ liệu người dùng, giao dịch, ngân sách trên Cloud Firestore.
- Quản lý trạng thái đồng bộ dữ liệu với 3 chế độ: Đám mây (Cloud), Ngoại tuyến (Local), Giảm cấp (Degraded).
- Thiết lập quy tắc bảo mật dữ liệu Firestore Security Rules (kiểm tra phân quyền và ràng buộc kiểu/giá trị dữ liệu).
- Bổ sung cấu hình `.gitignore` đảm bảo không push các file nhạy cảm và build artifact lên Git repository.

### 2. Danh sách file phụ trách chính
- `src/lib/firebase.ts`: Khởi tạo và cấu hình Firebase SDK (Auth & Firestore).
- `src/types/auth.ts`: Định nghĩa kiểu dữ liệu thông tin tài khoản người dùng (`UserProfile`).
- `src/utils/authErrors.ts` & `src/utils/authErrors.test.ts`: Ánh xạ mã lỗi Firebase Auth sang tiếng Việt & suite kiểm thử tự động.
- `src/services/authService.ts`: Xử lý nghiệp vụ xác thực (đăng nhập, đăng ký, đăng xuất, đổi tên hiển thị `updateUserDisplayName`, khôi phục mật khẩu).
- `src/services/syncStatus.ts` & `src/hooks/useSyncStatus.ts`: Xử lý và lắng nghe trạng thái đồng bộ đám mây / ngoại tuyến.
- `src/components/SyncBanner.tsx`: Thẻ thông báo trạng thái ngoại tuyến / sự cố kết nối đặt trong `MobileFrame`.
- `src/app/ProtectedRoute.tsx`: Route bảo vệ tài khoản, tự động điều hướng người dùng chưa đăng nhập về `/login`.
- `src/pages/LoginPage.tsx` & `src/pages/RegisterPage.tsx`: Màn hình đăng nhập/đăng ký với thông báo lỗi tiếng Việt và xử lý tham số `?expired=1`.
- `src/pages/ProfilePage.tsx`: Màn hình cá nhân với modal chỉnh sửa Họ và tên, hiển thị trạng thái đồng bộ thực tế.
- `firestore.rules` & `firestore.rules.test.md`: Quy tắc bảo mật dữ liệu Firestore và kịch bản 6 ca kiểm thử trên Rules Playground.
- `.gitignore` (root) & `web/.gitignore`: Cấu hình danh sách loại trừ không push lên Git.

### 3. Cấu hình biến môi trường `.env.local`
Tạo file `web/.env.local` chứa 6 biến môi trường bắt buộc sau (lấy từ Firebase Console):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 4. Cách chạy ứng dụng
```bash
cd web
npm install
npm run dev
```

### 5. Cấu trúc cơ sở dữ liệu Cloud Firestore
Dữ liệu được tổ chức theo kiến trúc phân quyền chuẩn chủ tài khoản:
- `users/{uid}`: Hồ sơ cá nhân người dùng (`displayName`, `email`, `createdAt`, `updatedAt`).
- `users/{uid}/transactions/{txId}`: Danh sách giao dịch thu/chi (`type`: 'income'|'expense', `amount` > 0, `date`: YYYY-MM-DD, `categoryId`, `categoryName`, `note`...).
- `users/{uid}/budgets/{monthYear}`: Cấu hình ngân sách theo tháng (`monthYear`: YYYY-MM, `totalLimit` >= 0, `categoryLimits`...).

### 6. Ba chế độ đồng bộ (Sync Modes)
- **Cloud (`cloud`)**: Kết nối Đám mây thành công. Dữ liệu được đồng bộ trực tiếp với Firebase Auth và Cloud Firestore.
- **Local (`local`)**: Chế độ ngoại tuyến khi chưa cấu hình Firebase hoặc chưa đăng nhập. Dữ liệu lưu an toàn trong `localStorage` trên thiết bị.
- **Degraded (`degraded`)**: Đã đăng nhập nhưng mất mạng hoặc sự cố Firestore. Hệ thống tự động chuyển sang lưu tạm ngoại tuyến và hiển thị `SyncBanner` cảnh báo mà không làm ngắt quãng trải nghiệm.

### 7. Cách thực hiện kiểm thử (Testing)
- **Kiểm thử tự động mã lỗi xác thực**: `npx tsx src/utils/authErrors.test.ts`
- **Kiểm thử tự động tính toán tài chính**: `npx tsx src/utils/finance.test.ts`
- **Kiểm thử Firestore Security Rules**: Thực hiện 6 ca kiểm thử trên Firebase Console Rules Playground dựa theo tài liệu hướng dẫn `firestore.rules.test.md`.

### 8. Danh sách file & thư mục KHÔNG push lên Git
- `node_modules/` & `web/node_modules/`
- `dist/` & `web/dist/`
- `.env.local` & `web/.env.local`
- `build/`
- `.gradle/`
- `.kotlin/`
- `.idea/`
- `local.properties`
- `*.log`

