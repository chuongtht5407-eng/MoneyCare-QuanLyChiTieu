import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { TextInput } from '../components/common/TextInput';
import { ChevronLeft, ChevronRight, Edit3, X, AlertTriangle } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import {
  formatCurrency,
  calculateMonthlyExpense,
  calculateMonthlyCategoryExpense,
  calculateBudgetUsage,
} from '../utils/finance';

export const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);

  const monthKey = `${selectedYear}-${selectedMonth < 10 ? '0' : ''}${selectedMonth}`;
  const monthDisplayStr = `Tháng ${selectedMonth < 10 ? '0' : ''}${selectedMonth}/${selectedYear}`;

  const { budget, updateBudget } = useBudgets(monthKey);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalLimitInput, setTotalLimitInput] = useState<string>('3000000');
  const [rentLimitInput, setRentLimitInput] = useState<string>('2000000');
  const [foodLimitInput, setFoodLimitInput] = useState<string>('800000');
  const [shoppingLimitInput, setShoppingLimitInput] = useState<string>('300000');
  const [transportLimitInput, setTransportLimitInput] = useState<string>('700000');

  // Month navigation logic
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Dynamic calculations for selected month/year
  const totalLimit = budget ? budget.totalLimit : 3000000;
  const totalSpent = calculateMonthlyExpense(transactions, selectedYear, selectedMonth);
  const budgetUsage = calculateBudgetUsage(totalSpent, totalLimit);

  const categorySpentMap = calculateMonthlyCategoryExpense(transactions, selectedYear, selectedMonth);

  const openEditModal = () => {
    setTotalLimitInput(totalLimit.toString());
    setRentLimitInput((budget?.categoryLimits?.rent ?? 2000000).toString());
    setFoodLimitInput((budget?.categoryLimits?.food ?? 800000).toString());
    setShoppingLimitInput((budget?.categoryLimits?.shopping ?? 300000).toString());
    setTransportLimitInput((budget?.categoryLimits?.transport ?? 700000).toString());
    setIsEditModalOpen(true);
  };

  const handleSaveBudget = async () => {
    const parsedTotal = parseInt(totalLimitInput, 10) || 3000000;
    const parsedRent = parseInt(rentLimitInput, 10) || 2000000;
    const parsedFood = parseInt(foodLimitInput, 10) || 800000;
    const parsedShopping = parseInt(shoppingLimitInput, 10) || 300000;
    const parsedTransport = parseInt(transportLimitInput, 10) || 700000;

    await updateBudget({
      id: monthKey,
      monthYear: monthDisplayStr,
      totalLimit: parsedTotal,
      categoryLimits: {
        rent: parsedRent,
        food: parsedFood,
        shopping: parsedShopping,
        transport: parsedTransport,
      },
    });

    setIsEditModalOpen(false);
  };

  const categoryConfigs = [
    { id: 'rent', name: 'Tiền trọ', limit: budget?.categoryLimits?.rent ?? 2000000 },
    { id: 'food', name: 'Ăn uống', limit: budget?.categoryLimits?.food ?? 800000 },
    { id: 'shopping', name: 'Mua sắm', limit: budget?.categoryLimits?.shopping ?? 300000 },
    { id: 'transport', name: 'Di chuyển', limit: budget?.categoryLimits?.transport ?? 700000 },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Ngân sách" />

        <div className="p-4 space-y-4">
          {/* Month Selector */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E8EAF0] text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-[#858A9B] hover:text-[#2F5BEA] transition-colors"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#171923] font-bold">{monthDisplayStr}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-[#858A9B] hover:text-[#2F5BEA] transition-colors"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Main Monthly Budget Card */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E8EAF0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#858A9B] font-semibold">Hạn mức chi tiêu tháng</span>
              <button
                type="button"
                onClick={openEditModal}
                className="w-8 h-8 rounded-full bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center hover:bg-blue-100 transition-colors"
                aria-label="Chỉnh sửa hạn mức"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-2xl font-extrabold text-[#171923]">
              {formatCurrency(totalLimit)}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#F0F2F5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUsage.status === 'exceeded'
                    ? 'bg-[#EF4444]'
                    : budgetUsage.status === 'warning'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#2F5BEA]'
                }`}
                style={{ width: `${Math.min(budgetUsage.percentage, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#858A9B]">
                Đã chi: <strong className="text-[#171923] font-bold">{formatCurrency(totalSpent)}</strong>
              </span>
              <span className="text-[#858A9B]">
                {budgetUsage.isOver ? 'Vượt quá: ' : 'Còn lại: '}
                <strong className={budgetUsage.isOver ? 'text-[#EF4444] font-bold' : 'text-[#16A66A] font-bold'}>
                  {formatCurrency(Math.abs(budgetUsage.remaining))}
                </strong>
              </span>
            </div>

            {/* Alert Banner */}
            {budgetUsage.status === 'warning' && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Chú ý: Bạn đã sử dụng hơn 80% ngân sách tháng.</span>
              </div>
            )}

            {budgetUsage.status === 'exceeded' && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-[#EF4444] font-medium">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <span>
                  Cảnh báo: Bạn đã vượt quá hạn mức ngân sách tháng này! (Vượt {formatCurrency(budgetUsage.overAmount)})
                </span>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold text-[#171923]">Chi tiết theo danh mục</h3>

            <div className="space-y-2.5">
              {categoryConfigs.map((cat) => {
                const spent = categorySpentMap[cat.id] || 0;
                const catUsage = calculateBudgetUsage(spent, cat.limit);
                const tagColor =
                  catUsage.status === 'exceeded'
                    ? 'bg-amber-100 text-amber-800 font-bold'
                    : catUsage.status === 'warning'
                    ? 'bg-orange-100 text-orange-800 font-bold'
                    : 'bg-emerald-100 text-emerald-800 font-bold';

                return (
                  <div key={cat.id} className="bg-white rounded-[20px] p-4 border border-[#E8EAF0] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#171923]">{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${tagColor}`}>
                        {catUsage.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          catUsage.status === 'exceeded'
                            ? 'bg-[#EF4444]'
                            : catUsage.status === 'warning'
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#2F5BEA]'
                        }`}
                        style={{ width: `${Math.min(catUsage.percentage, 100)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-[#858A9B] text-right">
                      {formatCurrency(spent)} / {formatCurrency(cat.limit)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="home" onTabClick={(tab) => {
        if (tab === 'home') navigate('/home');
        if (tab === 'transactions') navigate('/transactions');
        if (tab === 'add') navigate('/transactions/new');
        if (tab === 'statistics') navigate('/analytics');
        if (tab === 'profile') navigate('/profile');
      }} />

      {/* Edit Budget Bottom Sheet Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 animate-fade-in">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-md space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <h3 className="text-base font-bold text-[#171923]">Thiết lập ngân sách {monthDisplayStr}</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TextInput
              label="Hạn mức ngân sách tháng tổng (VNĐ)"
              type="number"
              value={totalLimitInput}
              onChange={(e) => setTotalLimitInput(e.target.value)}
            />

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#171923]">Hạn mức từng danh mục</h4>
              <TextInput
                label="Tiền trọ"
                type="number"
                value={rentLimitInput}
                onChange={(e) => setRentLimitInput(e.target.value)}
              />
              <TextInput
                label="Ăn uống"
                type="number"
                value={foodLimitInput}
                onChange={(e) => setFoodLimitInput(e.target.value)}
              />
              <TextInput
                label="Mua sắm"
                type="number"
                value={shoppingLimitInput}
                onChange={(e) => setShoppingLimitInput(e.target.value)}
              />
              <TextInput
                label="Di chuyển"
                type="number"
                value={transportLimitInput}
                onChange={(e) => setTransportLimitInput(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <PrimaryButton onClick={handleSaveBudget}>
                Lưu thay đổi
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
