import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types/transaction';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();

    // Tự động tải lại dữ liệu khi tab được focus lại hoặc chuyển qua lại giữa các tab
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        loadTransactions();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [loadTransactions]);

  const addTx = async (data: Omit<Transaction, 'id'>) => {
    const newTx = await createTransaction(data);
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const updateTx = async (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    await updateTransaction(id, data);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTx = async (id: string) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions,
    loading,
    error,
    reload: loadTransactions,
    addTx,
    updateTx,
    deleteTx,
  };
}
