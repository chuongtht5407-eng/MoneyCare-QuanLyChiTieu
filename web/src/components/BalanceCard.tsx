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
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#6C5CE7] via-[#6152DD] to-[#5036CC] p-6 text-white shadow-lg shadow-[#6C5CE7]/25 transition-all">
      {/* Decorative Wavy Background SVG at bottom right */}
      <div className="absolute right-0 bottom-0 top-0 left-0 pointer-events-none opacity-30">
        <svg
          viewBox="0 0 340 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M 0 100 Q 80 130 180 90 T 340 110 L 340 140 L 0 140 Z"
            fill="url(#card-wave-gradient)"
          />
          <path
            d="M 0 70 Q 120 120 220 75 T 340 95 L 340 140 L 0 140 Z"
            fill="#C4B5FD"
            fillOpacity="0.2"
          />
          <defs>
            <linearGradient id="card-wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#887CF6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between min-h-[95px]">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-purple-100 tracking-wide">
            Số dư hiện tại
          </span>
          <button
            onClick={toggleVisibility}
            type="button"
            className="p-1.5 -mr-1 rounded-full hover:bg-white/10 active:scale-95 transition-all text-purple-100"
            aria-label={isBalanceVisible ? 'Ẩn số dư' : 'Hiện số dư'}
            title={isBalanceVisible ? 'Ẩn số dư' : 'Hiện số dư'}
          >
            {isBalanceVisible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5 text-purple-200" />
            )}
          </button>
        </div>

        <div className="mt-2">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight font-sans">
            {isBalanceVisible ? formatCurrency(balance) : '•••••••• đ'}
          </p>
        </div>
      </div>
    </div>
  );
};
