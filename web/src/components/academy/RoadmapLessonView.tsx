import React, { useState } from 'react';
import {
  ChevronLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  RoadmapDay,
  getStageById,
} from '../../data/academyRoadmap';
import {
  CompleteRoadmapLessonResult,
  RoadmapLessonCompletion,
} from '../../services/academyRoadmapService';
import { ViBeMascot } from './ViBeMascot';

interface RoadmapLessonViewProps {
  lesson: RoadmapDay;
  existingCompletion: RoadmapLessonCompletion | null;
  nextLesson: RoadmapDay | null;
  chapterCompletedCount: number;
  chapterTotalCount: number;
  onCompleteLesson: (lessonId: string) => Promise<CompleteRoadmapLessonResult>;
  onSelectLesson: (lessonId: string) => void;
  onBackToRoadmap: () => void;
}

export const RoadmapLessonView: React.FC<RoadmapLessonViewProps> = ({
  lesson,
  existingCompletion,
  nextLesson,
  chapterCompletedCount,
  chapterTotalCount,
  onCompleteLesson,
  onSelectLesson,
  onBackToRoadmap,
}) => {
  const stage = getStageById(lesson.stageId);
  const content = lesson.content;

  // Interactive exercise states
  const [selectedQuizOption, setSelectedQuizOption] = useState<'A' | 'B' | 'C' | null>(null);
  const [selectedCalcValue, setSelectedCalcValue] = useState<number | null>(null);
  const [classificationAnswers, setClassificationAnswers] = useState<
    Record<string, 'need' | 'want'>
  >({});
  const [isExerciseChecked, setIsExerciseChecked] = useState<boolean>(false);

  // Completion persistence states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveResult, setSaveResult] = useState<CompleteRoadmapLessonResult | null>(null);

  if (!content) {
    return (
      <div className="bg-white rounded-[20px] p-5 border border-[#E8EAF0] text-center space-y-3">
        <p className="text-sm font-bold text-[#171923]">
          Bài học này đang phát triển nội dung.
        </p>
        <button
          onClick={onBackToRoadmap}
          type="button"
          className="px-4 py-2.5 rounded-xl bg-[#2F5BEA] text-white text-xs font-bold"
        >
          Quay về Lộ trình
        </button>
      </div>
    );
  }

  const isCompleted = Boolean(existingCompletion?.completed);
  const isChapterFinished = chapterTotalCount > 0 && chapterCompletedCount >= chapterTotalCount;
  const interaction = content.interaction;

  const canCheckExercise = (() => {
    if (interaction.type === 'quiz') return selectedQuizOption !== null;
    if (interaction.type === 'calculation') return selectedCalcValue !== null;
    return interaction.items.every((item) => Boolean(classificationAnswers[item.id]));
  })();

  const isExerciseCorrect = (() => {
    if (!isExerciseChecked) return false;
    if (interaction.type === 'quiz') return selectedQuizOption === interaction.correctOptionId;
    if (interaction.type === 'calculation') return selectedCalcValue === interaction.correctValue;
    return interaction.items.every(
      (item) => classificationAnswers[item.id] === item.correctCategory
    );
  })();

  const handleResetExercise = () => {
    setSelectedQuizOption(null);
    setSelectedCalcValue(null);
    setClassificationAnswers({});
    setIsExerciseChecked(false);
  };

  const handleSaveCompletion = async () => {
    if (isSaving || isCompleted) return;
    setIsSaving(true);
    setSaveResult(null);
    try {
      const result = await onCompleteLesson(lesson.lessonId);
      setSaveResult(result);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 academy-tab-enter">
      {/* Sub-navigation bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBackToRoadmap}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5BEA] hover:text-[#2149D8] bg-white border border-[#E8EAF0] px-3 py-2 rounded-xl shadow-2xs active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Quay về Lộ trình</span>
        </button>

        {stage && (
          <span className="text-[11px] font-bold text-[#64748B] bg-white border border-[#E8EAF0] px-2.5 py-1.5 rounded-xl">
            {stage.label} • {chapterCompletedCount}/{chapterTotalCount} bài
          </span>
        )}
      </div>

      {/* Lesson Hero Card */}
      <section className="bg-white rounded-[22px] border border-[#E8EAF0] shadow-2xs overflow-hidden">
        <div className="bg-gradient-to-br from-[#EAF0FF] via-[#E0EBFF] to-[#F4F8FF] p-4 flex items-center justify-between gap-3 border-b border-[#DCE6FF]">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#2F5BEA] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#DCE6FF]">
              {stage?.label} • Bài {lesson.dayNumber}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#171923] leading-snug">
              Bài {lesson.dayNumber}: {lesson.title}
            </h2>
          </div>

          <ViBeMascot variant="hero" className="w-20 h-18 shrink-0" />
        </div>

        {/* Meta Pills (No XP reward pill in Roadmap Phase 2.2) */}
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F5BEA] bg-[#EAF0FF] px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {lesson.durationMinutes} phút
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Bài học Lộ trình
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A66A] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã hoàn thành
              </span>
            )}
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#64748B]">
              Bạn sẽ học được
            </h3>
            <ul className="space-y-2">
              {content.objectives.map((obj, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-[13px] text-[#171923] leading-snug"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Short, Easy-to-Read Lesson Content + Real Vietnam Example */}
      <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-2xs space-y-3.5">
        <h3 className="text-sm font-extrabold text-[#171923]">Nội dung bài học</h3>

        <div className="space-y-2.5 text-xs sm:text-[13px] text-[#334155] leading-relaxed">
          {content.paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Highlighted Example Box */}
        <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2F5BEA]">
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>{content.exampleTitle}</span>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed">{content.exampleBody}</p>
        </div>

        {/* Ví Bé Speech Bubble */}
        <div className="flex items-center gap-2.5 bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl px-3 py-2.5">
          <ViBeMascot variant="compact" className="w-10 h-10 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#2F5BEA]">Ví Bé nhắn nhủ</p>
            <p className="text-xs font-semibold text-[#171923] leading-snug">
              “{content.vibeQuote}”
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Practice Section */}
      <section className="bg-white rounded-[22px] p-4 border border-[#DCE6FF] shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-[#2F5BEA]">
            {isCompleted ? 'Bài tập ôn tập' : 'Bài tập củng cố'}
          </h3>
          {isExerciseChecked && (
            <button
              onClick={handleResetExercise}
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] hover:text-[#2F5BEA]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-[13px] font-bold text-[#171923] leading-relaxed">
          {interaction.prompt}
        </p>

        {/* INTERACTION TYPE 1: QUIZ */}
        {interaction.type === 'quiz' && (
          <div className="space-y-2.5">
            {interaction.options.map((opt) => {
              const isSelected = selectedQuizOption === opt.id;
              const isRight = opt.id === interaction.correctOptionId;

              let style =
                'bg-white border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] text-[#171923]';
              let badge = 'border-[#CBD5E1] text-[#64748B] bg-white';
              let icon = null;

              if (isExerciseChecked) {
                if (isRight) {
                  style = 'border-[#16A66A] bg-[#ECFDF5] text-[#065F46] font-bold';
                  badge = 'bg-[#16A66A] text-white border-[#16A66A]';
                  icon = <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0" />;
                } else if (isSelected && !isRight) {
                  style = 'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] font-bold';
                  badge = 'bg-[#EF4444] text-white border-[#EF4444]';
                  icon = <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />;
                } else {
                  style = 'border-[#E8EAF0] bg-[#F8FAFC] text-[#94A3B8] opacity-75';
                }
              } else if (isSelected) {
                style = 'border-[#2F5BEA] bg-[#EAF0FF] text-[#1E3A8A] font-bold';
                badge = 'bg-[#2F5BEA] text-white border-[#2F5BEA]';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => !isExerciseChecked && setSelectedQuizOption(opt.id)}
                  disabled={isExerciseChecked}
                  type="button"
                  className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-[13px] font-semibold transition-all flex items-center justify-between gap-2.5 ${style}`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center font-extrabold shrink-0 mt-0.5 ${badge}`}
                    >
                      {opt.id}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>
        )}

        {/* INTERACTION TYPE 2: CALCULATION */}
        {interaction.type === 'calculation' && (
          <div className="space-y-3">
            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-xl px-3 py-2 text-xs font-bold text-[#2F5BEA]">
              {interaction.formulaHint}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {interaction.options.map((opt) => {
                const isSelected = selectedCalcValue === opt.value;
                const isRight = opt.value === interaction.correctValue;

                let style =
                  'bg-white border-[#E2E8F0] hover:border-[#BFDBFE] text-[#171923]';

                if (isExerciseChecked) {
                  if (isRight) {
                    style = 'border-[#16A66A] bg-[#ECFDF5] text-[#065F46] ring-1 ring-[#16A66A]/30';
                  } else if (isSelected && !isRight) {
                    style = 'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] ring-1 ring-[#EF4444]/30';
                  } else {
                    style = 'border-[#E8EAF0] bg-[#F8FAFC] text-[#94A3B8] opacity-75';
                  }
                } else if (isSelected) {
                  style = 'border-[#2F5BEA] bg-[#EAF0FF] text-[#2F5BEA] ring-1 ring-[#2F5BEA]/30';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !isExerciseChecked && setSelectedCalcValue(opt.value)}
                    disabled={isExerciseChecked}
                    type="button"
                    className={`py-3.5 px-3 rounded-2xl border text-sm font-extrabold transition-all active:scale-[0.98] ${style}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* INTERACTION TYPE 3: CLASSIFICATION (with customizable A/B labels) */}
        {interaction.type === 'classification' && (
          <div className="space-y-2.5">
            {interaction.items.map((item) => {
              const userChoice = classificationAnswers[item.id];
              const isItemCorrect = userChoice === item.correctCategory;
              const labelA = interaction.categoryALabel ?? 'Cần (Thiết yếu)';
              const labelB = interaction.categoryBLabel ?? 'Muốn (Mong muốn)';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3 border space-y-2 transition-colors ${
                    isExerciseChecked
                      ? isItemCorrect
                        ? 'bg-[#ECFDF5] border-[#BBF7D0]'
                        : 'bg-[#FEF2F2] border-[#FECACA]'
                      : 'bg-[#FAFBFD] border-[#E8EAF0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-[#171923]">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-[#64748B]">{item.detail}</p>
                    </div>
                    {isExerciseChecked &&
                      (isItemCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(['need', 'want'] as const).map((cat) => {
                      const active = userChoice === cat;
                      const label = cat === 'need' ? labelA : labelB;
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={isExerciseChecked}
                          onClick={() =>
                            setClassificationAnswers((prev) => ({
                              ...prev,
                              [item.id]: cat,
                            }))
                          }
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                            active
                              ? 'bg-[#2F5BEA] text-white border-[#2F5BEA] shadow-2xs'
                              : 'bg-white text-[#475569] border-[#CBD5E1] hover:border-[#93C5FD]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {isExerciseChecked && (
                    <p className="text-[11px] text-[#334155] leading-relaxed pt-1 border-t border-black/10">
                      {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Check Exercise Button / Explanation Box */}
        {!isExerciseChecked ? (
          <button
            onClick={() => setIsExerciseChecked(true)}
            disabled={!canCheckExercise}
            type="button"
            className="w-full py-3 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] disabled:opacity-45 text-white text-xs sm:text-sm font-bold transition-all active:scale-[0.98]"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <div
            className={`p-3.5 rounded-2xl border space-y-1.5 text-xs leading-relaxed academy-fade-in ${
              isExerciseCorrect
                ? 'bg-[#ECFDF5] border-[#BBF7D0]'
                : 'bg-[#FFFBEB] border-[#FDE68A]'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {isExerciseCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#16A66A] shrink-0" />
                  <span className="text-[#15803D]">Chính xác! Bạn nắm bài rất tốt.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0" />
                  <span className="text-[#92400E]">Xem lại lời giải thích nhé!</span>
                </>
              )}
            </div>
            <p className="text-[#171923]">
              {interaction.type === 'classification'
                ? interaction.summaryExplanation
                : interaction.explanation}
            </p>
          </div>
        )}
      </section>

      {/* Lesson Completion Section (Strictly truthful Cloud persistence, NO XP added in Phase 2.2) */}
      <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-2xs space-y-3">
        {/* Error Feedback if Firestore write failed — NEVER fakes completion */}
        {saveResult && !saveResult.success && (
          <div
            role="alert"
            className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-2xl p-3 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Chưa thể ghi nhận hoàn thành bài học</p>
              <p>{saveResult.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Truthful Success Feedback */}
        {saveResult && saveResult.success && (
          <div
            role="status"
            className="bg-[#ECFDF5] border border-[#BBF7D0] text-[#065F46] rounded-2xl p-3 text-xs flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#16A66A] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">
                {saveResult.alreadyCompleted
                  ? 'Bài học này đã được ghi nhận hoàn thành trước đó.'
                  : saveResult.savedToCloud
                  ? 'Đã lưu hoàn thành bài học lên Cloud Firestore!'
                  : 'Đã lưu hoàn thành bài học cục bộ trên thiết bị.'}
              </p>
              <p className="text-[11px] text-[#047857]">
                Tiến độ Lộ trình được cập nhật ngay và không làm thay đổi XP hay Streak hiện có.
              </p>
            </div>
          </div>
        )}

        {/* Chapter Unlock Celebration when Chapter reaches 100% */}
        {isChapterFinished && stage && stage.id < 4 && (
          <div
            role="status"
            className="bg-[#EAF0FF] border border-[#BFDBFE] text-[#1E3A8A] rounded-2xl p-3 text-xs flex items-start gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
            <span>
              Chúc mừng! Bạn đã hoàn thành {chapterTotalCount}/{chapterTotalCount} bài {stage.label} và tự động mở khóa Chương {stage.id + 1}!
            </span>
          </div>
        )}

        {isCompleted ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A66A] bg-[#ECFDF5] border border-[#BBF7D0] rounded-xl px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Bạn đã hoàn thành Bài {lesson.dayNumber} trong Lộ trình 90 bài học.</span>
            </div>

            {nextLesson && (
              <button
                onClick={() => onSelectLesson(nextLesson.lessonId)}
                type="button"
                className="w-full py-3 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Học tiếp Bài {nextLesson.dayNumber}: {nextLesson.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            )}

            <button
              onClick={onBackToRoadmap}
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                nextLesson
                  ? 'border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569]'
                  : 'bg-[#2F5BEA] hover:bg-[#244CD9] text-white py-3 text-sm rounded-2xl'
              }`}
            >
              <span>Quay về Lộ trình</span>
              {!nextLesson && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {!isExerciseChecked && (
              <p className="text-[11px] text-[#64748B] text-center">
                Hãy hoàn thành bài tập củng cố ở trên để mở nút Hoàn thành bài học.
              </p>
            )}

            <button
              onClick={handleSaveCompletion}
              disabled={!isExerciseChecked || isSaving}
              type="button"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#16A66A] hover:bg-[#128A57] disabled:opacity-45 text-white text-sm font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSaving
                  ? 'Đang lưu tiến độ...'
                  : saveResult && !saveResult.success
                  ? 'Thử lưu hoàn thành lại'
                  : 'Hoàn thành bài học'}
              </span>
            </button>

            <button
              onClick={onBackToRoadmap}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] text-xs font-bold transition-colors"
            >
              Quay về Lộ trình
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
