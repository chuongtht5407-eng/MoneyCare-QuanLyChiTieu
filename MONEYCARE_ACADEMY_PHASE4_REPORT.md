# MONEYCARE ACADEMY – PHASE 4 REPORT
## Hoàn thiện toàn bộ 3 trò chơi còn lại trong tab Hồ sơ khó

- **Ngày hoàn thành:** 2026-11-28
- **Dự án:** MoneyCare (`C:\Users\thien\AndroidStudioProjects\MoneyCare`, Web App trong `web/`)
- **Firebase Project ID:** `moneycare-2cde5` (không deploy, không chỉnh sửa Firestore Rules)
- **Phạm vi:** Triển khai đầy đủ 3 trò chơi còn lại trong tab **Hồ sơ khó** thuộc **MoneyCare Academy** (Checkpoint 4A, 4B, 4C), tích hợp vào `HardCasesTab` và `AcademyPage`, viết unit tests, xác minh production build và chạy kiểm thử E2E + responsive bằng Headless Chrome thực tế.

---

## 1. Trạng thái hoàn thành Phase 4A, 4B, 4C

| Checkpoint | Trò chơi | Engine | Storage theo UID | Giao diện UI | Unit Tests | Build & E2E Local | Trạng thái tổng |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Phase 4A** | Gánh xôi khởi nghiệp – 7 ngày làm chủ | Hoàn thành | Hoàn thành | Hoàn thành | 13/13 PASS | PASS | **TESTED** |
| **Phase 4B** | Mất việc bất ngờ – 30 ngày giữ vững tài chính | Hoàn thành | Hoàn thành | Hoàn thành | 12/12 PASS | PASS | **TESTED** |
| **Phase 4C** | Thẻ tín dụng không phải tiền miễn phí – 3 kỳ sao kê | Hoàn thành | Hoàn thành | Hoàn thành | 9/9 PASS | PASS | **TESTED** |
| **Tích hợp & Hồi quy** | `HardCasesTab` + `AcademyPage` + Boss Battle | Hoàn thành | Hoàn thành | Hoàn thành | 18/18 suites PASS | PASS | **TESTED** |

> Lưu ý phân loại trung thực: Kiểm thử E2E đã chạy trên Headless Chrome thực tế ở chế độ local-mode (không đăng nhập phiên Firebase Auth production thật). Chi tiết phân biệt được nêu rõ ở **Mục 9, Mục 11 và Mục 13**.

---

## 2. Danh sách file tạo mới và chỉnh sửa trong Phase 4

### 2.1. File tạo mới (15 files)

**Phase 4A – Gánh xôi khởi nghiệp:**
1. `web/src/data/stickyRiceGame.ts` — Pure TypeScript game engine 7 ngày (cấu hình, 7 sự kiện kinh doanh, tính chi phí/doanh thu/lãi lỗ/tồn hỏng, đánh giá 3 kết quả, validator).
2. `web/src/data/stickyRiceGame.test.ts` — 8 test suites kiểm tra công thức, chặn chi quá vốn, 7 ngày có lãi, hòa vốn/lãi thấp, thua lỗ, chống tính trùng ngày.
3. `web/src/services/stickyRiceStorageService.ts` — Service lưu trữ `localStorage` tách theo UID (`moneycare:game:sticky-rice:${uid}`).
4. `web/src/services/stickyRiceStorageService.test.ts` — 5 test suites kiểm tra cô lập UID, hỏng JSON, schema version, chống ghi đè dữ liệu cũ, reset cô lập.
5. `web/src/components/academy/StickyRiceGameView.tsx` — Giao diện hoàn chỉnh (Intro + `StickyRiceCartHeroSvg`, Gameplay 4 bước/ngày, Tổng kết ngày, Màn kết thúc 7 ngày + sổ cái 7 ngày + Chơi lại).

**Phase 4B – Mất việc bất ngờ:**
6. `web/src/data/jobLossGame.ts` — Pure TypeScript game engine 30 ngày / 6 chặng (quỹ dự phòng 6.000.000 đ, 8 chỉ số, thu nhập cơ hội có điều kiện Chặng 5, trả hóa đơn chậm Chặng 6, đánh giá 3 kết quả).
7. `web/src/data/jobLossGame.test.ts` — 8 test suites kiểm tra đủ 8 chỉ số, đạt/không đạt ngưỡng thu nhập cơ hội, trả nợ hóa đơn, chặn chiến thắng nếu vay nặng lãi hoặc bỏ đói, chống trừ trùng chặng.
8. `web/src/services/jobLossStorageService.ts` — Service lưu trữ `localStorage` tách theo UID (`moneycare:game:job-loss:${uid}`).
9. `web/src/services/jobLossStorageService.test.ts` — 4 test suites kiểm tra lưu/đọc, cô lập UID, dữ liệu lỗi, reset không ảnh hưởng game khác.
10. `web/src/components/academy/JobLossGameView.tsx` — Giao diện hoàn chỉnh (Intro + `EmergencyBriefcaseHeroSvg`, HUD quỹ dự phòng / tiến độ tìm việc / nhu cầu thiết yếu, 6 chặng 3 phương án, Tổng kết chặng, Màn kết thúc 30 ngày + nhật ký 6 chặng).

**Phase 4C – Thẻ tín dụng không phải tiền miễn phí:**
11. `web/src/data/creditCardGame.ts` — Pure TypeScript game engine 3 kỳ sao kê (hạn mức 10.000.000 đ, ngân sách trả thẻ 4.500.000 đ/kỳ, lãi đơn giản hóa 24%/năm = 2%/tháng, thanh toán tối thiểu 5% sàn 100.000 đ, phí trễ hạn 200.000 đ).
12. `web/src/data/creditCardGame.test.ts` — 5 test suites kiểm tra chặn vượt hạn mức 10 triệu, trả toàn bộ 0 đ lãi, trả tối thiểu phát sinh lãi 2%, bỏ quên thanh toán phát sinh phí trễ 200k + lãi 2%, chống tính lãi trùng kỳ.
13. `web/src/services/creditCardStorageService.ts` — Service lưu trữ `localStorage` tách theo UID (`moneycare:game:credit-card:${uid}`).
14. `web/src/services/creditCardStorageService.test.ts` — 4 test suites kiểm tra lưu/đọc, cô lập UID, hỏng dữ liệu, reset cô lập.
15. `web/src/components/academy/CreditCardGameView.tsx` — Giao diện hoàn chỉnh (Intro + `SimulatedCreditCardHeroSvg` + ghi chú minh bạch mô hình giáo dục đơn giản hóa, Kỳ 1 checklist nhiều món, Kỳ 2–3 sao kê + bảng trích dẫn phương án trả thẻ, Màn kết thúc 3 kỳ + lịch sử 3 kỳ).

### 2.2. File chỉnh sửa (4 files)

1. `web/src/data/bossBattle200k.ts` — **Chỉ** cập nhật metadata của 3 trò chơi mới trong mảng `HARD_CASE_PROFILES` (`isPlayable: true`, badge `'7 ngày'`, `'30 ngày'`, `'3 kỳ sao kê'`). Toàn bộ logic engine Boss Battle 7 ngày với 200k **giữ nguyên 100%**.
2. `web/src/data/bossBattle200k.test.ts` — Cập nhật Test 1 phản ánh đủ 4 trò chơi ở trạng thái `isPlayable: true` (giữ nguyên toàn bộ các bài test gameplay Boss Battle).
3. `web/src/components/academy/HardCasesTab.tsx` — Gỡ hoàn toàn trạng thái `"Sắp mở"`, hiển thị cả 4 trò chơi có thể mở chơi ngay kèm trạng thái thực tế (`Sẵn sàng`, `Đang chơi: ...`, `Đã hoàn thành`), 3 chỉ số tóm tắt theo từng trò chơi và CTA trung thực (`Bắt đầu` / `Tiếp tục ...` / `Xem kết quả`), giữ đúng thông báo `"Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud."`.
4. `web/src/pages/AcademyPage.tsx` — Quản lý state và storage độc lập cho cả 4 trò chơi theo `uid`, tự nạp lại an toàn khi đổi tài khoản / đăng xuất, kiểm tra tham số `?case=` hợp lệ với cả 4 `HardCaseId` (chuyển hướng an toàn về tab Hồ sơ khó nếu `?case=` không tồn tại), render đúng màn hình trò chơi bên trong tab 3 (`Hồ sơ khó`).

### 2.3. File báo cáo mới
- `MONEYCARE_ACADEMY_PHASE4_REPORT.md` (file này).

---

## 3. Cấu trúc ba game engine

Cả 3 engine được thiết kế theo mô hình **Pure TypeScript State Machine**, tách biệt hoàn toàn khỏi React UI, dùng số nguyên VND (`Math.round` / integer arithmetic), bất biến (immutable state transitions) và có cơ chế chống xử lý trùng bước (`anti-double-deduction` / `anti-double-interest`):

1. **`stickyRiceGame.ts` (Gánh xôi khởi nghiệp):**
   - State: `status` (`intro` | `playing` | `completed`), `currentDay` (`1..7`), `cash`, `initialCapital`, `totalRevenue`, `totalCost`, `totalProfit`, `totalSoldPortions`, `totalWastedPortions`, `dayRecords[]`, `pendingSummary`, `outcome`, `updatedAt`.
   - API chính: `createInitialStickyRiceState`, `startStickyRiceGame`, `calculateDayUpfrontCost`, `getMaxAffordablePortions`, `confirmStickyRiceDay`, `advanceStickyRiceDay`, `evaluateStickyRiceOutcome`, `validateStickyRiceState`.
2. **`jobLossGame.ts` (Mất việc bất ngờ):**
   - State: `status` (`intro` | `playing` | `completed`), `currentStage` (`1..6`), `cash`, `initialCash`, `totalEssentialSpent`, `totalNonEssentialSpent`, `totalIncomeEarned`, `debt`, `unpaidBills`, `jobSearchProgress` (`0..100`), `essentialsScore` (`0..100`), `usedRiskyDebt`, `missedEssentialCount`, `stageRecords[]`, `pendingSummary`, `outcome`, `updatedAt`.
   - API chính: `createInitialJobLossState`, `startJobLossGame`, `confirmJobLossStage`, `advanceJobLossStage`, `evaluateJobLossOutcome`, `validateJobLossState`.
3. **`creditCardGame.ts` (Thẻ tín dụng không phải tiền miễn phí):**
   - State: `status` (`intro` | `playing` | `completed`), `currentCycle` (`1..3`), `creditLimit`, `monthlyPaymentBudget`, `currentBalance`, `totalSpent`, `totalPaid`, `totalInterestPaid`, `totalLateFees`, `missedPaymentCount`, `minimumOnlyCount`, `cycleRecords[]`, `pendingSummary`, `outcome`, `updatedAt`.
   - API chính: `createInitialCreditCardState`, `startCreditCardGame`, `calculateMinimumPayment`, `getCreditCardPaymentQuotes`, `confirmCreditCardCycle`, `advanceCreditCardCycle`, `evaluateCreditCardOutcome`, `validateCreditCardState`.

---

## 4. Các màn hình và route

Giữ nguyên 100% route chính `/academy` và đúng 3 tab cố định (**Hôm nay** · **Lộ trình** · **Hồ sơ khó**), không bổ sung tab thứ 4 và không thêm route cấp cao mới:

| URL | Màn hình hiển thị | Nút quay lại |
| --- | --- | --- |
| `/academy?tab=advanced` | `HardCasesTab` (danh sách 4 trò chơi Hồ sơ khó) | — |
| `/academy?tab=advanced&case=boss-battle-200k` | `BossBattleView` (Phase 3/3.1 – giữ nguyên) | Quay lại tab Hồ sơ khó |
| `/academy?tab=advanced&case=ganh-xoi-khoi-nghiep` | `StickyRiceGameView` (Intro → Ngày 1..7 → Tổng kết ngày → Màn kết thúc) | Quay lại tab Hồ sơ khó |
| `/academy?tab=advanced&case=mat-viec-bat-ngo` | `JobLossGameView` (Intro → Chặng 1..6 → Tổng kết chặng → Màn kết thúc) | Quay lại tab Hồ sơ khó |
| `/academy?tab=advanced&case=the-tin-dung` | `CreditCardGameView` (Intro → Kỳ 1..3 → Tổng kết kỳ → Màn kết thúc) | Quay lại tab Hồ sơ khó |
| `/academy?tab=advanced&case=<invalid-id>` | Tự động dọn query `case` và hiển thị an toàn `HardCasesTab` | — |

---

## 5. Các công thức tài chính

Tất cả phép tính sử dụng số nguyên VND (không sai số dấu phẩy động) và ghi rõ trong giao diện rằng đây là **mô phỏng giáo dục đơn giản hóa**.

### 5.1. Gánh xôi khởi nghiệp (7 ngày)
- **Vốn khởi điểm:** `1.000.000 đ`
- **Chi phí đầu ngày (cơ bản):**
  - Nguyên liệu: `8.000 đ/suất` (biến động theo sự kiện, ví dụ ngày tăng giá nguyên liệu)
  - Hộp/bao bì: `2.000 đ/suất`
  - Chi phí cố định vận hành: `50.000 đ/ngày`
  - Phụ phí chiến thuật (`extraCost`): `>= 0 đ`
  - $\text{Chi phí ngày} = (\text{suất chuẩn bị} + \text{suất phát sinh}) \times (\text{giá nguyên liệu} + \text{giá bao bì}) + \text{chi phí cố định} + \text{phụ phí chiến thuật}$
- **Kiểm tra khả năng chi trả:** Nếu $\text{Chi phí ngày} > \text{Tiền mặt hiện có}$, hệ thống chặn xác nhận (`insufficient-cash`) và hiển thị số suất tối đa hợp lệ (`getMaxAffordablePortions`).
- **Nhu cầu & bán hàng:**
  - Nhu cầu nền theo mức giá: `15.000 đ` → `55 suất`; `20.000 đ` → `42 suất`; `25.000 đ` → `28 suất`
  - $\text{Khách thực tế} = \max(0,\ \text{nhu cầu nền} + \text{biến động sự kiện/chiến thuật})$
  - $\text{Suất bán được} = \min(\text{tổng suất chuẩn bị},\ \text{khách thực tế})$
  - $\text{Suất tồn hỏng} = \text{tổng suất chuẩn bị} - \text{suất bán được}$ (xôi không để sang ngày sau)
- **Doanh thu, lãi/lỗ & tiền mặt:**
  - $\text{Doanh thu ngày} = \text{suất bán được} \times \text{giá bán}$
  - $\text{Lãi/lỗ ngày} = \text{Doanh thu ngày} - \text{Chi phí ngày}$
  - $\text{Tiền mặt cuối ngày} = \text{Tiền mặt đầu ngày} - \text{Chi phí ngày} + \text{Doanh thu ngày}$
  - $\text{Tổng lãi/lỗ 7 ngày} = \text{Tiền mặt cuối Ngày 7} - 1.000.000$
- **Phân loại kết quả cuối 7 ngày:**
  1. **Kinh doanh có lãi (`profit`):** `totalProfit >= 300.000 đ` và `cash >= 1.300.000 đ`
  2. **Hòa vốn hoặc lãi thấp (`breakeven_low_profit`):** `0 <= totalProfit < 300.000 đ`
  3. **Kinh doanh thua lỗ (`loss`):** `totalProfit < 0`

### 5.2. Mất việc bất ngờ (30 ngày – 6 chặng × 5 ngày)
- **Quỹ dự phòng ban đầu:** `6.000.000 đ`
- **8 chỉ số theo dõi liên tục:**
  1. Tiền mặt còn lại (`cash`)
  2. Tổng chi thiết yếu (`totalEssentialSpent`)
  3. Tổng chi không thiết yếu (`totalNonEssentialSpent`)
  4. Tổng thu nhập tạm thời / cơ hội (`totalIncomeEarned`)
  5. Nợ vay (`debt`)
  6. Hóa đơn chậm thanh toán (`unpaidBills`)
  7. Tiến độ tìm việc (`jobSearchProgress`, `0..100%`, khởi điểm `10%`)
  8. Điểm đáp ứng nhu cầu thiết yếu (`essentialsScore`, `0..100`, khởi điểm `100`)
- **Thu nhập cơ hội có điều kiện (Chặng 5):**
  - Khoản thu nhập `+2.400.000 đ` **chỉ được cộng** khi `jobSearchProgress >= 45` trước khi chốt chặng; nếu chưa đạt ngưỡng, người chơi nhận `0 đ` và hệ thống ghi rõ lý do bỏ lỡ.
- **Trả hóa đơn chậm (Chặng 6):**
  - Nếu chọn phương án tất toán hóa đơn, hệ thống tự trừ đúng $\min(\text{cash khả dụng}, \text{unpaidBills})$ để giảm nợ hóa đơn về `0` hoặc thấp nhất có thể.
- **Phân loại kết quả sau 30 ngày:**
  1. **Vượt khó tốt (`strong_recovery`):** `!usedRiskyDebt && missedEssentialCount === 0 && debt === 0 && unpaidBills === 0 && cash >= 1.500.000 && jobSearchProgress >= 60 && essentialsScore >= 75`
  2. **Vượt qua nhưng cần củng cố tài chính (`survived_strengthen`):** `!usedRiskyDebt && cash >= 0 && debt <= 1.000.000 && unpaidBills <= 1.000.000 && essentialsScore >= 55`
  3. **Cần xây dựng lại kế hoạch (`need_rebuild`):** các trường hợp còn lại (kể cả vay nặng lãi hoặc bỏ đói/thiếu thiết yếu nghiêm trọng dù còn tiền mặt).

### 5.3. Thẻ tín dụng không phải tiền miễn phí (3 kỳ sao kê)
> **Ghi chú mô phỏng giáo dục:** Mô hình đơn giản hóa cho mục đích học tài chính cá nhân, không thay thế biểu phí/lãi suất thực tế từng ngân hàng.

- **Thông số cơ bản:**
  - Hạn mức thẻ giả lập: `10.000.000 đ`
  - Ngân sách trả thẻ mỗi kỳ: `4.500.000 đ`
  - Lãi suất mô phỏng: `24%/năm` tương đương `2%/tháng` tính **chỉ trên phần dư nợ sao kê chưa thanh toán**
  - Thanh toán tối thiểu: `5%` tổng sao kê, sàn tối thiểu `100.000 đ` (nhưng không vượt quá tổng dư nợ sao kê; bằng `0 đ` nếu dư nợ `0 đ`)
  - Phí trễ hạn: `200.000 đ` khi bỏ quên / không thanh toán tối thiểu trong kỳ có dư nợ
- **Kiểm soát hạn mức:**
  - Nếu $\text{Dư nợ đầu kỳ} + \text{Chi tiêu mới} > 10.000.000\text{ đ}$, engine trả về `over-limit` và giao diện khóa xác nhận kèm cảnh báo rõ ràng.
- **Công thức chốt sao kê từng kỳ:**
  - $\text{Tổng dư nợ sao kê} = \text{Dư nợ đầu kỳ} + \text{Chi tiêu mới trong kỳ}$
  - $\text{Số tiền thanh toán thực tế} = \min(\text{mức trả theo phương án},\ \text{tổng dư nợ sao kê},\ \text{ngân sách trả thẻ } 4.500.000\text{ đ})$
  - $\text{Dư nợ chưa trả} = \max(0,\ \text{Tổng dư nợ sao kê} - \text{Số tiền thanh toán thực tế})$
  - **Miễn lãi khi trả toàn bộ đúng hạn:** Nếu $\text{Dư nợ chưa trả} = 0$ → $\text{Lãi phát sinh} = 0\text{ đ}$, $\text{Phí trễ hạn} = 0\text{ đ}$.
  - **Chưa trả hết:** $\text{Lãi phát sinh} = \text{Math.round}(\text{Dư nợ chưa trả} \times 0.02)$.
  - **Không trả tối thiểu (khi tổng sao kê > 0):** $\text{Phí trễ hạn} = 200.000\text{ đ}$.
  - $\text{Dư nợ cuối kỳ (chuyển sang kỳ sau)} = \text{Dư nợ chưa trả} + \text{Lãi phát sinh} + \text{Phí trễ hạn}$ (luôn $\ge 0$, không bao giờ tính lãi trùng cho cùng một kỳ).
- **Phân loại kết quả sau 3 kỳ:**
  1. **Quản lý thẻ tốt (`good_management`):** `currentBalance === 0 && totalInterestPaid === 0 && totalLateFees === 0 && missedPaymentCount === 0`
  2. **Rủi ro nợ cao (`high_debt_risk`):** `missedPaymentCount > 0 || totalLateFees > 0 || currentBalance >= 3.000.000 || totalInterestPaid >= 250.000 || minimumOnlyCount >= 2`
  3. **Cần cải thiện (`needs_improvement`):** các trường hợp còn lại (ví dụ trả chậm một phần phát sinh lãi nhỏ nhưng đã tất toán kịp thời, không trễ hạn).

---

## 6. Cách lưu tiến độ theo UID

Toàn bộ tiến độ 4 trò chơi Hồ sơ khó được lưu cục bộ trên trình duyệt theo từng UID người dùng, hoàn toàn tách biệt với dữ liệu Firestore thật:

| Trò chơi | Storage Service | Khóa `localStorage` | Schema Version |
| --- | --- | --- | --- |
| Boss Battle – 7 ngày với 200k | `bossBattleStorageService.ts` (giữ nguyên Phase 3/3.1) | `moneycare_academy_boss_battle_200k_v1_${uid}` | `1` |
| Gánh xôi khởi nghiệp | `stickyRiceStorageService.ts` | `moneycare:game:sticky-rice:${uid}` | `1` |
| Mất việc bất ngờ | `jobLossStorageService.ts` | `moneycare:game:job-loss:${uid}` | `1` |
| Thẻ tín dụng | `creditCardStorageService.ts` | `moneycare:game:credit-card:${uid}` | `1` |

Cơ chế an toàn đã triển khai đồng bộ cho cả 3 storage service mới:
- Tự chuẩn hóa `uid` fallback (`guest`) nếu chưa có UID.
- Kiểm tra `version === 1` và chạy validator (`validateStickyRiceState` / `validateJobLossState` / `validateCreditCardState`) trước khi trả về UI.
- Nếu JSON hỏng hoặc sai schema → bỏ qua an toàn, xóa key hỏng và trả về trạng thái sạch ban đầu (không làm trắng trang).
- Chống ghi đè state cũ (`updatedAt`) giữa nhiều tab mở song song.
- `reset*State(uid)` chỉ xóa đúng 1 khóa của trò chơi đó và đúng UID đó, không ảnh hưởng 3 trò chơi còn lại, không ảnh hưởng UID khác và không chạm XP/Streak/Lộ trình.

---

## 7. Kết quả Unit Tests (18/18 suites PASS)

Toàn bộ 6 bộ test mới của Phase 4 và 12 bộ test hồi quy toàn dự án đã được chạy bằng `npx tsx` và đều trả về exit code `0`:

### 7.1. Unit tests mới của Phase 4 (6 suites – 34/34 test cases PASS)
1. `web/src/data/stickyRiceGame.test.ts` — **8/8 PASS**
2. `web/src/services/stickyRiceStorageService.test.ts` — **5/5 PASS**
3. `web/src/data/jobLossGame.test.ts` — **8/8 PASS**
4. `web/src/services/jobLossStorageService.test.ts` — **4/4 PASS**
5. `web/src/data/creditCardGame.test.ts` — **5/5 PASS**
6. `web/src/services/creditCardStorageService.test.ts` — **4/4 PASS**

### 7.2. Unit tests hồi quy hiện có (12 suites – 100% PASS)
7. `web/src/data/bossBattle200k.test.ts` — **9/9 PASS**
8. `web/src/services/bossBattleStorageService.test.ts` — **6/6 PASS**
9. `web/src/utils/finance.test.ts` — **PASS**
10. `web/src/utils/financeContextBuilder.test.ts` — **PASS**
11. `web/src/data/academyRoadmap.test.ts` — **PASS**
12. `web/src/services/academyRoadmapService.test.ts` — **PASS**
13. `web/src/services/academyService.test.ts` — **PASS**
14. `web/src/data/academyQuestions.test.ts` — **PASS**
15. `web/src/services/aiConversationService.test.ts` — **PASS**
16. `web/src/services/transactionService.test.ts` — **PASS**
17. `web/src/utils/authErrors.test.ts` — **PASS**
18. `web/src/utils/transactionHistoryAndForm.test.ts` — **PASS**

---

## 8. Kết quả Production Build

Lệnh chạy: `cd web && npm run build` (`tsc -b && vite build`)

- **Kết quả:** **PASS** (Exit code `0`, `0` lỗi TypeScript, `0` lỗi Vite bundle).
- **Modules transformed:** `2090 modules`.
- **Bundle đầu ra:** `dist/assets/index-BGCE65PG.js` (đã build sạch mà không làm thay đổi `.env.local` hay file cấu hình Firebase).

---

## 9. Kết quả kiểm thử E2E thực tế

### Môi trường thực thi
- Trình duyệt: **Headless Chrome thật** điều khiển qua Chrome DevTools Protocol (CDP), kết nối tới Vite dev server tạm thời trên cổng `4181` chạy ở **local-mode** (truyền biến môi trường tiến trình con `VITE_FIREBASE_API_KEY=your_api_key_here`, không sửa `.env.local`, không sửa `dist/`).
- Tổng thời gian chạy kịch bản tự động: `33.1s`, exit code `0`, **`0` console errors**, **`0` uncaught exceptions**.

### Kịch bản đã xác minh thực tế trên Headless Chrome (local-mode)
1. **Tab Hồ sơ khó (`HardCasesTab`):**
   - Hiển thị đủ 4 trò chơi có thể mở chơi ngay, không còn nhãn `"Sắp mở"`.
   - Hiển thị đúng thông báo: `"Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud."`.
   - Xác nhận XP (`170 XP`) và Streak (`2 ngày`) vẫn hiển thị bình thường ở Header Academy.
2. **Gánh xôi khởi nghiệp (full 7 ngày):**
   - Chơi đủ 7 ngày từ Intro → Ngày 1..7 → Màn kết thúc.
   - Bấm liên tiếp 3 lần nút xác nhận ngày (triple-click) → xác nhận không trừ tiền hay ghi trùng ngày.
   - Reload trang ở Ngày 3 (`Page.reload()`) → khôi phục đúng trạng thái Ngày 3.
   - Chuyển tab `Hôm nay` → `Lộ trình` → `Hồ sơ khó` → hiển thị đúng CTA `Tiếp tục Ngày 3/7`.
   - Kết thúc đủ 7 ngày đạt trạng thái **Kinh doanh có lãi** (`profit = +2.170.000 đ`).
   - Bấm **Chơi lại từ đầu** → reset sạch về trạng thái ban đầu.
3. **Mất việc bất ngờ (full 6 chặng / 30 ngày):**
   - Chơi đủ 6 chặng (30 ngày) từ Intro → Chặng 1..6 → Màn kết thúc.
   - Bấm liên tiếp 3 lần nút xác nhận chặng → xác nhận không trừ trùng tiền.
   - Reload trang ở Chặng 3 → khôi phục đúng tiến độ và các chỉ số.
   - Mở khóa thành công thu nhập cơ hội `+2.400.000 đ` khi đạt ngưỡng tìm việc ở Chặng 5.
   - Kết thúc đạt **Vượt khó tốt** (`cash = 2.800.000 đ`).
   - Bấm **Chơi lại từ đầu** → reset sạch về trạng thái ban đầu.
4. **Thẻ tín dụng (full 3 kỳ sao kê):**
   - Thử chọn các món tổng `10.800.000 đ` vượt hạn mức `10.000.000 đ` → giao diện chặn xác nhận và hiện cảnh báo vượt hạn mức.
   - Kỳ 1 quẹt `5.500.000 đ`, chọn `Thanh toán phần lớn` (`4.500.000 đ`) kèm triple-click → tính chính xác lãi `20.000 đ` (2% của `1.000.000 đ` chưa trả), dư nợ cuối kỳ `1.020.000 đ`, không tính lãi trùng.
   - Reload trang ở Kỳ 2 → khôi phục đúng sao kê Kỳ 2.
   - Kỳ 2 tất toán toàn bộ `1.020.000 đ` (lãi `0 đ`), Kỳ 3 không quẹt thêm (`0 đ`).
   - Kết thúc đạt **Cần cải thiện** (`totalInterestPaid = 20.000 đ`, `totalLateFees = 0 đ`, `currentBalance = 0 đ`).
   - Bấm **Chơi lại từ đầu** → reset sạch về trạng thái ban đầu.
5. **Hồi quy Boss Battle, điều hướng lỗi & cô lập dữ liệu:**
   - Bắt đầu Boss Battle 7 ngày với 200k và chốt Ngày 1 → còn `175.000 đ`, quay lại `HardCasesTab` hiển thị đúng huy hiệu `Đang chơi: Ngày 1/7`.
   - Mở URL không hợp lệ `/academy?tab=advanced&case=does-not-exist` → tự động chuyển về danh sách Hồ sơ khó an toàn, không lỗi runtime.
   - Kiểm tra khóa `localStorage` của UID khác không bị tác động, XP (`170 XP`) và Streak (`2 ngày`) không thay đổi sau toàn bộ phiên chơi.

> **Phân biệt rõ:** Các bước trên được kiểm chứng trên **Headless Chrome ở local-mode**, **KHÔNG** phải trên phiên đăng nhập Firebase Auth / Firestore production thật của `moneycare-2cde5`.

---

## 10. Kết quả Responsive (`375px`, `390px`, `430px`)

Đã đo kiểm tự động trên Headless Chrome tại 3 độ phân giải di động (`375×812`, `390×844`, `430×932`) cho `HardCasesTab` và cả 3 màn hình trò chơi mới (Intro, Gameplay, Màn kết thúc):

| Viewport | Tràn ngang (`scrollWidth <= clientWidth`) | 3 tab Academy thẳng hàng | Khoảng trống với BottomNavigation & nút `(+)` | Kết quả |
| --- | --- | --- | --- | --- |
| `375 × 812` | Không tràn ngang (`0px` overflow) | Đạt | Đạt (không che CTA cuối trang) | **PASS** |
| `390 × 844` | Không tràn ngang (`0px` overflow) | Đạt | Đạt (không che CTA cuối trang) | **PASS** |
| `430 × 932` | Không tràn ngang (`0px` overflow) | Đạt | Đạt (không che CTA cuối trang) | **PASS** |

---

## 11. Trạng thái của cả 4 trò chơi trong tab Hồ sơ khó

| Trò chơi | Route query `case` | Mức triển khai | Mức kiểm thử hiện tại | Trạng thái |
| --- | --- | --- | --- | --- |
| 1. Boss Battle – 7 ngày với 200k | `boss-battle-200k` | Đầy đủ (Phase 3/3.1, hồi quy Phase 4) | 15/15 unit tests + E2E hồi quy local-mode PASS | **TESTED** |
| 2. Gánh xôi khởi nghiệp – 7 ngày làm chủ | `ganh-xoi-khoi-nghiep` | Đầy đủ (Phase 4A) | 13/13 unit tests + E2E 7 ngày & responsive local-mode PASS | **TESTED** |
| 3. Mất việc bất ngờ – 30 ngày giữ vững tài chính | `mat-viec-bat-ngo` | Đầy đủ (Phase 4B) | 12/12 unit tests + E2E 6 chặng & responsive local-mode PASS | **TESTED** |
| 4. Thẻ tín dụng không phải tiền miễn phí – 3 kỳ sao kê | `the-tin-dung` | Đầy đủ (Phase 4C) | 9/9 unit tests + E2E 3 kỳ & responsive local-mode PASS | **TESTED** |
| Phiên đăng nhập Firebase Cloud thật (`moneycare-2cde5`) trên cả 4 game | `/academy?tab=advanced` | Đã tích hợp `uid` từ `useAuth` | Chưa thực hiện đăng nhập live Firebase trong trình duyệt | **NOT VERIFIED** |

Không có hạng mục nào ở trạng thái `BLOCKED`.

---

## 12. Các lỗi phát hiện và đã sửa trong quá trình triển khai

1. **Lỗi kịch bản test thua lỗ trong `stickyRiceGame.test.ts` (Test 7):**
   - *Nguyên nhân:* Kịch bản test ban đầu thử nhập 40 suất ở Ngày 4 (`530.000 đ`) khi tiền mặt còn `450.000 đ` nên bị guard `insufficient-cash` chặn đúng quy tắc; sau đó phương án bán 30 suất giá `25.000 đ` lại giúp phục hồi thành có lãi.
   - *Khắc phục:* Điều chỉnh kịch bản Test 7 sang trường hợp nhập dư vào các ngày mưa/cạnh tranh (Ngày 2–3) và thu hẹp quy mô bán giá biên mỏng (`15.000 đ`) ở Ngày 4–7 → cho kết quả thua lỗ thật `-660.000 đ` (`cash = 340.000 đ`), test PASS 8/8.
2. **Lỗi TypeScript `TS2322` khi chạy `npm run build`:**
   - *Nguyên nhân:* Prop `variant="mini"` được dùng ở 6 vị trí trong `StickyRiceGameView.tsx`, `JobLossGameView.tsx` và `CreditCardGameView.tsx`, trong khi union type thực tế của `ViBeMascot.tsx` là `'hero' | 'banner' | 'compact'`.
   - *Khắc phục:* Đổi toàn bộ 6 vị trí sang `variant="compact"` đúng thiết kế `ViBeMascot.tsx`. Chạy lại `npm run build` → PASS với `0` lỗi TypeScript.

---

## 13. Các vấn đề chưa được kiểm chứng (`NOT VERIFIED`)

1. **Phiên đăng nhập Firebase Auth / Cloud Firestore production thật (`moneycare-2cde5`):**
   - Chưa thực hiện đăng nhập tài khoản thật (Email/Password hoặc Google) trên trình duyệt để kiểm thử thực tế việc chuyển đổi giữa 2 tài khoản Firebase thật khác nhau trên cùng một trình duyệt. (Logic cô lập theo UID đã được chứng minh qua unit tests storage service và E2E local-mode, nhưng cần người dùng xác nhận trực tiếp khi đăng nhập tài khoản thật.)
2. **Trải nghiệm cảm ứng trực quan trên thiết bị di động vật lý (iOS Safari / Android Chrome):**
   - Đã kiểm tra kích thước viewport `375px`, `390px`, `430px` trên Headless Chrome, nhưng chưa bấm tay thực tế trên điện thoại vật lý để kiểm tra thao tác cuộn/bàn phím cảm ứng.

---

## 14. Xác nhận không ảnh hưởng tiền thật, XP, Streak, Lộ trình, Firebase AI

Đã rà soát mã nguồn và `git status`:
- **Không sửa** `web/src/pages/DashboardPage.tsx` (không thêm thẻ hay thay đổi số dư, thu nhập, chi tiêu, ngân sách).
- **Không sửa** `web/src/components/BottomNavigation.tsx` (giữ nguyên thanh điều hướng MoneyCare).
- **Không sửa** `web/src/components/academy/TodayMissionTab.tsx`, `RoadmapTab.tsx`, `RoadmapLessonView.tsx`.
- **Không sửa** `web/src/services/academyService.ts`, `academyRoadmapService.ts`, `transactionService.ts`, `budgetService.ts`, `aiService.ts`, `web/src/lib/firebase.ts`, `web/firestore.rules`, `web/.env.local`.
- Toàn bộ tiền trong 4 trò chơi là **tiền giả lập học tập** lưu riêng trong `localStorage` theo UID, hoàn toàn không ghi vào Firestore, không cộng/trừ số dư giao dịch thật và không sửa đổi XP, Level hay Streak của người dùng.

---

## 15. Xác nhận không deploy Firebase và không commit/push GitHub

- **Chưa** chạy `firebase deploy` (Hosting, Firestore Rules hay bất kỳ dịch vụ Firebase nào).
- **Chưa** chạy `git add`, `git commit`, `git push` hay tạo Pull Request lên GitHub.
- Toàn bộ thay đổi hiện nằm sạch trong workspace cục bộ, sẵn sàng để người dùng nghiệm thu và quyết định bước tiếp theo.
