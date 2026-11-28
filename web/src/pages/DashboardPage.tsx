import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, GraduationCap, ChevronRight, Flame } from 'lucide-react';
import { BalanceCard } from '../components/BalanceCard';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionItem } from '../components/TransactionItem';
import { BottomNavigation } from '../components/BottomNavigation';
import { Toast } from '../components/Toast';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import {
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateBudgetUsage,
} from '../utils/finance';
import {
  fetchAcademyProgress,
  calculateLevelInfo,
  AcademyProgress,
} from '../services/academyService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, loading: txLoading } = useTransactions();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const monthKey = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;

  const { budget } = useBudgets(monthKey);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [academyProg, setAcademyProg] = useState<AcademyProgress>({
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    async function loadProg() {
      const prog = await fetchAcademyProgress();
      setAcademyProg(prog);
    }
    loadProg();
  }, [user?.uid]);

  const levelInfo = calculateLevelInfo(academyProg.totalXP);

  const totalBalance = calculateTotalBalance(transactions);
  const monthlyIncome = calculateMonthlyIncome(transactions, currentYear, currentMonth);
  const monthlyExpense = calculateMonthlyExpense(transactions, currentYear, currentMonth);

  const budgetLimit = budget ? budget.totalLimit : 3000000;
  const budgetUsage = calculateBudgetUsage(monthlyExpense, budgetLimit);

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
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div className="p-5 space-y-4 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F5BEA] p-0.5 shadow-sm overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#E2E8F0" />
                  <path d="M 20 42 C 20 20, 80 20, 80 42 L 80 50 L 20 50 Z" fill="#1E293B" />
                  <circle cx="50" cy="50" r="20" fill="#FFEDD5" />
                  <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
                  <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
                  <path d="M 44 56 Q 50 62 56 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 15 95 C 20 70, 80 70, 85 95 Z" fill="#2F5BEA" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#858A9B]">Xin chào,</p>
              <h2 className="text-base sm:text-lg font-bold text-[#171923] tracking-tight">
                {displayName} 👋
              </h2>
            </div>
          </div>

          <button
            onClick={handleNotificationClick}
            type="button"
            className="relative w-10 h-10 rounded-full bg-white border border-[#E8EAF0] flex items-center justify-center text-[#171923] hover:bg-gray-50 active:scale-95 transition-all shadow-2xs"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5 text-[#171923]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>
        </div>

        {/* 1. Dynamic Overall Balance Card */}
        <BalanceCard balance={totalBalance} />

        {/* 2. MONEYCARE AI Quick Access Card */}
        <div
          onClick={() => navigate('/ai-assistant')}
          className="bg-gradient-to-r from-[#2F5BEA] to-[#60A5FA] text-white rounded-[20px] p-4 shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Trợ lý MoneyCare AI</h3>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Hỏi AI về thu chi, ngân sách & mẹo tiết kiệm
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
        </div>

        {/* 3. MONEYCARE ACADEMY Card */}
        <div
          onClick={() => navigate('/academy')}
          className="bg-gradient-to-r from-[#2F5BEA] via-[#3B82F6] to-[#8B5CF6] text-white rounded-[20px] p-4 shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold leading-tight truncate">MoneyCare Academy</h3>
                <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider shrink-0">
                  Cấp {levelInfo.level}
                </span>
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5 truncate flex items-center gap-1">
                <span>{academyProg.totalXP} XP</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-yellow-300 font-extrabold">
                  <Flame className="w-3 h-3 fill-yellow-300" />
                  {academyProg.currentStreak} ngày
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ml-2">
            <span>Bắt đầu học</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4. Dynamic Monthly Income & Expense Cards */}
        <FinanceSummaryCard
          income={monthlyIncome}
          expense={monthlyExpense}
        />

        {/* 5. Monthly Budget Progress Card */}
        <div onClick={() => navigate('/budget')} className="cursor-pointer">
          <BudgetProgress
            spent={monthlyExpense}
            limit={budgetLimit}
            percentage={budgetUsage.percentage}
          />
        </div>

        {/* 6. Dynamic Recent Transactions */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#171923]">Giao dịch gần đây</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-semibold text-[#2F5BEA] hover:underline"
              type="button"
            >
              Xem tất cả
            </button>
          </div>

          {txLoading ? (
            <LoadingState message="Đang tải giao dịch..." />
          ) : recentTransactions.length === 0 ? (
            <EmptyState
              title="Chưa có giao dịch"
              description="Hãy nhấn nút (+) bên dưới để thêm giao dịch đầu tiên."
            />
          ) : (
            <div className="bg-white rounded-[20px] p-2.5 border border-[#E8EAF0] shadow-2xs divide-y divide-[#F0F2F5]">
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
