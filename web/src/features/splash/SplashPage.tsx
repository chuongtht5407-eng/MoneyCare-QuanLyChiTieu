import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLogo } from '../../components/AppLogo';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to /home after 1.9 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 1900);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#6C5CE7] via-[#5D4CDA] to-[#472EBA] flex flex-col justify-between relative overflow-hidden text-white select-none">

      {/* Top spacing */}
      <div className="pt-12" />

      {/* Main Center Logo & Title */}
      <div className="flex flex-col items-center justify-center px-6 text-center z-10 animate-fade-in space-y-3">
        <AppLogo size="xl" showText={true} />

        <p className="text-sm sm:text-base font-normal text-purple-100 max-w-[260px] leading-relaxed pt-2">
          Quản lý tài chính cá nhân đơn giản và hiệu quả
        </p>
      </div>

      {/* Layered Decorative Wave SVG at Bottom */}
      <div className="relative w-full h-64 z-0 pointer-events-none">
        <svg
          viewBox="0 0 390 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          {/* Layer 1 - Background wave */}
          <path
            d="M 0 160 C 100 120, 240 220, 390 140 L 390 280 L 0 280 Z"
            fill="#887CF6"
            fillOpacity="0.25"
          />
          {/* Layer 2 - Middle wave */}
          <path
            d="M 0 190 C 120 150, 270 250, 390 180 L 390 280 L 0 280 Z"
            fill="#C4B5FD"
            fillOpacity="0.3"
          />
          {/* Layer 3 - Foreground wave */}
          <path
            d="M 0 220 C 150 190, 260 260, 390 210 L 390 280 L 0 280 Z"
            fill="#887CF6"
            fillOpacity="0.35"
          />
        </svg>

        {/* White pill bar at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/70 rounded-full" />
      </div>
    </div>
  );
};
