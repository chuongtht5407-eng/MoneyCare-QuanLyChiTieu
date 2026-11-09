import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ChevronLeft } from 'lucide-react';

export const Onboarding2Page: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/3');
  };

  const handleBack = () => {
    navigate('/onboarding/1');
  };

  const handleSkip = () => {
    localStorage.setItem('moneycare_onboarding_completed', 'true');
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7F8FC] text-[#171923]">
      {/* Top Bar with Back & Skip buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          type="button"
          className="w-9 h-9 rounded-full bg-white border border-[#E8EAF0] shadow-2xs flex items-center justify-center text-[#171923] hover:bg-gray-50 transition-all"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

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
            <rect x="30" y="45" width="140" height="110" rx="16" fill="#FFFFFF" />
            <rect x="45" y="115" width="25" height="30" rx="4" fill="#EAF0FF" />
            <rect x="77" y="90" width="25" height="55" rx="4" fill="#244CD9" opacity="0.6" />
            <rect x="109" y="65" width="25" height="80" rx="4" fill="#2F5BEA" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2.5 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171923]">
          Kiểm soát ngân sách thông minh
        </h2>
        <p className="text-xs sm:text-sm text-[#858A9B] leading-relaxed max-w-[280px] mx-auto">
          Thiết lập hạn mức và nhận cảnh báo khi sắp vượt ngân sách.
        </p>
      </div>

      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
          <span className="w-6 h-2 rounded-full bg-[#2F5BEA] transition-all" />
          <span className="w-2 h-2 rounded-full bg-[#E8EAF0]" />
        </div>

        <PrimaryButton onClick={handleNext}>
          Tiếp tục
        </PrimaryButton>
      </div>
    </div>
  );
};
