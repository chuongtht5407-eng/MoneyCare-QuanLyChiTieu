# 🤖 MONEYCARE AI – BÁO CÁO NÂNG CẤP LƯU TRỮ VÀ QUẢN LÝ LỊCH SỬ NHIỀU CUỘC TRÒ CHUYỆN

**Dự án:** MoneyCare – Ứng dụng Quản lý Chi tiêu Cá nhân  
**Tính năng nâng cấp:** Quản lý nhiều cuộc trò chuyện AI (Multi-Conversation History) dạng ChatGPT  
**Tác giả:** Senior React & Firebase AI Engineer  
**Ngày hoàn thành:** Tháng 11/2026  

---

## 1. DANH SÁCH FILE ĐÃ TẠO MỚI VÀ CẬP NHẬT

| STT | Đường dẫn file | Loại thao tác | Mô tả chức năng |
|:---:|---|:---:|---|
| 1 | `web/src/types/ai.ts` | **Cập nhật** | Thêm interface `AIConversation` (id, userId, title, createdAt, updatedAt, lastMessagePreview). |
| 2 | `web/src/services/aiConversationService.ts` | **Tạo mới** | Dịch vụ CRUD quản lý `aiConversations` và subcollection `messages` trên Firestore + LocalStorage fallback. |
| 3 | `web/src/services/aiConversationService.test.ts` | **Tạo mới** | Unit tests tự động cho các hàm lưu, tải, đổi tên, xóa cuộc trò chuyện AI. |
| 4 | `web/src/hooks/useAIChat.ts` | **Cập nhật** | Hook quản lý activeConversationId, danh sách hội thoại, tạo mới lười (lazy creation), tải tin nhắn riêng từng cuộc trò chuyện. |
| 5 | `web/src/components/ai/AIChatDrawer.tsx` | **Tạo mới** | Drawer/Sidebar hiển thị danh sách lịch sử trò chuyện, tìm kiếm, đổi tên và xóa kèm xác nhận. |
| 6 | `web/src/components/ai/AIChatHeader.tsx` | **Cập nhật** | Thêm nút Toggle Drawer lịch sử ở góc trái và nút "+ Tạo mới" ở góc phải. |
| 7 | `web/src/pages/AIAssistantPage.tsx` | **Cập nhật** | Tích hợp Drawer lịch sử, chuyển đổi mượt mà giữa các cuộc trò chuyện. |
| 8 | `web/firestore.rules` | **Cập nhật** | Đã cập nhật Security Rules bảo vệ `aiConversations` và `messages` theo `request.auth.uid`. |

---

## 2. CẤU TRÚC LƯU TRỮ FIRESTORE (SECURITY RULES ENFORCED)

Các cuộc trò chuyện AI được phân lập tuyệt đối theo `userId` người dùng:
```text
users/{userId}/aiConversations/{convId}
  ├── id: string
  ├── userId: string
  ├── title: string (Tạo tự động từ câu hỏi đầu tiên)
  ├── createdAt: ISO Date String
  ├── updatedAt: ISO Date String
  └── lastMessagePreview: string
      └── [subcollection] messages/{msgId}
          ├── id: string
          ├── conversationId: string
          ├── role: 'user' | 'model'
          ├── content: string
          ├── timestamp: string
          └── createdAt: ISO Date String
```

---

## 3. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH

1. **Tạo cuộc trò chuyện mới (Lazy Creation)**:
   - Nút `+ Tạo mới` trên Header và trong Drawer cho phép mở cửa sổ trò chuyện trống ngay lập tức.
   - Chỉ tạo tệp Firestore khi người dùng gửi câu hỏi đầu tiên, tránh tạo các cuộc trò chuyện rác.
2. **Lưu tự động tin nhắn & Phản hồi Gemini**:
   - Mọi câu hỏi của người dùng và câu trả lời của Gemini AI được tự động lưu vào Firestore subcollection `messages` và đồng bộ cache cục bộ.
3. **Danh sách Lịch sử & Thao tác quản lý**:
   - Hiển thị danh sách hội thoại sắp xếp theo thời gian mới nhất (`updatedAt` desc).
   - Đặt tiêu đề tự động ngắn gọn từ câu hỏi đầu tiên.
   - Tìm kiếm cuộc trò chuyện theo từ khóa.
   - Đổi tên cuộc trò chuyện trực tiếp.
   - Xóa cuộc trò chuyện sau khi người dùng xác nhận trên `ConfirmDialog` (tự động xóa sạch cả subcollection messages).
4. **Phân lập Ngữ cảnh & Bảo mật**:
   - Khi chọn một cuộc trò chuyện cũ, ứng dụng chỉ tải đúng tin nhắn thuộc cuộc trò chuyện đó.
   - Chuyển đổi tài khoản (Logout / Login) sẽ tự động làm sạch state và chỉ tải đúng lịch sử của UID mới.

---

## 4. KẾT QUẢ KIỂM THỬ KỸ THUẬT

1. **Production Build (`npm run build`)**: ✅ **SUCCESS 100%** (`built in 6.78s`, **0 lỗi TypeScript**).
2. **Unit Tests (`finance.test.ts`, `financeContextBuilder.test.ts`, `aiConversationService.test.ts`)**: ✅ **PASSED 100%**.
3. **Xác nhận Git**: **KHÔNG** tự động commit hay push GitHub.

---

## 5. THAO TÁC TRÊN FIREBASE CONSOLE

- **Quy tắc Firestore Security Rules**: Đã cập nhật sẵn trong tệp `web/firestore.rules`. Nếu bạn muốn cập nhật trực tiếp trên Firebase Console ➔ Mở **Firestore Database** ➔ Tab **Rules** ➔ Dán nội dung từ `web/firestore.rules` ➔ Bấm **Publish**.
- **Không cần thêm thao tác cài đặt nào khác**.
