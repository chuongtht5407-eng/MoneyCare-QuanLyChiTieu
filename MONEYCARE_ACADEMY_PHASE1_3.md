# 🎓 MONEYCARE ACADEMY – BÁO CÁO BÀN GIAO PHASE 1.3 (FIRESTORE PROGRESS, XP, LEVEL & STREAK)

**Dự án:** MoneyCare – Ứng dụng Quản lý Chi tiêu Cá nhân  
**Tính năng nâng cấp:** Phase 1.3 - Lưu tiến độ học tập trên Firestore, tích lũy XP, tính Level & chuỗi ngày học Streak  
**Tác giả:** Senior React & Firebase Engineer  
**Ngày hoàn thành:** Tháng 11/2026  

---

## 1. CÁC TỆP ĐÃ TẠO MỚI VÀ CHỈNH SỬA

| STT | Đường dẫn tệp | Loại thao tác | Mô tả chức năng |
|:---:|---|:---:|---|
| 1 | `web/src/services/academyService.ts` | **Tạo mới** | Dịch vụ quản lý tiến độ Academy (`fetchAcademyProgress`, `submitDailyQuiz`, `calculateLevelInfo`, `calculateNewStreak`) tích hợp Firestore Transaction & Local Cache. |
| 2 | `web/src/services/academyService.test.ts` | **Tạo mới** | Unit tests kiểm thử công thức Level, logic Streak và cơ chế chống cộng XP trùng. |
| 3 | `web/src/pages/AcademyPage.tsx` | **Cập nhật** | Hiển thị trình độ Cấp Level, thanh tiến độ XP, chuỗi Streak 🔥, xử lý submit câu hỏi +20 XP và thông báo nhận điểm thưởng lần đầu. |
| 4 | `web/src/pages/DashboardPage.tsx` | **Cập nhật** | Thẻ MoneyCare Academy hiển thị Cấp Level, tổng XP và chuỗi Streak thực tế của người dùng. |
| 5 | `web/firestore.rules` | **Cập nhật** | Security Rules bảo vệ subcollection `academy` và `academyDaily` theo `request.auth.uid`. |

---

## 2. CẤU TRÚC LƯU TRỮ FIRESTORE CỦA ACADEMY

Dữ liệu được lưu trữ phân lập theo `userId` người dùng trên Firestore:

```text
users/{userId}
  ├── academy/progress (Document)
  │     ├── totalXP: number (e.g. 120)
  │     ├── currentStreak: number (e.g. 3)
  │     ├── longestStreak: number (e.g. 5)
  │     ├── lastCompletedDate: string ("YYYY-MM-DD")
  │     └── updatedAt: ISO Date String
  │
  └── academyDaily/{dateKey} (Document e.g. "2026-11-15")
        ├── dateKey: string ("YYYY-MM-DD")
        ├── questionId: string
        ├── selectedAnswerId: 'A' | 'B' | 'C'
        ├── isCorrect: boolean
        ├── completed: boolean (true)
        ├── earnedXP: number (20)
        └── completedAt: ISO Date String
```

---

## 3. CÔNG THỨC TOÁN HỌC & QUY TẮC NGHIỆP VỤ

1. **Thưởng XP**:
   - Hoàn thành câu hỏi hằng ngày: **+20 XP**.
   - Trả lời sai vẫn nhận được +20 XP cho nỗ lực học tập.
2. **Công thức tính Level**:
   $$\text{Level} = \left\lfloor \frac{\text{Total XP}}{100} \right\rfloor + 1$$
   - Cấp 1: 0–99 XP (Tiến độ: $\text{Total XP} \pmod{100} / 100 \times 100\%$).
   - Cấp 2: 100–199 XP.
   - Cấp 3: 200–299 XP.
3. **Công thức tính Streak (Chuỗi ngày học liên tiếp)**:
   - Ngày đầu tiên hoàn thành: `currentStreak = 1`.
   - Hoàn thành ngày kế tiếp (`lastCompletedDate == yesterday`): `currentStreak = currentStreak + 1`.
   - Hoàn thành lại trong cùng ngày (`lastCompletedDate == today`): `currentStreak` giữ nguyên.
   - Bỏ lỡ ngày học (`lastCompletedDate < yesterday`): `currentStreak = 1`.

---

## 4. CƠ CHẾ CHỐNG CỘNG XP TRÙNG (ANTI-DOUBLE XP CLAIM)

- Hệ thống thực hiện kiểm tra bằng **Firestore Transaction**:
  1. Đọc tệp `academyDaily/{dateKey}`.
  2. Nếu tệp đã tồn tại với trạng thái `completed == true`, từ chối phát thưởng và trả về `isFirstSubmission = false` (Earned XP = 0).
  3. Chỉ cộng +20 XP cho lần hoàn thành đầu tiên của ngày.
- Khi người dùng bấm "Thử lại (Ôn tập)", ứng dụng cho phép làm lại câu hỏi để ôn kiến thức nhưng không phát thêm XP hay thay đổi kết quả đầu tiên đã lưu.

---

## 5. FIRESTORE SECURITY RULES

Đã cập nhật quy tắc bảo mật trong tệp `web/firestore.rules`:
```rules
match /academy/{docId} {
  allow read, delete: if request.auth != null && request.auth.uid == userId;
  allow create, update: if request.auth != null
    && request.auth.uid == userId
    && request.resource.data.totalXP is number
    && request.resource.data.totalXP >= 0;
}

match /academyDaily/{dateKey} {
  allow read, delete: if request.auth != null && request.auth.uid == userId;
  allow create, update: if request.auth != null
    && request.auth.uid == userId
    && request.resource.data.earnedXP is number
    && request.resource.data.earnedXP >= 0;
}
```

---

## 6. KẾT QUẢ KIỂM THỬ KỸ THUẬT BẮT BUỘC

1. **Production Build (`npm run build`)**: ✅ **SUCCESS 100%** (`built in 7.36s`, **0 lỗi TypeScript**, **0 lỗi Vite**).
2. **Unit Test Suites (`npm test`)**: ✅ **PASSED 100% (5/5 test suites passed)**:
   - `finance.test.ts`: PASSED
   - `financeContextBuilder.test.ts`: PASSED
   - `aiConversationService.test.ts`: PASSED
   - `academyQuestions.test.ts`: PASSED
   - `academyService.test.ts`: PASSED (Đã kiểm thử công thức Level, Streak, Anti-double XP claim).
3. **Bảo tồn tính năng MoneyCare AI**:
   - Giữ nguyên 100% mô hình Gemini AI, Firebase AI Logic, App Check, Lịch sử trò chuyện AI và các tính năng thu chi tài chính.
4. **Quy tắc Git**: **KHÔNG** tự động commit, **KHÔNG** push GitHub hay tạo Pull Request.
