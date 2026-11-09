export interface CategoryBudget {
  categoryId: string;
  categoryName: string;
  limit: number;
  spent?: number;
}

export interface MonthlyBudget {
  id: string; // YYYY-MM format, e.g. "2026-11"
  monthYear: string; // e.g. "Tháng 11/2026"
  totalLimit: number;
  categoryLimits: Record<string, number>; // categoryId -> limit
  updatedAt?: string;
}
