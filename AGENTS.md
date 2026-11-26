# 🤖 AGENTS.MD — MONEYCARE PROJECT GUIDELINES FOR AI AGENTS

Welcome to **MoneyCare** — a mobile-first Personal Finance Management Web Application built with React 19, TypeScript, Vite, Tailwind CSS, Firebase Authentication, Cloud Firestore, Recharts, and Firebase AI Logic (Gemini).

This document outlines the core architecture, rules, and operational guidelines for any AI Agent or developer working on this codebase.

---

## 🏛️ Project Architecture & Tech Stack

- **Frontend:** React 19, TypeScript ~5.7.2, Vite 6.1.0, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Lucide React icons, Recharts v3.
- **Backend Services:** Firebase Authentication, Cloud Firestore, Firebase App Check (reCAPTCHA Enterprise), Firebase AI Logic (`firebase/ai` SDK with `gemini-3.5-flash-lite` model).
- **Design System:** UTH Todo Blue Theme (`#2F5BEA` primary blue, `#F7F8FC` bg-main, `#171923` primary text, `#858A9B` secondary text, `#16A66A` success green, `#EF4444` expense red).
- **Mobile Container:** Mobile-first viewport (390 × 844px reference, supporting 360px–430px devices in `MobileFrame.tsx`).

---

## 📁 Source Code Structure

All Web App code lives under `web/`:
```text
web/
├── src/
│   ├── app/ (App.tsx, ProtectedRoute.tsx, router.tsx)
│   ├── pages/ (12 distinct screen pages in separate .tsx files + AIAssistantPage.tsx)
│   ├── components/ (common/, finance/, layout/, ai/, MobileFrame.tsx, BalanceCard.tsx, etc.)
│   ├── services/ (authService, transactionService, budgetService, categoryService, aiService, syncStatus)
│   ├── hooks/ (useAuth, useTransactions, useBudgets, useAIChat, useSyncStatus)
│   ├── utils/ (finance.ts, finance.test.ts, financeContextBuilder.ts, authErrors.ts)
│   ├── types/ (auth.ts, transaction.ts, category.ts, budget.ts, finance.ts, ai.ts)
│   └── lib/ (firebase.ts - Firebase & App Check initialization)
├── firestore.rules
├── .env.example
└── package.json
```

---

## 🚫 Strict Prohibitions & Rules for Agents

1. **NO UI REDESIGN:** Do NOT change the UTH Todo Blue design system, colors, fonts, or component layout unless explicitly instructed by the user.
2. **NO HARDCODING:** Never hardcode balance, income, expense, chart data, or budget numbers. All financial figures must be dynamically computed from user transactions/budgets.
3. **ONE PAGE PER FILE:** Keep each of the 12 screens in its own `.tsx` file under `web/src/pages/`. Never combine multiple pages into `App.tsx`.
4. **NO SECRET LEAKS:** Never commit `.env.local`, API keys, App Check debug tokens, or passwords to Git. Keep secret templates in `.env.example`.
5. **NO DESTRUCTIVE GIT:** Never use `git push --force`, `git reset --hard`, or `git clean -fd`. Never auto-merge PRs without user confirmation.
6. **NO FAKE AI RESPONSES:** Always route Gemini requests through `firebase/ai` SDK (`getAI`, `GoogleAIBackend`, `getGenerativeModel`). Surface real errors if AI fails.
7. **FINANCE MATH DISCIPLINE:** Expenses must display with a minus sign (`-200.000 đ`), Income must display with a plus sign (`+10.000.000 đ`).

---

## 🧪 Testing & Verification Protocol

Before finishing any task, you MUST run:
1. Production Build Verification: `cd web && npm run build` (Must exit with code 0 and 0 TypeScript errors).
2. Finance & AI Unit Tests: `cd web && npx tsx src/utils/finance.test.ts` and `npx tsx src/utils/financeContextBuilder.test.ts` (All test sets must PASS).
