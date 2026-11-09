import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

interface FinanceSummaryCardProps {
  income: number;
  expense: number;
}

export const FinanceSummaryCard: React.FC<FinanceSummaryCardProps> = ({
  income,
  expense,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {/* Thu nhập Card */}
      <div className="rounded-2xl bg-[#E8F7F0] p-4 flex flex-col justify-between border border-[#D1F2E2]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#16B364]/15 flex items-center justify-center text-[#16B364]">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-medium text-gray-600">Thu nhập</span>
        </div>
        <div className="mt-2.5">
          <p className="text-sm sm:text-base font-bold text-[#16163F] truncate">
            {formatCurrency(income)}
          </p>
        </div>
      </div>

      {/* Chi tiêu Card */}
      <div className="rounded-2xl bg-[#FDF2F2] p-4 flex flex-col justify-between border border-[#FDE2E2]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EF4444]/15 flex items-center justify-center text-[#EF4444]">
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-medium text-gray-600">Chi tiêu</span>
        </div>
        <div className="mt-2.5">
          <p className="text-sm sm:text-base font-bold text-[#EF4444] truncate">
            {formatCurrency(expense)}
          </p>
        </div>
      </div>
    </div>
  );
};
