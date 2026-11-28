# MONEYCARE ACADEMY – PHASE 2.2 REPORT
## Self-Paced Roadmap & Progress-Based Chapter Unlocking

- **Dự án:** MoneyCare (`web/`)
- **Firebase Project ID:** `moneycare-2cde5` | **Firestore Database:** `(default)`
- **Phạm vi:** Nâng cấp Tab **Lộ trình** (`/academy?tab=roadmap`) từ mô hình hiển thị theo ngày sang mô hình **Lộ trình 90 bài học – Học theo tốc độ của bạn**, hoàn thiện trọn bộ **15 bài học tương tác của Chương 1** và áp dụng cơ chế mở khóa chương thuần túy theo tiến độ.
- **Trạng thái Firestore Rules:** Giữ nguyên Khối 6 đã triển khai ở Phase 2.1 (ruleset `fe464cb2-2f42-4216-9cfc-a5293e99dd24`), **KHÔNG** chỉnh sửa và **KHÔNG** deploy lại `web/firestore.rules`.

---

## 1. Kết quả kiểm tra mã nguồn hiện tại (Root-Cause Audit)

Trước khi chỉnh sửa, đã rà soát toàn bộ nguồn liên quan gồm `academyRoadmap.ts`, `academyRoadmapService.ts`, `RoadmapTab.tsx`, `RoadmapLessonView.tsx`, `AcademyPage.tsx`, bộ test và `web/firestore.rules`:

| Hạng mục kiểm tra | Nguyên nhân thực tế ở Phase 2 | Phân loại |
|---|---|---|
| Khóa theo thời gian / lịch / 24 giờ / Streak / XP | **Không tồn tại** bất kỳ logic kiểm tra ngày (`Date`), thời gian chờ 24h, ngày đăng ký hay Streak/XP trong `isStageUnlocked()` và `canAccessLesson()`. | Không có khóa thời gian |
| Bài 4–15 (Chương 1) chưa mở được | Bị chặn do `isAvailable: false` (chưa viết nội dung tương tác ở Phase 2), đồng thời nhãn giao diện hiển thị `"Ngày 4–15"` / `"Lộ trình 90 ngày"` gây hiểu nhầm là bị khóa theo ngày. | Khóa do chưa có nội dung + cách hiển thị |
| Chương 2, 3, 4 chưa mở được | Hai nguyên nhân độc lập: (1) chưa hoàn thành đủ số bài chương trước (`isStageUnlocked`), và (2) nội dung 75 bài (`day-16..day-90`) đang phát triển (`isAvailable: false`). | Tách bạch rõ 2 nguyên nhân ở Phase 2.2 |
| Firestore Rules (Khối 6) | Đang bảo vệ `users/{userId}/academyRoadmap/{lessonId}` với đúng 5 trường `lessonId`, `dayNumber`, `stageId`, `completed`, `completedAt` và ràng buộc `lessonId == 'day-' + string(dayNumber)` (`1..90`). | Tương thích 100% — giữ nguyên |

---

## 2. Cấu trúc Lộ trình 90 bài học & Cơ chế mở khóa chương

- **Tên hiển thị mới:** `"Lộ trình 90 bài học – Học theo tốc độ của bạn"`
- **Quy tắc học tự do (Self-Paced):**
  - Không giới hạn số bài học mỗi ngày, có thể hoàn thành nhiều bài liên tiếp trong cùng một ngày.
  - Không chờ 24 giờ, không chờ sang ngày mới, không phụ thuộc ngày đăng ký, Streak, XP hay Level.
  - Trong chương đã mở khóa (Chương 1), người dùng có thể chọn học bất kỳ bài nào theo thứ tự tùy ý (ví dụ học Bài 5 trước Bài 2).

| Chương | Khoảng bài | Số lượng | Điều kiện mở khóa (thuần tiến độ) | Trạng thái nội dung Phase 2.2 |
|---|---|---|---|---|
| **Chương 1:** Tiền đi đâu hết rồi? | Bài 1–15 | 15 bài | Mở sẵn mặc định | **15/15 bài hoàn chỉnh (`isAvailable: true`)** |
| **Chương 2:** Shopee gọi, lý trí có nghe? | Bài 16–30 | 15 bài | Hoàn thành đủ 15/15 bài Chương 1 | Đang phát triển nội dung (`isAvailable: false`) |
| **Chương 3:** Cuối tháng không ăn mì gói | Bài 31–60 | 30 bài | Hoàn thành đủ 15/15 bài Chương 2 | Đang phát triển nội dung (`isAvailable: false`) |
| **Chương 4:** Ví chưa giàu nhưng đã trưởng thành | Bài 61–90 | 30 bài | Hoàn thành đủ 30/30 bài Chương 3 | Đang phát triển nội dung (`isAvailable: false`) |

---

## 3. Danh sách 15 bài học hoàn chỉnh của Chương 1

Tất cả 15 bài đều có mục tiêu học tập rõ ràng, nội dung ngắn gọn dễ đọc, ví dụ thực tế bằng VND sát đời sống sinh viên/người đi làm tại Việt Nam, lời nhắn của linh vật **Ví Bé** và bài tập tương tác thực (không dùng placeholder, không gọi Gemini để bịa bài học):

| Bài | Firestore `lessonId` | Tiêu đề bài học | Loại tương tác | Ghi chú |
|---|---|---|---|---|
| Bài 1 | `day-1` | Tiền đi đâu hết rồi? | `quiz` (A/B/C) | Giữ nguyên từ Phase 2 |
| Bài 2 | `day-2` | Cà phê 30k, một tháng thành bao nhiêu? | `calculation` | Giữ nguyên từ Phase 2 |
| Bài 3 | `day-3` | Cần hay muốn? | `classification` (Cần / Muốn) | Giữ nguyên từ Phase 2 |
| Bài 4 | `day-4` | Thu nhập thực nhận là bao nhiêu? | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 5 | `day-5` | Phân loại giao dịch để đọc biểu đồ rõ ràng | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 6 | `day-6` | Chi phí cố định và chi phí biến đổi | `classification` (Cố định / Biến đổi) | Mới ở Phase 2.2 |
| Bài 7 | `day-7` | Bẫy phí ship và các khoản phụ phí ẩn | `calculation` | Mới ở Phase 2.2 |
| Bài 8 | `day-8` | Tự nấu hay ăn ngoài — Tính thử mới biết | `calculation` | Mới ở Phase 2.2 |
| Bài 9 | `day-9` | Đi siêu thị đừng để bụng đói | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 10 | `day-10` | Chi tiêu theo cảm xúc (Emotional Spending) | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 11 | `day-11` | Quy tắc hoãn mua 48 giờ | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 12 | `day-12` | Rà soát các gói đăng ký trừ tiền âm thầm | `calculation` | Mới ở Phase 2.2 |
| Bài 13 | `day-13` | Tính chi phí sống tối thiểu 1 tháng | `calculation` | Mới ở Phase 2.2 |
| Bài 14 | `day-14` | Quy tắc 1 phút mỗi tối cùng MoneyCare | `quiz` (A/B/C) | Mới ở Phase 2.2 |
| Bài 15 | `day-15` | Tổng kết Chương 1 – Nền tảng giữ ví vững chắc | `classification` (Nên duy trì / Cần hạn chế) | Mới ở Phase 2.2 |

---

## 4. Các tệp đã cập nhật trong Phase 2.2

1. `web/src/data/academyRoadmap.ts`
   - Cập nhật nhãn 4 chương (`Chương 1`..`Chương 4`) và điều kiện mở khóa thuần tiến độ.
   - Giữ nguyên Bài 1–3 (`day-1..day-3`), bổ sung đầy đủ nội dung tương tác cho Bài 4–15 (`day-4..day-15`), giữ 75 bài của Chương 2–4 ở trạng thái `isAvailable: false`.
   - Bổ sung `categoryALabel` / `categoryBLabel` cho bài tập phân loại, thêm helper `hasStageAvailableContent(stageId)` và trường `isCompleted` trong `getStageProgress()`.
2. `web/src/services/academyRoadmapService.ts`
   - Giữ nguyên đường dẫn `users/{uid}/academyRoadmap/{lessonId}` và đúng 5 trường `lessonId`, `dayNumber`, `stageId`, `completed`, `completedAt`.
   - Thêm kiểm định `sanitizeRoadmapProgressMap()` và đối chiếu `docSnap.id === data.lessonId` với `getLessonById(data.lessonId)` để chỉ đếm các bản ghi `lessonId` hợp lệ của UID hiện tại.
   - Khi đọc Firestore lỗi (`source: 'error'`), trả về `{}` và thông báo lỗi trung thực, không bao giờ mở khóa chương từ dữ liệu giả.
   - Cho phép truyền `completedLessons` vào `completeRoadmapLesson(lessonId, completedLessons)` để xác thực quyền truy cập theo tiến độ thực tế; giữ nguyên `runTransaction` idempotent (chỉ `create`, không `update`/`delete`).
3. `web/src/components/academy/RoadmapTab.tsx`
   - Header mới: `"Lộ trình 90 bài học – Học theo tốc độ của bạn"`, tổng số bài hoàn thành `X/90`, thanh tiến độ tổng thể, và hộp động viên từ **Ví Bé**.
   - 4 **Chapter Cards** có thể thu gọn / mở rộng (không đổ phẳng 90 bài gây dài màn hình): hiển thị số bài, tiến độ chương, thanh tiến độ và badge trạng thái trung thực (`Hoàn thành`, `Đang mở`, `Đang phát triển nội dung`, `Chưa mở khóa`).
   - Mở Chương 1 hiển thị danh sách 15 bài với `Bài X`, thời lượng, trạng thái (`Chưa học` / `Đã hoàn thành`) và nút `Học ngay` / `Ôn tập`.
   - Khi Chương 2 được mở khóa (15/15 Chương 1), hiển thị rõ thông báo mở khóa + `"Đang phát triển nội dung"`, không tạo nút bắt đầu giả hay màn hình trống.
4. `web/src/components/academy/RoadmapLessonView.tsx`
   - Đổi toàn bộ nhãn hiển thị sang `Chương X • Bài Y` và `Lộ trình 90 bài học`.
   - Hỗ trợ nhãn tùy biến `categoryALabel` / `categoryBLabel` cho bài tập phân loại (Bài 6, Bài 15).
   - Cho phép mở lại bài đã hoàn thành để ôn tập mà không ghi trùng hoàn thành; hiển thị ngay nút **Học tiếp Bài kế tiếp** hoặc **Quay về Lộ trình**, và thông báo chúc mừng khi hoàn tất đủ 15/15 bài của Chương 1.
5. `web/src/pages/AcademyPage.tsx`
   - Nối trạng thái mở/đóng chương (`expandedStageId`, mặc định mở Chương 1), tính `nextAvailableLesson` trong cùng chương để học liên tiếp nhiều bài trong ngày.
   - Cập nhật URL access guard (chờ `!roadmapLoading` trước khi kiểm tra để tránh redirect nhầm khi tải Cloud Firestore) và phân biệt rõ thông báo **chương chưa mở khóa** với **bài học đang phát triển nội dung**.
6. `web/src/data/academyRoadmap.test.ts` & `web/src/services/academyRoadmapService.test.ts`
   - Cập nhật đầy đủ test cho học tự do, học ngược thứ tự (`day-5` trước `day-4`), học nhiều bài trong cùng một ngày, mốc 14/15 chưa mở Chương 2 → 15/15 mở ngay Chương 2, tính bất biến khi ôn tập lại, bảo toàn dữ liệu `day-1..day-3`, lọc `lessonId` giả, và xác minh XP/Level/Streak bất biến.

---

## 5. Bảo toàn tương thích Firestore & Dữ liệu thật

- **Đường dẫn Firestore:** `users/{uid}/academyRoadmap/{lessonId}` (không đổi).
- **Document ID:** `day-1` .. `day-90` (không đổi — khớp tuyệt đối với quy tắc `lessonId == 'day-' + string(dayNumber)` trong Khối 6 đã deploy).
- **5 trường dữ liệu:** `lessonId`, `dayNumber`, `stageId`, `completed`, `completedAt` (không thêm/bớt trường).
- **Dữ liệu hiện có:** Tiến độ `day-1`, `day-2`, `day-3` đã lưu trên Firestore của tài khoản thật được đọc nguyên vẹn và hiển thị thành `Bài 1`, `Bài 2`, `Bài 3` đã hoàn thành.
- **Tách biệt hoàn toàn:** Không chạm vào `users/{uid}/academy/progress` (XP, Level, Streak), `academyService.ts`, `TodayMissionTab.tsx`, `Hồ sơ khó`, `DashboardPage.tsx`, `BottomNavigation.tsx`, Firebase AI Logic, Authentication hay App Check.

---

## 6. Kết quả kiểm thử tự động & Build Verification

### 6.1. Production Build (`cd web && npm run build`)
- **Kết quả:** **PASS** (exit code `0`, `0` lỗi TypeScript, Vite build thành công `2077 modules transformed`).

### 6.2. Unit Tests (`npx tsx` — 10/10 bộ test PASS)
| Bộ kiểm thử | Kết quả | Nội dung xác minh chính |
|---|---|---|
| `src/data/academyRoadmap.test.ts` | **PASS** (6/6) | 4 chương, 90 bài liên tục, 15 bài Chương 1 khác biệt, học không cần thứ tự, mốc 14/15 → 15/15 mở Chương 2, mốc Chương 3 & 4 |
| `src/services/academyRoadmapService.test.ts` | **PASS** (6/6) | Bảo toàn `day-1..day-3`, lọc key giả, học `day-5` trước `day-4` trong cùng ngày, idempotency, 14/15 vs 15/15, từ chối `day-16`, XP/Streak bất biến |
| `src/utils/finance.test.ts` | **PASS** | Tính toán thu/chi/ngân sách |
| `src/utils/financeContextBuilder.test.ts` | **PASS** | Ngữ cảnh tài chính cho MoneyCare AI |
| `src/services/academyService.test.ts` | **PASS** | XP, Level, Streak, chống cộng trùng XP |
| `src/data/academyQuestions.test.ts` | **PASS** | Ngân hàng 20 câu hỏi hằng ngày |
| `src/services/aiConversationService.test.ts` | **PASS** | Lịch sử hội thoại AI |
| `src/services/transactionService.test.ts` | **PASS** | CRUD & validation giao dịch |
| `src/utils/authErrors.test.ts` | **PASS** | Ánh xạ lỗi đăng nhập |
| `src/pages/transactionHistoryAndForm.test.ts` | **PASS** | Lọc, tìm kiếm lịch sử giao dịch |

### 6.3. React SSR Render Verification (`verify_phase2_2_ssr.tsx`)
- **Kết quả:** **PASS** (5/5) — Xác minh render không lỗi cho `RoadmapTab` (0/90, 14/15 Chương 2 khóa, 15/15 Chương 2 mở khóa với nhãn `"Đang phát triển nội dung"`) và toàn bộ 15 bài trong `RoadmapLessonView` (bao gồm nhãn phân loại tùy biến Bài 6 & Bài 15 và nút `Học tiếp Bài` khi đã hoàn thành).

### 6.4. Kiểm tra bằng `studio_analyze_file`
- **Kết quả:** **PASS** — 0 lỗi/cảnh báo trên cả 7 file Phase 2.2.

---

## 7. Trạng thái kiểm thử trên Firebase Cloud thật

- **Trạng thái kiểm thử trình duyệt với Cloud Firestore thật (`moneycare-2cde5`):** **`NOT VERIFIED`**
- **Lý do:** Môi trường CLI hiện tại chỉ chạy Unit Test (Local/Mock), SSR và Vite Build; chưa đăng nhập tài khoản thật trên trình duyệt để ghi/đọc trực tiếp lên Cloud Firestore production.

---

## 8. Hướng dẫn người dùng kiểm thử thủ công trên trình duyệt (Live Cloud Verification)

1. Chạy `cd web && npm run dev` và đăng nhập tài khoản thật tại MoneyCare.
2. Vào **MoneyCare Academy → Tab Lộ trình**:
   - Xác nhận tiêu đề `"Lộ trình 90 bài học – Học theo tốc độ của bạn"` và tiến độ cũ (nếu đã học `day-1..day-3`) vẫn hiển thị đúng dấu tích xanh.
3. Chọn **Bài 5** trước **Bài 4**, làm bài tập và bấm **Hoàn thành bài học**:
   - Xác nhận thông báo `"Đã lưu hoàn thành bài học lên Cloud Firestore!"` và không có lỗi `permission-denied`.
4. Tiếp tục bấm **Học tiếp** (hoặc chọn **Bài 4**) và hoàn thành thêm bài trong **cùng một ngày**:
   - Xác nhận không bị chặn chờ qua ngày mới, tiến độ `X/90` và `X/15` tăng ngay lập tức.
5. Reload trang (`F5`):
   - Xác nhận tiến độ giữ nguyên, đồng thời quay sang tab **Hôm nay** xác nhận **XP, Level, Streak** không bị thay đổi.
6. Hoàn thành đủ 14/15 bài Chương 1 → kiểm tra Chương 2 vẫn **Chưa mở khóa**; hoàn thành nốt bài thứ 15 → kiểm tra Chương 1 chuyển **Hoàn thành** và Chương 2 tự động mở khóa hiển thị **Đang phát triển nội dung**.
7. Mở lại một bài đã hoàn thành (`Ôn tập`) → xác nhận xem lại bình thường và không làm tăng trùng tổng số bài hoàn thành.
8. Thử truy cập trực tiếp `/academy?tab=roadmap&lesson=day-16` → xác nhận bị chặn và hiển thị thông báo rõ ràng.

---

## 9. Xác nhận tuân thủ giới hạn phạm vi

- [x] Không chỉnh sửa hoặc deploy lại `web/firestore.rules`.
- [x] Không thay đổi `DashboardPage.tsx`, `BottomNavigation.tsx`, `AcademyHeader.tsx`, `TodayMissionTab.tsx` hay tab `Hồ sơ khó`.
- [x] Không bổ sung tab thứ 4 và chưa triển khai Phase 3 (Boss Battle).
- [x] Không thay đổi XP, Level, Streak hay Firebase AI Logic / Authentication / App Check.
- [x] Không tự commit, push GitHub hay deploy Firebase Hosting.

---

## 10. Bước tiếp theo đề xuất

Sau khi bạn xác nhận kết quả kiểm thử thực tế trên trình duyệt với tài khoản thật cho Phase 2.2, các bước tiếp theo có thể lựa chọn:
- Viết tiếp nội dung tương tác Chương 2 (Bài 16–30), **hoặc**
- Chuyển sang **Phase 3 – Tab Hồ sơ khó** (Boss Battle 7 ngày với 200k & các tình huống mô phỏng tài chính).
