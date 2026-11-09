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

  const barChartData: BarChartDataPoint[] = [
    { month: 'T6', income: 8000000, expense: 2500000 },
    { month: 'T7', income: 9000000, expense: 3100000 },
    { month: 'T8', income: 8500000, expense: 2800000 },
    { month: 'T9', income: 10000000, expense: 3200000 },
    { month: 'T10', income: 9500000, expense: 2700000 },
    { month: 'T11', income: totalIncome, expense: totalExpense },
  ];

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
      color: '#2F5BEA',
      percentage: totalExpense > 0 ? (categoryTotals.rent / totalExpense) * 100 : 0,
    },
    {
      name: 'Ăn uống',
      value: categoryTotals.food,
      color: '#60A5FA',
      percentage: totalExpense > 0 ? (categoryTotals.food / totalExpense) * 100 : 0,
    },
    {
      name: 'Mua sắm',
      value: categoryTotals.shopping,
      color: '#93C5FD',
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
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Thống kê" showBack={false} />

        <div className="p-4 space-y-4">
          <div className="bg-[#F0F2F5] p-1 rounded-xl grid grid-cols-2 gap-1 text-center font-bold text-xs">
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`py-2.5 rounded-lg transition-all ${
                period === 'month'
                  ? 'bg-[#2F5BEA] text-white shadow-xs'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Tháng
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`py-2.5 rounded-lg transition-all ${
                period === 'year'
                  ? 'bg-[#2F5BEA] text-white shadow-xs'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Năm
            </button>
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E8EAF0] text-xs font-semibold shadow-2xs">
            <button type="button" className="p-1 text-gray-500 hover:text-[#2F5BEA]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#171923] font-bold">Tháng 11/2026</span>
            <button type="button" className="p-1 text-gray-500 hover:text-[#2F5BEA]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs text-[#16A66A] font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Thu nhập</span>
              </div>
              <p className="text-sm font-bold text-[#171923] mt-1.5 truncate">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100">
              <div className="flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Chi tiêu</span>
              </div>
              <p className="text-sm font-bold text-[#EF4444] mt-1.5 truncate">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>

          <FinanceBarChart data={barChartData} />
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
