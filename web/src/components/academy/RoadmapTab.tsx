import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  Wallet,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import {
  ROADMAP_STAGES,
  ROADMAP_DAYS,
  RoadmapStage,
  getDaysByStage,
  getStageProgress,
  hasStageAvailableContent,
  isStageUnlocked,
} from '../../data/academyRoadmap';
import { RoadmapProgressMap } from '../../services/academyRoadmapService';
import { ViBeMascot } from './ViBeMascot';

interface RoadmapTabProps {
  completedLessons: RoadmapProgressMap;
  expandedStageId: number | null;
  loading: boolean;
  syncError: string | null;
  accessNotice: string | null;
  onDismissAccessNotice: () => void;
  onToggleStage: (stageId: number) => void;
  onSelectLesson: (lessonId: string) => void;
}

function getStageIcon(stageId: RoadmapStage['id']) {
  switch (stageId) {
    case 1:
      return Wallet;
    case 2:
      return ShoppingBag;
    case 3:
      return ShieldCheck;
    case 4:
      return TrendingUp;
  }
}

function getViBeEncouragement(totalCompleted: number, chapter1Done: boolean): string {
  if (chapter1Done) {
    return 'Xuất sắc! Bạn đã hoàn thành trọn vẹn 15/15 bài Chương 1 và mở khóa Chương 2. Hãy ôn tập bất kỳ bài nào bạn muốn nhé!';
  }
  if (totalCompleted === 0) {
    return 'Bạn có thể học tự do bất kỳ bài nào trong Chương 1 theo tốc độ của riêng mình — không cần chờ qua ngày mới đâu!';
  }
  if (totalCompleted < 8) {
    return `Tuyệt vời! Bạn đã hoàn thành ${totalCompleted}/15 bài Chương 1. Hoàn thành đủ 15 bài sẽ tự động mở khóa Chương 2 nhé!`;
  }
  return `Sắp cán đích Chương 1 rồi (${totalCompleted}/15 bài)! Chỉ còn ${15 - totalCompleted} bài nữa để mở khóa Chương 2!`;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  completedLessons,
  expandedStageId,
  loading,
  syncError,
  accessNotice,
  onDismissAccessNotice,
  onToggleStage,
  onSelectLesson,
}) => {
  const totalLessons = ROADMAP_DAYS.length;
  const totalCompleted = ROADMAP_DAYS.filter((d) => Boolean(completedLessons[d.lessonId])).length;
  const overallPercent =
    totalLessons > 0 ? Math.min(100, Math.round((totalCompleted / totalLessons) * 100)) : 0;

  const chapter1Stats = getStageProgress(1, completedLessons);
  const encouragement = getViBeEncouragement(totalCompleted, chapter1Stats.isCompleted);

  return (
    <div className="space-y-4 academy-tab-enter">
      {/* 1. Self-Paced 90-Lesson Roadmap Header Banner */}
      <section
        aria-label="Tổng quan Lộ trình 90 bài học"
        className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#214CE0] via-[#2F5BEA] to-[#528BFF] text-white p-4 shadow-sm space-y-3"
      >
        <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 right-16 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                4 chương • {totalLessons} bài học
              </span>
              <span className="text-[10px] font-bold bg-white/15 text-blue-50 px-2 py-0.5 rounded-full">
                {loading ? 'Đang tải...' : `${totalCompleted}/${totalLessons} bài`}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-extrabold leading-tight tracking-tight">
              Lộ trình 90 bài học – Học theo tốc độ của bạn
            </h2>

            <p className="text-xs text-blue-50/95 leading-relaxed">
              Học tự do không giới hạn mỗi ngày. Hoàn thành chương trước để mở khóa chương tiếp theo.
            </p>
          </div>

          <div className="shrink-0 -mr-1 -mb-2">
            <ViBeMascot variant="banner" className="w-[82px] h-[76px]" />
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative z-10 space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-50">
            <span>Tiến độ tổng thể</span>
            <span className="font-extrabold text-white">
              {loading ? '...' : `${totalCompleted}/${totalLessons} bài (${overallPercent}%)`}
            </span>
          </div>
          <div
            className="w-full h-2 bg-white/25 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={loading ? 0 : overallPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tiến độ tổng thể Lộ trình 90 bài học"
          >
            <div
              className="h-full bg-white rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${loading ? 0 : overallPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Ví Bé Motivational Message */}
      <div className="flex items-center gap-3 bg-[#F2F6FF] border border-[#DCE6FF] rounded-2xl px-3.5 py-2.5">
        <ViBeMascot variant="compact" className="w-10 h-10 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#2F5BEA]">
            Ví Bé đồng hành
          </p>
          <p className="text-xs font-medium text-[#1E3A8A] leading-snug">{encouragement}</p>
        </div>
      </div>

      {/* 3. Unauthorized URL Guard Notice */}
      {accessNotice && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-2xl p-3 text-xs flex items-start justify-between gap-2"
        >
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            <span>{accessNotice}</span>
          </div>
          <button
            onClick={onDismissAccessNotice}
            type="button"
            className="text-[11px] font-bold text-[#991B1B] underline shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 4. Honest Cloud Sync Error (Never unlocks chapters from fake data) */}
      {syncError && (
        <div
          role="alert"
          className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-2xl p-3 text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <span>{syncError}</span>
        </div>
      )}

      {/* 5. Four Collapsible / Expandable Chapter Cards */}
      <section aria-label="Danh sách 4 chương học" className="space-y-3">
        {ROADMAP_STAGES.map((stage) => {
          const unlocked = isStageUnlocked(stage.id, completedLessons);
          const stats = getStageProgress(stage.id, completedLessons);
          const hasContent = hasStageAvailableContent(stage.id);
          const stageLessons = getDaysByStage(stage.id);
          const isExpanded = expandedStageId === stage.id;
          const Icon = getStageIcon(stage.id);

          // Distinct, honest status badge (never confuses locked-by-progress with content-in-development)
          const statusBadge = (() => {
            if (stats.isCompleted) {
              return {
                text: 'Hoàn thành',
                className: 'text-[#16A66A] bg-[#ECFDF5] border border-[#BBF7D0]',
                icon: <CheckCircle2 className="w-3 h-3" />,
              };
            }
            if (unlocked && hasContent) {
              return {
                text: 'Đang mở',
                className: 'text-[#2F5BEA] bg-[#EAF0FF] border border-[#DCE6FF]',
                icon: <Sparkles className="w-3 h-3" />,
              };
            }
            if (unlocked && !hasContent) {
              return {
                text: 'Đang phát triển nội dung',
                className: 'text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A]',
                icon: <Clock className="w-3 h-3" />,
              };
            }
            return {
              text: 'Chưa mở khóa',
              className: 'text-[#64748B] bg-[#EEF2F6]',
              icon: <Lock className="w-3 h-3" />,
            };
          })();

          return (
            <div
              key={stage.id}
              className={`rounded-[20px] border transition-all overflow-hidden ${
                unlocked
                  ? 'bg-white border-[#E8EAF0] shadow-2xs'
                  : 'bg-[#F8FAFD] border-dashed border-[#CBD5E1]'
              }`}
            >
              {/* Chapter Card Header — Clickable to expand/collapse */}
              <button
                type="button"
                onClick={() => onToggleStage(stage.id)}
                aria-expanded={isExpanded}
                className="w-full p-4 text-left space-y-3 hover:bg-[#FAFBFD]/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      stats.isCompleted
                        ? 'bg-[#ECFDF5] text-[#16A66A] border border-[#BBF7D0]'
                        : unlocked
                        ? 'bg-[#EAF0FF] text-[#2F5BEA] border border-[#DCE6FF]'
                        : 'bg-[#EEF2F6] text-[#94A3B8]'
                    }`}
                  >
                    {stats.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            unlocked
                              ? 'text-[#2F5BEA] bg-[#EAF0FF]'
                              : 'text-[#64748B] bg-[#EEF2F6]'
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="text-[11px] font-semibold text-[#858A9B]">
                          Bài {stage.dayStart}–{stage.dayEnd} ({stats.totalDays} bài)
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusBadge.className}`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.text}</span>
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-extrabold leading-snug ${
                          unlocked ? 'text-[#171923]' : 'text-[#64748B]'
                        }`}
                      >
                        {stage.title}
                      </h3>
                      <span className="text-[#858A9B] shrink-0 mt-0.5">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed">{stage.description}</p>
                  </div>
                </div>

                {/* Chapter Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-[#64748B] font-medium truncate">
                      {unlocked
                        ? hasContent
                          ? 'Chọn bất kỳ bài nào để học ngay'
                          : 'Đã mở khóa • Đang phát triển nội dung'
                        : stage.unlockRequirementText}
                    </span>
                    <span
                      className={`font-bold shrink-0 ${
                        stats.isCompleted
                          ? 'text-[#16A66A]'
                          : unlocked
                          ? 'text-[#2F5BEA]'
                          : 'text-[#94A3B8]'
                      }`}
                    >
                      {loading
                        ? '...'
                        : `${stats.completedCount}/${stats.totalDays} bài (${stats.progressPercent}%)`}
                    </span>
                  </div>

                  <div
                    className="w-full h-2 bg-[#EAF0FF] rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={loading ? 0 : stats.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Tiến độ ${stage.label}`}
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                        stats.isCompleted
                          ? 'bg-[#16A66A]'
                          : unlocked
                          ? 'bg-[#2F5BEA]'
                          : 'bg-[#CBD5E1]'
                      }`}
                      style={{ width: `${loading ? 0 : stats.progressPercent}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Chapter Content */}
              {isExpanded && (
                <div className="border-t border-[#E8EAF0] bg-[#FAFBFD] px-3.5 py-3 space-y-2.5">
                  {unlocked && hasContent ? (
                    <>
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-bold text-[#475569]">
                          Danh sách {stageLessons.length} bài học ({stage.label})
                        </span>
                        <span className="text-[10px] font-bold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
                          Học theo thứ tự bất kỳ
                        </span>
                      </div>

                      <div className="space-y-2">
                        {stageLessons.map((lesson) => {
                          const isDone = Boolean(completedLessons[lesson.lessonId]);
                          return (
                            <div
                              key={lesson.lessonId}
                              className={`rounded-2xl p-3 border transition-all space-y-2.5 ${
                                isDone
                                  ? 'bg-[#F8FEFB] border-[#BBF7D0]'
                                  : 'bg-white border-[#E8EAF0]'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-[11px] ${
                                    isDone
                                      ? 'bg-[#ECFDF5] text-[#16A66A]'
                                      : 'bg-[#EAF0FF] text-[#2F5BEA]'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                  ) : (
                                    `B${lesson.dayNumber}`
                                  )}
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-extrabold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
                                      Bài {lesson.dayNumber}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#64748B]">
                                      <Clock className="w-3 h-3" />
                                      {lesson.durationMinutes} phút
                                    </span>
                                    {isDone ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#16A66A] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Đã hoàn thành
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-semibold text-[#858A9B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                                        Chưa học
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-xs sm:text-[13px] font-bold text-[#171923] leading-snug">
                                    {lesson.title}
                                  </h4>
                                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                                    {lesson.shortDescription}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => onSelectLesson(lesson.lessonId)}
                                type="button"
                                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                                  isDone
                                    ? 'bg-[#EAF0FF] text-[#2F5BEA] hover:bg-[#DCE6FF]'
                                    : 'bg-[#2F5BEA] text-white hover:bg-[#244CD9] shadow-2xs'
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{isDone ? 'Ôn tập' : 'Học ngay'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : unlocked && !hasContent ? (
                    <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#92400E]">
                        <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span>
                          {stage.label} đã mở khóa — Đang phát triển nội dung
                        </span>
                      </div>
                      <p className="text-xs text-[#78350F] leading-relaxed">
                        Chúc mừng bạn đã đạt đủ tiến độ mở khóa {stage.label} (Bài {stage.dayStart}–
                        {stage.dayEnd})! Nội dung bài học chi tiết của chương này đang được phát triển và sẽ sớm ra mắt.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white border border-[#E2E8F0] p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#475569]">
                        <Lock className="w-4 h-4 text-[#64748B] shrink-0" />
                        <span>{stage.label} chưa mở khóa</span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {stage.unlockRequirementText}. Không cần chờ qua ngày mới — chương sẽ tự động mở khóa ngay khi bạn hoàn thành đủ tiến độ chương trước.
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Trạng thái nội dung: Đang phát triển nội dung</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
