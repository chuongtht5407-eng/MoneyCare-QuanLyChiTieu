import React from 'react';
import { formatCurrency } from '../utils/finance';

interface BudgetProgressProps {
  spent: number;
  limit: number;
  percentage: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  limit,
  percentage,
}) => {
  const fillWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="rounded-2xl bg-white p-4.5 border border-gray-100 shadow-sm space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#16163F]">Ngân sách tháng</h3>
        <span className="text-xs font-bold text-[#EF4444]">
          {percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%
        </span>
      </div>

      {/* Progress Bar Track & Fill */}
      <div className="w-full h-2.5 bg-[#EEF0F8] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6C5CE7] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      {/* Detail Labels */}
      <div className="flex items-center justify-between text-xs text-[#7A7B98]">
        <span>
          Đã chi: <strong className="text-gray-700 font-medium">{formatCurrency(spent)}</strong>
        </span>
        <span>
          Hạn mức: <strong className="text-gray-700 font-medium">{formatCurrency(limit)}</strong>
        </span>
      </div>
    </div>
  );
};
