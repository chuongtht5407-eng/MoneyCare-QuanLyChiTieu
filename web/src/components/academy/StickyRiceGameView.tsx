import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Info,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react';
import {
  STICKY_RICE_CONFIG,
  STICKY_RICE_DAYS,
  STICKY_RICE_PRICE_OPTIONS,
  StickyRiceConfirmInput,
  StickyRiceGameState,
  StickyRicePrice,
  StickyRiceTacticId,
  calculateDayUpfrontCost,
  evaluateStickyRiceOutcome,
  formatSignedStickyRiceVnd,
  formatStickyRiceVnd,
  getMaxAffordablePortions,
  getStickyRiceDay,
  getStickyRiceDayRecord,
  getUnitVariableCost,
} from '../../data/stickyRiceGame';
import { ViBeMascot } from './ViBeMascot';

interface StickyRiceGameViewProps {
  gameState: StickyRiceGameState;
  onStartGame: () => void;
  onConfirmDay: (input: StickyRiceConfirmInput) => void;
  onAdvanceDay: () => void;
  onRestartGame: () => void;
  onBackToHardCases: () => void;
}

function StickyRiceCartHeroSvg() {
  return (
    <svg
      viewBox="0 0 132 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-24 shrink-0"
      role="img"
      aria-label="Xe bán xôi khởi nghiệp"
    >
      <circle cx="66" cy="56" r="44" fill="#FEF3C7" />
      {/* Awning roof */}
      <path d="M22 36L30 22H102L110 36H22Z" fill="#F97316" stroke="#2F5BEA" strokeWidth="2.6" />
      <path d="M22 36C22 41 28 43 33 41C38 43 44 41 44 36" fill="#FFFFFF" stroke="#2F5BEA" strokeWidth="2" />
      <path d="M44 36C44 41 50 43 55 41C60 43 66 41 66 36" fill="#FDBA74" stroke="#2F5BEA" strokeWidth="2" />
      <path d="M66 36C66 41 72 43 77 41C82 43 88 41 88 36" fill="#FFFFFF" stroke="#2F5BEA" strokeWidth="2" />
      <path d="M88 36C88 41 94 43 99 41C104 43 110 41 110 36" fill="#FDBA74" stroke="#2F5BEA" strokeWidth="2" />
      {/* Poles */}
      <line x1="30" y1="41" x2="30" y2="62" stroke="#2F5BEA" strokeWidth="3" />
      <line x1="102" y1="41" x2="102" y2="62" stroke="#2F5BEA" strokeWidth="3" />
      {/* Steaming Sticky Rice Pot */}
      <path d="M52 50C54 45 78 45 80 50" fill="#FDE047" stroke="#D97706" strokeWidth="2.2" />
      <rect x="49" y="50" width="34" height="12" rx="4" fill="#FFFFFF" stroke="#2F5BEA" strokeWidth="2.4" />
      <path d="M59 43C57.5 40 60 39 59 37" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <path d="M67 42C65.5 39 68 38 67 36" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      {/* Cart Body */}
      <rect x="26" y="62" width="80" height="24" rx="7" fill="#2F5BEA" />
      <rect x="34" y="67" width="64" height="14" rx="4" fill="#EAF0FF" />
      <text x="66" y="77" textAnchor="middle" fill="#2F5BEA" fontSize="9.5" fontWeight="800">
        XÔI NÓNG
      </text>
      {/* Wheels */}
      <circle cx="42" cy="91" r="8" fill="#171923" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="42" cy="91" r="2.5" fill="#FACC15" />
      <circle cx="90" cy="91" r="8" fill="#171923" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="90" cy="91" r="2.5" fill="#FACC15" />
    </svg>
  );
}

export const StickyRiceGameView: React.FC<StickyRiceGameViewProps> = ({
  gameState,
  onStartGame,
  onConfirmDay,
  onAdvanceDay,
  onRestartGame,
  onBackToHardCases,
}) => {
  const currentDayData = getStickyRiceDay(gameState.currentDay) ?? STICKY_RICE_DAYS[0];
  const maxAffordable = useMemo(
    () => getMaxAffordablePortions(gameState.cash, currentDayData),
    [gameState.cash, currentDayData]
  );

  const [portions, setPortions] = useState<number>(() => Math.min(40, maxAffordable));
  const [unitPrice, setUnitPrice] = useState<StickyRicePrice>(20_000);
  const [tacticId, setTacticId] = useState<StickyRiceTacticId>('A');
  const [confirmRestartOpen, setConfirmRestartOpen] = useState<boolean>(false);

  const topAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastSubmittedKeyRef = useRef<string | null>(null);

  // Reset daily controls & scroll to top on day/status/runId changes
  useEffect(() => {
    const day = getStickyRiceDay(gameState.currentDay) ?? STICKY_RICE_DAYS[0];
    const maxNow = getMaxAffordablePortions(gameState.cash, day);
    const defaultPortions = Math.min(40, maxNow);
    setPortions(defaultPortions);
    setUnitPrice(20_000);
    setTacticId('A');
    setConfirmRestartOpen(false);
    lastSubmittedKeyRef.current = null;

    if (topAnchorRef.current && typeof topAnchorRef.current.scrollIntoView === 'function') {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Intentionally depend on currentDay, status, runId (not cash mid-day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentDay, gameState.status, gameState.runId]);

  // =========================================================================
  // SCREEN A: INTRO SCREEN
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

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            Khởi nghiệp nhỏ
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <StickyRiceCartHeroSvg />
            <ViBeMascot variant="hero" className="w-24 h-22 shrink-0" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171923] tracking-tight">
              Gánh xôi khởi nghiệp – 7 ngày làm chủ
            </h2>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Bạn là sinh viên mở xe xôi buổi sáng với vốn giả lập <strong>1.000.000 đ</strong>. Mỗi ngày hãy quyết định lượng nhập nguyên liệu, giá bán và cách ứng phó sự cố để giữ dòng tiền dương và kinh doanh có lãi!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#FEF3C7]/70 border border-[#FDE68A] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Wallet className="w-4 h-4 text-[#D97706] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#B45309] tabular-nums whitespace-nowrap">
                1.000.000 đ
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Vốn ban đầu</p>
            </div>

            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Calendar className="w-4 h-4 text-[#2F5BEA] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                7 ngày
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Kinh doanh</p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <TrendingUp className="w-4 h-4 text-[#16A66A] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#16A66A] tabular-nums whitespace-nowrap">
                Có lãi
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Mục tiêu</p>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3.5 text-left space-y-1.5 text-xs text-[#475569]">
            <p className="font-extrabold text-[#171923]">Mục tiêu & nguyên tắc kinh doanh:</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>Mỗi ngày gồm 4 bước: Nhập nguyên liệu → Định giá → Xử lý tình huống → Chốt sổ.</li>
              <li>Chi phí cố định vận hành <strong>50.000 đ/ngày</strong> + chi phí biến đổi từng suất; không thể nhập hàng vượt quá tiền mặt hiện có.</li>
              <li>Xôi tồn cuối ngày không thể bán lại hôm sau — ước lượng đúng nhu cầu để tránh lỗ tồn kho.</li>
              <li>
                Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud. Tiền giả lập không ảnh hưởng số dư thật hay XP.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 shrink-0" />
            <span>Bắt đầu kinh doanh</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      </div>
    );
  }

  // =========================================================================
  // SCREEN C: SUMMARY / RESULT SCREEN
  // =========================================================================
  if (gameState.status === 'completed') {
    const outcome = evaluateStickyRiceOutcome(gameState);
    const isProfit = outcome.type === 'profit';
    const isLow = outcome.type === 'breakeven_low_profit';

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
            Tổng kết 7/7 ngày
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs space-y-4">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                isProfit
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isLow
                  ? 'bg-[#FFFBEB] text-[#D97706]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {isProfit ? (
                <Trophy className="w-7 h-7" />
              ) : isLow ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <TrendingDown className="w-7 h-7" />
              )}
            </div>

            <span
              className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                isProfit
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isLow
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

          {/* 6 Required Business Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng doanh thu 7 ngày</p>
              <p className="text-sm sm:text-base font-extrabold text-[#2F5BEA] mt-0.5 tabular-nums whitespace-nowrap">
                {formatStickyRiceVnd(gameState.totalRevenue)}
              </p>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng chi phí</p>
              <p className="text-sm sm:text-base font-extrabold text-[#171923] mt-0.5 tabular-nums whitespace-nowrap">
                {formatStickyRiceVnd(gameState.totalCost)}
              </p>
            </div>

            <div
              className={`rounded-2xl p-3 border min-w-0 ${
                gameState.totalProfit >= 0
                  ? 'bg-[#ECFDF5] border-[#BBF7D0]'
                  : 'bg-[#FEF2F2] border-[#FECACA]'
              }`}
            >
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng lợi nhuận / lỗ</p>
              <p
                className={`text-sm sm:text-base font-extrabold mt-0.5 tabular-nums whitespace-nowrap ${
                  gameState.totalProfit >= 0 ? 'text-[#16A66A]' : 'text-[#EF4444]'
                }`}
              >
                {formatSignedStickyRiceVnd(gameState.totalProfit)}
              </p>
            </div>

            <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tiền mặt còn lại</p>
              <p className="text-sm sm:text-base font-extrabold text-[#B45309] mt-0.5 tabular-nums whitespace-nowrap">
                {formatStickyRiceVnd(gameState.cash)}
              </p>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Số ngày có lãi</p>
              <p className="text-sm sm:text-base font-extrabold text-[#171923] mt-0.5 tabular-nums whitespace-nowrap">
                {gameState.profitableDays} / 7 ngày
              </p>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Số suất xôi đã bán</p>
              <p className="text-sm sm:text-base font-extrabold text-[#171923] mt-0.5 tabular-nums whitespace-nowrap">
                {gameState.totalPortionsSold} suất
                {gameState.totalPortionsUnsold > 0 && (
                  <span className="text-[10px] font-semibold text-[#EA580C] ml-1">
                    (tồn {gameState.totalPortionsUnsold})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Ví Bé Closing */}
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

          {/* 7-Day Business Ledger */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Nhật ký kinh doanh 7 ngày
            </h3>
            <div className="space-y-1.5">
              {gameState.history.map((item) => (
                <div
                  key={item.dayNumber}
                  className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-2.5 text-xs flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#171923]">
                      Ngày {item.dayNumber}: Bán {item.soldPortions}/{item.preparedPortions} suất ({formatStickyRiceVnd(item.unitPrice)})
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      Doanh thu {formatStickyRiceVnd(item.revenue)} • Chi phí {formatStickyRiceVnd(item.totalCost)}
                      {item.unsoldPortions > 0 ? ` • Tồn ${item.unsoldPortions}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0 tabular-nums whitespace-nowrap">
                    <p
                      className={`font-extrabold ${
                        item.profit >= 0 ? 'text-[#16A66A]' : 'text-[#EF4444]'
                      }`}
                    >
                      {formatSignedStickyRiceVnd(item.profit)}
                    </p>
                    <p className="text-[10px] font-semibold text-[#64748B]">
                      Quỹ: {formatStickyRiceVnd(item.endingCash)}
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
  // SCREEN B: GAMEPLAY (DAYS 1..7 — 4 STEPS)
  // =========================================================================
  const confirmedRecord = getStickyRiceDayRecord(gameState, gameState.currentDay);
  const unitVariableCost = getUnitVariableCost(currentDayData);
  const selectedTactic =
    currentDayData.tactics.find((t) => t.id === tacticId) ?? currentDayData.tactics[0];
  const selectedPriceObj =
    STICKY_RICE_PRICE_OPTIONS.find((p) => p.price === unitPrice) ?? STICKY_RICE_PRICE_OPTIONS[1];

  const upfrontPreview = calculateDayUpfrontCost(
    currentDayData,
    portions,
    selectedTactic,
    gameState.cash
  );

  const handleConfirmCurrentDay = () => {
    if (confirmedRecord || !upfrontPreview.canAfford) return;
    const submitKey = `${gameState.runId}:${gameState.currentDay}`;
    if (lastSubmittedKeyRef.current === submitKey) return;
    lastSubmittedKeyRef.current = submitKey;

    onConfirmDay({
      dayNumber: gameState.currentDay,
      basePortions: portions,
      unitPrice,
      tacticId: selectedTactic.id,
    });
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

        <span className="text-xs font-extrabold text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1.5 rounded-xl tabular-nums whitespace-nowrap shrink-0">
          Ngày {gameState.currentDay} / 7
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

      {/* 2-Step Restart Confirmation */}
      {confirmRestartOpen && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3 text-xs space-y-2">
          <p className="font-bold text-[#92400E]">
            Chơi lại Gánh xôi khởi nghiệp từ Ngày 1 với vốn 1.000.000 đ?
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

      {/* 7-Day Progress Bar */}
      <div className="grid grid-cols-7 gap-1.5" aria-label={`Tiến độ ngày ${gameState.currentDay} trên 7`}>
        {STICKY_RICE_DAYS.map((day) => {
          const isDone = gameState.history.some((r) => r.dayNumber === day.dayNumber);
          const isCurrent = day.dayNumber === gameState.currentDay;
          return (
            <div
              key={day.dayNumber}
              className={`h-2 rounded-full transition-all ${
                isDone ? 'bg-[#16A66A]' : isCurrent ? 'bg-[#F97316]' : 'bg-[#E2E8F0]'
              }`}
            />
          );
        })}
      </div>

      {/* Business Cash HUD */}
      <section className="bg-white rounded-[22px] p-3.5 border border-[#E8EAF0] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#64748B]">Tiền mặt gánh xôi (giả lập)</p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#2F5BEA] tracking-tight tabular-nums whitespace-nowrap">
              {formatStickyRiceVnd(gameState.cash)}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-[#64748B]">Lãi / lỗ lũy kế</p>
            <p
              className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                gameState.totalProfit >= 0 ? 'text-[#16A66A]' : 'text-[#EF4444]'
              }`}
            >
              {formatSignedStickyRiceVnd(gameState.totalProfit)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2 border-t border-[#F1F5F9] text-[11px]">
          <span className="font-semibold text-[#475569] tabular-nums whitespace-nowrap">
            Giá vốn hôm nay: <strong className="text-[#EA580C]">{formatStickyRiceVnd(unitVariableCost)}/suất</strong>
          </span>
          <span className="font-semibold text-[#64748B] tabular-nums whitespace-nowrap">
            Ngày lãi: <strong className="text-[#171923]">{gameState.profitableDays}/{gameState.history.length}</strong>
          </span>
        </div>
      </section>

      {/* Ví Bé Banner */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3 flex items-center gap-3">
        <ViBeMascot variant="compact" className="w-12 h-11 shrink-0" />
        <p className="text-xs font-semibold text-[#92400E] leading-relaxed">
          &ldquo;{confirmedRecord ? confirmedRecord.vibeReaction : currentDayData.vibeIntro}&rdquo;
        </p>
      </div>

      {/* BEFORE CONFIRM: STEPS 1, 2, 3 */}
      {!confirmedRecord ? (
        <div className="space-y-3.5">
          {/* STEP 1: Nhập nguyên liệu */}
          <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#2F5BEA] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-[#171923]">Nhập nguyên liệu</h3>
              </div>
              <span className="text-[11px] font-bold text-[#64748B] tabular-nums whitespace-nowrap">
                Tối đa: {maxAffordable} suất
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-2 text-center text-[11px]">
              <div className="min-w-0">
                <p className="text-[10px] text-[#64748B]">Nguyên liệu</p>
                <p className="font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                  {formatStickyRiceVnd(currentDayData.ingredientCostPerPortion)}
                </p>
              </div>
              <div className="min-w-0 border-x border-[#E8EAF0]">
                <p className="text-[10px] text-[#64748B]">Bao bì</p>
                <p className="font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                  {formatStickyRiceVnd(currentDayData.packagingCostPerPortion)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#64748B]">Vận hành/ngày</p>
                <p className="font-extrabold text-[#EA580C] tabular-nums whitespace-nowrap">
                  {formatStickyRiceVnd(currentDayData.fixedOperatingCost)}
                </p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between gap-3 bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-2.5">
              <button
                type="button"
                aria-label="Giảm 5 suất"
                disabled={portions <= 0}
                onClick={() => setPortions((p) => Math.max(0, p - STICKY_RICE_CONFIG.portionStep))}
                className="w-10 h-10 rounded-xl bg-white border border-[#DCE6FF] text-[#2F5BEA] flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="text-center">
                <p className="text-lg font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                  {portions} suất
                </p>
                <p className="text-[11px] font-semibold text-[#64748B] tabular-nums whitespace-nowrap">
                  Tiền hàng: {formatStickyRiceVnd(portions * unitVariableCost)}
                </p>
              </div>

              <button
                type="button"
                aria-label="Tăng 5 suất"
                disabled={portions + STICKY_RICE_CONFIG.portionStep > maxAffordable}
                onClick={() =>
                  setPortions((p) =>
                    Math.min(maxAffordable, p + STICKY_RICE_CONFIG.portionStep)
                  )
                }
                className="w-10 h-10 rounded-xl bg-[#2F5BEA] text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1.5">
              {STICKY_RICE_CONFIG.portionPresets.map((preset) => {
                const disabled = preset > maxAffordable;
                const active = portions === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    disabled={disabled}
                    onClick={() => setPortions(preset)}
                    className={`py-1.5 rounded-xl text-xs font-extrabold tabular-nums transition-all border ${
                      active
                        ? 'bg-[#2F5BEA] text-white border-[#2F5BEA]'
                        : disabled
                        ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed'
                        : 'bg-white text-[#475569] border-[#E8EAF0] hover:border-[#2F5BEA]'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: Định giá */}
          <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F5BEA] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="text-sm font-extrabold text-[#171923]">Định giá bán mỗi suất</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {STICKY_RICE_PRICE_OPTIONS.map((opt) => {
                const isSelected = unitPrice === opt.price;
                const margin = opt.price - unitVariableCost;
                return (
                  <button
                    key={opt.price}
                    type="button"
                    onClick={() => setUnitPrice(opt.price)}
                    className={`rounded-2xl p-2.5 text-center border-2 transition-all space-y-1 ${
                      isSelected
                        ? 'bg-[#F4F7FF] border-[#2F5BEA]'
                        : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF]'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                      {opt.label}
                    </p>
                    <p className="text-[10px] font-bold text-[#16A66A] tabular-nums whitespace-nowrap">
                      Lãi gộp +{Math.round(margin / 1000)}k
                    </p>
                    <p className="text-[10px] font-semibold text-[#64748B] tabular-nums whitespace-nowrap">
                      ~{opt.baseDemand} khách
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#64748B]">{selectedPriceObj.tagline}</p>
          </section>

          {/* STEP 3: Tình huống kinh doanh */}
          <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#F97316] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-[#171923]">Tình huống hôm nay</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA580C] bg-[#FFF4E5] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {currentDayData.tag}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-extrabold text-[#171923] leading-snug">
                {currentDayData.title}
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {currentDayData.description}
              </p>
            </div>

            <div className="space-y-2">
              {currentDayData.tactics.map((tac) => {
                const preview = calculateDayUpfrontCost(
                  currentDayData,
                  portions,
                  tac,
                  gameState.cash
                );
                const isSelected = selectedTactic.id === tac.id;
                return (
                  <button
                    key={tac.id}
                    type="button"
                    disabled={!preview.canAfford}
                    onClick={() => setTacticId(tac.id)}
                    className={`w-full text-left rounded-2xl p-3 border-2 transition-all space-y-1 ${
                      isSelected
                        ? 'bg-[#F4F7FF] border-[#2F5BEA]'
                        : !preview.canAfford
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-55 cursor-not-allowed'
                        : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#171923] leading-snug">
                        {tac.id}. {tac.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {tac.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 text-[10px] font-bold">
                      <span className="text-[#2F5BEA]">{tac.impactHint}</span>
                      {!preview.canAfford && (
                        <span className="text-[#EF4444]">Không đủ tiền mặt</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Upfront Cost Summary */}
            <div
              className={`rounded-2xl p-3 border text-xs space-y-1 ${
                upfrontPreview.canAfford
                  ? 'bg-[#FAFBFD] border-[#E8EAF0]'
                  : 'bg-[#FEF2F2] border-[#FECACA]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#64748B] font-semibold">Tổng chi thực tế hôm nay:</span>
                <span
                  className={`font-extrabold tabular-nums whitespace-nowrap ${
                    upfrontPreview.canAfford ? 'text-[#171923]' : 'text-[#EF4444]'
                  }`}
                >
                  {formatStickyRiceVnd(upfrontPreview.totalCost)}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Gồm hàng ({formatStickyRiceVnd(upfrontPreview.variableCost)}) + vận hành ({formatStickyRiceVnd(upfrontPreview.fixedCost)})
                {upfrontPreview.eventCost > 0
                  ? ` + xử lý sự kiện (${formatStickyRiceVnd(upfrontPreview.eventCost)})`
                  : ''}
                .
              </p>
              {!upfrontPreview.canAfford && (
                <p className="text-[11px] font-bold text-[#EF4444] flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Không đủ tiền mặt! Hãy giảm số suất chuẩn bị hoặc đổi phương án sự kiện.</span>
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!upfrontPreview.canAfford}
              onClick={handleConfirmCurrentDay}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                upfrontPreview.canAfford
                  ? 'bg-[#2F5BEA] hover:bg-[#244CD9] text-white shadow-sm active:scale-[0.98]'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Mở bán Ngày {gameState.currentDay} / 7</span>
            </button>
          </section>
        </div>
      ) : (
        /* STEP 4: Tổng kết ngày */
        <section className="bg-white rounded-[22px] p-4 border-2 border-[#DCE6FF] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#16A66A] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="text-sm font-extrabold text-[#171923]">
                Tổng kết Ngày {confirmedRecord.dayNumber}
              </h3>
            </div>
            <span
              className={`text-xs font-extrabold px-2.5 py-1 rounded-full tabular-nums whitespace-nowrap ${
                confirmedRecord.profit >= 0
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {formatSignedStickyRiceVnd(confirmedRecord.profit)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-2 min-w-0">
              <p className="text-[10px] font-semibold text-[#64748B]">Chuẩn bị</p>
              <p className="text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                {confirmedRecord.preparedPortions} suất
              </p>
            </div>
            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-xl p-2 min-w-0">
              <p className="text-[10px] font-semibold text-[#16A66A]">Đã bán</p>
              <p className="text-sm font-extrabold text-[#16A66A] tabular-nums whitespace-nowrap">
                {confirmedRecord.soldPortions} suất
              </p>
            </div>
            <div
              className={`rounded-xl p-2 border min-w-0 ${
                confirmedRecord.unsoldPortions > 0
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : 'bg-[#FAFBFD] border-[#E8EAF0]'
              }`}
            >
              <p className="text-[10px] font-semibold text-[#64748B]">Tồn kho</p>
              <p
                className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                  confirmedRecord.unsoldPortions > 0 ? 'text-[#D97706]' : 'text-[#171923]'
                }`}
              >
                {confirmedRecord.unsoldPortions} suất
              </p>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Giá bán / Nhu cầu khách:</span>
              <span className="font-bold text-[#171923] tabular-nums whitespace-nowrap">
                {formatStickyRiceVnd(confirmedRecord.unitPrice)} • {confirmedRecord.effectiveDemand} khách
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Doanh thu ({confirmedRecord.soldPortions} × {formatStickyRiceVnd(confirmedRecord.unitPrice)}):</span>
              <span className="font-extrabold text-[#16A66A] tabular-nums whitespace-nowrap">
                +{formatStickyRiceVnd(confirmedRecord.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Tổng chi phí đã ghi nhận:</span>
              <span className="font-extrabold text-[#EF4444] tabular-nums whitespace-nowrap">
                -{formatStickyRiceVnd(confirmedRecord.totalCost)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#E8EAF0]">
              <span className="font-bold text-[#171923]">Lợi nhuận ngày {confirmedRecord.dayNumber}:</span>
              <span
                className={`font-extrabold tabular-nums whitespace-nowrap ${
                  confirmedRecord.profit >= 0 ? 'text-[#16A66A]' : 'text-[#EF4444]'
                }`}
              >
                {formatSignedStickyRiceVnd(confirmedRecord.profit)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[#171923]">Tiền mặt cuối ngày:</span>
              <span className="font-extrabold text-[#2F5BEA] tabular-nums whitespace-nowrap">
                {formatStickyRiceVnd(confirmedRecord.endingCash)}
              </span>
            </div>
          </div>

          {confirmedRecord.unsoldPortions > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-2.5 text-[11px] text-[#92400E] flex items-start gap-2">
              <Package className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>
                Tồn {confirmedRecord.unsoldPortions} suất xôi (giá vốn {formatStickyRiceVnd(confirmedRecord.spoilageValue)} đã tính trong tổng chi phí hôm nay, không bị trừ lặp).
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onAdvanceDay}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <span>
              {gameState.currentDay < STICKY_RICE_CONFIG.totalDays
                ? `Sang Ngày ${gameState.currentDay + 1} / 7`
                : 'Xem tổng kết 7 ngày'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      )}

      <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
        <span>Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.</span>
      </div>
    </div>
  );
};
