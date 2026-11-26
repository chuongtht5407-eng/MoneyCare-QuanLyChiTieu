# 🔍 SKILL: SYSTEMATIC BUG DIAGNOSIS FOR MONEYCARE

This skill defines the disciplined debugging loop when encountering UI errors, build failures, or Firebase/AI connection errors in MoneyCare.

---

## 🛠️ The Debugging Loop

1. **Reproduce & Isolate (Failing Feedback Loop):**
   - Run `npm run build` or `npm run dev` to capture exact error code and stack trace.
   - Categorize the error:
     - `TSxxxx`: TypeScript compilation error.
     - `403`: Firebase App Check or Google Cloud permission error.
     - `404`: Retired/missing model or missing Firestore document.
     - `500/503`: Temporary server busy error.

2. **Formulate Hypothesis:**
   - Inspect recent changes in git (`git diff`).
   - Identify the single root cause (e.g. incorrect model string, missing import, mismatched prop type).

3. **Apply Minimal Fix:**
   - Modify the minimum necessary lines of code (prefer editing 1 file).
   - Never rewrite unaffected modules or change the UTH Todo Blue design.

4. **Verify Fix:**
   - Re-run `npm run build`.
   - Re-run unit tests (`npx tsx src/utils/*.test.ts`).
   - Confirm fix without creating regressions.
