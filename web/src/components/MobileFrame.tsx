import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  darkStatusBar?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  darkStatusBar = false,
}) => {
  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center sm:py-6 px-0 sm:px-4">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[880px] bg-[#F8F9FE] sm:rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-[8px] sm:border-[#1E1E2E]">

        {/* iOS Style Status Bar */}
        <div
          className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold z-30 shrink-0 select-none ${
            darkStatusBar ? 'bg-transparent text-white' : 'bg-[#F8F9FE] text-[#16163F]'
          }`}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};
