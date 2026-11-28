# MONEYCARE ACADEMY – PHASE 3 REPORT
## Tab "Hồ sơ khó" & Trò chơi Boss Battle – 7 ngày với 200k

- **Dự án:** MoneyCare (`web/`)
- **Phạm vi:** Xây dựng đầy đủ Tab **Hồ sơ khó** (`/academy?tab=advanced`) với 4 hồ sơ theo thiết kế và trò chơi hoàn chỉnh **Boss Battle – 7 ngày với 200k** (`/academy?tab=advanced&case=boss-battle-200k`).
- **Bảo toàn kiến trúc:** Giữ nguyên đúng 3 tab cố định (`Hôm nay`, `Lộ trình`, `Hồ sơ khó`), giữ nguyên Dashboard, BottomNavigation, Transactions, Budgets, Academy XP/Level/Streak, tiến độ Lộ trình 90 bài học, Firebase AI Logic và `web/firestore.rules`.

---

## 1. Danh sách tệp đã tạo mới và chỉnh sửa trong Phase 3

### Tệp tạo mới
1. `web/src/data/bossBattle200k.ts` — Danh sách 4 hồ sơ khó, nội dung 7 ngày (21 phương án tương tác kèm câu thoại linh vật Ví Bé), và toàn bộ engine tài chính TypeScript thuần (`createInitialBossBattleState`, `startBossBattle`, `applyBossBattleChoice`, `advanceBossBattleDay`, `evaluateBossBattleOutcome`, `validateBossBattleState`).
2. `web/src/services/bossBattleStorageService.ts` — Dịch vụ lưu/tải/khởi tạo lại ván chơi theo UID trên `localStorage` kèm kiểm định schema và chống ghi đè ngoài ý muốn.
3. `web/src/components/academy/HardCasesTab.tsx` — Giao diện danh sách 4 hồ sơ khó (Boss Battle mở chơi thật + 3 hồ sơ `"Sắp mở"`).
4. `web/src/components/academy/BossBattleView.tsx` — 3 màn hình hoàn chỉnh của Boss Battle: (A) Giới thiệu, (B) Gameplay Ngày 1–7, (C) Tổng kết kết quả & Nhật ký 7 ngày + Chơi lại.
5. `web/src/data/bossBattle200k.test.ts` — Bộ kiểm thử đơn vị cho engine thuần (9 nhóm test).
6. `web/src/services/bossBattleStorageService.test.ts` — Bộ kiểm thử lưu trữ thiết bị và cách ly dữ liệu thật (6 nhóm test).

### Tệp chỉnh sửa
7. `web/src/pages/AcademyPage.tsx` — Chỉ thay thế nội dung nhánh `activeTab === 'advanced'`, bổ sung URL guard cho `?tab=advanced&case=...` và nối state/handlers cho Boss Battle. Không thay đổi Tab `Hôm nay` hay Tab `Lộ trình`.

---

## 2. Giao diện đã hoàn thành

Tuân thủ thiết kế trắng – xanh dương (`#2F5BEA`), card bo góc, mobile-first (tương thích 375px, 390px, 430px), không phá `BottomNavigation` và tái sử dụng linh vật **Ví Bé** (`ViBeMascot.tsx`):

1. **Tab Hồ sơ khó (`HardCasesTab.tsx`):**
   - Hero banner xanh dương MoneyCare + Ví Bé.
   - Hiển thị đủ **4 hồ sơ** theo thiết kế:
     1. **Boss Battle – 7 ngày với 200k** (nhãn `Phổ biến`, nút `Bắt đầu thử thách` hoặc `Tiếp tục Ngày X/7` nếu đang chơi dở, kèm mini-status ngân sách/nợ/thiết yếu).
     2. **Gánh xôi khởi nghiệp** — hiển thị rõ `Sắp mở`, chưa cho phép chơi.
     3. **Mất việc bất ngờ** — hiển thị rõ `Sắp mở`, chưa cho phép chơi.
     4. **Thẻ tín dụng không phải tiền miễn phí** — hiển thị rõ `Sắp mở`, chưa cho phép chơi.
   - Thông báo minh bạch về tiền giả lập & lưu cục bộ trên thiết bị.
2. **Boss Battle – Màn A: Giới thiệu trò chơi (`BossBattleView.tsx`):**
   - Minh họa Boss bát mì + Ví Bé, 3 ô chỉ số (`7 ngày`, `200.000 đ Ngân sách`, `100/100 Thiết yếu` — không hiển thị `+100 XP` giả).
   - Tóm tắt luật chơi và nút `Bắt đầu thử thách` + nút quay về `Quay về Hồ sơ khó`.
3. **Boss Battle – Màn B: Gameplay Ngày 1/7 → Ngày 7/7 (`BossBattleView.tsx`):**
   - Thanh điều hướng trên: `< Hồ sơ khó`, `Ngày X / 7`, nút `Chơi lại` có hộp xác nhận 2 bước (tránh bấm nhầm làm mất ván chơi).
   - Thanh tiến độ 7 đoạn (xanh lá = đã qua, xanh dương = ngày hiện tại).
   - HUD tài chính cập nhật tức thì: **Ngân sách giả lập còn lại**, **Nợ phát sinh**, **Nhu cầu thiết yếu (0–100)** và **Tổng đã chi**.
   - Bong bóng thoại **Ví Bé** phản ứng theo từng ngày và từng lựa chọn cụ thể.
   - 3 lựa chọn `A / B / C` hiển thị rõ số tiền (`-XX.000 đ` / `+XX.000 đ`), tác động dự kiến, nút `Xác nhận lựa chọn` (khóa ngay sau khi xác nhận để không trừ tiền trùng), thẻ hậu quả và nút `Sang Ngày X+1 / 7` (hoặc `Xem tổng kết 7 ngày`).
4. **Boss Battle – Màn C: Tổng kết kết quả & Chơi lại (`BossBattleView.tsx`):**
   - 3 mức kết quả minh bạch: **Chiến thắng**, **Vượt qua khó khăn**, **Cần thử lại**.
   - 4 thẻ chỉ số cuối ván (`Ngân sách còn lại`, `Nợ phát sinh`, `Tổng đã chi`, `Nhu cầu thiết yếu X/7 ngày đủ`), lời tổng kết của Ví Bé, bài học tài chính, **Nhật ký quyết định 7 ngày**, nút `Chơi lại từ đầu` và `Quay về Hồ sơ khó`.

---

## 3. Cơ chế trò chơi & Luồng điều hướng

- **Luồng hoàn chỉnh:** `MoneyCare Academy → Hồ sơ khó → Boss Battle → Bắt đầu → Ngày 1/7 → ... → Ngày 7/7 → Kết quả → Hồ sơ khó`.
- **Chống trừ tiền hai lần:** `applyBossBattleChoice()` kiểm tra `history.some(r => r.dayNumber === dayNumber)`. Khi ngày hiện tại đã xác nhận, mọi lần bấm lặp đều bị chặn (`reason: 'already-confirmed'`).
- **Chống nhảy ngày sai quy trình:** `advanceBossBattleDay()` chỉ chuyển sang `currentDay + 1` khi ngày hiện tại đã có bản ghi xác nhận trong `history`; `applyBossBattleChoice()` chỉ nhận đúng `dayNumber === state.currentDay`.
- **Không reset ngoài ý muốn:** Quay về `Hồ sơ khó` khi đang chơi ở Ngày `X/7` vẫn giữ nguyên ván chơi trong state và `localStorage`; khi quay lại sẽ tiếp tục ngay tại Ngày `X/7`. Chỉ tạo ván mới khi người dùng chủ động xác nhận chơi lại.

---

## 4. Bảy ngày tình huống & Các lựa chọn

| Ngày | Chủ đề tình huống | A | B | C |
|---|---|---|---|---|
| **Ngày 1** | Bạn bè rủ ăn buffet 199k | Đi buffet (`-199.000 đ`) — *"Ủa, còn 200k mà buffet 199k hả chủ nhân?"* | Hẹn sau lương, tự nấu (`-25.000 đ`) | Nhịn ăn tối (`0 đ`, bỏ bữa `-25` thiết yếu) |
| **Ngày 2** | Shopee Flash Sale 50% | Chốt áo sale + ăn (`-150.000 đ`) — *"Sale 50% không có nghĩa ví tự nhiên giàu hơn đâu!"* | Bỏ qua sale, chỉ ăn đủ bữa (`-30.000 đ`) | Mua áo sale & nhịn ăn (`-120.000 đ`, bỏ bữa `-30`) |
| **Ngày 3** | Trời mưa lớn (chi phí di chuyển) | Xe công nghệ giờ cao điểm + ăn (`-95.000 đ`) | Áo mưa đi xe buýt/ghép xe + ăn (`-35.000 đ`) | Đi bộ 8km dưới mưa & bỏ bữa trưa (`0 đ`, `-30`) |
| **Ngày 4** | Phát sinh thiết yếu (thủng lốp & đau họng) | Vá lốp + thuốc cơ bản + cơm nhà (`-40.000 đ`) | Thay cặp lốp đắt + nước tăng lực (`-160.000 đ`) — *"Ví Bé đề nghị họp khẩn về ngân sách!"* | Chỉ vá lốp, bỏ thuốc & nhịn trưa (`-15.000 đ`, `-25`) |
| **Ngày 5** | Bạn bè rủ đi cà phê sống ảo | Full combo nước + bánh + ăn ngoài (`-130.000 đ`) | Trà đá trò chuyện + cơm nhà (`-25.000 đ`) | Gọi ly nước 65k, nhịn bữa tối (`-65.000 đ`, `-25`) |
| **Ngày 6** | Điều chỉnh ngân sách trước 2 ngày cuối | Bán giáo trình cũ (`+30.000 đ`) & tự nấu (`-20.000 đ`, `+5` thiết yếu) | Giữ giáo trình, tự nấu cơm nhà (`-20.000 đ`) | Đặt giao đồ ăn + trà sữa ăn mừng sớm (`-110.000 đ`) |
| **Ngày 7** | Ngày cuối trước khi nhận lương | Tự nấu đủ bữa + đi lại tối giản (`-20.000 đ`) | Ăn lẩu ăn mừng sớm (`-150.000 đ`) | Ăn mì gói khô cả ngày (`-10.000 đ`, thiếu chất `-25`) |

---

## 5. Công thức tính tiền & Xếp loại kết quả

### Công thức tính từng ngày (`applyBossBattleChoice`)
- Tiền khả dụng trong ngày: $\text{availableCash} = \text{budget} + \text{income}$
- Nếu $\text{availableCash} \ge \text{cost}$:
  - $\text{nextBudget} = \text{availableCash} - \text{cost}$, $\text{debtAdded} = 0$
- Nếu $\text{availableCash} < \text{cost}$:
  - $\text{nextBudget} = 0$, $\text{debtAdded} = \text{cost} - \text{availableCash}$
- Cộng dồn:
  - $\text{nextDebt} = \text{debt} + \text{debtAdded}$
  - $\text{nextTotalSpent} = \text{totalSpent} + \text{cost}$
  - $\text{nextEssentialsScore} = \text{clamp}(\text{essentialsScore} + \text{essentialDelta},\; 0,\; 100)$
  - $\text{nextEssentialsMissed} = \text{essentialsMissed} + (\text{missedEssential} ? 1 : 0)$

### Công thức đánh giá kết quả sau 7 ngày (`evaluateBossBattleOutcome`)
1. **`failed` (Cần thử lại):** Khi `debt > 50.000 đ` **HOẶC** `essentialsMissed >= 2` **HOẶC** `essentialsScore < 50`.
   - Đảm bảo **bỏ bữa / bỏ qua nhu cầu thiết yếu để giữ tiền luôn bị tính là thất bại**, kể cả khi còn dư `100.000 đ` và `0 đ` nợ.
2. **`victory` (Chiến thắng):** Khi `debt === 0` **VÀ** `budget > 0` **VÀ** `essentialsMissed === 0` **VÀ** `essentialsScore >= 70`.
   - Hai đường thắng đã kiểm thử:
     - Đường tối ưu có bán giáo trình (`B, B, B, A, B, A, A`): dư **`35.000 đ`**, `0 đ` nợ, `7/7` ngày đủ thiết yếu.
     - Đường chỉ chi tiêu hợp lý (`B, B, B, A, B, B, A`): dư **`5.000 đ`**, `0 đ` nợ, `7/7` ngày đủ thiết yếu.
3. **`survived_hard` (Vượt qua khó khăn):** Các trường hợp hoàn thành 7 ngày còn lại (`0 < debt <= 50.000 đ`, hoặc `budget === 0`, hoặc lỡ bỏ thiết yếu đúng 1 lần).

---

## 6. Cơ chế lưu tiến độ & Đề xuất Schema Cloud Firestore (Chưa triển khai)

### Cơ chế lưu hiện tại (Phase 3)
- Lưu cục bộ trên thiết bị qua `localStorage` theo khóa riêng cho từng UID: `moneycare_academy_boss_battle_200k_v1_${uid}`.
- Có `validateBossBattleState()` chặn dữ liệu hỏng/sai phiên bản và cơ chế chống ghi đè thụt lùi (`stale-overwrite-blocked`) trên cùng `runId`.
- Giao diện hiển thị rõ đây là **tiền giả lập, lưu trên thiết bị (chưa đồng bộ Cloud)** và hoàn toàn tách biệt với số dư thật, Transactions, Budgets, Academy XP, Level, Streak và Roadmap.

### Đề xuất Schema & Security Rules nếu đồng bộ Cloud Firestore ở Phase sau (KHÔNG sửa/deploy trong lượt này)
- **Đường dẫn đề xuất:** `users/{userId}/academyHardCases/{caseId}` (ví dụ `caseId == 'boss-battle-200k'`).
- **Schema đề xuất:** `{ caseId, runId, status, currentDay, budget, debt, totalSpent, totalIncome, essentialsScore, essentialsMissed, outcome, updatedAt }` (chỉ lưu tiến độ mô phỏng, không gắn XP trực tiếp ở client).
- **Đề xuất Security Rules (chờ kiểm duyệt sau):** Chỉ cho phép `request.auth != null && request.auth.uid == userId`, kiểm tra `keys().hasOnly(...)`, `caseId in ['boss-battle-200k']`, `currentDay is int && 1..7`, `budget >= 0`, `debt >= 0`, `essentialsScore is int && 0..100`, `allow delete: if false`.

---

## 7. Kết quả Build & Kiểm thử tự động

### 7.1. Production Build (`cd web && npm run build`)
- **Kết quả:** **PASS** — Exit code `0`, `0` lỗi TypeScript, Vite build thành công `2081 modules transformed`.

### 7.2. Unit Tests (`npx tsx` — 12/12 bộ test PASS)
| Bộ kiểm thử | Kết quả | Nội dung kiểm chứng |
|---|---|---|
| `src/data/bossBattle200k.test.ts` | **PASS** (9/9) | 4 hồ sơ, 7 ngày khác nhau, câu thoại Ví Bé, đường thắng A (`+35k`), đường thắng B (`+5k`), vượt khó (`25k nợ`), thua do nợ, thua do bỏ bữa (`100k tiền mặt vẫn FAILED`), chống trừ tiền trùng, chống nhảy ngày, validator |
| `src/services/bossBattleStorageService.test.ts` | **PASS** (6/6) | Lưu/tải lại Ngày 3/7, cách ly UID, chống ghi đè thụt lùi, dữ liệu hỏng, chơi lại tạo `runId` mới, xác minh Transactions / XP / Streak / Roadmap bất biến 100% |
| `src/data/academyRoadmap.test.ts` | **PASS** (6/6) | Lộ trình 90 bài học & mở khóa chương |
| `src/services/academyRoadmapService.test.ts` | **PASS** (6/6) | Lưu tiến độ Lộ trình |
| `src/services/academyService.test.ts` | **PASS** | XP, Level, Streak |
| `src/data/academyQuestions.test.ts` | **PASS** | 20 câu hỏi hằng ngày |
| `src/utils/finance.test.ts` | **PASS** | Tính toán thu/chi/ngân sách |
| `src/utils/financeContextBuilder.test.ts` | **PASS** | Ngữ cảnh AI |
| `src/services/aiConversationService.test.ts` | **PASS** | Hội thoại AI |
| `src/services/transactionService.test.ts` | **PASS** | Giao dịch thật |
| `src/utils/authErrors.test.ts` | **PASS** | Ánh xạ lỗi đăng nhập |
| `src/pages/transactionHistoryAndForm.test.ts` | **PASS** | Lọc & tìm kiếm giao dịch |

### 7.3. React SSR Render Check (`verify_phase3_ssr.tsx`)
- **Kết quả:** **PASS** (4/4) — Render thành công `HardCasesTab` (trạng thái ban đầu & đang chơi Ngày 3/7) và `BossBattleView` trên toàn bộ Màn A (Intro), Màn B (đủ Ngày 1–7 trước & sau xác nhận) và Màn C (Chiến thắng & Thua do bỏ bữa).

### 7.4. Kiểm tra tĩnh (`studio_analyze_file`)
- **Kết quả:** **PASS** — 0 lỗi/cảnh báo trên cả 7 tệp Phase 3.

---

## 8. Những phần đã kiểm chứng thực tế vs Chưa kiểm chứng

### Đã kiểm chứng thực tế (VERIFIED)
- Logic tài chính thuần, công thức trừ tiền, phát sinh nợ, chỉ số thiết yếu và phân loại 3 kết quả qua 9 nhóm unit tests.
- Lưu/tải lại theo UID, chống ghi đè thụt lùi, chơi lại tạo ván mới và cách ly 100% với Transactions / XP / Streak / Roadmap qua 6 nhóm service tests.
- Toàn bộ 12 bộ unit tests của dự án + TypeScript `tsc -b` + Vite production build + React SSR render toàn bộ màn hình Phase 3.

### Chưa kiểm chứng (NOT VERIFIED)
- **Tương tác trực tiếp trên trình duyệt thật (DOM click, responsive visual inspection tại 375px / 390px / 430px) và ảnh chụp màn hình giao diện thực tế:** **`NOT VERIFIED`** do môi trường hiện tại không có công cụ điều khiển trình duyệt web (Playwright/Puppeteer/Chrome DevTools) để mở ứng dụng chạy thật và chụp ảnh màn hình.

---

## 9. Hướng dẫn người dùng kiểm thử thực tế trên trình duyệt

1. Chạy `cd web && npm run dev`, mở trình duyệt (bật DevTools responsive tại `375px`, `390px`, `430px`) và vào **MoneyCare Academy → Hồ sơ khó**.
2. Kiểm tra đủ **4 hồ sơ** (Boss Battle mở chơi được; Gánh xôi khởi nghiệp, Mất việc bất ngờ, Thẻ tín dụng hiển thị `Sắp mở`).
3. Bấm **Bắt đầu thử thách** → đọc màn Giới thiệu → bấm **Bắt đầu thử thách**.
4. Chơi thử 2 ngày, bấm **< Hồ sơ khó**, rồi quay lại Boss Battle → xác nhận tiếp tục đúng **Ngày 3/7** không bị reset.
5. Chơi hết **7/7 ngày** theo nhánh hợp lý (`B, B, B, A, B, A, A`) → xác nhận kết quả **Chiến thắng** với số dư **`35.000 đ`**, `0 đ` nợ.
6. Bấm **Chơi lại từ đầu**, thử nhánh bỏ bữa (`C, B, C, C, B, B, C`) → xác nhận kết quả **Cần thử lại** dù vẫn còn `100.000 đ` tiền mặt.
7. Mở lại Tab **Hôm nay**, Tab **Lộ trình**, **Dashboard** và **Giao dịch** → xác nhận XP, Level, Streak, tiến độ Lộ trình và số dư/giao dịch thật hoàn toàn không thay đổi.
