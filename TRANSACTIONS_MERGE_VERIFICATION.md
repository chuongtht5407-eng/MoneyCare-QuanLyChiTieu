# 🔍 TRANSACTIONS MERGE VERIFICATION & DISCREPANCY REPORT

**Dự án:** MoneyCare – Ứng dụng Quản lý Chi tiêu Cá nhân  
**Người kiểm tra:** Senior React & Git Integration Engineer (Người 1)  
**Nhánh kiểm tra:** `main`  
**Ngày kiểm tra:** Tháng 11/2026  

---

## 1. KIỂM TRA TRẠNG THÁI GIT & LOCAL MAIN
- **Branch hiện tại:** `main`
- **Commit local & `origin/main` mới nhất:** `dac5b9a` (Merge pull request từ `origin/feature/transactions`).
- **Trạng thái đồng bộ:** Local `main` đã được pull cập nhật hoàn toàn đồng bộ với `origin/main` bằng lệnh `git pull origin main`.

---

## 2. ĐỐI CHƯỚNG GIỮA BÁO CÁO BÀN GIAO (`MODULE_2_HANDOVER.md`) VÀ SOURCE CODE THỰC TẾ

Sau khi kiểm tra trực tiếp mã nguồn trong `main`, chúng ta phát hiện một sự lệch pha quan trọng: **Người 2 đã viết báo cáo bàn giao dựa trên các tính năng dự kiến (planned features), nhưng mã nguồn thực tế được commit lên GitHub (`dac5b9a`) mới chỉ hoàn thành phần cốt lõi (baseline CRUD), dẫn đến việc một số tính năng nâng cao chưa xuất hiện trên ứng dụng.**

### Bảng đối chiếu chi tiết:

| Tính năng trong báo cáo bàn giao | Tình trạng thực tế trong Source Code (`main`) | Nguyên nhân / Giải thích |
|---|---|---|
| **12 danh mục** (8 chi tiêu, 4 thu nhập) | ❌ **Chưa có đủ** (Chỉ có 6 danh mục trong `categoryService.ts`) | Code commit chỉ có 5 chi tiêu (`food`, `shopping`, `transport`, `rent`, `entertainment`) và 1 thu nhập (`salary`). |
| **Bộ chọn tháng trước/sau** (chuyển năm 12/2026 ↔ 01/2027) | ❌ **Chưa có** (Giao diện cố định chuỗi cứng `'Tháng 11/2026'`) | Các nút `<` và `>` trên `TransactionHistoryPage.tsx` chưa được gắn sự kiện `onClick` và state thay đổi tháng. |
| **Tìm kiếm tiếng Việt không dấu** (`removeVietnameseTones`) | ❌ **Chưa có** (Dùng cơ bản `.toLowerCase().includes(...)`) | Hàm chuyển đổi Unicode chưa được tích hợp vào bộ lọc tìm kiếm của History. |
| **CRUD Giao dịch & Validation** | ✅ **Đã có & Hoạt động tốt** | Thêm, sửa, xóa, chống double-click (`isSubmitting`), phân lập UID hoạt động chuẩn xác. |
| **Unit Tests tự động** | ✅ **Đã có** (`transactionService.test.ts` & `transactionHistoryAndForm.test.ts`) | Đã tồn tại trong source code. |

---

## 3. NGUYÊN NHÂN CHÍNH XÁC CỦA LỖI
1. **Lệch pha giữa Document và Code commit:** Tệp `MODULE_2_HANDOVER.md` liệt kê các tính năng "sẽ có / thiết kế hoàn chỉnh", nhưng nhánh `feature/transactions` khi đẩy lên GitHub thiếu các đoạn code triển khai chi tiết cho phần mở rộng danh mục và điều hướng tháng.
2. **Hardcoded UI state:** Trang lịch sử giao dịch đang sử dụng state tĩnh `const [currentMonth] = useState('Tháng 11/2026')` nên không phản hồi thao tác bấm chuyển tháng.

---

## 4. KẾT QUẢ BUILD & KIỂM THỬ
- **Lệnh thực thi:** `npm run build`
- **Kết quả:** **Thành công 100%** (0 lỗi TypeScript, 0 lỗi biên dịch Vite). Do code hiện tại chỉ thiếu các tính năng mở rộng giao diện (chưa code), TypeScript không phát hiện lỗi biên dịch.

---

## 5. HƯỚNG XỬ LÝ TIẾP THEO (ACTION PLAN)

Để đưa ứng dụng khớp hoàn toàn với kỳ vọng và báo cáo bàn giao của Người 2, chúng ta sẽ thực hiện bản bổ sung tối thiểu (minimal fix) ngay trên nhánh `main`:
1. **Cập nhật `categoryService.ts`**: Bổ sung đầy đủ 8 danh mục chi tiêu và 4 danh mục thu nhập kèm icon chuẩn.
2. **Cập nhật `TransactionHistoryPage.tsx`**: Thêm state quản lý tháng/năm, viết hàm xử lý sự kiện bấm nút `<` và `>` để chuyển đổi tháng/năm linh hoạt, đồng thời bổ sung hàm khử dấu tiếng Việt cho ô tìm kiếm.
3. Không làm ảnh hưởng đến Firebase Auth, Firestore schema hay các module của Người 1 và Người 3.
