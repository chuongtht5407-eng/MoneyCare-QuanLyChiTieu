import { useState, useEffect, useCallback } from 'react';
import { MonthlyBudget } from '../types/budget';
import { fetchMonthlyBudget, saveMonthlyBudget } from '../services/budgetService';

export function useBudgets(monthYear: string = '2026-11') {
  const [budget, setBudget] = useState<MonthlyBudget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBudget = useCallback(async () => {
    setLoading(true);
    try {
      const b = await fetchMonthlyBudget(monthYear);
      setBudget(b);
    } catch (err) {
      console.error('Error fetching budget:', err);
    } finally {
      setLoading(false);
    }
  }, [monthYear]);

  useEffect(() => {
    loadBudget();

    // Tự động tải lại dữ liệu ngân sách khi tab được focus lại
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        loadBudget();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [loadBudget]);

  const updateBudget = async (newBudget: MonthlyBudget) => {
    await saveMonthlyBudget(newBudget);
    setBudget(newBudget);
  };

  return {
    budget,
    loading,
    updateBudget,
    reload: loadBudget,
  };
}
