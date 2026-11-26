# 📐 SKILL: DOMAIN MODELING & FINANCE ENGINE FOR MONEYCARE

This skill defines the rules for financial calculations and state management in MoneyCare.

---

## 🔢 Financial Formulas & Calculation Rules

### 1. Overall Balance Calculation (`calculateTotalBalance`)
$$\text{Total Balance} = \sum_{t \in \text{Income}} t.\text{amount} - \sum_{t \in \text{Expense}} t.\text{amount}$$

### 2. Monthly Income & Expense (`calculateMonthlyIncome`, `calculateMonthlyExpense`)
Filter transactions where `type == 'income'` (or `'expense'`) and `date.year == year` and `date.month == month`.

### 3. Budget Status & Overrun Alert (`calculateBudgetUsage`)
$$\text{Percentage} = \frac{\text{Monthly Expense}}{\text{Monthly Budget Limit}} \times 100$$
$$\text{Remaining} = \text{Monthly Budget Limit} - \text{Monthly Expense}$$

- **Status Rules:**
  - `normal`: $\text{Percentage} < 80\%$
  - `warning`: $80\% \le \text{Percentage} < 100\%$ (Orange banner)
  - `exceeded`: $\text{Percentage} \ge 100\%$ (Red banner with exact overrun amount)

### 4. Currency Formatting (`formatCurrency`)
- Input: amount in VND.
- Expense display: `-200.000 đ`
- Income display: `+10.000.000 đ`
- Standard locale: `vi-VN`
