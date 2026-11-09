export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string; // e.g. "utensils", "shopping-bag", "car", "home", "wallet"
  bgTint: string;
  color: string;
  isDefault?: boolean;
}
