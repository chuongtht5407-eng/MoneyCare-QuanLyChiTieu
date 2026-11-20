import { Category, CategoryType } from '../types/category';

export const DEFAULT_CATEGORIES: Category[] = [
  // --- Danh mục Chi tiêu (Expense) ---
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
    id: 'bills',
    name: 'Hóa đơn',
    type: 'expense',
    icon: 'receipt',
    bgTint: 'bg-[#FFF7ED]',
    color: 'text-[#EA580C]',
    isDefault: true,
  },
  {
    id: 'health',
    name: 'Sức khỏe',
    type: 'expense',
    icon: 'heart-pulse',
    bgTint: 'bg-[#ECFDF5]',
    color: 'text-[#059669]',
    isDefault: true,
  },
  {
    id: 'other_expense',
    name: 'Chi khác',
    type: 'expense',
    icon: 'more-horizontal',
    bgTint: 'bg-[#F1F5F9]',
    color: 'text-[#64748B]',
    isDefault: true,
  },

  // --- Danh mục Thu nhập (Income) ---
  {
    id: 'salary',
    name: 'Lương',
    type: 'income',
    icon: 'wallet',
    bgTint: 'bg-[#E8F7F0]',
    color: 'text-[#16B364]',
    isDefault: true,
  },
  {
    id: 'bonus',
    name: 'Thưởng',
    type: 'income',
    icon: 'gift',
    bgTint: 'bg-[#FEF9C3]',
    color: 'text-[#CA8A04]',
    isDefault: true,
  },
  {
    id: 'investment',
    name: 'Đầu tư',
    type: 'income',
    icon: 'trending-up',
    bgTint: 'bg-[#E0E7FF]',
    color: 'text-[#4F46E5]',
    isDefault: true,
  },
  {
    id: 'other_income',
    name: 'Thu khác',
    type: 'income',
    icon: 'circle-dollar-sign',
    bgTint: 'bg-[#F3E8FF]',
    color: 'text-[#9333EA]',
    isDefault: true,
  },
];

const LOCAL_CUSTOM_CATEGORIES_KEY = 'moneycare_custom_categories';

export async function getCategories(): Promise<Category[]> {
  const saved = localStorage.getItem(LOCAL_CUSTOM_CATEGORIES_KEY);
  if (saved) {
    try {
      const custom: Category[] = JSON.parse(saved);
      return [...DEFAULT_CATEGORIES, ...custom];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }
  return DEFAULT_CATEGORIES;
}

export async function getCategoriesByType(type: CategoryType): Promise<Category[]> {
  const allCategories = await getCategories();
  return allCategories.filter((cat) => cat.type === type);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const allCategories = await getCategories();
  return allCategories.find((cat) => cat.id === id);
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  const saved = localStorage.getItem(LOCAL_CUSTOM_CATEGORIES_KEY);
  let customOnly: Category[] = [];
  if (saved) {
    try {
      customOnly = JSON.parse(saved);
    } catch {
      customOnly = [];
    }
  }
  customOnly.push(newCat);
  localStorage.setItem(LOCAL_CUSTOM_CATEGORIES_KEY, JSON.stringify(customOnly));
  return newCat;
}
