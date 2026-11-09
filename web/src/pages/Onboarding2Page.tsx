import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ArrowRight } from 'lucide-react';

export const Onboarding2Page: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/3');
  };

  const handleSkip = () => {
    localStorage.setItem('moneycare_onboarding_completed', 'true');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F8F9FE] text-[#16163F]">
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSkip}
          type="button"
          className="text-xs font-semibold text-[#7A7B98] hover:text-[#6C5CE7] transition-colors py-1 px-3"
        >
          Bỏ qua
        </button>
      </div>

      {/* 3D Budget Target & Chart Illustration */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#887CF6]/15 rounded-full blur-2xl transform scale-90" />
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-xl">
            {/* Dashboard card */}
            <rect x="30" y="45" width="140" height="110" rx="20" fill="#FFFFFF" />
            <rect x="45" y="115" width="20" height="30" rx="4" fill="#C4B5FD" />
            <rect x="75" y="95" width="20" height="50" rx="4" fill="#887CF6" />
            <rect x="105" y="75" width="20" height="70" rx="4" fill="#6C5CE7" />

            {/* Target Board */}
            <circle cx="140" cy="120" r="30" fill="#5036CC" />
            <circle cx="140" cy="120" r="22" fill="#FFFFFF" />
            <circle cx="140" cy="120" r="14" fill="#6C5CE7" />
            <circle cx="140" cy="120" r="6" fill="#EF4444" />

            {/* Dart arrow */}
            <path d="M 175 85 L 144 116 L 140 108 L 167 81 Z" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-3 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#16163F]">
          Thiết lập ngân sách thông minh
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7B98] leading-relaxed max-w-[280px] mx-auto">
          Đặt hạn mức chi tiêu và nhận cảnh báo khi sắp vượt ngân sách.
        </p>
      </div>

      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-6 h-2 rounded-full bg-[#6C5CE7] transition-all" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>

        <PrimaryButton onClick={handleNext}>
          <span>Tiếp theo</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </PrimaryButton>
      </div>
    </div>
  );
};
