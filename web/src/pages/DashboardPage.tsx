import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { BalanceCard } from '../components/BalanceCard';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionItem } from '../components/TransactionItem';
import { BottomNavigation } from '../components/BottomNavigation';
import { Toast } from '../components/Toast';
import { LoadingState } from '../components/common/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { calculateFinancialSummary } from '../utils/finance';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, loading: txLoading } = useTransactions();
  const { budget } = useBudgets('2026-11');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const budgetLimit = budget ? budget.totalLimit : 3000000;
  const summary = calculateFinancialSummary(transactions, budgetLimit);
  const recentTransactions = transactions.slice(0, 3);

  const handleTabClick = (tabName: string) => {
    if (tabName === 'home') return;
    if (tabName === 'transactions') {
      navigate('/transactions');
    } else if (tabName === 'add') {
      navigate('/transactions/new');
    } else if (tabName === 'statistics') {
      navigate('/analytics');
    } else if (tabName === 'profile') {
      navigate('/profile');
    }
  };

  const handleNotificationClick = () => {
    setToastMessage('Bạn chưa có thông báo mới nào.');
  };

  const displayName = user?.displayName || 'Minh Hùng';

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FE] text-[#16163F]">
      <div className="p-5 space-y-5 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#887CF6] p-0.5 shadow-sm overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#E2E8F0" />
                  <path d="M 20 42 C 20 20, 80 20, 80 42 L 80 50 L 20 50 Z" fill="#1E293B" />
                  <circle cx="50" cy="50" r="20" fill="#FFEDD5" />
                  <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
                  <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
                  <path d="M 44 56 Q 50 62 56 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 15 95 C 20 70, 80 70, 85 95 Z" fill="#4F46E5" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#7A7B98]">Xin chào,</p>
              <h2 className="text-base sm:text-lg font-bold text-[#16163F] tracking-tight">
                {displayName} 👋
              </h2>
            </div>
          </div>

          <button
            onClick={handleNotificationClick}
            type="button"
            className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5 text-[#16163F]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>
        </div>

        {/* 1. Balance Card */}
        <BalanceCard balance={summary.currentBalance} />

        {/* 2. Income & Expense Cards */}
        <FinanceSummaryCard
          income={summary.totalIncome}
          expense={summary.totalExpense}
        />

        {/* 3. Monthly Budget Progress Card */}
        <div onClick={() => navigate('/budget')} className="cursor-pointer">
          <BudgetProgress
            spent={summary.budgetSpent}
            limit={summary.budgetLimit}
            percentage={summary.budgetUsagePercentage}
          />
        </div>

        {/* 4. Recent Transactions */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#16163F]">Giao dịch gần đây</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-semibold text-[#6C5CE7] hover:underline"
              type="button"
            >
              Xem tất cả
            </button>
          </div>

          {txLoading ? (
            <LoadingState message="Đang tải giao dịch..." />
          ) : (
            <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm divide-y divide-gray-50">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/transactions/${tx.id}/edit`)}
                  className="cursor-pointer"
                >
                  <TransactionItem transaction={tx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation activeTab="home" onTabClick={handleTabClick} />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};
