import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { TransactionItem } from '../components/TransactionItem';
import { BottomNavigation } from '../components/BottomNavigation';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionType, Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/finance';

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không phân biệt có dấu / không dấu
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Tạo nhãn gom nhóm ngày thông minh dựa trên ngày giao dịch thực tế
 */
function formatDateGroupLabel(dateStr: string): string {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const parts = dateStr.split('-');
  const dayMonth = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;

  if (dateStr === todayStr) {
    return `Hôm nay, ${dayMonth}`;
  }
  if (dateStr === yesterdayStr) {
    return `Hôm qua, ${dayMonth}`;
  }
  return parts.length === 3 ? `${dayMonth}/${parts[0]}` : dateStr;
}

export const TransactionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, loading } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');

  // Quản lý tháng / năm chọn để lọc (mặc định tháng 11/2026 hoặc tháng hiện tại)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(11);

  // Điều hướng tháng trước
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  // Điều hướng tháng kế tiếp
  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Chuỗi định dạng tháng để so sánh (YYYY-MM)
  const currentMonthFilterStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const currentMonthDisplay = `Tháng ${selectedMonth}/${selectedYear}`;

  // Lọc giao dịch kết hợp: Tháng + Loại giao dịch + Tìm kiếm tiếng Việt không dấu
  const filtered = useMemo(() => {
    const normalizedSearch = removeVietnameseTones(searchTerm);

    return transactions.filter((tx) => {
      // 1. Lọc theo tháng
      const matchesMonth = tx.date && tx.date.startsWith(currentMonthFilterStr);

      // 2. Lọc theo loại (all, income, expense)
      const matchesType = selectedType === 'all' || tx.type === selectedType;

      // 3. Lọc theo tìm kiếm (không dấu, không phân biệt hoa thường)
      let matchesSearch = true;
      if (normalizedSearch) {
        const categoryMatch = removeVietnameseTones(tx.categoryName || '').includes(normalizedSearch);
        const noteMatch = tx.note ? removeVietnameseTones(tx.note).includes(normalizedSearch) : false;
        matchesSearch = categoryMatch || noteMatch;
      }

      return matchesMonth && matchesType && matchesSearch;
    });
  }, [transactions, currentMonthFilterStr, selectedType, searchTerm]);

  // Tính tổng thu / tổng chi theo danh sách đã lọc
  const totalIncome = useMemo(
    () =>
      filtered
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [filtered]
  );

  const totalExpense = useMemo(
    () =>
      filtered
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [filtered]
  );

  // Gom nhóm giao dịch theo ngày
  const grouped = useMemo(() => {
    return filtered.reduce((groups, tx) => {
      const groupKey = formatDateGroupLabel(tx.date);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [filtered]);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Giao dịch" showBack={false} />

        <div className="p-4 space-y-4">
          {/* Ô Tìm kiếm */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858A9B]" />
              <input
                type="text"
                placeholder="Tìm theo danh mục, ghi chú (có/không dấu)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 bg-white border border-[#E8EAF0] rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#2F5BEA] shadow-2xs"
              />
            </div>
            <button
              type="button"
              className="p-2.5 rounded-xl bg-white border border-[#E8EAF0] text-[#171923] shadow-2xs hover:bg-gray-50 transition-colors"
              aria-label="Lọc"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Bộ lọc Loại giao dịch (Tất cả / Thu nhập / Chi tiêu) */}
          <div className="bg-[#F0F2F5] p-1 rounded-xl grid grid-cols-3 gap-1 text-center font-bold text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`py-2 rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-[#2F5BEA] text-white shadow-xs'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('income')}
              className={`py-2 rounded-lg transition-all ${
                selectedType === 'income'
                  ? 'bg-[#16A66A] text-white shadow-xs'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('expense')}
              className={`py-2 rounded-lg transition-all ${
                selectedType === 'expense'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Chi tiêu
            </button>
          </div>

          {/* Bộ chọn tháng (Mũi tên trái / phải) */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-[#E8EAF0] text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-gray-500 hover:text-[#2F5BEA] active:scale-95 transition-transform"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#171923] font-bold">{currentMonthDisplay}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-gray-500 hover:text-[#2F5BEA] active:scale-95 transition-transform"
              aria-label="Tháng tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tổng thu nhập & Tổng chi tiêu của tháng/bộ lọc */}
          <div className="flex items-center justify-between px-2 text-xs font-bold">
            <span className="text-[#16A66A]">+{formatCurrency(totalIncome)}</span>
            <span className="text-[#EF4444]">-{formatCurrency(totalExpense)}</span>
          </div>

          {/* Danh sách giao dịch hoặc trạng thái Loading / Trống */}
          {loading ? (
            <LoadingState message="Đang tải lịch sử giao dịch..." />
          ) : filtered.length === 0 ? (
            <EmptyState description="Không tìm thấy giao dịch nào phù hợp trong tháng này." />
          ) : (
            <div className="space-y-4 pt-1">
              {Object.entries(grouped).map(([dateLabel, items]) => (
                <div key={dateLabel} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#858A9B] px-1">
                    {dateLabel}
                  </h4>
                  <div className="bg-white rounded-[20px] p-2 border border-[#E8EAF0] shadow-2xs divide-y divide-[#F0F2F5]">
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

      <BottomNavigation
        activeTab="transactions"
        onTabClick={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'add') navigate('/transactions/new');
          if (tab === 'statistics') navigate('/analytics');
          if (tab === 'profile') navigate('/profile');
        }}
      />
    </div>
  );
};
