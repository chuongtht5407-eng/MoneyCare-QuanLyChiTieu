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
