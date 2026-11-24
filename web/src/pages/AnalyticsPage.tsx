import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { FinanceBarChart, BarChartDataPoint } from '../components/finance/FinanceBarChart';
import { ExpenseDonutChart, CategoryExpenseData } from '../components/finance/ExpenseDonutChart';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { DEFAULT_CATEGORIES } from '../services/categoryService';
import {
  formatCurrency,
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateMonthlyCategoryExpense,
  calculateYearlyChartData,
} from '../utils/finance';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  const today = new Date();
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);

  // Month navigation logic
  const handlePrevPeriod = () => {
    if (period === 'month') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear((y) => y - 1);
      } else {
        setSelectedMonth((m) => m - 1);
      }
    } else {
      setSelectedYear((y) => y - 1);
    }
  };

  const handleNextPeriod = () => {
    if (period === 'month') {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear((y) => y + 1);
      } else {
        setSelectedMonth((m) => m + 1);
      }
    } else {
      setSelectedYear((y) => y + 1);
    }
  };

  // Dynamic calculations
  let periodIncome = 0;
  let periodExpense = 0;
  let barChartData: BarChartDataPoint[] = [];

  if (period === 'month') {
    periodIncome = calculateMonthlyIncome(transactions, selectedYear, selectedMonth);
    periodExpense = calculateMonthlyExpense(transactions, selectedYear, selectedMonth);

    // Build 6-month trailing chart data ending at selected month
    barChartData = Array.from({ length: 6 }).map((_, i) => {
      const idx = 5 - i;
      let m = selectedMonth - idx;
      let y = selectedYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      const inc = calculateMonthlyIncome(transactions, y, m);
      const exp = calculateMonthlyExpense(transactions, y, m);
      return { month: `T${m}`, income: inc, expense: exp };
    });
  } else {
    // Yearly mode: sum 12 months for selected year
    barChartData = calculateYearlyChartData(transactions, selectedYear);
    periodIncome = barChartData.reduce((sum, item) => sum + item.income, 0);
    periodExpense = barChartData.reduce((sum, item) => sum + item.expense, 0);
  }

  // Category breakdown calculation for selected period
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const d = new Date(t.date);
    const matchesPeriod =
      period === 'month'
        ? d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
        : d.getFullYear() === selectedYear;

    if (matchesPeriod) {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    }
  });

  const categoryColorPalette = [
    '#2F5BEA',
    '#60A5FA',
    '#93C5FD',
    '#38BDF8',
    '#F59E0B',
    '#EC4899',
    '#10B981',
    '#8B5CF6',
  ];

  const expenseCategories = DEFAULT_CATEGORIES.filter((c) => c.type === 'expense');

  const donutData: CategoryExpenseData[] = expenseCategories
    .map((cat, idx) => {
      const val = categoryTotals[cat.id] || 0;
      const pct = periodExpense > 0 ? (val / periodExpense) * 100 : 0;
      return {
        name: cat.name,
        value: val,
        color: categoryColorPalette[idx % categoryColorPalette.length],
        percentage: Number(pct.toFixed(1)),
      };
    })
    .filter((d) => d.value > 0);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Thống kê" showBack={false} />

        <div className="p-4 space-y-4">
          {/* Period Toggle Tabs: Tháng vs Năm */}
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

          {/* Date Selector */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E8EAF0] text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={handlePrevPeriod}
              className="p-1 text-[#858A9B] hover:text-[#2F5BEA] transition-colors"
              aria-label="Kỳ trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#171923] font-bold">
              {period === 'month'
                ? `Tháng ${selectedMonth < 10 ? '0' : ''}${selectedMonth}/${selectedYear}`
                : `Năm ${selectedYear}`}
            </span>
            <button
              type="button"
              onClick={handleNextPeriod}
              className="p-1 text-[#858A9B] hover:text-[#2F5BEA] transition-colors"
              aria-label="Kỳ sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Summary Income & Expense Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs text-[#16A66A] font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Thu nhập</span>
              </div>
              <p className="text-sm font-bold text-[#171923] mt-1.5 truncate">
                {formatCurrency(periodIncome)}
              </p>
            </div>

            <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100">
              <div className="flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Chi tiêu</span>
              </div>
              <p className="text-sm font-bold text-[#EF4444] mt-1.5 truncate">
                {formatCurrency(periodExpense)}
              </p>
            </div>
          </div>

          {/* 1. Dynamic Bar Chart */}
          <FinanceBarChart data={barChartData} />

          {/* 2. Dynamic Donut Chart */}
          <ExpenseDonutChart data={donutData} totalExpense={periodExpense} />
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
