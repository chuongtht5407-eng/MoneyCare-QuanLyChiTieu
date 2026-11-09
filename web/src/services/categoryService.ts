import { Category } from '../types/category';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Ăn uống',
    type: 'expense',
    icon: 'utensils',
    bgTint: 'bg-[#FDF2F2]',
    color: 'text-[#EF4444]',
    isDefault: true,
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    type: 'expense',
    icon: 'shopping-bag',
    bgTint: 'bg-[#FCE7F3]',
    color: 'text-[#EC4899]',
    isDefault: true,
  },
  {
    id: 'transport',
    name: 'Di chuyển',
    type: 'expense',
    icon: 'car',
    bgTint: 'bg-[#E0F2FE]',
    color: 'text-[#0284C7]',
    isDefault: true,
  },
  {
    id: 'rent',
    name: 'Tiền trọ',
    type: 'expense',
    icon: 'home',
    bgTint: 'bg-[#FEF3C7]',
    color: 'text-[#D97706]',
    isDefault: true,
  },
  {
    id: 'entertainment',
    name: 'Giải trí',
    type: 'expense',
    icon: 'sparkles',
    bgTint: 'bg-[#EDE9FE]',
    color: 'text-[#8B5CF6]',
    isDefault: true,
  },
  {
    id: 'salary',
    name: 'Lương',
    type: 'income',
    icon: 'wallet',
    bgTint: 'bg-[#E8F7F0]',
    color: 'text-[#16B364]',
    isDefault: true,
  },
];

export async function getCategories(): Promise<Category[]> {
  const saved = localStorage.getItem('moneycare_custom_categories');
  if (saved) {
    try {
      const custom = JSON.parse(saved);
      return [...DEFAULT_CATEGORIES, ...custom];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }
  return DEFAULT_CATEGORIES;
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  const categories = await getCategories();
  const customOnly = categories.filter((c) => !c.isDefault);
  customOnly.push(newCat);
  localStorage.setItem('moneycare_custom_categories', JSON.stringify(customOnly));
  return newCat;
}
