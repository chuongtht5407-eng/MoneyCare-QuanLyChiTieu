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
 * Calculate financial totals dynamically from transaction list
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
  const budgetUsagePercentage = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    budgetLimit,
    budgetSpent: totalExpense,
    budgetUsagePercentage: Number(budgetUsagePercentage.toFixed(1)),
  };
}
