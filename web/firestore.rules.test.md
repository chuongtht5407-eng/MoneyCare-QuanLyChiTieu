# 🧪 Kịch Bản Kiểm Thử Firestore Security Rules (Firebase Rules Playground)

Tài liệu này hướng dẫn chạy **6 ca kiểm định bảo mật** trên công cụ **Rules Playground** trong Firebase Console (mục *Firestore Database* -> tab *Rules* -> nút *Rules Playground*).

---

## 📋 Danh Sách 6 Ca Kiểm Thử

### Ca 1: Người dùng chưa đăng nhập cố tình đọc dữ liệu
- **Mục tiêu**: Đảm bảo từ chối mọi truy cập trái phép khi chưa qua xác thực (`request.auth == null`).
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `get`
  - **Location**: `/users/user_123`
  - **Authentication**: `Off` (Unauthenticated)
- **Kết quả mong đợi**: ❌ **Denied** (Bị từ chối).

---

### Ca 2: Người dùng A cố tình đọc hoặc sửa thông tin của người dùng B
- **Mục tiêu**: Đảm bảo nguyên tắc cô lập dữ liệu người dùng (`request.auth.uid == userId`).
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `get` (hoặc `update`)
  - **Location**: `/users/user_B`
  - **Authentication**: `On`
  - **Firebase UID**: `user_A`
- **Kết quả mong đợi**: ❌ **Denied** (Bị từ chối vì `user_A` khác `user_B`).

---

### Ca 3: Người dùng A cố tình xóa giao dịch của người dùng B
- **Mục tiêu**: Ngăn chặn hành vi can thiệp trái phép vào subcollection của tài khoản khác.
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `delete`
  - **Location**: `/users/user_B/transactions/tx_999`
  - **Authentication**: `On`
  - **Firebase UID**: `user_A`
- **Kết quả mong đợi**: ❌ **Denied** (Bị từ chối).

---

### Ca 4: Người dùng hợp lệ gửi giao dịch có số tiền <= 0 hoặc sai loại giao dịch
- **Mục tiêu**: Kiểm tra tính hợp lệ về kiểu và miền giá trị của giao dịch (`amount > 0`, `type in ['income', 'expense']`).
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `create`
  - **Location**: `/users/user_A/transactions/tx_new`
  - **Authentication**: `On`
  - **Firebase UID**: `user_A`
  - **Document data (JSON)**:
    ```json
    {
      "type": "invalid_type",
      "amount": -50000,
      "date": "2026-11-10",
      "categoryName": "Ăn uống"
    }
    ```
- **Kết quả mong đợi**: ❌ **Denied** (Bị từ chối do `type` không hợp lệ và `amount <= 0`).

---

### Ca 5: Người dùng hợp lệ cố tình đặt tên hiển thị (displayName) vượt quá 50 ký tự
- **Mục tiêu**: Kiểm tra ràng buộc độ dài tên hồ sơ (`displayName.size() <= 50`).
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `update`
  - **Location**: `/users/user_A`
  - **Authentication**: `On`
  - **Firebase UID**: `user_A`
  - **Document data (JSON)**:
    ```json
    {
      "displayName": "Tên này rất dài và vượt quá năm mươi ký tự cho phép của hệ thống MoneyCare quản lý tài chính cá nhân"
    }
    ```
- **Kết quả mong đợi**: ❌ **Denied** (Bị từ chối do vượt quá 50 ký tự).

---

### Ca 6: Chủ sở hữu hợp lệ ghi dữ liệu giao dịch đúng chuẩn
- **Mục tiêu**: Đảm bảo các giao dịch hợp lệ của chính chủ tài khoản được phép lưu thành công.
- **Cấu hình trên Rules Playground**:
  - **Simulation type**: `create`
  - **Location**: `/users/user_A/transactions/tx_valid_01`
  - **Authentication**: `On`
  - **Firebase UID**: `user_A`
  - **Document data (JSON)**:
    ```json
    {
      "type": "expense",
      "amount": 45000,
      "date": "2026-11-10",
      "categoryId": "food",
      "categoryName": "Ăn sáng bánh mì",
      "note": "Mua tại căng tin",
      "createdAt": "2026-11-10T08:00:00.000Z"
    }
    ```
- **Kết quả mong đợi**: ✅ **Allowed** (Được phép thành công).
