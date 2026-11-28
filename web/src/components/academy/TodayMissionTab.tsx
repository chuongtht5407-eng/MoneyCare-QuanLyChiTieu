import React, { useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  RotateCcw,
  HelpCircle,
  Zap,
  ChevronUp,
} from 'lucide-react';
import { QuizQuestion } from '../../data/academyQuestions';
import {
  AcademyDailyRecord,
  AcademyProgress,
  LevelInfo,
} from '../../services/academyService';
import { AcademyOverviewCard } from './AcademyOverviewCard';
import { ViBeMascot } from './ViBeMascot';

interface TodayMissionTabProps {
  progress: AcademyProgress;
  levelInfo: LevelInfo;
  dateKey: string;
  loading: boolean;
  currentQuestion: QuizQuestion;
  dailyRecord: AcademyDailyRecord | null;
  selectedOptionId: 'A' | 'B' | 'C' | null;
  isConfirmed: boolean;
  isSubmitting: boolean;
  isQuizExpanded: boolean;
  earnedXpNotice: number | null;
  onSelectOption: (optionId: 'A' | 'B' | 'C') => void;
  onConfirmAnswer: () => void;
  onResetQuiz: () => void;
  onSetQuizExpanded: (expanded: boolean) => void;
  onOpenNewTransaction: () => void;
}

function getDifficultyLabel(difficulty: QuizQuestion['difficulty']): string {
  if (difficulty === 'easy') return 'Dễ';
  if (difficulty === 'medium') return 'Vừa';
  return 'Thử thách';
}

export const TodayMissionTab: React.FC<TodayMissionTabProps> = ({
  progress,
  levelInfo,
  dateKey,
  loading,
  currentQuestion,
  dailyRecord,
  selectedOptionId,
  isConfirmed,
  isSubmitting,
  isQuizExpanded,
  earnedXpNotice,
  onSelectOption,
  onConfirmAnswer,
  onResetQuiz,
  onSetQuizExpanded,
  onOpenNewTransaction,
}) => {
  const scenarioSectionRef = useRef<HTMLDivElement | null>(null);

  const isDailyCompleted = Boolean(dailyRecord?.completed);
  const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;

  const handleOpenQuiz = (reviewMode = false) => {
    if (reviewMode && isConfirmed) {
      onResetQuiz();
    }
    onSetQuizExpanded(true);
    setTimeout(() => {
      scenarioSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 60);
  };

  return (
    <div className="space-y-4 academy-tab-enter">
      {/* 1. Overview: Ví Bé + Level Progress + 3 Stat Tiles */}
      <AcademyOverviewCard
        progress={progress}
        levelInfo={levelInfo}
        dateKey={dateKey}
        isDailyCompleted={isDailyCompleted}
        loading={loading}
      />

      {/* 2. A. Thẻ nhiệm vụ hôm nay (Blue Hero Card — Modeled after Screen 2) */}
      <section
        aria-label="Thẻ nhiệm vụ hôm nay"
        className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#214CE0] via-[#2F5BEA] to-[#528BFF] text-white p-4 shadow-sm"
      >
        {/* Subtle decorative circles */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 right-16 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wide text-blue-100">
                Nhiệm vụ hôm nay
              </span>
              {isDailyCompleted ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#16A66A] text-white px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã hoàn thành
                </span>
              ) : (
                <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  +20 XP
                </span>
              )}
            </div>

            <h2 className="text-lg font-extrabold leading-tight tracking-tight">
              Giữ ví an toàn 💪
            </h2>

            <p className="text-xs text-blue-50/95 leading-relaxed">
              Hoàn thành thử thách tài chính để tích lũy kiến thức và duy trì chuỗi học!
            </p>
          </div>

          <div className="shrink-0 -mr-1 -mb-2">
            <ViBeMascot variant="banner" className="w-[92px] h-[86px]" />
          </div>
        </div>
      </section>

      {/* First-time +20 XP Earned Notice (Only shown on real first submission) */}
      {earnedXpNotice !== null && earnedXpNotice > 0 && (
        <div
          role="status"
          className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] p-3.5 rounded-2xl shadow-2xs flex items-center justify-between gap-3 academy-fade-in"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#16A66A] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold leading-tight">
                Hoàn thành nhiệm vụ hôm nay!
              </p>
              <p className="text-[11px] text-[#047857] mt-0.5">
                Đã lưu +{earnedXpNotice} XP và cập nhật chuỗi Streak.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold bg-[#16A66A] text-white px-2.5 py-1 rounded-full shrink-0">
            +{earnedXpNotice} XP
          </span>
        </div>
      )}

      {/* 3. B. Tình huống hôm nay (Powered by REAL daily quiz system) */}
      <section
        ref={scenarioSectionRef}
        aria-label="Tình huống hôm nay"
        className="bg-gradient-to-b from-[#F2F6FF] to-white rounded-[22px] p-4 border border-[#DCE6FF] shadow-2xs space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-extrabold text-[#2F5BEA] truncate">
              Tình huống hôm nay
            </span>
            <span className="text-[10px] font-bold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full shrink-0">
              {getDifficultyLabel(currentQuestion.difficulty)}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-[#858A9B] shrink-0">
            {dateKey}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[15px] sm:text-base font-extrabold text-[#171923] leading-snug">
            {currentQuestion.category}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Collapsed State: Preview + Start/Review CTA */}
        {!isQuizExpanded ? (
          <div className="space-y-3 pt-1">
            {isDailyCompleted && (
              <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#BBF7D0] text-[#15803D] rounded-xl px-3 py-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0" />
                <span>
                  Bạn đã hoàn thành tình huống hôm nay (+{dailyRecord?.earnedXP ?? 20} XP).
                </span>
              </div>
            )}

            <button
              onClick={() => handleOpenQuiz(false)}
              type="button"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-bold transition-all duration-200 shadow-sm shadow-[#2F5BEA]/25 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>
                {isDailyCompleted ? 'Xem lại & Ôn tập' : 'Bắt đầu thử thách'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* Expanded Interactive Quiz (Reuses existing daily quiz & Firestore transaction) */
          <div className="space-y-3 pt-2 border-t border-[#E2E8F5] academy-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171923]">Câu 1 / 1</span>
                <div className="w-20 h-1.5 bg-[#EAF0FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2F5BEA] rounded-full transition-all duration-300"
                    style={{ width: isConfirmed ? '100%' : selectedOptionId ? '60%' : '25%' }}
                  />
                </div>
              </div>

              <button
                onClick={() => onSetQuizExpanded(false)}
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#858A9B] hover:text-[#171923] px-2 py-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <span>Thu gọn</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Options A, B, C */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectAnswer = opt.id === currentQuestion.correctAnswerId;

                let optionStyle =
                  'bg-white border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] text-[#171923]';
                let badgeStyle = 'border-[#CBD5E1] text-[#64748B] bg-white';
                let statusIcon = null;

                if (isConfirmed) {
                  if (isCorrectAnswer) {
                    optionStyle =
                      'border-[#16A66A] bg-[#ECFDF5] text-[#065F46] font-bold ring-1 ring-[#16A66A]/30';
                    badgeStyle = 'bg-[#16A66A] text-white border-[#16A66A]';
                    statusIcon = <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0" />;
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle =
                      'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] font-bold ring-1 ring-[#EF4444]/30';
                    badgeStyle = 'bg-[#EF4444] text-white border-[#EF4444]';
                    statusIcon = <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />;
                  } else {
                    optionStyle = 'border-[#E8EAF0] bg-[#F8FAFC] text-[#94A3B8] opacity-70';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'border-[#2F5BEA] bg-[#EAF0FF] text-[#1E3A8A] font-bold ring-1 ring-[#2F5BEA]/30';
                  badgeStyle = 'bg-[#2F5BEA] text-white border-[#2F5BEA]';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectOption(opt.id)}
                    disabled={isConfirmed || isSubmitting}
                    type="button"
                    className={`w-full p-3.5 rounded-2xl text-xs sm:text-[13px] text-left font-semibold border transition-all duration-200 flex items-center justify-between gap-2.5 active:scale-[0.99] ${optionStyle}`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center font-extrabold shrink-0 mt-0.5 transition-colors ${badgeStyle}`}
                      >
                        {opt.id}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>
                    {statusIcon}
                  </button>
                );
              })}
            </div>

            {/* Ví Bé Tip Bar before confirming (Modeled after Screen 3) */}
            {!isConfirmed && (
              <div className="flex items-center gap-2.5 bg-[#F4F7FF] border border-[#E2E8F5] rounded-2xl px-3 py-2.5">
                <ViBeMascot variant="compact" className="w-9 h-9 shrink-0" />
                <p className="text-[11px] sm:text-xs text-[#475569] font-medium leading-snug">
                  Hãy chọn phương án bạn cho là hợp lý nhất nhé!
                </p>
              </div>
            )}

            {/* Confirm Button or Result Explanation */}
            {!isConfirmed ? (
              <button
                onClick={onConfirmAnswer}
                disabled={!selectedOptionId || isSubmitting}
                type="button"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] disabled:opacity-45 disabled:hover:bg-[#2F5BEA] text-white text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>
                  {isSubmitting
                    ? 'Đang lưu kết quả...'
                    : isDailyCompleted
                    ? 'Xác nhận đáp án (Ôn tập)'
                    : 'Xác nhận đáp án (+20 XP)'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <div className="space-y-3 pt-1 academy-fade-in">
                <div
                  className={`p-3.5 rounded-2xl border space-y-2 text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-[#ECFDF5] border-[#BBF7D0]'
                      : 'bg-[#FEF2F2] border-[#FECACA]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#16A66A] shrink-0" />
                        <span className="text-[#15803D]">Lựa chọn hợp lý! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
                        <span className="text-[#DC2626]">Chưa chính xác rồi!</span>
                      </>
                    )}
                  </div>

                  <p className="text-[#171923]">{currentQuestion.explanation}</p>

                  <div className="pt-2 border-t border-black/10 flex items-start gap-2 text-[11px] text-[#2F5BEA] font-medium">
                    <Lightbulb className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
                    <span>
                      <strong>Mẹo tài chính:</strong> {currentQuestion.financialTip}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onResetQuiz}
                    type="button"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#DCE6FF] bg-white hover:bg-[#F4F7FF] text-[#171923] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ôn tập lại</span>
                  </button>
                  <button
                    onClick={() => onSetQuizExpanded(false)}
                    type="button"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Hoàn tất</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. C. Danh sách nhiệm vụ (Only real existing mission — no fake rows) */}
      <section aria-label="Danh sách nhiệm vụ hôm nay" className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-bold text-[#171923]">Danh sách nhiệm vụ</h3>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isDailyCompleted
                ? 'bg-[#ECFDF5] text-[#16A66A]'
                : 'bg-[#EAF0FF] text-[#2F5BEA]'
            }`}
          >
            {isDailyCompleted ? '1/1 hoàn thành' : '0/1 hoàn thành'}
          </span>
        </div>

        {/* Real Persisted Mission #1: Daily Financial Quiz */}
        <div className="bg-white rounded-[20px] p-3.5 border border-[#E8EAF0] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDailyCompleted
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : 'bg-[#EAF0FF] text-[#2F5BEA]'
              }`}
            >
              {isDailyCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-xs sm:text-[13px] font-bold text-[#171923] leading-snug">
                  Trắc nghiệm tài chính hằng ngày
                </h4>
              </div>
              <p className="text-[11px] text-[#858A9B] leading-snug">
                Chủ đề: {currentQuestion.category}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-extrabold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
                  +20 XP
                </span>
                {isDailyCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#16A66A] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã hoàn thành
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-[#858A9B] bg-[#F4F6FA] px-2 py-0.5 rounded-full">
                    Chưa hoàn thành
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuiz(isDailyCompleted)}
            type="button"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
              isDailyCompleted
                ? 'bg-[#EAF0FF] text-[#2F5BEA] hover:bg-[#DCE6FF]'
                : 'bg-[#2F5BEA] text-white hover:bg-[#244CD9] shadow-2xs'
            }`}
          >
            {isDailyCompleted ? 'Ôn tập' : 'Bắt đầu'}
          </button>
        </div>

        {/* Preserved Daily Habit Shortcut from existing AcademyPage (No fake XP reward) */}
        <div className="bg-white rounded-[20px] p-3.5 border border-[#E8EAF0] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#F97316] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-[#F97316]" />
            </div>

            <div className="min-w-0 space-y-1">
              <h4 className="text-xs sm:text-[13px] font-bold text-[#171923] leading-snug">
                Ghi chép tối thiểu 1 giao dịch
              </h4>
              <p className="text-[11px] text-[#858A9B] leading-snug">
                Giữ thói quen theo dõi dòng tiền mỗi ngày trong MoneyCare.
              </p>
              <span className="inline-block text-[10px] font-semibold text-[#64748B] bg-[#F4F6FA] px-2 py-0.5 rounded-full">
                Thói quen gợi ý
              </span>
            </div>
          </div>

          <button
            onClick={onOpenNewTransaction}
            type="button"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F7FF] text-[#2F5BEA] border border-[#DCE6FF] hover:bg-[#EAF0FF] transition-all active:scale-95 shrink-0"
          >
            Ghi ngay
          </button>
        </div>
      </section>
    </div>
  );
};
