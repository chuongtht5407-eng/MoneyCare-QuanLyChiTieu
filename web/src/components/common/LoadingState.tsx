import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Đang tải dữ liệu...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px]">
      <div className="w-10 h-10 border-3 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-[#7A7B98] font-medium">{message}</p>
    </div>
  );
};
