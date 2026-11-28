# 🗺️ BÁO CÁO TRIỂN KHAI PHASE 2 — MONEYCARE ACADEMY (LỘ TRÌNH 90 NGÀY)

**Dự án:** MoneyCare – Ứng dụng Quản lý Tài chính Cá nhân  
**Phạm vi:** Phase 2 — Tab Lộ trình (4 giai đoạn, 90 ngày, 3 bài học tương tác đầu tiên, lưu tiến độ tách biệt)  
**Firebase Project ID:** `moneycare-2cde5`  
**Trạng thái:** Hoàn thành Phase 2, dừng để người dùng nghiệm thu giao diện và phê duyệt cập nhật Firestore Rules trước khi sang Phase 3  

---

## 1. Những chức năng Lộ trình đã có trước khi sửa

Trước khi thực hiện Phase 2, tab `Lộ trình` (`activeTab === 'roadmap'`) trong `web/src/pages/AcademyPage.tsx` chỉ gồm:

- 1 thẻ giới thiệu tĩnh (*"Lộ trình 90 ngày làm chủ Tài chính Cá nhân"*).
- 4 thẻ giai đoạn tĩnh với tiêu đề sơ khai (`open` / `locked`) — không có cấu trúc 90 ngày, không có thanh tiến độ thực, không thể bấm xem danh sách bài học, chưa có nội dung bài học tương tác, chưa có cơ chế lưu tiến độ hay bảo vệ truy cập URL.

---

## 2. Những phần đã bổ sung trong Phase 2

- **Banner Lộ trình 90 ngày** phong cách trắng – xanh dương MoneyCare (`"Lộ trình 90 ngày thoát kiếp cháy ví"` / `"Học từng chút, quản lý tiền tốt hơn mỗi ngày."`) kèm số ngày hoàn thành thực tế (`X/90 ngày`) và linh vật **Ví Bé**.
- **Hệ thống 4 giai đoạn – đủ 90 ngày chuẩn xác** (không trùng, không thiếu ngày) với thanh tiến độ thực từng giai đoạn, trạng thái mở khóa, nút xem bài học cho giai đoạn đang mở và trạng thái khóa trung thực cho giai đoạn chưa mở.
- **Danh sách ngày học theo giai đoạn** (Giai đoạn 1 hiển thị rõ 3 bài học đang mở ở đầu và 12 ngày còn lại `Ngày 4–15` ở trạng thái `"Chưa khả dụng"` / `"Chưa mở"`, không có nút giả).
- **Màn hình chi tiết bài học riêng (`RoadmapLessonView.tsx`)** cho 3 bài học tương tác đầu tiên, có nút quay lại danh sách giai đoạn và nút `"Quay về Lộ trình"` giữ nguyên tab `Lộ trình` trên route `/academy`.
- **Cơ chế lưu tiến độ bài học Lộ trình tách biệt hoàn toàn** khỏi XP & Streak của Academy (`users/{uid}/academyRoadmap/{lessonId}`), báo lỗi trung thực khi Firestore ghi thất bại và tuyệt đối không hiển thị hoàn thành giả.
- **Bảo vệ URL (`URL Access Guard`)** chặn truy cập trái phép vào các giai đoạn đang khóa (`stage=2..4`) hoặc bài học chưa khả dụng (`lesson=day-4..day-90`, ID không hợp lệ).

---

## 3. Các file đã tạo và chỉnh sửa

### File đã tạo mới
| STT | Đường dẫn file | Mô tả |
|:---:|---|---|
| 1 | `web/src/data/academyRoadmap.ts` | Cấu trúc 4 giai đoạn, 90 ngày liên tục (`day-1`..`day-90`), nội dung chi tiết & bài tập tương tác cho 3 bài đầu, các hàm `isStageUnlocked`, `canAccessLesson`, `getStageProgress`. |
| 2 | `web/src/data/academyRoadmap.test.ts` | Bộ unit test xác minh 4 giai đoạn, đúng 90 ngày không trùng/thiếu, 3 bài học đầu và cơ chế chặn truy cập. |
| 3 | `web/src/services/academyRoadmapService.ts` | Dịch vụ đọc/ghi tiến độ Lộ trình theo UID tại `users/{uid}/academyRoadmap/{lessonId}` với Firestore Transaction idempotent, không đụng XP/Streak, không giả lập thành công khi Cloud lỗi. |
| 4 | `web/src/services/academyRoadmapService.test.ts` | Bộ unit test kiểm thử idempotency, lưu lại sau reload, từ chối bài khóa và đảm bảo không thay đổi XP/Streak. |
| 5 | `web/src/components/academy/RoadmapTab.tsx` | Giao diện tab Lộ trình (banner xanh, 4 card giai đoạn, danh sách 15 ngày của Giai đoạn 1). |
| 6 | `web/src/components/academy/RoadmapLessonView.tsx` | Màn hình chi tiết bài học tương tác (trắc nghiệm, tính toán, phân loại Cần/Muốn, giải thích, nút hoàn thành & quay về Lộ trình). |
| 7 | `MONEYCARE_ACADEMY_PHASE2_REPORT.md` | Báo cáo nghiệm thu Phase 2 này. |

### File đã chỉnh sửa
| STT | Đường dẫn file | Nội dung chỉnh sửa |
|:---:|---|---|
| 1 | `web/src/pages/AcademyPage.tsx` | Tích hợp `RoadmapTab`, `RoadmapLessonView`, đồng bộ query params trên `/academy` (`?tab=roadmap&stage=1&lesson=day-1`), áp dụng URL guard cho bài/giai đoạn đóng và tải tiến độ Lộ trình tách biệt. |
| 2 | `web/firestore.rules` | Chuẩn bị rule `match /academyRoadmap/{lessonId}` (KHÔNG tự deploy — chờ người dùng phê duyệt). |

*Xác nhận không chỉnh sửa `DashboardPage.tsx`, `BottomNavigation.tsx`, `router.tsx`, `TodayMissionTab.tsx`, `AcademyHeader.tsx`, `academyService.ts`, `aiService.ts` hay `firebase.ts`.*

---

## 4. Cấu trúc 4 giai đoạn và 90 ngày

| Giai đoạn | Phạm vi ngày | Số ngày | Tiêu đề | Nội dung chính | Trạng thái Phase 2 |
|:---:|:---:|:---:|---|---|---|
| **Giai đoạn 1** | Ngày 1–15 | 15 ngày | **Tiền đi đâu hết rồi?** | Thu nhập, chi tiêu, ghi chép giao dịch, phân loại nhu cầu và thói quen tiêu dùng. | **Đang mở** (3 bài đầu khả dụng, Ngày 4–15 chưa khả dụng) |
| **Giai đoạn 2** | Ngày 16–30 | 15 ngày | **Shopee gọi, lý trí có nghe?** | Ngân sách, quy tắc 50/30/20, mua sắm thông minh và kiểm soát chi tiêu cảm xúc. | **Khóa** (mở khi hoàn thành Giai đoạn 1) |
| **Giai đoạn 3** | Ngày 31–60 | 30 ngày | **Cuối tháng không ăn mì gói** | Tiết kiệm, quỹ dự phòng, kiểm soát nợ, sử dụng thẻ tín dụng. | **Khóa** (mở khi hoàn thành Giai đoạn 2) |
| **Giai đoạn 4** | Ngày 61–90 | 30 ngày | **Ví chưa giàu nhưng đã trưởng thành** | Tích lũy, mục tiêu dài hạn, kiến thức đầu tư cơ bản và kế hoạch tài chính cá nhân. | **Khóa** (mở khi hoàn thành Giai đoạn 3) |

**Tổng cộng:** `15 + 15 + 30 + 30 = 90` ngày liên tục (`day-1` → `day-90`), đã kiểm chứng tự động bằng unit test không trùng lặp và không thiếu ngày.

---

## 5. Ba bài học tương tác đầu tiên

Mỗi bài đều có đầy đủ: tiêu đề, thời lượng dự kiến, mục tiêu học tập (*"Bạn sẽ học được"*), nội dung ngắn + ví dụ thực tế, câu thoại **Ví Bé** đồng bộ Phase 1, bài tập tương tác, lời giải thích đáp án, nút **Hoàn thành bài học** và nút **Quay về Lộ trình**. Không dùng Gemini API để sinh bài học.

1. **Bài 1 (Ngày 1) – Tiền đi đâu hết rồi?** *(4 phút)*
   - Giải thích vì sao cần ghi chép thu chi hằng ngày với ví dụ thực tế **sinh viên nhận 3.000.000 đ/tháng** nhưng ngày 20 chỉ còn 150.000 đ mà không rõ nguyên nhân.
   - Lời thoại Ví Bé: *"Tiền không tự biến mất, chỉ là mình chưa ghi lại thôi!"*
   - Tương tác: Câu hỏi trắc nghiệm củng cố (A/B/C) + lời giải thích đáp án.
2. **Bài 2 (Ngày 2) – Cà phê 30k, một tháng thành bao nhiêu?** *(4 phút)*
   - Dạy cách nhận diện chi phí nhỏ lặp lại; nhấn mạnh không phải mọi khoản cà phê đều xấu mà mục tiêu là biết tổng chi phí để lựa chọn phù hợp ngân sách.
   - Lời thoại Ví Bé: *"30k nghe nhỏ, nhưng 30 lần thì ví bắt đầu họp khẩn!"*
   - Tương tác: Bài tập tính toán `30.000 đ × 30 ngày = 900.000 đ` (chọn trong 4 phương án số tiền) + giải thích chi tiết theo tháng & năm.
3. **Bài 3 (Ngày 3) – Cần hay muốn?** *(5 phút)*
   - Dạy phân biệt Nhu cầu thiết yếu (**Cần**) và Mong muốn (**Muốn**).
   - Lời thoại Ví Bé: *"Chủ nhân ghi chép chi tiêu rồi! Ví Bé cảm động quá."*
   - Tương tác: Bài tập phân loại 4 khoản chi thực tế (**Tiền trọ hằng tháng**, **Ăn uống cơ bản hằng ngày**, **Mua thêm đôi giày mới**, **Đăng ký dịch vụ giải trí**) vào nhóm Cần/Muốn và xem giải thích chi tiết từng mục.

---

## 6. Cách quản lý mở khóa và bảo vệ URL

- **Cấp độ Giai đoạn (`isStageUnlocked`):** Giai đoạn 1 mở mặc định (`isUnlockedByDefault = true`); Giai đoạn 2, 3, 4 chỉ mở khi toàn bộ ngày của giai đoạn trước đã hoàn thành. Thẻ giai đoạn khóa không có nút bấm giả.
- **Cấp độ Bài học (`canAccessLesson`):** Chỉ trả về `true` khi bài học tồn tại, thuộc giai đoạn đã mở khóa VÀ có `isAvailable === true` cùng nội dung hoàn chỉnh (`day-1`, `day-2`, `day-3`). Các ngày `4..15` trong Giai đoạn 1 hiển thị rõ `"Chưa khả dụng"` / `"Chưa mở"`, không bấm được và không dẫn tới trang trống.
- **URL Guard trên `/academy`:** Khi người dùng nhập trực tiếp URL trái phép (ví dụ `/academy?tab=roadmap&stage=2` hoặc `/academy?tab=roadmap&lesson=day-10`), `AcademyPage` tự động chặn, điều hướng sạch về `/academy?tab=roadmap` và hiện thông báo đỏ giải thích lý do.
- **Điều hướng quay lại:** Mọi màn hình con đều ở trong route `/academy?tab=roadmap...` với nút quay về danh sách Giai đoạn hoặc `"Quay về Lộ trình"`, giữ đúng tab Lộ trình và không làm mất XP/Streak hay trạng thái tab Hôm nay.

---

## 7. Cách lưu tiến độ thực tế (tách biệt XP & Streak)

- **Đường dẫn Firestore riêng biệt theo UID:** `users/{uid}/academyRoadmap/{lessonId}` (ví dụ `users/{uid}/academyRoadmap/day-1`).
- **Cấu trúc document (`RoadmapLessonCompletion`):**
  ```json
  {
    "lessonId": "day-1",
    "dayNumber": 1,
    "stageId": 1,
    "completed": true,
    "completedAt": "2026-11-28T10:30:00.000Z"
  }
  ```
- **Tách biệt 100% khỏi XP & Streak:** `academyRoadmapService.ts` tuyệt đối không đọc/ghi `users/{uid}/academy/progress` hay `users/{uid}/academyDaily/{dateKey}`. Không cộng XP khi mở bài, học bài hay hoàn thành bài Lộ trình ở Phase 2.
- **Chống ghi đè (Idempotent):** Sử dụng `runTransaction` kiểm tra document đã có `completed === true` chưa; nếu rồi giữ nguyên bản ghi gốc và trả về `alreadyCompleted: true`.
- **Trung thực khi Cloud lỗi:** Khi đang đăng nhập Firebase (`isFirebaseConfigured && db && user`), nếu Firestore trả lỗi (như `permission-denied` do chưa deploy Rules hoặc mất mạng), hệ thống **không** ghi nhận hoàn thành giả, **không** báo đã lưu Cloud và hiển thị nguyên nhân lỗi thực tế kèm nút *"Thử lưu hoàn thành lại"*.

---

## 8. Cập nhật Firestore Rules (CẦN NGƯỜI DÙNG PHÊ DUYỆT — CHƯA DEPLOY)

**CÓ — Cần cập nhật Firestore Rules** vì `web/firestore.rules` áp dụng nguyên tắc mặc định từ chối (`allow read, write: if false;`) và hiện chưa có khối rule cho subcollection `academyRoadmap`.

Đã chuẩn bị sẵn Khối 6 trong tệp `web/firestore.rules` để bạn xem xét và phê duyệt (chưa deploy):

```rules
match /academyRoadmap/{lessonId} {
  allow read, delete: if request.auth != null && request.auth.uid == userId;

  allow create, update: if request.auth != null
    && request.auth.uid == userId
    && request.resource.data.lessonId == lessonId
    && request.resource.data.dayNumber is number
    && request.resource.data.dayNumber >= 1
    && request.resource.data.dayNumber <= 90
    && request.resource.data.stageId is number
    && request.resource.data.stageId >= 1
    && request.resource.data.stageId <= 4
    && request.resource.data.completed == true
    && request.resource.data.completedAt is string;
}
```

*Lưu ý: Trước khi bạn phê duyệt và deploy rule này lên project `moneycare-2cde5`, việc đọc/ghi tiến độ Lộ trình lên Cloud trên tài khoản thật sẽ nhận lỗi `permission-denied` và ứng dụng sẽ báo trung thực thay vì giả lập hoàn thành.*

---

## 9. Kết quả Build & Kiểm thử

### A. Build & Static Analysis
- `cd web && npm run build` (`tsc -b && vite build`): **PASS (Exit Code 0)**, `built in 6.75s`, **0 lỗi TypeScript**, **0 lỗi Vite**.
- IDE Static Analysis (`studio_analyze_file`) trên 5 file Phase 2: **0 lỗi, 0 cảnh báo**.

### B. Unit Tests (Chế độ Local / Mock Node — KHÔNG dùng Emulator và KHÔNG ghi Firebase thực tế)
- **10/10 bộ unit test PASS (Exit Code 0):**
  1. `src/data/academyRoadmap.test.ts` — **PASS** (4 giai đoạn, 90 ngày liên tục, nội dung 3 bài đầu, URL/unlock guard, tính %).
  2. `src/services/academyRoadmapService.test.ts` — **PASS** *(Local/Mock mode)*: lưu lần đầu không giả Cloud, chống ghi đè idempotent, giữ tiến độ sau reload, chặn `day-4`/`day-16`/`day-999`, và xác minh XP/Streak giữ nguyên 100%.
  3. `src/utils/finance.test.ts` — **PASS**
  4. `src/utils/financeContextBuilder.test.ts` — **PASS**
  5. `src/services/academyService.test.ts` — **PASS**
  6. `src/data/academyQuestions.test.ts` — **PASS**
  7. `src/services/aiConversationService.test.ts` — **PASS**
  8. `src/services/transactionService.test.ts` — **PASS**
  9. `src/utils/authErrors.test.ts` — **PASS**
  10. `src/pages/transactionHistoryAndForm.test.ts` — **PASS**

### C. Kiểm thử Render Component (SSR `renderToStaticMarkup` — Mock props)
- Đã kiểm thử render không lỗi cho `RoadmapTab` (màn 4 giai đoạn & màn 15 ngày của Giai đoạn 1) và `RoadmapLessonView` (đủ cả Bài 1, Bài 2, Bài 3); xác nhận không có nhãn `+XP` giả, đầy đủ nút quay về Lộ trình và nhãn `"Chưa khả dụng"` cho Ngày 4–15.

---

## 10. Những gì chưa kiểm thử thực tế

- **Firebase Emulator Suite:** Chưa chạy kiểm thử tự động Security Rules bằng Firestore Emulator.
- **Firebase Production (`moneycare-2cde5`) & Trình duyệt thực tế:** Chưa đăng nhập bằng tài khoản thật để test ghi/đọc Cloud thực tế (`users/{uid}/academyRoadmap/{lessonId}`) vì (1) nghiêm cấm tạo dữ liệu thử nghiệm trên tài khoản thật và (2) bản cập nhật `firestore.rules` chưa được bạn phê duyệt và deploy.
- **Kiểm tra trực quan mobile thực tế (375px / 390px / 430px):** Đề nghị bạn chạy `cd web && npm run dev`, mở `/home` → **MoneyCare Academy** → tab **Lộ trình** để kiểm tra trực tiếp trước khi phê duyệt deploy rules và chuyển sang Phase 3.

---

## 11. Xác nhận Hôm nay, Hồ sơ khó & tính năng MoneyCare không bị ảnh hưởng

- **Tab Hôm nay (`TodayMissionTab.tsx`):** Không bị chỉnh sửa; vẫn giữ nguyên câu hỏi hằng ngày, XP, Level, Streak và Ví Bé.
- **Tab Hồ sơ khó:** Không bị chỉnh sửa nội dung; chưa xây dựng Boss Battle hay trò chơi 7 ngày.
- **Các phân hệ khác:** Không sửa Dashboard, BottomNavigation, Transactions, Analytics, Budget, Authentication hay Firebase AI Logic / Gemini Chatbot.

---

## 12. Xác nhận không commit, push GitHub hoặc deploy

- **XÁC NHẬN:** Không thực hiện `git add`, `git commit`, `git push`, không tạo Pull Request và **không** deploy `firestore.rules` hay Firebase Hosting.
