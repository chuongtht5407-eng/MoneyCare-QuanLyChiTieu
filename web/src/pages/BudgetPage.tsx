import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { TextInput } from '../components/common/TextInput';
import { ChevronLeft, ChevronRight, Edit3, X, AlertTriangle } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/finance';

export const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const { budget, updateBudget } = useBudgets('2026-11');
  const { transactions } = useTransactions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalLimitInput, setTotalLimitInput] = useState<string>('3000000');
  const [rentLimitInput, setRentLimitInput] = useState<string>('2000000');
  const [foodLimitInput, setFoodLimitInput] = useState<string>('800000');
  const [shoppingLimitInput, setShoppingLimitInput] = useState<string>('300000');
  const [transportLimitInput, setTransportLimitInput] = useState<string>('700000');

  const totalLimit = budget ? budget.totalLimit : 3000000;

  const categorySpent: Record<string, number> = {
    rent: 0,
    food: 0,
    shopping: 0,
    transport: 0,
  };

  let totalSpent = 0;

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      totalSpent += t.amount;
      if (categorySpent[t.categoryId] !== undefined) {
        categorySpent[t.categoryId] += t.amount;
      }
    }
  });

  const remaining = totalLimit - totalSpent;
  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const openEditModal = () => {
    setTotalLimitInput(totalLimit.toString());
    if (budget) {
      setRentLimitInput((budget.categoryLimits.rent || 2000000).toString());
      setFoodLimitInput((budget.categoryLimits.food || 800000).toString());
      setShoppingLimitInput((budget.categoryLimits.shopping || 300000).toString());
      setTransportLimitInput((budget.categoryLimits.transport || 700000).toString());
    }
    setIsEditModalOpen(true);
  };

  const handleSaveBudget = async () => {
    const parsedTotal = parseInt(totalLimitInput, 10) || 3000000;
    const parsedRent = parseInt(rentLimitInput, 10) || 2000000;
    const parsedFood = parseInt(foodLimitInput, 10) || 800000;
    const parsedShopping = parseInt(shoppingLimitInput, 10) || 300000;
    const parsedTransport = parseInt(transportLimitInput, 10) || 700000;

    await updateBudget({
      id: '2026-11',
      monthYear: 'Tháng 11/2026',
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
    { id: 'rent', name: 'Tiền trọ', limit: budget?.categoryLimits.rent || 2000000 },
    { id: 'food', name: 'Ăn uống', limit: budget?.categoryLimits.food || 800000 },
    { id: 'shopping', name: 'Mua sắm', limit: budget?.categoryLimits.shopping || 300000 },
    { id: 'transport', name: 'Di chuyển', limit: budget?.categoryLimits.transport || 700000 },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Ngân sách" />

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E8EAF0] text-xs font-semibold shadow-2xs">
            <button type="button" className="p-1 text-gray-500 hover:text-[#2F5BEA]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#171923] font-bold">Tháng 11/2026</span>
            <button type="button" className="p-1 text-gray-500 hover:text-[#2F5BEA]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

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

            <div className="w-full h-3 bg-[#F0F2F5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalPercentage >= 100
                    ? 'bg-[#EF4444]'
                    : totalPercentage >= 80
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#2F5BEA]'
                }`}
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#858A9B]">
                Đã chi: <strong className="text-[#171923] font-bold">{formatCurrency(totalSpent)}</strong>
              </span>
              <span className="text-[#858A9B]">
                Còn lại:{' '}
                <strong className={remaining < 0 ? 'text-[#EF4444] font-bold' : 'text-[#16A66A] font-bold'}>
                  {formatCurrency(remaining)}
                </strong>
              </span>
            </div>

            {totalPercentage >= 80 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {totalPercentage >= 100
                    ? 'Cảnh báo: Bạn đã vượt quá hạn mức ngân sách tháng này!'
                    : 'Chú ý: Bạn đã sử dụng hơn 80% ngân sách tháng.'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold text-[#171923]">Chi tiết theo danh mục</h3>

            <div className="space-y-2.5">
              {categoryConfigs.map((cat) => {
                const spent = categorySpent[cat.id] || 0;
                const percentage = cat.limit > 0 ? (spent / cat.limit) * 100 : 0;
                const tagColor =
                  percentage >= 100
                    ? 'bg-amber-100 text-amber-800'
                    : percentage >= 80
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-emerald-100 text-emerald-800';

                return (
                  <div key={cat.id} className="bg-white rounded-[20px] p-4 border border-[#E8EAF0] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#171923]">{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${tagColor}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2F5BEA] rounded-full transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 animate-fade-in">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-md space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <h3 className="text-base font-bold text-[#171923]">Thiết lập ngân sách</h3>
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
