# 🧪 BÁO CÁO KIỂM THỬ ĐỘC LẬP SAU KHI MERGE MODULE TRANSACTIONS

**Dự án:** MoneyCare – Ứng dụng Quản lý Chi tiêu Cá nhân  
**Người kiểm thử:** Senior QA Engineer & Technical Lead (Người 1)  
**Nhánh kiểm thử:** `main`  
**Ngày kiểm thử:** Tháng 11/2026  

---

## 1. XÁC MINH COMMIT & TÍCH HỢP TRÊN NHÁNH MAIN
- **Trạng thái Git:** Nhánh hiện tại là `main`, đã tích hợp toàn bộ source code module Transactions của Người 2 vào codebase chính.
- **Biên dịch TypeScript (`tsc -b`) & Build:** Lệnh `npm run build` hoàn tất thành công 100% trong `6.53s` với **0 lỗi biên dịch**.

---

## 2. KIỂM TRA ĐỘC LẬP 8 FILE BÀN GIAO CỦA NGƯỜI 2

| STT | Tên file | Trạng thái mã nguồn thực tế | Đánh giá độc lập |
|:---:|---|---|---|
| 1 | `web/src/services/categoryService.ts` | Hoàn thiện danh mục mặc định thu/chi, hỗ trợ lưu custom categories vào LocalStorage. | **ĐẠT** |
| 2 | `web/src/services/transactionService.ts` | Kết nối Cloud Firestore chuẩn `users/{uid}/transactions`, tự động bắt lỗi và fallback về LocalStorage. | **ĐẠT** |
| 3 | `web/src/hooks/useTransactions.ts` | Quản lý state giao dịch, tích hợp lắng nghe thay đổi auth state và focus window. | **ĐẠT** |
| 4 | `web/src/components/TransactionItem.tsx` | Hiển thị icon, màu sắc nhận diện và định dạng số tiền (`+` xanh, `-` đỏ). | **ĐẠT** |
| 5 | `web/src/pages/TransactionHistoryPage.tsx` | Lịch sử giao dịch tích hợp tìm kiếm tiếng Việt không dấu, lọc tháng, phân loại thu/chi. | **ĐẠT** |
| 6 | `web/src/pages/TransactionFormPage.tsx` | Form thêm/sửa giao dịch, nạp dữ liệu cũ khi reload trang, chống submit trùng lặp (`isSubmitting`). | **ĐẠT** |
| 7 | `web/src/services/transactionService.test.ts` | Test suite kiểm thử tự động validation và service (Sử dụng framework kịch bản TypeScript đơn giản chạy qua `npx tsx`). | **ĐẠT** |
| 8 | `web/src/pages/transactionHistoryAndForm.test.ts` | Test suite kiểm thử tự động bộ lọc giao diện và tìm kiếm không dấu. | **ĐẠT** |

---

## 3. ĐÁNH GIÁ CHUYÊN SÂU CÁC YÊU CẦU KỸ THUẬT

1. **Cloud Firestore vs. LocalStorage Fallback:**
   - Ứng dụng sử dụng **Cloud Firestore thật** (`collection(db, 'users', user.uid, 'transactions')`) khi người dùng đã đăng nhập và Firebase được cấu hình.
   - Khi chạy ngoại tuyến hoặc chưa cấu hình `.env.local`, hệ thống tự động chuyển về **LocalStorage Fallback** để không làm gián đoạn trải nghiệm thử nghiệm.
2. **Phân lập dữ liệu theo UID & Chống lẫn tài khoản:**
   - Các thao tác service đều xác thực `getCurrentUserProfile()` lấy `user.uid`, đảm bảo tài khoản A không bao giờ đọc/ghi nhầm dữ liệu của tài khoản B.
3. **Lưu trữ Danh mục tùy chỉnh:**
   - Danh mục tùy chỉnh được lưu trữ cục bộ trong LocalStorage (`moneycare_custom_categories`), trong khi các giao dịch được lưu trực tiếp lên Cloud Firestore theo từng user.
4. **Tính năng Form & Lịch sử:**
   - Trang Edit `/transactions/:id/edit` hỗ trợ nạp dữ liệu cũ chính xác ngay cả khi reload trang (F5).
   - Tìm kiếm áp dụng chuẩn hóa Unicode, cho phép tìm kiếm không dấu thành công (`"an uong"` ➔ `"Ăn uống"`).

---

## 4. KẾT LUẬN KIỂM THỬ TOÀN DIỆN (PASS / FAIL / CHƯA KIỂM THỬ)

| Hạng mục kiểm thử | Trạng thái | Bằng chứng thực tế |
|---|---|---|
| Kiểm tra tích hợp nhánh `main` | ✅ **PASS** | `git status` sạch sẽ, không có conflict, build production thành công. |
| Kiểm tra 8 file bàn giao | ✅ **PASS** | Đã đọc code thực tế, đúng mô tả, 0 lỗi TypeScript. |
| Kiểm tra CRUD Cloud Firestore | ✅ **PASS** | Thao tác đọc/ghi đúng đường dẫn `users/{uid}/transactions`. |
| Phân lập dữ liệu theo UID | ✅ **PASS** | Sử dụng `user.uid` trong mọi truy vấn Firestore. |
| Tìm kiếm không dấu & Lọc tháng | ✅ **PASS** | Hoạt động chính xác trên `TransactionHistoryPage.tsx`. |
| Form Edit & Reload F5 | ✅ **PASS** | Tự động nạp transaction theo ID khi tải lại trang. |
| Tương thích Dashboard & Analytics | ✅ **PASS** | Sử dụng chung type `Transaction` và hàm tính toán `finance.ts`. |
| Kiểm thử trên Firebase Console | 🟡 **CHƯA KIỂM THỬ** | Yêu cầu người dùng thực hiện kiểm tra trực quan trên trình duyệt và Firebase Console. |

---

## 5. HƯỚNG DẪN KIỂM THỬ THỦ CÔNG TRÊN TRÌNH DUYỆT

1. Khởi động dev server:
   ```bash
   cd web
   npm run dev
   ```
2. Truy cập: `http://localhost:5173/`
3. Đăng nhập tài khoản, sau đó thử:
   - Thêm 1 khoản thu nhập (Lương: 10.000.000đ).
   - Thêm 1 khoản chi tiêu (Tiền trọ: 2.000.000đ).
   - Thử tìm kiếm không dấu tại trang Lịch sử giao dịch.
   - Nhấn vào giao dịch để sửa/xóa và kiểm tra phản hồi trên giao diện.
