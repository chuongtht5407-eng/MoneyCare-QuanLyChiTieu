import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

interface BalanceCardProps {
  balance: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);

  const toggleVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2F5BEA] via-[#2850D4] to-[#2149D8] p-5 sm:p-6 text-white shadow-lg shadow-[#2F5BEA]/25 transition-all">
      {/* Decorative clean geometric shape */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between min-h-[90px]">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-blue-100 tracking-wide">
            Số dư hiện tại
          </span>
          <button
            onClick={toggleVisibility}
            type="button"
            className="p-1.5 -mr-1 rounded-full hover:bg-white/10 active:scale-95 transition-all text-blue-100"
            aria-label={isBalanceVisible ? 'Ẩn số dư' : 'Hiện số dư'}
            title={isBalanceVisible ? 'Ẩn số dư' : 'Hiện số dư'}
          >
            {isBalanceVisible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5 text-blue-200" />
            )}
          </button>
        </div>

        <div className="mt-2.5">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            {isBalanceVisible ? formatCurrency(balance) : '•••••••• đ'}
          </p>
        </div>
      </div>
    </div>
  );
};
