import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Check } from 'lucide-react';

export const Onboarding3Page: React.FC = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    localStorage.setItem('moneycare_onboarding_completed', 'true');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F8F9FE] text-[#16163F]">
      <div className="flex justify-end pt-2" />

      {/* 3D Analytics Donut Illustration */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#C4B5FD]/20 rounded-full blur-2xl transform scale-90" />
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-xl">
            <rect x="35" y="35" width="130" height="130" rx="24" fill="#FFFFFF" />

            {/* Donut slices */}
            <circle cx="100" cy="100" r="42" fill="none" stroke="#E2E8F0" strokeWidth="18" />
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="none"
              stroke="#6C5CE7"
              strokeWidth="18"
              strokeDasharray="264"
              strokeDashoffset="70"
            />
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="none"
              stroke="#887CF6"
              strokeWidth="18"
              strokeDasharray="264"
              strokeDashoffset="190"
            />
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="none"
              stroke="#C4B5FD"
              strokeWidth="18"
              strokeDasharray="264"
              strokeDashoffset="240"
            />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-3 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#16163F]">
          Thống kê trực quan, hiểu rõ tài chính
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7B98] leading-relaxed max-w-[280px] mx-auto">
          Biểu đồ và báo cáo chi tiết giúp bạn nắm bắt thói quen chi tiêu.
        </p>
      </div>

      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-6 h-2 rounded-full bg-[#6C5CE7] transition-all" />
        </div>

        <PrimaryButton onClick={handleFinish}>
          <span>Bắt đầu ngay</span>
          <Check className="w-4 h-4 stroke-[2.5]" />
        </PrimaryButton>
      </div>
    </div>
  );
};
