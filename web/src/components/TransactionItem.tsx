import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Sparkles,
  Receipt,
  HeartPulse,
  MoreHorizontal,
  Wallet,
  Gift,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatCurrency } from '../utils/finance';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      // Chi tiêu (Expense)
      case 'food':
        return {
          icon: <Utensils className="w-5 h-5" />,
          bg: 'bg-[#FDF2F2]',
          color: 'text-[#EF4444]',
        };
      case 'shopping':
        return {
          icon: <ShoppingBag className="w-5 h-5" />,
          bg: 'bg-[#FCE7F3]',
          color: 'text-[#EC4899]',
        };
      case 'transport':
        return {
          icon: <Car className="w-5 h-5" />,
          bg: 'bg-[#E0F2FE]',
          color: 'text-[#0284C7]',
        };
      case 'rent':
        return {
          icon: <Home className="w-5 h-5" />,
          bg: 'bg-[#FEF3C7]',
          color: 'text-[#D97706]',
        };
      case 'entertainment':
        return {
          icon: <Sparkles className="w-5 h-5" />,
          bg: 'bg-[#EDE9FE]',
          color: 'text-[#8B5CF6]',
        };
      case 'bills':
        return {
          icon: <Receipt className="w-5 h-5" />,
          bg: 'bg-[#FFF7ED]',
          color: 'text-[#EA580C]',
        };
      case 'health':
        return {
          icon: <HeartPulse className="w-5 h-5" />,
          bg: 'bg-[#ECFDF5]',
          color: 'text-[#059669]',
        };
      case 'other_expense':
        return {
          icon: <MoreHorizontal className="w-5 h-5" />,
          bg: 'bg-[#F1F5F9]',
          color: 'text-[#64748B]',
        };

      // Thu nhập (Income)
      case 'salary':
        return {
          icon: <Wallet className="w-5 h-5" />,
          bg: 'bg-[#E8F7F0]',
          color: 'text-[#16B364]',
        };
      case 'bonus':
        return {
          icon: <Gift className="w-5 h-5" />,
          bg: 'bg-[#FEF9C3]',
          color: 'text-[#CA8A04]',
        };
      case 'investment':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          bg: 'bg-[#E0E7FF]',
          color: 'text-[#4F46E5]',
        };
      case 'other_income':
        return {
          icon: <CircleDollarSign className="w-5 h-5" />,
          bg: 'bg-[#F3E8FF]',
          color: 'text-[#9333EA]',
        };

      default:
        return {
          icon: <Wallet className="w-5 h-5" />,
          bg: 'bg-[#EDE9FE]',
          color: 'text-[#6C5CE7]',
        };
    }
  };

  const styleConfig = getCategoryIcon(transaction.categoryId);
  const isExpense = transaction.type === 'expense';

  return (
    <div className="flex items-center justify-between py-2.5 hover:bg-gray-50/80 px-2 -mx-2 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-2xl ${styleConfig.bg} ${styleConfig.color} flex items-center justify-center shrink-0`}
        >
          {styleConfig.icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#16163F]">
            {transaction.categoryName}
          </h4>
          <p className="text-xs text-[#7A7B98] mt-0.5">{transaction.formattedTime}</p>
        </div>
      </div>

      <div className="text-right">
        <span
          className={`text-sm font-bold ${
            isExpense ? 'text-[#EF4444]' : 'text-[#16B364]'
          }`}
        >
          {formatCurrency(isExpense ? -transaction.amount : transaction.amount, true)}
        </span>
      </div>
    </div>
  );
};
