import React from 'react';
import { ChevronLeft, GraduationCap, Flame } from 'lucide-react';
import { LevelInfo } from '../../services/academyService';

export type AcademyTab = 'today' | 'roadmap' | 'advanced';

interface AcademyHeaderProps {
  levelInfo: LevelInfo;
  currentStreak: number;
  activeTab: AcademyTab;
  onBack: () => void;
  onTabChange: (tab: AcademyTab) => void;
}

const TABS: { id: AcademyTab; label: string }[] = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'roadmap', label: 'Lộ trình' },
  { id: 'advanced', label: 'Hồ sơ khó' },
];

export const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  levelInfo,
  currentStreak,
  activeTab,
  onBack,
  onTabChange,
}) => {
  return (
    <header className="bg-white border-b border-[#E8EAF0] sticky top-0 z-30 shadow-2xs">
      {/* Top Bar */}
      <div className="px-4 pt-3 pb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            type="button"
            className="w-9 h-9 rounded-full bg-[#F4F6FB] border border-[#E8EAF0] flex items-center justify-center text-[#171923] hover:bg-[#EAF0FF] hover:text-[#2F5BEA] transition-colors duration-200 active:scale-95 shrink-0"
            aria-label="Quay lại trang chủ"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center shrink-0 border border-[#DCE6FF]">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-[15px] sm:text-base font-bold text-[#171923] tracking-tight leading-tight truncate">
              MoneyCare Academy
            </h1>
            <p className="text-[11px] text-[#858A9B] font-semibold leading-tight mt-0.5 truncate">
              Cấp {levelInfo.level} • {levelInfo.totalXP} XP
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <div
          className="flex items-center gap-1 bg-[#FFF4E5] border border-[#FED7AA] px-2.5 py-1.5 rounded-full text-xs font-extrabold text-[#EA580C] shrink-0"
          title={`Chuỗi học hiện tại: ${currentStreak} ngày`}
        >
          <Flame className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316] shrink-0" />
          <span>{currentStreak} ngày</span>
        </div>
      </div>

      {/* 3 Mandatory Tabs — fixed 3-column grid, zero horizontal scroll */}
      <nav aria-label="Điều hướng MoneyCare Academy" className="grid grid-cols-3 px-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`relative py-2.5 px-1 text-xs sm:text-[13px] font-bold text-center transition-colors duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-[#2F5BEA]'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`absolute left-3 right-3 bottom-0 h-[2.5px] rounded-full bg-[#2F5BEA] transition-all duration-200 ${
                  isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </header>
  );
};
