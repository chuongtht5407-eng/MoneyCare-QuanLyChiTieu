import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Heart,
  Info,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  Wallet,
  XCircle,
} from 'lucide-react';
import {
  BOSS_BATTLE_CONFIG,
  BOSS_BATTLE_DAYS,
  BossBattleGameState,
  BossOptionId,
  evaluateBossBattleOutcome,
  formatBossVnd,
  getBossBattleDay,
  getDayRecord,
} from '../../data/bossBattle200k';
import { ViBeMascot } from './ViBeMascot';

interface BossBattleViewProps {
  gameState: BossBattleGameState;
  onStartGame: () => void;
  onConfirmChoice: (dayNumber: number, optionId: BossOptionId) => void;
  onAdvanceDay: () => void;
  onRestartGame: () => void;
  onBackToHardCases: () => void;
}

function BossNoodleHeroSvg() {
  return (
    <svg
      viewBox="0 0 128 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-24 shrink-0"
      role="img"
      aria-label="Biểu tượng Boss Battle 7 ngày với 200k"
    >
      <circle cx="64" cy="58" r="44" fill="#FFF4E5" />
      {/* Sparkles */}
      <path d="M22 24L24 29L29 31L24 33L22 38L20 33L15 31L20 29L22 24Z" fill="#FACC15" />
      <circle cx="106" cy="28" r="3" fill="#60A5FA" />
      {/* Steam */}
      <path d="M48 16C45 21 51 24 48 29" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 12C61 17 67 20 64 25" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 16C77 21 83 24 80 29" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      {/* Noodles */}
      <path d="M29 48C36 33 92 33 99 48" fill="#FDE047" stroke="#EA580C" strokeWidth="2.8" />
      <path
        d="M38 43C46 38 52 45 60 41C68 37 74 45 82 41C87 39 91 42 94 44"
        stroke="#EA580C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Shadow */}
      <ellipse cx="64" cy="96" rx="34" ry="6" fill="#CBD5E1" opacity="0.6" />
      {/* Bowl */}
      <path
        d="M24 48H104C103 71 88 86 64 86C40 86 25 71 24 48Z"
        fill="#FFFFFF"
        stroke="#2F5BEA"
        strokeWidth="3.2"
      />
      <path d="M46 86H82L78 94H50L46 86Z" fill="#2F5BEA" />
      {/* Determined Boss Eyes */}
      <path d="M44 59L54 63" stroke="#171923" strokeWidth="3" strokeLinecap="round" />
      <path d="M84 59L74 63" stroke="#171923" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="66.5" r="3.4" fill="#171923" />
      <circle cx="51" cy="65.5" r="1.1" fill="#FFFFFF" />
      <circle cx="78" cy="66.5" r="3.4" fill="#171923" />
      <circle cx="79" cy="65.5" r="1.1" fill="#FFFFFF" />
      <ellipse cx="42" cy="72" rx="4" ry="2.2" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="86" cy="72" rx="4" ry="2.2" fill="#FDA4AF" opacity="0.85" />
      <path d="M58 75C61 72 67 72 70 75" stroke="#EA580C" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export const BossBattleView: React.FC<BossBattleViewProps> = ({
  gameState,
  onStartGame,
  onConfirmChoice,
  onAdvanceDay,
  onRestartGame,
  onBackToHardCases,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<BossOptionId | null>(null);
  const [confirmRestartOpen, setConfirmRestartOpen] = useState<boolean>(false);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastSubmittedKeyRef = useRef<string | null>(null);

  // Reset local selection & scroll smoothly to top whenever day, status, or runId changes
  useEffect(() => {
    setSelectedOptionId(null);
    setConfirmRestartOpen(false);
    lastSubmittedKeyRef.current = null;
    if (topAnchorRef.current && typeof topAnchorRef.current.scrollIntoView === 'function') {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameState.currentDay, gameState.status, gameState.runId]);

  // =========================================================================
  // SCREEN A: INTRO SCREEN (Màn giới thiệu trò chơi)
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

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA580C] bg-[#FFF4E5] border border-[#FED7AA] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            Boss Battle
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BossNoodleHeroSvg />
            <ViBeMascot variant="hero" className="w-24 h-22 shrink-0" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#171923] tracking-tight">
              7 ngày với 200k
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Bạn có <strong>200.000 đ giả lập</strong> và <strong>7 ngày</strong> để chi tiêu cho ăn uống, đi lại và các nhu cầu thiết yếu trước ngày nhận lương. Liệu bạn có về đích an toàn mà không mắc nợ và không bỏ bữa?
            </p>
          </div>

          {/* 3 Honest Stat Tiles (No fake XP reward in Phase 3) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Calendar className="w-4 h-4 text-[#2F5BEA] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                {BOSS_BATTLE_CONFIG.totalDays} ngày
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Thử thách</p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Wallet className="w-4 h-4 text-[#16A66A] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#16A66A] tabular-nums whitespace-nowrap">
                200.000 đ
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Ngân sách</p>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Heart className="w-4 h-4 text-[#D97706] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                100/100
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Thiết yếu</p>
            </div>
          </div>

          {/* Rules summary */}
          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3.5 text-left space-y-1.5 text-xs text-[#475569]">
            <p className="font-extrabold text-[#171923]">Luật chơi nhanh:</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>Mỗi ngày chọn 1 phương án và xác nhận chi tiêu.</li>
              <li>Chi vượt số tiền còn lại sẽ phát sinh <strong>Nợ</strong>.</li>
              <li>
                <strong>Không được bỏ bữa</strong> hoặc bỏ bê nhu cầu thiết yếu để giữ tiền.
              </li>
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
            <span>Bắt đầu thử thách</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      </div>
    );
  }

  // =========================================================================
  // SCREEN C: SUMMARY / RESULT SCREEN (Tổng kết kết quả & Chơi lại)
  // =========================================================================
  if (gameState.status === 'completed') {
    const outcome = evaluateBossBattleOutcome(gameState);
    const isVictory = outcome.type === 'victory';
    const isSurvivedHard = outcome.type === 'survived_hard';
    const essentialsMetDays = BOSS_BATTLE_CONFIG.totalDays - gameState.essentialsMissed;

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
            Kết quả 7/7 ngày
          </span>
        </div>

        {/* Verdict Hero Card */}
        <section
          className={`rounded-[24px] p-5 border shadow-xs text-center space-y-4 ${
            isVictory
              ? 'bg-gradient-to-b from-[#ECFDF5] via-white to-white border-[#BBF7D0]'
              : isSurvivedHard
              ? 'bg-gradient-to-b from-[#FFFBEB] via-white to-white border-[#FDE68A]'
              : 'bg-gradient-to-b from-[#FEF2F2] via-white to-white border-[#FECACA]'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isVictory
                  ? 'bg-[#16A66A] text-white'
                  : isSurvivedHard
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[#EF4444] text-white'
              }`}
            >
              {isVictory ? (
                <Trophy className="w-7 h-7" />
              ) : isSurvivedHard ? (
                <Sparkles className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>

            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                isVictory
                  ? 'bg-[#ECFDF5] text-[#16A66A] border border-[#BBF7D0]'
                  : isSurvivedHard
                  ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                  : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
              }`}
            >
              {outcome.badgeText}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171923] leading-snug">
              {outcome.title}
            </h2>
            <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
              {outcome.summary}
            </p>
          </div>

          {/* 4 Final Financial Metrics */}
          <div className="grid grid-cols-2 gap-2.5 text-left">
            <div className="bg-white rounded-2xl p-3 border border-[#E8EAF0]">
              <p className="text-[10px] font-bold text-[#858A9B] uppercase">Ngân sách còn lại</p>
              <p
                className={`text-base font-extrabold mt-0.5 ${
                  gameState.budget > 0 ? 'text-[#16A66A]' : 'text-[#EF4444]'
                }`}
              >
                {formatBossVnd(gameState.budget)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E8EAF0]">
              <p className="text-[10px] font-bold text-[#858A9B] uppercase">Nợ phát sinh</p>
              <p
                className={`text-base font-extrabold mt-0.5 ${
                  gameState.debt > 0 ? 'text-[#EF4444]' : 'text-[#16A66A]'
                }`}
              >
                {gameState.debt > 0 ? `-${formatBossVnd(gameState.debt)}` : '0 đ'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E8EAF0]">
              <p className="text-[10px] font-bold text-[#858A9B] uppercase">Tổng đã chi</p>
              <p className="text-base font-extrabold text-[#171923] mt-0.5">
                -{formatBossVnd(gameState.totalSpent)}
              </p>
              {gameState.totalIncome > 0 && (
                <p className="text-[10px] font-bold text-[#16A66A]">
                  Thu thêm: +{formatBossVnd(gameState.totalIncome)}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E8EAF0]">
              <p className="text-[10px] font-bold text-[#858A9B] uppercase">Nhu cầu thiết yếu</p>
              <p
                className={`text-base font-extrabold mt-0.5 ${
                  gameState.essentialsMissed === 0 ? 'text-[#16A66A]' : 'text-[#EA580C]'
                }`}
              >
                {essentialsMetDays}/{BOSS_BATTLE_CONFIG.totalDays} ngày đủ
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">
                Điểm: {gameState.essentialsScore}/100
              </p>
            </div>
          </div>

          {/* Ví Bé Closing Quote + Takeaway */}
          <div className="flex items-center gap-3 bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 text-left">
            <ViBeMascot variant="compact" className="w-11 h-11 shrink-0" />
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] font-extrabold text-[#2F5BEA] uppercase">Ví Bé tổng kết</p>
              <p className="text-xs font-semibold text-[#1E3A8A] leading-snug">
                “{outcome.vibeClosing}”
              </p>
            </div>
          </div>

          <p className="text-xs font-medium text-[#334155] bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-3 text-left leading-relaxed">
            {outcome.takeaway}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedOptionId(null);
                onRestartGame();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại từ đầu</span>
            </button>

            <button
              type="button"
              onClick={onBackToHardCases}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] text-xs font-bold transition-colors"
            >
              Quay về Hồ sơ khó
            </button>
          </div>
        </section>

        {/* 7-Day Decision Timeline */}
        <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-[#171923]">Nhật ký quyết định 7 ngày</h3>
          <div className="divide-y divide-[#F1F5F9]">
            {gameState.history.map((rec) => (
              <div key={rec.dayNumber} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
                    Ngày {rec.dayNumber} • Phương án {rec.optionId}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold">
                    {rec.income > 0 && (
                      <span className="text-[#16A66A]">+{formatBossVnd(rec.income)}</span>
                    )}
                    <span className={rec.cost > 0 ? 'text-[#EF4444]' : 'text-[#64748B]'}>
                      {rec.cost > 0 ? `-${formatBossVnd(rec.cost)}` : '0 đ'}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#171923] leading-snug">{rec.optionLabel}</p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                  <span className="text-[#64748B]">Còn lại: {formatBossVnd(rec.budgetAfter)}</span>
                  {rec.debtAdded > 0 && (
                    <span className="text-[#EF4444]">
                      Phát sinh nợ: +{formatBossVnd(rec.debtAdded)}
                    </span>
                  )}
                  {rec.missedEssential && (
                    <span className="text-[#EA580C]">Thiếu nhu cầu thiết yếu</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
          <span>
            <strong>Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.</strong> Tiền giả lập không cộng XP và không thay đổi Streak, Lộ trình hay giao dịch thật.
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN B: GAMEPLAY SCREEN (Ngày 1/7 -> Ngày 7/7)
  // =========================================================================
  const scenario = getBossBattleDay(gameState.currentDay);
  const confirmedRecord = getDayRecord(gameState, gameState.currentDay);
  const isDayConfirmed = Boolean(confirmedRecord);
  const activeOptionId = confirmedRecord ? confirmedRecord.optionId : selectedOptionId;
  const previewOption = scenario?.options.find((o) => o.id === activeOptionId) ?? null;

  if (!scenario) {
    return null;
  }

  return (
    <div ref={topAnchorRef} className="space-y-3.5 academy-tab-enter scroll-mt-4">
      {/* Top Bar: Back + Day Counter + Safe Restart trigger */}
      <div className="flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={onBackToHardCases}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2F5BEA] hover:text-[#2149D8] bg-white border border-[#E8EAF0] px-2.5 py-2 rounded-xl shadow-2xs active:scale-95 transition-all whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Hồ sơ khó</span>
        </button>

        <span className="text-xs font-extrabold text-[#171923] bg-white border border-[#E8EAF0] px-2.5 sm:px-3 py-1.5 rounded-xl tabular-nums whitespace-nowrap shrink-0">
          Ngày {gameState.currentDay} / {BOSS_BATTLE_CONFIG.totalDays}
        </span>

        <button
          type="button"
          onClick={() => setConfirmRestartOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] hover:text-[#EF4444] bg-white border border-[#E8EAF0] px-2.5 py-2 rounded-xl whitespace-nowrap shrink-0"
          title="Bắt đầu lại ván mới"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi lại</span>
        </button>
      </div>

      {/* Explicit 2-step restart confirmation (prevents accidental reset!) */}
      {confirmRestartOpen && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-3 space-y-2 text-xs text-[#991B1B]"
        >
          <p className="font-bold">Bạn muốn hủy ván hiện tại (Ngày {gameState.currentDay}/7) và chơi lại từ Ngày 1 với 200.000 đ?</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmRestartOpen(false);
                setSelectedOptionId(null);
                onRestartGame();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#EF4444] text-white font-bold text-xs"
            >
              Xác nhận chơi lại
            </button>
            <button
              type="button"
              onClick={() => setConfirmRestartOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#FECACA] text-[#991B1B] font-bold text-xs"
            >
              Giữ ván đang chơi
            </button>
          </div>
        </div>
      )}

      {/* 7-Step Progress Bar */}
      <div
        className="grid grid-cols-7 gap-1.5"
        role="progressbar"
        aria-valuenow={gameState.currentDay}
        aria-valuemin={1}
        aria-valuemax={BOSS_BATTLE_CONFIG.totalDays}
        aria-label={`Tiến độ Boss Battle Ngày ${gameState.currentDay} trên 7`}
      >
        {BOSS_BATTLE_DAYS.map((d) => {
          const done = Boolean(getDayRecord(gameState, d.dayNumber));
          const current = d.dayNumber === gameState.currentDay;
          return (
            <div
              key={d.dayNumber}
              className={`h-2 rounded-full transition-colors ${
                done
                  ? 'bg-[#16A66A]'
                  : current
                  ? 'bg-[#2F5BEA]'
                  : 'bg-[#DCE6FF]'
              }`}
            />
          );
        })}
      </div>

      {/* Live Financial HUD (Budget, Debt, Essentials) */}
      <section
        aria-label="Trạng thái tài chính giả lập"
        className="bg-white rounded-[20px] p-3.5 border border-[#E8EAF0] shadow-2xs space-y-2.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#858A9B]">
              Ngân sách giả lập còn lại
            </p>
            <p
              className={`text-xl font-extrabold tracking-tight tabular-nums whitespace-nowrap ${
                gameState.budget === 0
                  ? 'text-[#EF4444]'
                  : gameState.budget <= 50_000
                  ? 'text-[#D97706]'
                  : 'text-[#16A66A]'
              }`}
            >
              {formatBossVnd(gameState.budget)}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#858A9B]">
              Nợ phát sinh
            </p>
            <p
              className={`text-base font-extrabold tabular-nums whitespace-nowrap ${
                gameState.debt > 0 ? 'text-[#EF4444]' : 'text-[#16A66A]'
              }`}
            >
              {gameState.debt > 0 ? `-${formatBossVnd(gameState.debt)}` : '0 đ'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9] text-[11px]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#475569]">
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                gameState.essentialsScore >= 70
                  ? 'text-[#16A66A]'
                  : gameState.essentialsScore >= 50
                  ? 'text-[#D97706]'
                  : 'text-[#EF4444]'
              }`}
            />
            Nhu cầu thiết yếu:{' '}
            <strong className="text-[#171923] tabular-nums">{gameState.essentialsScore}/100</strong>
          </span>

          <span className="font-semibold text-[#64748B] tabular-nums">
            Đã chi: <strong className="text-[#171923]">-{formatBossVnd(gameState.totalSpent)}</strong>
          </span>
        </div>
      </section>

      {/* Ví Bé Dynamic Speech Bubble */}
      <div className="flex items-center gap-2.5 bg-[#F2F6FF] border border-[#DCE6FF] rounded-2xl px-3.5 py-2.5">
        <ViBeMascot variant="compact" className="w-10 h-10 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold text-[#2F5BEA] uppercase">
            {isDayConfirmed ? 'Ví Bé phản hồi' : `Ví Bé • Ngày ${scenario.dayNumber}`}
          </p>
          <p className="text-xs font-semibold text-[#1E3A8A] leading-snug">
            “{confirmedRecord ? confirmedRecord.vibeReaction : scenario.vibeIntro}”
          </p>
        </div>
      </div>

      {/* Scenario & 3 Options Card */}
      <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-2xs space-y-3.5">
        <div className="space-y-1">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#2F5BEA] bg-[#EAF0FF] px-2.5 py-0.5 rounded-full">
            Ngày {scenario.dayNumber} • {scenario.tag}
          </span>
          <h2 className="text-base font-extrabold text-[#171923] leading-snug">
            {scenario.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* 3 Choices */}
        <div className="space-y-2.5">
          {scenario.options.map((opt) => {
            const isSelected = activeOptionId === opt.id;
            const isConfirmedThis = confirmedRecord?.optionId === opt.id;

            let cardStyle =
              'bg-white border-[#E2E8F0] hover:border-[#93C5FD] hover:bg-[#F8FAFF] text-[#171923]';
            let badgeStyle = 'border-[#CBD5E1] text-[#64748B] bg-white';

            if (isDayConfirmed) {
              if (isConfirmedThis) {
                cardStyle = opt.missedEssential
                  ? 'border-[#EA580C] bg-[#FFF7ED] text-[#9A3412]'
                  : 'border-[#2F5BEA] bg-[#EAF0FF] text-[#1E3A8A]';
                badgeStyle = opt.missedEssential
                  ? 'bg-[#EA580C] text-white border-[#EA580C]'
                  : 'bg-[#2F5BEA] text-white border-[#2F5BEA]';
              } else {
                cardStyle = 'border-[#E8EAF0] bg-[#F8FAFC] text-[#94A3B8] opacity-65';
              }
            } else if (isSelected) {
              cardStyle = 'border-[#2F5BEA] bg-[#EAF0FF] text-[#1E3A8A] ring-1 ring-[#2F5BEA]/25';
              badgeStyle = 'bg-[#2F5BEA] text-white border-[#2F5BEA]';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isDayConfirmed}
                onClick={() => !isDayConfirmed && setSelectedOptionId(opt.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all space-y-2 ${cardStyle}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center font-extrabold shrink-0 mt-0.5 ${badgeStyle}`}
                    >
                      {opt.id}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs sm:text-[13px] font-bold leading-snug">{opt.label}</p>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 pl-8">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      opt.missedEssential
                        ? 'bg-[#FEF2F2] text-[#EF4444]'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {opt.impactHint}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold tabular-nums whitespace-nowrap">
                    {opt.income > 0 && (
                      <span className="text-[#16A66A]">+{formatBossVnd(opt.income)}</span>
                    )}
                    <span className={opt.cost > 0 ? 'text-[#EF4444]' : 'text-[#64748B]'}>
                      {opt.cost > 0 ? `-${formatBossVnd(opt.cost)}` : '0 đ'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Impact Before Confirming */}
        {!isDayConfirmed && previewOption && (
          <div className="bg-[#FAFBFD] border border-[#DCE6FF] rounded-2xl p-3 text-xs space-y-1">
            <p className="font-bold text-[#2F5BEA]">Dự kiến tác động của Phương án {previewOption.id}:</p>
            <p className="text-[#475569]">
              Chi tiêu:{' '}
              <strong className="text-[#EF4444] tabular-nums">
                {previewOption.cost > 0 ? `-${formatBossVnd(previewOption.cost)}` : '0 đ'}
              </strong>
              {previewOption.income > 0 && (
                <>
                  {' '}• Thu thêm:{' '}
                  <strong className="text-[#16A66A] tabular-nums">
                    +{formatBossVnd(previewOption.income)}
                  </strong>
                </>
              )}
              {previewOption.missedEssential && (
                <>
                  {' '}• <strong className="text-[#EA580C]">Cảnh báo: Bỏ qua nhu cầu thiết yếu!</strong>
                </>
              )}
            </p>
          </div>
        )}

        {/* Confirm Button OR Post-Confirm Consequence + Next Day CTA */}
        {!confirmedRecord ? (
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={() => {
              if (!selectedOptionId) return;
              const submitKey = `${gameState.runId}:${scenario.dayNumber}`;
              if (lastSubmittedKeyRef.current === submitKey) return;
              lastSubmittedKeyRef.current = submitKey;
              onConfirmChoice(scenario.dayNumber, selectedOptionId);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] disabled:opacity-45 text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm"
          >
            Xác nhận lựa chọn
          </button>
        ) : (
          <div className="space-y-3 academy-fade-in">
            <div
              role="status"
              className={`rounded-2xl p-3.5 border space-y-1.5 text-xs ${
                confirmedRecord.debtAdded > 0 || confirmedRecord.missedEssential
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : 'bg-[#ECFDF5] border-[#BBF7D0]'
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold text-sm">
                {confirmedRecord.missedEssential ? (
                  <>
                    <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
                    <span className="text-[#991B1B]">Cảnh báo nhu cầu thiết yếu!</span>
                  </>
                ) : confirmedRecord.debtAdded > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0" />
                    <span className="text-[#92400E]">
                      Vượt ngân sách — phát sinh nợ {formatBossVnd(confirmedRecord.debtAdded)}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#16A66A] shrink-0" />
                    <span className="text-[#15803D]">Đã ghi nhận lựa chọn Ngày {scenario.dayNumber}</span>
                  </>
                )}
              </div>
              <p className="text-[#171923] leading-relaxed">{confirmedRecord.consequence}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedOptionId(null);
                onAdvanceDay();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#16A66A] hover:bg-[#128A57] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <span>
                {gameState.currentDay < BOSS_BATTLE_CONFIG.totalDays
                  ? `Sang Ngày ${gameState.currentDay + 1} / ${BOSS_BATTLE_CONFIG.totalDays}`
                  : 'Xem tổng kết 7 ngày'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}
      </section>

      {/* Subtle truthful local-device note */}
      <p className="text-[11px] text-[#858A9B] text-center px-2">
        Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.
      </p>
    </div>
  );
};
