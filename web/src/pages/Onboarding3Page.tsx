import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';

export const Onboarding3Page: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/onboarding/2');
  };

  const handleFinish = () => {
    localStorage.setItem('moneycare_onboarding_completed', 'true');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7F8FC] text-[#171923]">
      {/* Top Bar with Back button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          type="button"
          className="w-9 h-9 rounded-full bg-white border border-[#E8EAF0] shadow-2xs flex items-center justify-center text-[#171923] hover:bg-gray-50 transition-all"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div />
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        <div className="relative w-64 h-64 bg-[#EAF0FF] rounded-3xl flex items-center justify-center shadow-sm border border-[#E8EAF0]">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
            <rect x="35" y="35" width="130" height="130" rx="20" fill="#FFFFFF" />
            <circle cx="100" cy="100" r="42" fill="none" stroke="#E8EAF0" strokeWidth="16" />
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="none"
              stroke="#2F5BEA"
              strokeWidth="16"
              strokeDasharray="264"
              strokeDashoffset="70"
            />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2.5 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171923]">
          Hiểu rõ tài chính của bạn
        </h2>
        <p className="text-xs sm:text-sm text-[#858A9B] leading-relaxed max-w-[280px] mx-auto">
          Thống kê trực quan giúp bạn đưa ra những quyết định chi tiêu tốt hơn.
        </p>
      </div>

      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
          <span className="w-6 h-2 rounded-full bg-[#2F5BEA] transition-all" />
        </div>

        <PrimaryButton onClick={handleFinish}>
          Bắt đầu ngay
        </PrimaryButton>
      </div>
    </div>
  );
};
