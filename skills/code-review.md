# 🧐 SKILL: CODE REVIEW & QUALITY ASSURANCE FOR MONEYCARE

This skill defines the checklist for reviewing code changes before staging or creating a Pull Request.

---

## 📋 Code Review Checklist

### 1. UI & Design System Compliance
- [ ] Uses UTH Todo Blue theme (`#2F5BEA` primary blue, `#F7F8FC` bg-main, `#171923` primary text).
- [ ] Viewport container is mobile-first (`MobileFrame.tsx` reference width 390 × 844px).
- [ ] Responsive without horizontal overflow across 360px–430px viewports.

### 2. Finance Logic & Math
- [ ] Expenses display with minus sign (`-200.000 đ`).
- [ ] Income displays with plus sign (`+10.000.000 đ`).
- [ ] Budget usage percentage is mathematically accurate ($\text{Spent} / \text{Limit} \times 100$).
- [ ] All amounts are dynamically computed from transactions (zero hardcoded values).

### 3. Firebase & Security
- [ ] Uses `firebase/ai` SDK with `GoogleAIBackend` for AI Assistant.
- [ ] App Check initialized with `ReCaptchaEnterpriseProvider` and `FIREBASE_APPCHECK_DEBUG_TOKEN` enabled on dev.
- [ ] No secrets, debug tokens, or `.env.local` files committed to Git.
- [ ] Firestore operations isolated by `user.uid`.

### 4. Build & Tests
- [ ] `npm run build` exits with code 0 and 0 TypeScript errors.
- [ ] All unit tests in `src/utils/finance.test.ts` and `src/utils/financeContextBuilder.test.ts` pass 100%.
