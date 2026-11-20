import { useState, useEffect, useCallback, useRef } from 'react';
import { Transaction } from '../types/transaction';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
} from '../services/transactionService';
import { getCurrentUserProfile, subscribeToAuthChanges } from '../services/authService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmittingRef = useRef<boolean>(false);
  const currentUidRef = useRef<string | undefined>(getCurrentUserProfile()?.uid);

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

  // Lắng nghe thay đổi tài khoản để đảm bảo không hiển thị nhầm dữ liệu giữa các tài khoản
  useEffect(() => {
    loadTransactions();

    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user?.uid !== currentUidRef.current) {
        currentUidRef.current = user?.uid;
        loadTransactions();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadTransactions]);

  const addTx = async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    if (isSubmittingRef.current) {
      throw new Error('Thao tác đang được xử lý, vui lòng không nhấn liên tục.');
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const newTx = await createTransaction(data);
      setTransactions((prev) => [newTx, ...prev.filter((t) => t.id !== newTx.id)]);
      return newTx;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi thêm giao dịch';
      setError(msg);
      throw err;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const updateTx = async (id: string, data: Partial<Omit<Transaction, 'id'>>): Promise<void> => {
    if (isSubmittingRef.current) {
      throw new Error('Thao tác đang được xử lý, vui lòng không nhấn liên tục.');
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await updateTransaction(id, data);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t))
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật giao dịch';
      setError(msg);
      throw err;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const deleteTx = async (id: string): Promise<void> => {
    if (isSubmittingRef.current) {
      throw new Error('Thao tác đang được xử lý, vui lòng không nhấn liên tục.');
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa giao dịch';
      setError(msg);
      throw err;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const getTxById = useCallback(
    async (id: string): Promise<Transaction | null> => {
      // 1. Tìm trong state hiện tại
      const found = transactions.find((t) => t.id === id);
      if (found) return found;
      // 2. Nếu state chưa có (ví dụ khi reload trực tiếp trang edit), đọc qua Service
      return await getTransactionById(id);
    },
    [transactions]
  );

  return {
    transactions,
    loading,
    isSubmitting,
    error,
    reload: loadTransactions,
    addTx,
    updateTx,
    deleteTx,
    getTxById,
  };
}
