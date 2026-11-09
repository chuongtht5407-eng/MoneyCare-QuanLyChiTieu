import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { TransactionItem } from '../components/TransactionItem';
import { BottomNavigation } from '../components/BottomNavigation';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionType } from '../types/transaction';
import { formatCurrency } from '../utils/finance';

export const TransactionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [currentMonth, setCurrentMonth] = useState('Tháng 11/2026');

  // Filter logic
  const filtered = transactions.filter((tx) => {
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesSearch =
      tx.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Group by date
  const grouped = filtered.reduce((groups, tx) => {
    const groupKey = tx.formattedTime.includes('Hôm nay')
      ? 'Hôm nay, 08/11'
      : tx.formattedTime.includes('Hôm qua')
      ? 'Hôm qua, 07/11'
      : tx.date;
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(tx);
    return groups;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F8F9FE] text-[#16163F]">
      <div>
        <PageHeader title="Giao dịch" showBack={false} />

        <div className="p-4 space-y-4">
          {/* Search Input & Filter Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7B98]" />
              <input
                type="text"
                placeholder="Tìm kiếm giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 bg-white border border-gray-100 rounded-2xl text-xs sm:text-sm font-medium outline-none focus:border-[#6C5CE7] shadow-2xs"
              />
            </div>
            <button
              type="button"
              className="p-2.5 rounded-2xl bg-white border border-gray-100 text-[#16163F] shadow-2xs hover:bg-gray-50"
              aria-label="Lọc"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Type Tabs */}
          <div className="bg-[#EEF0F8] p-1 rounded-2xl grid grid-cols-3 gap-1 text-center font-bold text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`py-2 rounded-xl transition-all ${
                selectedType === 'all'
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'text-[#7A7B98] hover:text-[#16163F]'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('income')}
              className={`py-2 rounded-xl transition-all ${
                selectedType === 'income'
                  ? 'bg-[#16B364] text-white shadow-xs'
                  : 'text-[#7A7B98] hover:text-[#16163F]'
              }`}
            >
              Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('expense')}
              className={`py-2 rounded-xl transition-all ${
                selectedType === 'expense'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'text-[#7A7B98] hover:text-[#16163F]'
              }`}
            >
              Chi tiêu
            </button>
          </div>

          {/* Month Selector */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 text-xs font-semibold shadow-2xs">
            <button type="button" className="p-1 text-gray-500 hover:text-[#6C5CE7]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#16163F] font-bold">{currentMonth}</span>
            <button type="button" className="p-1 text-gray-500 hover:text-[#6C5CE7]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Income & Expense Summary Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-bold">
            <span className="text-[#16B364]">+{formatCurrency(totalIncome)}</span>
            <span className="text-[#EF4444]">-{formatCurrency(totalExpense)}</span>
          </div>

          {/* Grouped Transaction List */}
          {loading ? (
            <LoadingState message="Đang tải lịch sử giao dịch..." />
          ) : filtered.length === 0 ? (
            <EmptyState description="Không tìm thấy giao dịch nào phù hợp." />
          ) : (
            <div className="space-y-4 pt-1">
              {Object.entries(grouped).map(([dateLabel, items]) => (
                <div key={dateLabel} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#7A7B98] px-1">
                    {dateLabel}
                  </h4>
                  <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-2xs divide-y divide-gray-50">
                    {items.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => navigate(`/transactions/${tx.id}/edit`)}
                        className="cursor-pointer"
                      >
                        <TransactionItem transaction={tx} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation activeTab="transactions" onTabClick={(tab) => {
        if (tab === 'home') navigate('/home');
        if (tab === 'add') navigate('/transactions/new');
        if (tab === 'statistics') navigate('/analytics');
        if (tab === 'profile') navigate('/profile');
      }} />
    </div>
  );
};
