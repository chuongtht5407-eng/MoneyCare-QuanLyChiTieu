import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLogo } from '../components/AppLogo';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const onboardingDone = localStorage.getItem('moneycare_onboarding_completed');
      const currentUser = localStorage.getItem('moneycare_current_user');

      if (currentUser) {
        navigate('/home');
      } else if (onboardingDone) {
        navigate('/login');
      } else {
        navigate('/onboarding/1');
      }
    }, 1900);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-full min-h-screen bg-[#2F5BEA] flex flex-col justify-between items-center py-16 px-6 text-white select-none relative overflow-hidden">
      <div className="pt-8" />

      <div className="flex flex-col items-center justify-center text-center z-10 animate-fade-in space-y-4">
        <div className="w-20 h-20 rounded-[28px] bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
          <AppLogo size="lg" showText={false} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">MoneyCare</h1>
        <p className="text-sm font-normal text-blue-100 max-w-[260px] leading-relaxed">
          Quản lý tài chính cá nhân thông minh
        </p>
      </div>

      <div className="w-full max-w-[200px] flex flex-col items-center space-y-3">
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-white rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] text-blue-100 font-medium tracking-wide">Phiên bản 2.1.0</p>
      </div>
    </div>
  );
};
