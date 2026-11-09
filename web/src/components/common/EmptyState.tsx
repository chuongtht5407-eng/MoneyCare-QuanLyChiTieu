import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại chưa có thông tin giao dịch nào được ghi nhận.',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-2.5 bg-white/50 rounded-2xl border border-dashed border-gray-200">
      <div className="w-12 h-12 rounded-full bg-purple-50 text-[#6C5CE7] flex items-center justify-center mb-1">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-bold text-[#16163F]">{title}</h4>
      <p className="text-xs text-[#7A7B98] max-w-[220px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};
