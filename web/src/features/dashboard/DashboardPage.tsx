import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { BalanceCard } from '../../components/BalanceCard';
import { FinanceSummaryCard } from '../../components/FinanceSummaryCard';
import { BudgetProgress } from '../../components/BudgetProgress';
import { TransactionItem } from '../../components/TransactionItem';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Toast } from '../../components/Toast';
import { DEMO_TRANSACTIONS, DEMO_MONTHLY_BUDGET_LIMIT } from '../../data/demoTransactions';
import { calculateFinancialSummary } from '../../utils/finance';

export const DashboardPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute financial totals dynamically from demo transactions
  const financialSummary = calculateFinancialSummary(
    DEMO_TRANSACTIONS,
    DEMO_MONTHLY_BUDGET_LIMIT
  );

  // Display top 3 recent transactions on dashboard home
  const recentTransactions = DEMO_TRANSACTIONS.slice(0, 3);

  const handleTabClick = (tabName: string) => {
    if (tabName === 'home') return;
    if (tabName === 'transactions') {
      setToastMessage('Màn hình giao dịch sẽ được phát triển ở giai đoạn tiếp theo');
    } else if (tabName === 'add') {
      setToastMessage('Chức năng thêm giao dịch đang được phát triển');
    } else if (tabName === 'statistics') {
      setToastMessage('Màn hình thống kê sẽ được phát triển ở giai đoạn tiếp theo');
    } else if (tabName === 'profile') {
      setToastMessage('Màn hình cá nhân sẽ được phát triển ở giai đoạn tiếp theo');
    }
  };

  const handleNotificationClick = () => {
    setToastMessage('Bạn không có thông báo mới nào');
  };

  const handleSeeAllClick = () => {
    setToastMessage('Màn hình giao dịch sẽ được phát triển ở giai đoạn tiếp theo');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FE] text-[#16163F]">

      {/* Scrollable Main Content */}
      <div className="p-5 space-y-5 flex-1">

        {/* Header Section */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {/* User Avatar SVG */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#887CF6] p-0.5 shadow-sm overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#E2E8F0" />
                  {/* Hair */}
                  <path d="M 20 42 C 20 20, 80 20, 80 42 L 80 50 L 20 50 Z" fill="#1E293B" />
                  {/* Face */}
                  <circle cx="50" cy="48" r="22" fill="#FDE047" fillOpacity="0.4" />
                  <circle cx="50" cy="50" r="20" fill="#FFEDD5" />
                  {/* Eyes & Smile */}
                  <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
                  <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
                  <path d="M 44 56 Q 50 62 56 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Body/Shirt */}
                  <path d="M 15 95 C 20 70, 80 70, 85 95 Z" fill="#4F46E5" />
                </svg>
              </div>
            </div>

            {/* Greeting Text */}
            <div>
              <p className="text-xs text-[#7A7B98]">Xin chào,</p>
              <h2 className="text-base sm:text-lg font-bold text-[#16163F] tracking-tight">
                Minh Hùng 👋
              </h2>
            </div>
          </div>

          {/* Bell Notification Button */}
          <button
            onClick={handleNotificationClick}
            type="button"
            className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <Bell className="w-5 h-5 text-[#16163F]" />
            {/* Red Notification Badge Dot */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>
        </div>

        {/* 1. Balance Card */}
        <BalanceCard balance={financialSummary.currentBalance} />

        {/* 2. Income & Expense Cards */}
        <FinanceSummaryCard
          income={financialSummary.totalIncome}
          expense={financialSummary.totalExpense}
        />

        {/* 3. Monthly Budget Progress */}
        <BudgetProgress
          spent={financialSummary.budgetSpent}
          limit={financialSummary.budgetLimit}
          percentage={financialSummary.budgetUsagePercentage}
        />

        {/* 4. Recent Transactions Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#16163F]">Giao dịch gần đây</h3>
            <button
              onClick={handleSeeAllClick}
              className="text-xs font-semibold text-[#6C5CE7] hover:underline"
              type="button"
            >
              Xem tất cả
            </button>
          </div>

          {/* List of 3 Recent Transactions */}
          <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm divide-y divide-gray-50">
            {recentTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation Bar */}
      <BottomNavigation activeTab="home" onTabClick={handleTabClick} />

      {/* Toast popup */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};
