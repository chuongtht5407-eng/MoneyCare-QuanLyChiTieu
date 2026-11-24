import { Transaction, FinancialSummary } from '../types/finance';

/**
 * Format currency number to Vietnamese Dong format (e.g. 7.100.000 đ)
 */
export function formatCurrency(amount: number, showSign: boolean = false): string {
  const absoluteValue = Math.abs(amount);
  const formattedNumber = new Intl.NumberFormat('vi-VN').format(absoluteValue);

  if (showSign && amount < 0) {
    return `-${formattedNumber} đ`;
  }
  if (showSign && amount > 0) {
    return `+${formattedNumber} đ`;
  }

  return `${formattedNumber} đ`;
}

/**
 * Calculate total overall balance across all time
 */
export function calculateTotalBalance(transactions: Transaction[]): number {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return totalIncome - totalExpense;
}

/**
 * Calculate total income for a specific month and year
 */
export function calculateMonthlyIncome(
  transactions: Transaction[],
  year: number,
  month: number
): number {
  return transactions
    .filter((t) => {
      if (t.type !== 'income') return false;
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total expense for a specific month and year
 */
export function calculateMonthlyExpense(
  transactions: Transaction[],
  year: number,
  month: number
): number {
  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate category breakdown for a specific month and year
 */
export function calculateMonthlyCategoryExpense(
  transactions: Transaction[],
  year: number,
  month: number
): Record<string, number> {
  const result: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const d = new Date(t.date);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      result[t.categoryId] = (result[t.categoryId] || 0) + t.amount;
    }
  });

  return result;
}

/**
 * Calculate 12-month bar chart data for a specific year
 */
export function calculateYearlyChartData(
  transactions: Transaction[],
  year: number
): Array<{ month: string; income: number; expense: number }> {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  return months.map((label, index) => {
    const m = index + 1;
    const income = calculateMonthlyIncome(transactions, year, m);
    const expense = calculateMonthlyExpense(transactions, year, m);
    return { month: label, income, expense };
  });
}

/**
 * Calculate budget usage statistics and alert status
 */
export function calculateBudgetUsage(spent: number, limit: number) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  const isOver = remaining < 0;
  const overAmount = isOver ? Math.abs(remaining) : 0;

  let status: 'normal' | 'warning' | 'exceeded' = 'normal';
  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
  }

  return {
    percentage: Number(percentage.toFixed(2)),
    remaining,
    isOver,
    overAmount,
    status,
  };
}

/**
 * Calculate financial summary for backward compatibility
 */
export function calculateFinancialSummary(
  transactions: Transaction[],
  budgetLimit: number = 3000000
): FinancialSummary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const budgetUsage = calculateBudgetUsage(totalExpense, budgetLimit);

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    budgetLimit,
    budgetSpent: totalExpense,
    budgetUsagePercentage: Number(budgetUsage.percentage.toFixed(1)),
  };
}
