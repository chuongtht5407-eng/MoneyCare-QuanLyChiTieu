# 📖 GLOSSARY.MD — MONEYCARE DOMAIN DICTIONARY

This document defines the core financial and technical domain concepts used throughout the **MoneyCare** codebase.

---

## 💰 Financial Domain Terms

### 1. Transaction (Giao dịch)
A record of a single financial movement executed by a user.
- **`type`**: `'income'` (Thu nhập) or `'expense'` (Chi tiêu).
- **`amount`**: Integer value in VND (e.g., `200000` for 200,000 đ).
- **`categoryId`**: ID of the category (e.g., `'food'`, `'rent'`, `'salary'`).
- **`date`**: ISO date string (`YYYY-MM-DD`).
- **`formattedTime`**: Human-readable date string (e.g., `'Hôm nay, 12:30'`, `'Hôm qua, 07/11'`).

### 2. Category (Danh mục)
Classification for transactions.
- **Expense Categories:** `food` (Ăn uống), `shopping` (Mua sắm), `transport` (Di chuyển), `rent` (Tiền trọ), `entertainment` (Giải trí), `bills` (Hóa đơn), `health` (Sức khỏe), `other_expense` (Chi khác).
- **Income Categories:** `salary` (Lương), `bonus` (Thưởng), `investment` (Đầu tư), `other_income` (Thu khác).

### 3. Total Balance (Số dư tích lũy)
The cumulative overall balance calculated as:
$$\text{Total Balance} = \sum \text{Total Income} - \sum \text{Total Expense}$$

### 4. Monthly Budget (Ngân sách tháng)
Target spending cap for a specific month and year (`YYYY-MM` format).
- **`totalLimit`**: Overall monthly spending limit in VND (default: `3,000,000 đ`).
- **`categoryLimits`**: Individual limits mapping `categoryId` to max VND (e.g. `rent: 2000000`, `food: 800000`).

### 5. Budget Usage & Alert Status
- **`percentage`**: $(\text{Monthly Expense} / \text{Monthly Budget Limit}) \times 100\%$
- **`remaining`**: $\text{Monthly Budget Limit} - \text{Monthly Expense}$
- **`status`**:
  - `normal` (< 80% usage): Green indicator.
  - `warning` (80% – 100% usage): Orange warning indicator.
  - `exceeded` (≥ 100% usage): Red alert indicator displaying exact overrun amount.

---

## 🤖 AI Assistant Domain Terms

### 1. Finance Context (Ngữ cảnh tài chính AI)
Structured JSON containing user's financial totals (income, expense, balance, top categories, budget %, month-over-month differences) built by `financeContextBuilder.ts` and passed to Gemini AI.

### 2. AI Consent (Quyền riêng tư dữ liệu AI)
User privacy toggle (`AIFinanceConsent.tsx`). When OFF, AI answers general financial questions without receiving user's personal financial context. When ON, AI reads user's dynamic finance metrics to give tailored advice.

### 3. Firebase AI Logic
Official Firebase SDK service (`firebase/ai` with `GoogleAIBackend`) connecting MoneyCare to Google Gemini models (`gemini-3.5-flash-lite`) authenticated via Firebase App Check tokens.
