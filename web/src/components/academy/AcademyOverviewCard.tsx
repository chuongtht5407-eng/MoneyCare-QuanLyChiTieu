import React, { useState } from 'react';
import { GraduationCap, Flame, Star, Award } from 'lucide-react';
import { AcademyProgress, LevelInfo } from '../../services/academyService';
import {
  ViBeMascot,
  VIBE_QUOTES,
  VIBE_COMPLETED_QUOTES,
  getInitialViBeQuoteIndex,
} from './ViBeMascot';

interface AcademyOverviewCardProps {
  progress: AcademyProgress;
  levelInfo: LevelInfo;
  dateKey: string;
  isDailyCompleted: boolean;
  loading?: boolean;
}

export function getLevelTitle(level: number): string {
  if (level <= 1) return 'Người mới khởi đầu';
  if (level === 2) return 'Người quản lý chi tiêu';
  if (level === 3) return 'Người giữ ví thông minh';
  if (level === 4) return 'Chuyên gia ngân sách';
  return 'Bậc thầy tài chính';
}

export const AcademyOverviewCard: React.FC<AcademyOverviewCardProps> = ({
  progress,
  levelInfo,
  dateKey,
  isDailyCompleted,
  loading = false,
}) => {
  const quotes = isDailyCompleted ? VIBE_COMPLETED_QUOTES : VIBE_QUOTES;
  const [quoteOffset, setQuoteOffset] = useState<number>(0);

  const baseIdx = getInitialViBeQuoteIndex(dateKey);
  const currentQuote = quotes[(baseIdx + quoteOffset) % quotes.length];

  const handleNextQuote = () => {
    setQuoteOffset((prev) => prev + 1);
  };

  return (
    <section aria-label="Tổng quan tiến độ học tập" className="space-y-3">
      {/* Ví Bé Greeting + Speech Bubble (Modeled after Screen 1) */}
      <div className="flex items-center gap-3 px-0.5">
        <button
          type="button"
          onClick={handleNextQuote}
          className="shrink-0 focus:outline-none active:scale-95 transition-transform duration-200"
          aria-label="Chạm vào Ví Bé để xem lời động viên khác"
          title="Chạm để đổi lời nhắn của Ví Bé"
        >
          <ViBeMascot variant="hero" className="w-[84px] h-[78px]" />
        </button>

        <button
          type="button"
          onClick={handleNextQuote}
          className="relative flex-1 text-left bg-white border border-[#E2E8F5] rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-2xs hover:border-[#C7D7FE] transition-colors duration-200"
        >
          <p className="text-[11px] font-bold text-[#2F5BEA] mb-0.5">
            Ví Bé nhắn nhủ
          </p>
          <p className="text-xs sm:text-[13px] font-medium text-[#171923] leading-snug">
            “{currentQuote}”
          </p>
        </button>
      </div>

      {/* Level & XP Progress Card (Modeled after Screen 1) */}
      <div className="bg-white rounded-[20px] p-3.5 border border-[#E8EAF0] shadow-2xs space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center shrink-0 border border-[#DCE6FF]">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-[13px] font-bold text-[#171923] truncate">
                Cấp {levelInfo.level} - {getLevelTitle(levelInfo.level)}
              </p>
              <span className="text-[11px] font-bold text-[#2F5BEA] shrink-0">
                {loading ? '...' : `${levelInfo.xpInCurrentLevel} / ${levelInfo.xpToNextLevel} XP`}
              </span>
            </div>

            {/* Smooth XP Progress Bar */}
            <div
              className="w-full bg-[#EAF0FF] h-2.5 rounded-full overflow-hidden mt-2"
              role="progressbar"
              aria-valuenow={levelInfo.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tiến độ lên cấp tiếp theo"
            >
              <div
                className="bg-[#2F5BEA] h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${loading ? 0 : levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Stat Tiles: Streak | Tổng XP | Kỷ lục (Modeled after Screen 1) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-[18px] p-3 border border-[#E8EAF0] shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#FFF4E5] flex items-center justify-center mb-1.5">
            <Flame className="w-4 h-4 text-[#F97316] fill-[#F97316]" />
          </div>
          <p className="text-sm font-extrabold text-[#171923] leading-tight">
            {loading ? '—' : `${progress.currentStreak} ngày`}
          </p>
          <p className="text-[11px] font-medium text-[#858A9B] mt-0.5">Streak</p>
        </div>

        <div className="bg-white rounded-[18px] p-3 border border-[#E8EAF0] shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#FEF9C3] flex items-center justify-center mb-1.5">
            <Star className="w-4 h-4 text-[#EAB308] fill-[#FACC15]" />
          </div>
          <p className="text-sm font-extrabold text-[#171923] leading-tight">
            {loading ? '—' : `${progress.totalXP} XP`}
          </p>
          <p className="text-[11px] font-medium text-[#858A9B] mt-0.5">Tổng XP</p>
        </div>

        <div className="bg-white rounded-[18px] p-3 border border-[#E8EAF0] shadow-2xs flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#EAF0FF] flex items-center justify-center mb-1.5">
            <Award className="w-4 h-4 text-[#2F5BEA]" />
          </div>
          <p className="text-sm font-extrabold text-[#171923] leading-tight">
            {loading ? '—' : `${progress.longestStreak} ngày`}
          </p>
          <p className="text-[11px] font-medium text-[#858A9B] mt-0.5">Kỷ lục</p>
        </div>
      </div>
    </section>
  );
};
