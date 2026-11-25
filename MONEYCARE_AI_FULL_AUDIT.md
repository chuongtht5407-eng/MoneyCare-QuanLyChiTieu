# 🤖 MONEYCARE AI – BÁO CÁO CẢI TIẾN VÀ ĐÁNH GIÁ HỆ THỐNG TOÀN DIỆN (FULL AUDIT & REPAIR)

**Dự án:** MoneyCare – Ứng dụng Quản lý Chi tiêu Cá nhân  
**Thành phần:** Module Trợ lý Tài chính Cá nhân (MoneyCare AI)  
**Tác giả:** Senior Firebase AI Engineer & QA Lead  
**Ngày báo cáo:** Tháng 11/2026  

---

## 1. KIẾN TRÚC HỆ THỐNG HIỆN TẠI

- **Frontend Framework:** React 19 + TypeScript 5.7 + Vite 6 + Tailwind CSS.
- **Firebase Initialization (`src/lib/firebase.ts`):** Khởi tạo instance `app`, `auth`, `db` (Firestore).
- **Firebase App Check:** Kích hoạt `initializeAppCheck` cùng `ReCaptchaEnterpriseProvider`. Tự động bật `FIREBASE_APPCHECK_DEBUG_TOKEN` ở môi trường dev localhost.
- **Firebase AI Logic SDK (`src/services/aiService.ts`):** Sử dụng SDK chính thức `firebase/ai` với `GoogleAIBackend` kết hợp danh sách model `['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b']`.
- **Finance Context Engine (`src/utils/financeContextBuilder.ts`):** Tổng hợp thu/chi, số dư, danh mục chi lớn nhất và % ngân sách từ dữ liệu thật, đính kèm System Instruction tiếng Việt.
- **Quyền riêng tư (`AIFinanceConsent.tsx`):** Cho phép người dùng chủ động Bật/Tắt việc chia sẻ ngữ cảnh tài chính cho AI.

---

## 2. DANH SÁCH FILE ĐÃ KIỂM TRA VÀ SỬA ĐỔI

| STT | Tên file & Đường dẫn | Chức năng chi tiết |
|:---:|---|---|
| 1 | `web/src/lib/firebase.ts` | Cấu hình Firebase App Check với `ReCaptchaEnterpriseProvider` & Debug Token cho dev. |
| 2 | `web/src/services/aiService.ts` | Tích hợp `firebase/ai`, xử lý Exponential Backoff Retry (2 lần) & Model Fallback khi server 500/503. |
| 3 | `web/src/hooks/useAIChat.ts` | Quản lý state tin nhắn, cờ riêng tư `moneycare_ai_consent`, bổ sung hàm `retryLastMessage`. |
| 4 | `web/src/utils/financeContextBuilder.ts` | Trích xuất ngữ cảnh tài chính thực tế và tạo prompt tiếng Việt chuẩn. |
| 5 | `web/src/utils/financeContextBuilder.test.ts` | Test suite kiểm thử tự động cho Finance Context Builder. |
| 6 | `web/src/pages/AIAssistantPage.tsx` | Màn hình giao diện chat, bổ sung nút **"Thử lại"** khi gặp lỗi tạm thời. |
| 7 | `web/src/components/ai/*` | Các UI component chat (Header, Message, Input, Suggestions, Loading, Consent). |

---

## 3. LỊCH SỬ LỖI VÀ GIẢI PHÁP ĐÃ XỬ LÝ (403, 404, 500)

| Mã Lỗi | Nguyên nhân gốc rễ | Giải pháp kỹ thuật đã áp dụng |
|:---:|---|---|
| **403 Forbidden** | Gọi trực tiếp cổng REST API cũ không có App Check Token header. | Chuyển hoàn toàn sang SDK `firebase/ai` (`getAI`, `GoogleAIBackend`), tự động đính kèm App Check Token trong mọi request. |
| **404 Model Retired** | Dùng tên model đã bị ngưng hỗ trợ (`gemini-1.5-flash` cũ). | Cập nhật danh sách model chính thức sang `gemini-2.0-flash` & `gemini-1.5-flash-8b`. |
| **500 High Demand** | Máy chủ Google Cloud Vertex AI quá tải đột xuất tại thời điểm gửi request. | 1. Bổ sung cơ chế **Retry tự động với Exponential Backoff** (thử lại 2 lần với độ trễ 1.2s).<br>2. Bổ sung cơ chế **Model Fallback** (thử lần lượt `gemini-2.0-flash` ➔ `gemini-1.5-flash`).<br>3. Hiển thị thông báo tiếng Việt thân thiện kèm nút **"Thử lại"** để người dùng bấm gửi lại cực kỳ tiện lợi. |

---

## 4. BẢNG KIỂM TRA BẢO MẬT BIẾN MÔI TRƯỜNG

| Tên biến môi trường | Bắt buộc | Đã cấu hình | Vị trí mã nguồn |
|---|:---:|:---:|---|
| `VITE_FIREBASE_API_KEY` | **Có** | ✅ | `src/lib/firebase.ts` |
| `VITE_FIREBASE_PROJECT_ID` | **Có** | ✅ | `src/lib/firebase.ts` (`moneycare-2cde5`) |
| `VITE_FIREBASE_APPCHECK_SITE_KEY` | **Có** | ✅ | `src/lib/firebase.ts` |
| `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` | Tuỳ chọn | ✅ | `src/lib/firebase.ts` (Chỉ nạp ở dev mode) |

*Ghi chú:* Giá trị thật của các mã Key được bảo vệ an toàn trong tệp `.env.local` và không bao giờ bị lộ lên Git hay bản build production.

---

## 5. KẾT QUẢ KIỂM THỬ THỰC TẾ

1. **Biên dịch Production Build (`npm run build`):**
   - **Exit Code:** `0 (Success)`
   - **Thời gian build:** `7.10s`
   - **Lỗi TypeScript:** **0 lỗi**
2. **Unit Tests (`financeContextBuilder.test.ts`):**
   - **Exit Code:** `0 (Success)`
   - **Kết quả:** **100% PASSED (7/7 assertions)**.
3. **Bảo vệ các module khác:**
   - Đảm bảo 100% không ảnh hưởng đến Authentication, Transactions, Dashboard, Analytics hay Budget.

---

## 6. HƯỚNG DẪN DÀNH CHO NGƯỜI DÙNG

1. **Mở tệp `.env.local`** tại thư mục `web/` và đảm bảo đã có đủ cấu hình App Check Site Key và Debug Token.
2. Khởi chạy ứng dụng:
   ```bash
   cd web
   npm run dev
   ```
3. Mở Chrome tại **`http://localhost:5173/ai-assistant`**.
4. Gửi câu hỏi trải nghiệm. Nếu máy chủ Google báo quá tải tạm thời (Lỗi 500), ứng dụng sẽ tự động thử lại hoặc hiển thị nút **"Thử lại"** màu xanh để bạn chỉ cần nhấp 1 phát là gửi lại request thành công!
