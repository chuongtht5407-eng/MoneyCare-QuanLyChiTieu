import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';

export const Onboarding1Page: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/2');
  };

  const handleSkip = () => {
    localStorage.setItem('moneycare_onboarding_completed', 'true');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7F8FC] text-[#171923]">
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSkip}
          type="button"
          className="text-xs font-semibold text-[#858A9B] hover:text-[#2F5BEA] transition-colors py-1 px-3"
        >
          Bỏ qua
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        <div className="relative w-64 h-64 bg-[#EAF0FF] rounded-3xl flex items-center justify-center shadow-sm border border-[#E8EAF0]">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
            <rect x="35" y="55" width="130" height="90" rx="16" fill="#2F5BEA" />
            <rect x="45" y="45" width="110" height="20" rx="6" fill="#244CD9" opacity="0.8" />
            <circle cx="135" cy="100" r="7" fill="#FFFFFF" />
            <rect x="65" y="75" width="70" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.8" />
            <rect x="65" y="95" width="45" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2.5 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171923]">
          Ghi chép thu chi dễ dàng
        </h2>
        <p className="text-xs sm:text-sm text-[#858A9B] leading-relaxed max-w-[280px] mx-auto">
          Theo dõi mọi khoản thu nhập và chi tiêu chỉ trong vài thao tác.
        </p>
      </div>

      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-6 h-2 rounded-full bg-[#2F5BEA] transition-all" />
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
        </div>

        <PrimaryButton onClick={handleNext}>
          Tiếp tục
        </PrimaryButton>
      </div>
    </div>
  );
};
