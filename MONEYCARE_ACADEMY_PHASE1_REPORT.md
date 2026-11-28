# 🎓 BÁO CÁO TRIỂN KHAI PHASE 1 — MONEYCARE ACADEMY

**Dự án:** MoneyCare – Ứng dụng Quản lý Tài chính Cá nhân  
**Phạm vi:** Phase 1 — MoneyCare Academy: Trang tổng quan & Tab Hôm nay  
**Firebase Project ID:** `moneycare-2cde5`  
**Trạng thái:** Hoàn thành Phase 1, chờ người dùng kiểm tra giao diện thực tế trước khi triển khai Phase 2  

---

## 1. Hình ảnh tham khảo đã phân tích

Đã phân tích chi tiết cả 2 hình ảnh đính kèm:

- **Ảnh 1 (Bản thiết kế MoneyCare Academy gồm 10 màn hình):**
  - **Màn hình 1 – Trang Academy (Tổng quan):** Bố cục sáng với nền xanh nhạt/trắng, icon mũ tốt nghiệp xanh dương, linh vật **Ví Bé** đội mũ tốt nghiệp kèm bong bóng thoại động viên, thẻ tiến độ Cấp độ + thanh XP xanh dương, và lưới 3 thẻ chỉ số (Streak, Tổng XP, Thành tích/Kỷ lục).
  - **Màn hình 2 – Tab Hôm nay (Nhiệm vụ ngày):** Header trắng gọn có nút quay lại, tiêu đề `MoneyCare Academy`, dòng phụ `Cấp X • Y XP`, badge Streak màu cam bên phải; thanh 3 tab `Hôm nay | Lộ trình | Hồ sơ khó` gạch chân xanh dương; thẻ hero xanh dương nổi bật `"Nhiệm vụ hôm nay – Giữ ví an toàn 💪"` kèm hình Ví Bé góc phải; thẻ `"Tình huống hôm nay"` sáng nhẹ với nút CTA xanh dương `"Bắt đầu thử thách →"`.
  - **Màn hình 3 & 4 – Câu hỏi trắc nghiệm & Kết quả nhận XP:** Làm nguồn cảm hứng tinh chỉnh giao diện trả lời A/B/C và phản hồi kết quả cho hệ thống trắc nghiệm hằng ngày đang có (tái sử dụng 100%, không tạo hệ thống mới).
  - **Màn hình 5–10 (Lộ trình 90 ngày, Chi tiết bài học, Hồ sơ khó, Boss Battle 7 ngày với 200k, Gameplay ngày 1/7, Kết thúc thử thách):** Ghi nhận để giữ tính nhất quán cho các giai đoạn sau, **không** triển khai trong Phase 1.
- **Ảnh 2 (Giao diện Dashboard MoneyCare hiện tại):**
  - Đã có sẵn `MobileFrame` mô phỏng thanh trạng thái `9:41`, `BottomNavigation` với nút `(+)` nổi ở giữa, và thẻ `MoneyCare Academy` điều hướng tới `/academy` với nút `Bắt đầu học >`. Giữ nguyên hoàn toàn Dashboard và không thêm thanh trạng thái hay khung điện thoại thứ hai.

---

## 2. Giao diện Academy trước khi sửa

Trước khi nâng cấp Phase 1, tệp `web/src/pages/AcademyPage.tsx` (567 dòng) có các đặc điểm sau:

- Header sử dụng icon mũ tốt nghiệp nền **gradient tím** (`from-[#2F5BEA] to-[#8B5CF6]`), thanh tiến độ XP và banner nhiệm vụ ngày cũng dùng gradient tím chưa đồng nhất với bảng màu xanh dương MoneyCare của bản thiết kế.
- Chưa có linh vật **Ví Bé** và lời thoại động viên.
- Khu vực tổng quan chỉ có 1 thẻ tiến độ dạng text phẳng, chưa có lưới 3 thẻ chỉ số (Streak / Tổng XP / Kỷ lục) như Màn hình 1.
- Câu hỏi trắc nghiệm hiển thị trực tiếp toàn bộ đáp án ngay khi mở trang, chưa có bước thẻ giới thiệu `"Tình huống hôm nay"` với nút `"Bắt đầu thử thách →"` và danh sách nhiệm vụ rõ ràng như Màn hình 2.
- `useEffect` tải dữ liệu chỉ phụ thuộc `[dateKey]`, chưa lắng nghe thay đổi `user?.uid` từ `useAuth()`.

---

## 3. Giao diện sau khi sửa (Phase 1)

- **Academy Header (`AcademyHeader.tsx`):**
  - Nền trắng sạch, viền mảnh `#E8EAF0`, sticky top.
  - Đầy đủ: nút quay lại `<` về `/home`, icon mũ tốt nghiệp nền xanh nhạt `#EAF0FF` / icon `#2F5BEA` (đã loại bỏ hoàn toàn gradient tím), tiêu đề `MoneyCare Academy`, phụ đề động `Cấp {level} • {totalXP} XP`, và badge Streak màu cam (`🔥 {currentStreak} ngày`).
  - Thanh **3 tab bắt buộc** (`Hôm nay | Lộ trình | Hồ sơ khó`) dùng lưới `grid-cols-3` không tràn/cuộn ngang trên 375px–430px, gạch chân xanh dương `#2F5BEA` chuyển mượt 200ms.
- **Khu vực tổng quan & Linh vật Ví Bé (`AcademyOverviewCard.tsx` + `ViBeMascot.tsx`):**
  - Linh vật **Ví Bé** thiết kế bằng SVG nội bộ (không dùng API ngoài hay URL ảnh bên ngoài): chiếc ví xanh dương đội mũ tốt nghiệp, biểu cảm vui vẻ, đi kèm bong bóng lời thoại hài hước động viên (chạm vào Ví Bé hoặc bong bóng để đổi câu nói).
  - Thẻ tiến độ Level + thanh XP xanh dương `#2F5BEA` mượt mà hiển thị đúng dữ liệu thực `{xpInCurrentLevel} / {xpToNextLevel} XP`.
  - Lưới 3 thẻ chỉ số thực: **Streak** (`currentStreak ngày`), **Tổng XP** (`totalXP XP`), **Kỷ lục** (`longestStreak ngày`).
- **Tab Hôm nay (`TodayMissionTab.tsx`):**
  - **A. Thẻ nhiệm vụ hôm nay:** Card xanh dương MoneyCare (`#214CE0` → `#2F5BEA` → `#528BFF`), tiêu đề `"Nhiệm vụ hôm nay"`, `"Giữ ví an toàn 💪"`, mô tả ngắn, trạng thái `+20 XP` hoặc `Đã hoàn thành ✓` màu xanh lá, và linh vật Ví Bé góc phải.
  - **B. Tình huống hôm nay:** Tái sử dụng trực tiếp hệ thống câu hỏi hằng ngày thật (`getDailyQuestion` + `submitDailyQuiz` của `academyService.ts`), không tạo hệ thống câu hỏi song song hay thưởng XP giả. Khi bấm `"Bắt đầu thử thách"` (hoặc `"Xem lại & Ôn tập"`), mở khu vực trắc nghiệm A/B/C có thanh tiến độ `Câu 1 / 1`, gợi ý Ví Bé, xác nhận đáp án, giải thích chi tiết và mẹo tài chính.
  - **C. Danh sách nhiệm vụ:** Hiển thị trung thực đúng **1 nhiệm vụ tính XP thật** (`Trắc nghiệm tài chính hằng ngày`, `+20 XP`, trạng thái `0/1` hoặc `1/1 hoàn thành`, nút `Bắt đầu` / `Ôn tập`) — không tạo thêm nhiệm vụ giả. Giữ lại thẻ gợi ý thói quen `"Ghi chép tối thiểu 1 giao dịch"` (điều hướng `/transactions/new`) từ bản cũ và ghi rõ là `Thói quen gợi ý` (không gắn nhãn XP giả).
- **Tab Lộ trình & Tab Hồ sơ khó:** Giữ nguyên nội dung hiện có, giữ trạng thái học tập khi chuyển tab, chưa xây dựng gameplay mới.
- **Tương tác & Responsive:** Hỗ trợ `@media (prefers-reduced-motion: reduce)` trong `global.css`, bổ sung khoảng đệm đáy `pb-10` để `BottomNavigation` không che nội dung.

---

## 4. Các file đã tạo

| STT | Đường dẫn file | Vai trò |
|:---:|---|---|
| 1 | `web/src/components/academy/ViBeMascot.tsx` | Linh vật SVG **Ví Bé** (3 biến thể `hero`, `banner`, `compact`) và danh sách lời thoại vui. |
| 2 | `web/src/components/academy/AcademyHeader.tsx` | Header MoneyCare Academy + Streak badge cam + 3 tab `Hôm nay / Lộ trình / Hồ sơ khó`. |
| 3 | `web/src/components/academy/AcademyOverviewCard.tsx` | Khu vực lời chào Ví Bé, thanh tiến độ Level/XP động và lưới 3 thẻ Streak / Tổng XP / Kỷ lục. |
| 4 | `web/src/components/academy/TodayMissionTab.tsx` | Toàn bộ giao diện Tab Hôm nay (Thẻ nhiệm vụ xanh dương, Tình huống hôm nay gắn quiz thật, Danh sách nhiệm vụ). |
| 5 | `MONEYCARE_ACADEMY_PHASE1_REPORT.md` | Báo cáo nghiệm thu Phase 1 này. |

---

## 5. Các file đã chỉnh sửa

| STT | Đường dẫn file | Nội dung chỉnh sửa |
|:---:|---|---|
| 1 | `web/src/pages/AcademyPage.tsx` | Tái cấu trúc trang sử dụng các component Phase 1, bổ sung đồng bộ theo `user?.uid` từ `useAuth()`, giữ nguyên trạng thái học tập khi chuyển tab, bảo toàn tab `Lộ trình` & `Hồ sơ khó` và `BottomNavigation`. |
| 2 | `web/src/styles/global.css` | Thêm animation chuyển tab nhẹ (`academy-tab-enter`, `academy-fade-in`, ~200ms) và quy tắc `@media (prefers-reduced-motion: reduce)`. |

*Lưu ý: Không chỉnh sửa `DashboardPage.tsx`, `BottomNavigation.tsx`, `router.tsx`, `academyService.ts`, `academyQuestions.ts`, `firestore.rules` hay bất kỳ service AI/Auth/Transactions/Budget nào.*

---

## 6. Những component & module được tái sử dụng

- `MobileFrame` (`web/src/components/MobileFrame.tsx`) — tái sử dụng qua `router.tsx`, không tạo thêm khung điện thoại/status bar thứ hai.
- `BottomNavigation` (`web/src/components/BottomNavigation.tsx`) — giữ nguyên hoàn toàn 5 nút điều hướng.
- `ProtectedRoute` (`web/src/app/ProtectedRoute.tsx`) và `useAuth` (`web/src/hooks/useAuth.ts`).
- `academyService.ts` (`fetchAcademyProgress`, `fetchDailyRecord`, `submitDailyQuiz`, `calculateLevelInfo`, `getVietnamDateKey`).
- `academyQuestions.ts` (`getDailyQuestion`, bộ 20 câu hỏi tài chính thực tế).
- Thẻ `MoneyCare Academy` trên `DashboardPage.tsx` và route `/academy` trong `router.tsx`.

---

## 7. Những chức năng đã hoạt động

- Điều hướng từ thẻ `MoneyCare Academy` trên Dashboard (`Bắt đầu học >`) sang `/academy` và nút quay lại về `/home`.
- Hiển thị động Level, Tổng XP, thanh tiến độ lên cấp, Current Streak và Longest Streak từ `users/{uid}/academy/progress` (không hardcode, không tự cộng XP/Streak khi chỉ mở trang).
- Chuyển đổi mượt mà giữa 3 tab `Hôm nay | Lộ trình | Hồ sơ khó` mà không mất XP hay trạng thái câu hỏi đang mở.
- Linh vật Ví Bé SVG với lời thoại động viên có thể chạm để đổi câu nói.
- Hoàn thành tình huống trắc nghiệm hằng ngày nhận `+20 XP` lần đầu qua Firestore Transaction chống cộng trùng (`users/{uid}/academyDaily/{dateKey}`), hỗ trợ xem lại & ôn tập không cộng thêm XP.
- Nút shortcut `"Ghi ngay"` mở màn hình thêm giao dịch `/transactions/new`.
- Toàn bộ tính năng MoneyCare hiện có (Dashboard, Auth, Transactions, Analytics, Budget, AI Chatbot & lịch sử chat) không bị ảnh hưởng.

---

## 8. Những chức năng để lại cho Phase 2 trở đi

- Màn hình câu hỏi trắc nghiệm độc lập & bộ tình huống thực tế mở rộng (như kịch bản *"Đi ăn buffet cùng bạn?"* có lưu tiến độ riêng).
- Lộ trình 90 ngày đầy đủ kèm thanh tiến độ từng giai đoạn và màn hình **Chi tiết bài học**.
- Màn hình **Hồ sơ khó** nâng cao (danh sách thử thách thực tế đầy đủ).
- **Boss Battle – 7 ngày với 200k**, gameplay từng ngày (`Ngày 1/7` → `7/7`) và màn hình kết thúc thử thách.
- Công cụ tài chính mới, Sổ vay mượn, Notifications.

---

## 9. Kết quả Build

- Lệnh thực thi: `npm run build` (tại thư mục `web/`, chạy `tsc -b && vite build`).
- Kết quả: **PASS (Exit Code 0)** — **0 lỗi TypeScript**, **0 lỗi Vite**.
- Thời gian build: `7.13s`, đóng gói thành công `dist/index.html`, `dist/assets/index-zF6RPuo1.css`, `dist/assets/index-BJGTdAeh.js`.
- Kiểm tra IDE static analysis (`studio_analyze_file`) trên cả 5 file mới/đã sửa: **0 lỗi, 0 cảnh báo**.

---

## 10. Kết quả Test

1. **8/8 bộ Unit Test hiện có đều PASS (Exit Code 0):**
   - `npx tsx src/utils/finance.test.ts` — **PASS**
   - `npx tsx src/utils/financeContextBuilder.test.ts` — **PASS**
   - `npx tsx src/services/academyService.test.ts` — **PASS** (Level, Streak, chống cộng XP trùng)
   - `npx tsx src/data/academyQuestions.test.ts` — **PASS** (20 câu hỏi, deterministic theo ngày)
   - `npx tsx src/services/aiConversationService.test.ts` — **PASS**
   - `npx tsx src/services/transactionService.test.ts` — **PASS**
   - `npx tsx src/utils/authErrors.test.ts` — **PASS**
   - `npx tsx src/pages/transactionHistoryAndForm.test.ts` — **PASS**
2. **Kiểm thử render component Phase 1 (`renderToStaticMarkup` với dữ liệu mẫu động 240 XP / Cấp 3 / Streak 4 ngày / Kỷ lục 7 ngày):**
   - Xác nhận `AcademyHeader`, `AcademyOverviewCard`, `TodayMissionTab` (trạng thái chưa làm & trạng thái đã hoàn thành) render đúng dữ liệu động, không có số hardcode (`150 XP`), không có gradient tím `#8B5CF6`, đủ 3 tab, đúng nhãn nhiệm vụ `0/1` và `1/1`.
3. **Giới hạn kiểm thử trình duyệt trực tiếp:**
   - Do `/academy` được bảo vệ bởi `ProtectedRoute` gắn với Firebase Auth thực (`moneycare-2cde5`) và quy tắc nghiêm cấm tạo tài khoản/dữ liệu thử nghiệm trên tài khoản thật, chưa thể đăng nhập tự động vào ứng dụng live trên trình duyệt headless. Người dùng vui lòng chạy `cd web && npm run dev` và kiểm tra trực tiếp bằng tài khoản của mình trên các khung 375px / 390px / 430px trước khi duyệt sang Phase 2.

---

## 11. Các vấn đề Firestore ghi nhận (Audit)

- **Schema & Rules:** Không thay đổi schema Firestore (`users/{uid}/academy/progress`, `users/{uid}/academyDaily/{dateKey}`) và không thay đổi `web/firestore.rules`. Không tạo dữ liệu thử nghiệm, không xóa hay reset tiến độ người dùng.
- **Ghi nhận nguy cơ lệch đồng bộ localStorage ↔ Firestore trong `academyService.ts` (chưa tự ý sửa theo quy tắc Section 15):**
  - Trong `fetchAcademyProgress()` và `fetchDailyRecord()`, nếu Firestore chưa có document (`!snapshot.exists()`) hoặc kết nối lỗi, hàm rơi xuống `getLocalProgress(uid)` / `getLocalDailyRecord(uid, dateKey)`.
  - Trong `submitDailyQuiz()`, nếu Firestore transaction gặp lỗi mạng, hàm lưu cục bộ vào `localStorage` nhưng hiện chưa có cơ chế đồng bộ ngược (sync/reconcile) lên Firestore khi có mạng trở lại.
  - **Đề xuất:** Nếu người dùng đồng ý ở giai đoạn sau, có thể bổ sung cơ chế đồng bộ rõ ràng hoặc tách riêng trạng thái offline/online để đảm bảo nhất quán tuyệt đối giữa `localStorage` và Firestore.

---

## 12. Xác nhận không thay đổi Firebase AI Logic

- **XÁC NHẬN:** Không chỉnh sửa bất kỳ dòng code nào trong `web/src/lib/firebase.ts`, `web/src/services/aiService.ts`, `web/src/services/aiConversationService.ts`, `web/src/hooks/useAIChat.ts`, `web/src/pages/AIAssistantPage.tsx` hay các component trong `web/src/components/ai/`.
- Giữ nguyên model Gemini, App Check và toàn bộ lịch sử hội thoại AI.

---

## 13. Xác nhận không commit, push GitHub hoặc deploy

- **XÁC NHẬN:** Không thực hiện `git add`, `git commit`, `git push`, không tạo Pull Request và không chạy `firebase deploy`.
- Toàn bộ thay đổi đang ở trạng thái local working tree để người dùng kiểm tra trực tiếp.
