import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { MonthlyBudget } from '../types/budget';
import { getCurrentUserProfile } from './authService';

const LOCAL_BUDGET_KEY = 'moneycare_monthly_budgets';

const DEFAULT_BUDGET: MonthlyBudget = {
  id: '2026-11',
  monthYear: 'Tháng 11/2026',
  totalLimit: 3000000,
  categoryLimits: {
    rent: 2000000,
    food: 800000,
    shopping: 300000,
    transport: 700000,
  },
};

function getLocalBudgets(): Record<string, MonthlyBudget> {
  const saved = localStorage.getItem(LOCAL_BUDGET_KEY);
  if (!saved) {
    const initial = { '2026-11': DEFAULT_BUDGET };
    localStorage.setItem(LOCAL_BUDGET_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return { '2026-11': DEFAULT_BUDGET };
  }
}

export async function fetchMonthlyBudget(monthYear: string = '2026-11'): Promise<MonthlyBudget> {
  const user = getCurrentUserProfile();

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'budgets', monthYear);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as MonthlyBudget;
      }
    } catch (err) {
      console.warn('Firestore fetch budget failed, returning local budget:', err);
    }
  }

  const localBudgets = getLocalBudgets();
  return localBudgets[monthYear] || {
    id: monthYear,
    monthYear: `Tháng ${monthYear.split('-')[1]}/${monthYear.split('-')[0]}`,
    totalLimit: 3000000,
    categoryLimits: {
      rent: 2000000,
      food: 800000,
      shopping: 300000,
      transport: 700000,
    },
  };
}

export async function saveMonthlyBudget(budget: MonthlyBudget): Promise<void> {
  const user = getCurrentUserProfile();
  const now = new Date().toISOString();
  const data = { ...budget, updatedAt: now };

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'budgets', budget.id);
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.warn('Firestore save budget error, saving locally:', err);
    }
  }

  const local = getLocalBudgets();
  local[budget.id] = data;
  localStorage.setItem(LOCAL_BUDGET_KEY, JSON.stringify(local));
}
