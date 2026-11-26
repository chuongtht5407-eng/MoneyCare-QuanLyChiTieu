# 🔴🟢🔵 SKILL: TEST-DRIVEN DEVELOPMENT (TDD) FOR MONEYCARE

This skill defines the mandatory TDD workflow when creating new financial calculations, hooks, or service methods in MoneyCare.

---

## 🔁 The TDD Cycle

1. **RED (🔴 Write a Failing Test):**
   - Create or update a test in `web/src/utils/*.test.ts` or `web/src/services/*.test.ts`.
   - Define exact input transactions/budgets and expected mathematical output.
   - Run `npx tsx <test_file_path>` and verify the test fails for the right reason.

2. **GREEN (🟢 Write Minimal Code to Pass):**
   - Implement the minimal logic in `utils/finance.ts` or `services/`.
   - Re-run `npx tsx <test_file_path>`.
   - Verify the test passes cleanly.

3. **REFACTOR (🔵 Clean Code & Run Build):**
   - Refactor code for readability and type safety without changing behavior.
   - Run `npm run build` in `web/` to confirm 0 TypeScript or Vite errors.

---

## 📌 MoneyCare TDD Checklist
- [ ] Financial amounts formatted in VND (`formatCurrency`).
- [ ] Expenses display negative sign (`-`).
- [ ] Income displays positive sign (`+`).
- [ ] Budget usage percentage computed to 2 decimal places.
- [ ] Multi-month and multi-year data isolation tested.
