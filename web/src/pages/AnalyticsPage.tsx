import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { FinanceBarChart, BarChartDataPoint } from '../components/finance/FinanceBarChart';
import { ExpenseDonutChart, CategoryExpenseData } from '../components/finance/ExpenseDonutChart';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/finance';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Bar chart data over T6..T11
  const barChartData: BarChartDataPoint[] = [
    { month: 'T6', income: 8000000, expense: 2500000 },
    { month: 'T7', income: 9000000, expense: 3100000 },
    { month: 'T8', income: 8500000, expense: 2800000 },
    { month: 'T9', income: 10000000, expense: 3200000 },
    { month: 'T10', income: 9500000, expense: 2700000 },
    { month: 'T11', income: totalIncome, expense: totalExpense },
  ];

  // Donut chart category distribution
  const categoryTotals: Record<string, number> = {
    rent: 0,
    food: 0,
    shopping: 0,
    transport: 0,
  };

  transactions.forEach((t) => {
    if (t.type === 'expense' && categoryTotals[t.categoryId] !== undefined) {
      categoryTotals[t.categoryId] += t.amount;
    }
  });

  const donutData: CategoryExpenseData[] = [
    {
      name: 'Tiền trọ',
      value: categoryTotals.rent,
      color: '#6C5CE7',
      percentage: totalExpense > 0 ? (categoryTotals.rent / totalExpense) * 100 : 0,
    },
    {
      name: 'Ăn uống',
      value: categoryTotals.food,
      color: '#887CF6',
      percentage: totalExpense > 0 ? (categoryTotals.food / totalExpense) * 100 : 0,
    },
    {
      name: 'Mua sắm',
      value: categoryTotals.shopping,
      color: '#C4B5FD',
      percentage: totalExpense > 0 ? (categoryTotals.shopping / totalExpense) * 100 : 0,
    },
    {
      name: 'Di chuyển',
      value: categoryTotals.transport,
      color: '#38BDF8',
      percentage: totalExpense > 0 ? (categoryTotals.transport / totalExpense) * 100 : 0,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FE] text-[#16163F]">
      <div>
        <PageHeader title="Thống kê" showBack={false} />

        <div className="p-4 space-y-4">
          {/* Period Toggle Tabs: Tháng vs Năm */}
          <div className="bg-[#EEF0F8] p-1 rounded-2xl grid grid-cols-2 gap-1 text-center font-bold text-xs">
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`py-2.5 rounded-xl transition-all ${
                period === 'month'
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'text-[#7A7B98] hover:text-[#16163F]'
              }`}
            >
              Tháng
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`py-2.5 rounded-xl transition-all ${
                period === 'year'
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'text-[#7A7B98] hover:text-[#16163F]'
              }`}
            >
              Năm
            </button>
          </div>

          {/* Selector */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 text-xs font-semibold shadow-2xs">
            <button type="button" className="p-1 text-gray-500 hover:text-[#6C5CE7]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#16163F] font-bold">Tháng 11/2026</span>
            <button type="button" className="p-1 text-gray-500 hover:text-[#6C5CE7]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Income & Expense Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#E8F7F0] p-3.5 rounded-2xl border border-[#D1F2E2]">
              <div className="flex items-center gap-1.5 text-xs text-[#16B364] font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Thu nhập</span>
              </div>
              <p className="text-sm font-bold text-[#16163F] mt-1.5 truncate">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="bg-[#FDF2F2] p-3.5 rounded-2xl border border-[#FDE2E2]">
              <div className="flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Chi tiêu</span>
              </div>
              <p className="text-sm font-bold text-[#EF4444] mt-1.5 truncate">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>

          {/* 1. Bar Chart */}
          <FinanceBarChart data={barChartData} />

          {/* 2. Donut Chart */}
          <ExpenseDonutChart data={donutData} totalExpense={totalExpense} />
        </div>
      </div>

      <BottomNavigation activeTab="statistics" onTabClick={(tab) => {
        if (tab === 'home') navigate('/home');
        if (tab === 'transactions') navigate('/transactions');
        if (tab === 'add') navigate('/transactions/new');
        if (tab === 'profile') navigate('/profile');
      }} />
    </div>
  );
};
