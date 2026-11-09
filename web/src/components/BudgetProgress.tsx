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
    <div className="rounded-[20px] bg-white p-5 border border-[#E8EAF0] shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#171923]">Ngân sách tháng</h3>
        <span className={`text-xs font-bold ${percentage >= 100 ? 'text-[#EF4444]' : percentage >= 80 ? 'text-[#F59E0B]' : 'text-[#2F5BEA]'}`}>
          {percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%
        </span>
      </div>

      <div className="w-full h-2.5 bg-[#F0F2F5] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            percentage >= 100 ? 'bg-[#EF4444]' : percentage >= 80 ? 'bg-[#F59E0B]' : 'bg-[#2F5BEA]'
          }`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#858A9B]">
        <span>
          Đã chi: <strong className="text-[#171923] font-semibold">{formatCurrency(spent)}</strong>
        </span>
        <span>
          Hạn mức: <strong className="text-[#171923] font-semibold">{formatCurrency(limit)}</strong>
        </span>
      </div>
    </div>
  );
};
