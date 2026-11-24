export type ChatRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface AIFinanceContext {
  month: number;
  year: number;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  topExpenseCategories: Array<{ categoryName: string; amount: number; percentage: number }>;
  budgetLimit: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetUsagePercent: number;
  previousMonthIncome: number;
  previousMonthExpense: number;
}

export interface AIChatOptions {
  includeFinanceContext: boolean;
  systemInstruction?: string;
}
