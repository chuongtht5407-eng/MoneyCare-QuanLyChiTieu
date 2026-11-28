import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Heart,
  Info,
  Receipt,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  Wallet,
} from 'lucide-react';
import {
  JOB_LOSS_CONFIG,
  JOB_LOSS_STAGES,
  JobLossGameState,
  JobLossOptionId,
  evaluateJobLossOutcome,
  formatJobLossVnd,
  getJobLossStage,
  getJobLossStageRecord,
} from '../../data/jobLossGame';
import { ViBeMascot } from './ViBeMascot';

interface JobLossGameViewProps {
  gameState: JobLossGameState;
  onStartGame: () => void;
  onConfirmChoice: (stageNumber: number, optionId: JobLossOptionId) => void;
  onAdvanceStage: () => void;
  onRestartGame: () => void;
  onBackToHardCases: () => void;
}

function EmergencyBriefcaseHeroSvg() {
  return (
    <svg
      viewBox="0 0 132 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-24 shrink-0"
      role="img"
      aria-label="Quỹ dự phòng khi mất việc bất ngờ"
    >
      <circle cx="66" cy="56" r="44" fill="#EDE9FE" />
      {/* Handle */}
      <path d="M50 38V31C50 27.5 53 25 56.5 25H75.5C79 25 82 27.5 82 31V38" stroke="#2F5BEA" strokeWidth="3.5" strokeLinecap="round" />
      {/* Briefcase Body */}
      <rect x="24" y="38" width="84" height="50" rx="12" fill="#FFFFFF" stroke="#2F5BEA" strokeWidth="3" />
      <path d="M24 56C44 63 88 63 108 56" stroke="#2F5BEA" strokeWidth="2.6" />
      {/* Shield Clasp */}
      <rect x="57" y="51" width="18" height="16" rx="5" fill="#6D28D9" />
      <path d="M63 59L65.5 61.5L70 56.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* 30 Days Badge */}
      <rect x="78" y="20" width="38" height="18" rx="9" fill="#2F5BEA" />
      <text x="97" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">
        30 NGÀY
      </text>
    </svg>
  );
}

export const JobLossGameView: React.FC<JobLossGameViewProps> = ({
  gameState,
  onStartGame,
  onConfirmChoice,
  onAdvanceStage,
  onRestartGame,
  onBackToHardCases,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<JobLossOptionId | null>(null);
  const [confirmRestartOpen, setConfirmRestartOpen] = useState<boolean>(false);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastSubmittedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setSelectedOptionId(null);
    setConfirmRestartOpen(false);
    lastSubmittedKeyRef.current = null;
    if (topAnchorRef.current && typeof topAnchorRef.current.scrollIntoView === 'function') {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameState.currentStage, gameState.status, gameState.runId]);

  // =========================================================================
  // SCREEN A: INTRO
  // =========================================================================
  if (gameState.status === 'intro') {
    return (
      <div ref={topAnchorRef} className="space-y-4 academy-tab-enter scroll-mt-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToHardCases}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5BEA] hover:text-[#2149D8] bg-white border border-[#E8EAF0] px-3 py-2 rounded-xl shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Quay về Hồ sơ khó</span>
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D28D9] bg-[#EDE9FE] border border-[#DDD6FE] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            Quỹ dự phòng
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <EmergencyBriefcaseHeroSvg />
            <ViBeMascot variant="hero" className="w-24 h-22 shrink-0" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171923] tracking-tight">
              Mất việc bất ngờ – 30 ngày giữ vững tài chính
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Thu nhập chính đột ngột dừng lại trong khi tiền nhà, điện nước và ăn uống vẫn phải thanh toán. Với quỹ dự phòng giả lập <strong>6.000.000 đ</strong>, bạn sẽ xoay xở qua <strong>6 chặng (30 ngày)</strong> như thế nào?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#EDE9FE]/70 border border-[#DDD6FE] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Wallet className="w-4 h-4 text-[#6D28D9] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#6D28D9] tabular-nums whitespace-nowrap">
                6.000.000 đ
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Quỹ dự phòng</p>
            </div>

            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Calendar className="w-4 h-4 text-[#2F5BEA] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                6 chặng
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">30 ngày</p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Heart className="w-4 h-4 text-[#16A66A] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#16A66A] tabular-nums whitespace-nowrap">
                100/100
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Thiết yếu</p>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3.5 text-left space-y-1.5 text-xs text-[#475569]">
            <p className="font-extrabold text-[#171923]">Mục tiêu vượt khó 30 ngày:</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>Duy trì đầy đủ nhu cầu thiết yếu (ăn uống, nhà ở, sức khỏe) và tránh nợ rủi ro.</li>
              <li>Chủ động đẩy <strong>Tiến độ tìm việc</strong> — các cơ hội thu nhập có điều kiện chỉ trả tiền khi bạn đủ sẵn sàng.</li>
              <li>Bỏ bữa, bỏ mặc hóa đơn hoặc vay nóng lãi cao không bao giờ được tính là vượt khó thành công.</li>
              <li>
                Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud. Tiền giả lập không ảnh hưởng số dư thật hay XP.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedOptionId(null);
              onStartGame();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Bắt đầu 30 ngày thử thách</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      </div>
    );
  }

  // =========================================================================
  // SCREEN C: SUMMARY
  // =========================================================================
  if (gameState.status === 'completed') {
    const outcome = evaluateJobLossOutcome(gameState);
    const isStrong = outcome.type === 'strong_recovery';
    const isMedium = outcome.type === 'survived_strengthen';

    return (
      <div ref={topAnchorRef} className="space-y-4 academy-tab-enter scroll-mt-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToHardCases}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5BEA] hover:text-[#2149D8] bg-white border border-[#E8EAF0] px-3 py-2 rounded-xl shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Quay về Hồ sơ khó</span>
          </button>

          <span className="text-[11px] font-bold text-[#64748B] bg-white border border-[#E8EAF0] px-2.5 py-1.5 rounded-xl whitespace-nowrap shrink-0">
            Tổng kết 30 ngày
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs space-y-4">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                isStrong
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isMedium
                  ? 'bg-[#FFFBEB] text-[#D97706]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {isStrong ? (
                <Trophy className="w-7 h-7" />
              ) : isMedium ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>

            <span
              className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                isStrong
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isMedium
                  ? 'bg-[#FFFBEB] text-[#B45309]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {outcome.badgeText}
            </span>

            <h2 className="text-lg font-extrabold text-[#171923] leading-snug">
              {outcome.title}
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              {outcome.summary}
            </p>
          </div>

          {/* 6 Financial & Readiness Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tiền mặt còn lại</p>
              <p className="text-sm sm:text-base font-extrabold text-[#2F5BEA] mt-0.5 tabular-nums whitespace-nowrap">
                {formatJobLossVnd(gameState.cash)}
              </p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Thu nhập tạm thời</p>
              <p className="text-sm sm:text-base font-extrabold text-[#16A66A] mt-0.5 tabular-nums whitespace-nowrap">
                +{formatJobLossVnd(gameState.totalTempIncome)}
              </p>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Chi thiết yếu / Không thiết yếu</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] mt-0.5 tabular-nums whitespace-nowrap">
                {formatJobLossVnd(gameState.totalEssentialSpent)}
              </p>
              <p className="text-[10px] font-semibold text-[#EA580C] tabular-nums whitespace-nowrap">
                Không thiết yếu: {formatJobLossVnd(gameState.totalNonEssentialSpent)}
              </p>
            </div>

            <div
              className={`rounded-2xl p-3 border min-w-0 ${
                gameState.debt > 0 || gameState.unpaidBills > 0
                  ? 'bg-[#FEF2F2] border-[#FECACA]'
                  : 'bg-[#ECFDF5] border-[#BBF7D0]'
              }`}
            >
              <p className="text-[11px] font-semibold text-[#64748B]">Nợ / Hóa đơn còn nợ</p>
              <p
                className={`text-xs sm:text-sm font-extrabold mt-0.5 tabular-nums whitespace-nowrap ${
                  gameState.debt > 0 ? 'text-[#EF4444]' : 'text-[#16A66A]'
                }`}
              >
                Nợ: {formatJobLossVnd(gameState.debt)}
              </p>
              <p className="text-[10px] font-semibold text-[#64748B] tabular-nums whitespace-nowrap">
                Hóa đơn: {formatJobLossVnd(gameState.unpaidBills)}
              </p>
            </div>

            <div className="bg-[#EDE9FE]/60 border border-[#DDD6FE] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tiến độ tìm việc</p>
              <p className="text-sm sm:text-base font-extrabold text-[#6D28D9] mt-0.5 tabular-nums whitespace-nowrap">
                {gameState.jobSearchProgress}%
              </p>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Nhu cầu thiết yếu</p>
              <p
                className={`text-sm sm:text-base font-extrabold mt-0.5 tabular-nums whitespace-nowrap ${
                  gameState.essentialsScore >= 75 ? 'text-[#16A66A]' : 'text-[#EA580C]'
                }`}
              >
                {gameState.essentialsScore}/100
              </p>
            </div>
          </div>

          <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 flex items-center gap-3">
            <ViBeMascot variant="compact" className="w-12 h-11 shrink-0" />
            <p className="text-xs font-medium text-[#1E3A8A] leading-relaxed">
              &ldquo;{outcome.vibeClosing}&rdquo;
            </p>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 text-xs text-[#475569] leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
            <span>{outcome.takeaway}</span>
          </div>

          {/* 6-Stage Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Nhật ký 6 chặng (30 ngày)
            </h3>
            <div className="space-y-1.5">
              {gameState.history.map((item) => (
                <div
                  key={item.stageNumber}
                  className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-2.5 text-xs flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#171923]">
                      {item.dayRangeLabel} • Phương án {item.optionId}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">{item.optionLabel}</p>
                  </div>
                  <div className="text-right shrink-0 tabular-nums whitespace-nowrap">
                    {item.incomeReceived > 0 && (
                      <p className="font-bold text-[#16A66A]">
                        +{formatJobLossVnd(item.incomeReceived)}
                      </p>
                    )}
                    <p className="font-bold text-[#EF4444]">
                      -{formatJobLossVnd(item.essentialCost + item.nonEssentialCost)}
                    </p>
                    <p className="text-[10px] font-semibold text-[#64748B]">
                      Quỹ: {formatJobLossVnd(item.cashAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <button
              type="button"
              onClick={onRestartGame}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Chơi lại từ đầu</span>
            </button>

            <button
              type="button"
              onClick={onBackToHardCases}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F4F7FF] text-[#2F5BEA] border border-[#DCE6FF] text-xs sm:text-sm font-bold transition-all active:scale-[0.98]"
            >
              Quay về Hồ sơ khó
            </button>
          </div>
        </section>

        <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
          <span>
            Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud. Không làm thay đổi số dư thật hay XP.
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN B: GAMEPLAY (6 STAGES)
  // =========================================================================
  const stage = getJobLossStage(gameState.currentStage) ?? JOB_LOSS_STAGES[0];
  const confirmedRecord = getJobLossStageRecord(gameState, gameState.currentStage);

  const handleConfirm = () => {
    if (!selectedOptionId || confirmedRecord) return;
    const submitKey = `${gameState.runId}:${gameState.currentStage}`;
    if (lastSubmittedKeyRef.current === submitKey) return;
    lastSubmittedKeyRef.current = submitKey;
    onConfirmChoice(gameState.currentStage, selectedOptionId);
  };

  return (
    <div ref={topAnchorRef} className="space-y-3.5 academy-tab-enter scroll-mt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToHardCases}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2F5BEA] hover:text-[#2149D8] bg-white border border-[#E8EAF0] px-2.5 py-2 rounded-xl shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Hồ sơ khó</span>
        </button>

        <span className="text-xs font-extrabold text-[#6D28D9] bg-[#EDE9FE] border border-[#DDD6FE] px-2.5 py-1.5 rounded-xl tabular-nums whitespace-nowrap shrink-0">
          Chặng {gameState.currentStage} / 6 • {stage.dayRangeLabel}
        </span>

        <button
          type="button"
          onClick={() => setConfirmRestartOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] hover:text-[#171923] bg-white border border-[#E8EAF0] px-2.5 py-2 rounded-xl active:scale-95 transition-all whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi lại</span>
        </button>
      </div>

      {confirmRestartOpen && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3 text-xs space-y-2">
          <p className="font-bold text-[#92400E]">
            Chơi lại Mất việc bất ngờ từ Chặng 1 với quỹ dự phòng 6.000.000 đ?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmRestartOpen(false);
                onRestartGame();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#D97706] text-white font-bold"
            >
              Xác nhận chơi lại
            </button>
            <button
              type="button"
              onClick={() => setConfirmRestartOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8EAF0] text-[#475569] font-bold"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* 6-Stage Progress */}
      <div className="grid grid-cols-6 gap-1.5">
        {JOB_LOSS_STAGES.map((s) => {
          const isDone = gameState.history.some((r) => r.stageNumber === s.stageNumber);
          const isCurrent = s.stageNumber === gameState.currentStage;
          return (
            <div
              key={s.stageNumber}
              className={`h-2 rounded-full transition-all ${
                isDone ? 'bg-[#16A66A]' : isCurrent ? 'bg-[#6D28D9]' : 'bg-[#E2E8F0]'
              }`}
            />
          );
        })}
      </div>

      {/* Emergency Fund HUD */}
      <section className="bg-white rounded-[22px] p-3.5 border border-[#E8EAF0] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B]">Quỹ dự phòng còn lại</p>
            <p
              className={`text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums whitespace-nowrap ${
                gameState.cash >= 1_500_000
                  ? 'text-[#2F5BEA]'
                  : gameState.cash > 0
                  ? 'text-[#D97706]'
                  : 'text-[#EF4444]'
              }`}
            >
              {formatJobLossVnd(gameState.cash)}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-[#64748B]">Nợ / Hóa đơn nợ</p>
            <p
              className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                gameState.debt + gameState.unpaidBills > 0 ? 'text-[#EF4444]' : 'text-[#16A66A]'
              }`}
            >
              {formatJobLossVnd(gameState.debt + gameState.unpaidBills)}
            </p>
          </div>
        </div>

        {/* Job Progress & Essentials Bars */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F1F5F9]">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-[#6D28D9]">Tìm việc</span>
              <span className="text-[#171923] tabular-nums">{gameState.jobSearchProgress}%</span>
            </div>
            <div className="h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6D28D9] rounded-full transition-all"
                style={{ width: `${gameState.jobSearchProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-[#16A66A]">Thiết yếu</span>
              <span className="text-[#171923] tabular-nums">{gameState.essentialsScore}/100</span>
            </div>
            <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  gameState.essentialsScore >= 75
                    ? 'bg-[#16A66A]'
                    : gameState.essentialsScore >= 55
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#EF4444]'
                }`}
                style={{ width: `${gameState.essentialsScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] text-[#64748B]">
          <span className="tabular-nums whitespace-nowrap">
            Thu tạm: <strong className="text-[#16A66A]">+{formatJobLossVnd(gameState.totalTempIncome)}</strong>
          </span>
          <span className="tabular-nums whitespace-nowrap">
            Hóa đơn nợ: <strong className={gameState.unpaidBills > 0 ? 'text-[#EF4444]' : 'text-[#171923]'}>{formatJobLossVnd(gameState.unpaidBills)}</strong>
          </span>
        </div>
      </section>

      {/* Ví Bé Banner */}
      <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 flex items-center gap-3">
        <ViBeMascot variant="compact" className="w-12 h-11 shrink-0" />
        <p className="text-xs font-semibold text-[#1E3A8A] leading-relaxed">
          &ldquo;{confirmedRecord ? confirmedRecord.vibeReaction : stage.vibeIntro}&rdquo;
        </p>
      </div>

      {/* Scenario Card */}
      <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-3">
        <div className="space-y-1">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#6D28D9] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
            {stage.dayRangeLabel} • {stage.tag}
          </span>
          <h3 className="text-base font-extrabold text-[#171923] leading-snug">
            {stage.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
            {stage.description}
          </p>
        </div>

        <div className="space-y-2.5">
          {stage.options.map((opt) => {
            const isPicked = confirmedRecord
              ? confirmedRecord.optionId === opt.id
              : selectedOptionId === opt.id;
            const totalOutflow = opt.essentialCost + opt.nonEssentialCost;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(confirmedRecord)}
                onClick={() => {
                  if (!confirmedRecord) setSelectedOptionId(opt.id);
                }}
                className={`w-full text-left rounded-2xl p-3.5 border-2 transition-all space-y-1.5 ${
                  isPicked
                    ? 'bg-[#F4F7FF] border-[#2F5BEA] shadow-2xs'
                    : confirmedRecord
                    ? 'bg-[#FAFBFD] border-[#E8EAF0] opacity-55'
                    : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF] active:scale-[0.99]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        isPicked
                          ? 'bg-[#2F5BEA] text-white'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-[13px] font-extrabold text-[#171923] leading-snug">
                      {opt.label}
                    </span>
                  </div>

                  <div className="text-right shrink-0 space-y-0.5 tabular-nums whitespace-nowrap">
                    {opt.guaranteedIncome > 0 && !opt.isRiskyDebt && (
                      <span className="block text-[11px] font-extrabold text-[#16A66A] bg-[#ECFDF5] px-2 py-0.5 rounded-lg">
                        +{formatJobLossVnd(opt.guaranteedIncome)}
                      </span>
                    )}
                    <span className="block text-[11px] font-extrabold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded-lg">
                      -{formatJobLossVnd(totalOutflow)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#64748B] leading-relaxed pl-8">
                  {opt.description}
                </p>

                <div className="pl-8 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      opt.isRiskyDebt || opt.missedEssential
                        ? 'bg-[#FEF2F2] text-[#EF4444]'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {opt.impactHint}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm or Consequence */}
        {!confirmedRecord ? (
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleConfirm}
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              selectedOptionId
                ? 'bg-[#2F5BEA] hover:bg-[#244CD9] text-white shadow-sm active:scale-[0.98]'
                : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            <span>Xác nhận quyết định ({stage.dayRangeLabel})</span>
          </button>
        ) : (
          <div className="space-y-3 pt-1">
            <div
              className={`rounded-2xl p-3.5 border text-xs space-y-1.5 ${
                confirmedRecord.debtAdded > 0 || confirmedRecord.unpaidBillsAfter > 0
                  ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                  : 'bg-[#ECFDF5] border-[#BBF7D0] text-[#065F46]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-extrabold">
                {confirmedRecord.debtAdded > 0 ? (
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                ) : (
                  <Receipt className="w-4 h-4 text-[#16A66A] shrink-0" />
                )}
                <span>Kết quả {confirmedRecord.dayRangeLabel}</span>
              </div>
              <p className="leading-relaxed">{confirmedRecord.consequenceNote}</p>
            </div>

            <button
              type="button"
              onClick={onAdvanceStage}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <span>
                {gameState.currentStage < JOB_LOSS_CONFIG.totalStages
                  ? `Sang Chặng ${gameState.currentStage + 1} / 6`
                  : 'Xem tổng kết 30 ngày'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </section>

      <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
        <span>Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.</span>
      </div>
    </div>
  );
};
