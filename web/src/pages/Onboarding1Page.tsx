import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ArrowRight } from 'lucide-react';

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
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F8F9FE] text-[#16163F]">
      {/* Top Bar with Skip button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSkip}
          type="button"
          className="text-xs font-semibold text-[#7A7B98] hover:text-[#6C5CE7] transition-colors py-1 px-3"
        >
          Bỏ qua
        </button>
      </div>

      {/* 3D Wallet & Coins Illustration */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#6C5CE7]/10 rounded-full blur-2xl transform scale-90" />
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-xl">
            {/* Wallet body */}
            <rect x="35" y="75" width="130" height="90" rx="22" fill="url(#wallet-grad)" />
            <rect x="45" y="65" width="110" height="20" rx="8" fill="#887CF6" opacity="0.8" />
            {/* Wallet flap */}
            <path d="M 115 100 L 165 100 C 170 100 170 140 165 140 L 115 140 Z" fill="#5036CC" />
            <circle cx="135" cy="120" r="7" fill="#FBBF24" />
            {/* Receipt coming out */}
            <path d="M 70 30 L 110 30 L 110 85 L 103 80 L 96 85 L 90 80 L 83 85 L 77 80 L 70 85 Z" fill="#FFFFFF" />
            <line x1="78" y1="45" x2="102" y2="45" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="78" y1="55" x2="96" y2="55" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            {/* Gold coins stack */}
            <ellipse cx="155" cy="155" rx="16" ry="7" fill="#D97706" />
            <rect x="139" y="145" width="32" height="10" fill="#F59E0B" />
            <ellipse cx="155" cy="145" rx="16" ry="7" fill="#FBBF24" />

            <ellipse cx="155" cy="135" rx="16" ry="7" fill="#D97706" />
            <rect x="139" y="125" width="32" height="10" fill="#F59E0B" />
            <ellipse cx="155" cy="125" rx="16" ry="7" fill="#FBBF24" />

            <defs>
              <linearGradient id="wallet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#887CF6" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Text Info */}
      <div className="text-center space-y-3 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#16163F]">
          Kiểm soát chi tiêu dễ dàng
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7B98] leading-relaxed max-w-[280px] mx-auto">
          Ghi chép, phân loại và theo dõi tài chính của bạn mọi lúc, mọi nơi.
        </p>
      </div>

      {/* Progress Dots & Next Button */}
      <div className="space-y-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-6 h-2 rounded-full bg-[#6C5CE7] transition-all" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
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
