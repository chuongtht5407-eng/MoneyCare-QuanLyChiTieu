export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId?: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string; // YYYY-MM-DD
  formattedTime: string; // e.g. "Hôm nay, 12:30"
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  budgetLimit: number;
  budgetSpent: number;
  budgetUsagePercentage: number;
}
