import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Info,
  Percent,
  Receipt,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  CREDIT_CARD_CONFIG,
  CREDIT_CARD_CYCLES,
  CYCLE_1_PURCHASE_ITEMS,
  ConfirmCreditCycleInput,
  CreditCardGameState,
  CreditCardPaymentPlanId,
  calculateMinimumPayment,
  calculatePaymentQuotes,
  evaluateCreditCardOutcome,
  formatCreditVnd,
  getCreditCardCycle,
  getCreditCardCycleRecord,
} from '../../data/creditCardGame';
import { ViBeMascot } from './ViBeMascot';

interface CreditCardGameViewProps {
  gameState: CreditCardGameState;
  onStartGame: () => void;
  onConfirmCycle: (input: ConfirmCreditCycleInput) => void;
  onAdvanceCycle: () => void;
  onRestartGame: () => void;
  onBackToHardCases: () => void;
}

function SimulatedCreditCardHeroSvg() {
  return (
    <svg
      viewBox="0 0 138 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-24 shrink-0"
      role="img"
      aria-label="Thẻ tín dụng mô phỏng giáo dục"
    >
      <circle cx="68" cy="56" r="44" fill="#E0F2FE" />
      <rect x="16" y="28" width="104" height="62" rx="12" fill="#2F5BEA" />
      <rect x="16" y="42" width="104" height="10" fill="#1E3A8A" opacity="0.45" />
      {/* Chip */}
      <rect x="28" y="48" width="16" height="12" rx="3" fill="#FDE047" />
      <line x1="36" y1="48" x2="36" y2="60" stroke="#CA8A04" strokeWidth="1.2" />
      {/* Simulated Card Label */}
      <text x="28" y="75" fill="#FFFFFF" fontSize="8.5" fontWeight="800" letterSpacing="1">
        DEMO CARD • 10M
      </text>
      <text x="28" y="83" fill="#BFDBFE" fontSize="6.5" fontWeight="600">
        KHÔNG PHẢI THẺ THẬT
      </text>
      {/* Warning Pill */}
      <circle cx="110" cy="30" r="11" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
      <text x="110" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
        %
      </text>
    </svg>
  );
}

export const CreditCardGameView: React.FC<CreditCardGameViewProps> = ({
  gameState,
  onStartGame,
  onConfirmCycle,
  onAdvanceCycle,
  onRestartGame,
  onBackToHardCases,
}) => {
  // Cycle 1 multi-select purchase items
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['course-fee']);
  // Cycle 2 & 3 single-select spending option
  const [selectedSpendOptId, setSelectedSpendOptId] = useState<string>('c2-none');
  const [selectedPaymentPlan, setSelectedPaymentPlan] =
    useState<CreditCardPaymentPlanId>('full');
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  const [confirmRestartOpen, setConfirmRestartOpen] = useState<boolean>(false);

  const topAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastSubmittedKeyRef = useRef<string | null>(null);

  const currentCycleData =
    getCreditCardCycle(gameState.currentCycle) ?? CREDIT_CARD_CYCLES[0];

  // Reset per-cycle controls & scroll smoothly to top on cycle/status/runId change
  useEffect(() => {
    setLimitWarning(null);
    setConfirmRestartOpen(false);
    lastSubmittedKeyRef.current = null;

    if (gameState.currentCycle === 1) {
      setSelectedItemIds(['course-fee']);
    } else if (gameState.currentCycle === 2) {
      setSelectedSpendOptId('c2-none');
    } else {
      setSelectedSpendOptId('c3-none');
    }

    if (topAnchorRef.current && typeof topAnchorRef.current.scrollIntoView === 'function') {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameState.currentCycle, gameState.status, gameState.runId]);

  const cycle1PurchasesTotal = useMemo(() => {
    return CYCLE_1_PURCHASE_ITEMS.filter((i) => selectedItemIds.includes(i.id)).reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }, [selectedItemIds]);

  const cycleNewPurchases = useMemo(() => {
    if (gameState.currentCycle === 1) return cycle1PurchasesTotal;
    const found = currentCycleData.spendingOptions.find((o) => o.id === selectedSpendOptId);
    return found ? found.amount : 0;
  }, [gameState.currentCycle, cycle1PurchasesTotal, currentCycleData, selectedSpendOptId]);

  const cyclePurchaseSummary = useMemo(() => {
    if (gameState.currentCycle === 1) {
      const picked = CYCLE_1_PURCHASE_ITEMS.filter((i) => selectedItemIds.includes(i.id));
      if (picked.length === 0) return 'Không quẹt thẻ kỳ 1';
      return picked.map((p) => p.label).join(', ');
    }
    const found = currentCycleData.spendingOptions.find((o) => o.id === selectedSpendOptId);
    return found ? found.label : 'Không phát sinh chi tiêu mới';
  }, [gameState.currentCycle, selectedItemIds, currentCycleData, selectedSpendOptId]);

  const projectedStatementBalance = gameState.currentBalance + cycleNewPurchases;
  const paymentQuotes = useMemo(
    () => calculatePaymentQuotes(projectedStatementBalance),
    [projectedStatementBalance]
  );

  // Keep selected payment plan pointing to a valid available quote whenever statement balance changes
  useEffect(() => {
    const activeQuote = paymentQuotes.find((q) => q.id === selectedPaymentPlan && q.available);
    if (!activeQuote) {
      const firstAvailable = paymentQuotes.find((q) => q.available);
      if (firstAvailable) {
        setSelectedPaymentPlan(firstAvailable.id);
      }
    }
  }, [paymentQuotes, selectedPaymentPlan]);

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

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0369A1] bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            Quản trị nợ thẻ
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <SimulatedCreditCardHeroSvg />
            <ViBeMascot variant="hero" className="w-24 h-22 shrink-0" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171923] tracking-tight">
              Thẻ tín dụng không phải tiền miễn phí
            </h2>
            <p className="text-xs font-extrabold text-[#EA580C]">
              &ldquo;{CREDIT_CARD_CONFIG.subtitle}&rdquo;
            </p>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed pt-1">
              Trải nghiệm <strong>3 kỳ sao kê</strong> với hạn mức giả lập <strong>10.000.000 đ</strong> và ngân sách trả thẻ <strong>4.500.000 đ/kỳ</strong> để hiểu tận gốc cách dư nợ, lãi suất và phí phát sinh.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#E0F2FE]/70 border border-[#BAE6FD] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <CreditCard className="w-4 h-4 text-[#0369A1] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#0369A1] tabular-nums whitespace-nowrap">
                10.000.000 đ
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Hạn mức demo</p>
            </div>

            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Calendar className="w-4 h-4 text-[#2F5BEA] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#171923] tabular-nums whitespace-nowrap">
                3 kỳ sao kê
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Thời lượng</p>
            </div>

            <div className="bg-[#FFF4E5] border border-[#FED7AA] rounded-2xl px-1.5 py-2.5 space-y-1 min-w-0">
              <Percent className="w-4 h-4 text-[#EA580C] mx-auto" />
              <p className="text-xs sm:text-sm font-extrabold text-[#EA580C] tabular-nums whitespace-nowrap">
                2%/tháng
              </p>
              <p className="text-[10px] font-semibold text-[#64748B]">Lãi mô phỏng</p>
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3.5 text-left space-y-1.5 text-xs text-[#475569]">
            <p className="font-extrabold text-[#171923]">Quy tắc mô phỏng giáo dục (minh bạch):</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>
                <strong>Miễn lãi:</strong> Thanh toán 100% dư nợ sao kê đúng hạn → 0 đ lãi, 0 đ phí.
              </li>
              <li>
                <strong>Công thức lãi đơn giản hóa:</strong> 24%/năm (~2%/tháng), chỉ tính 1 lần/kỳ trên <strong>dư nợ chưa thanh toán</strong> (KHÔNG tính trên hạn mức 10 triệu). Mô phỏng giáo dục này không đại diện biểu phí của bất kỳ ngân hàng cụ thể nào.
              </li>
              <li>
                <strong>Thanh toán tối thiểu:</strong> 5% dư nợ sao kê (tối thiểu 100.000 đ); trả thấp hơn mức tối thiểu bị phí trễ hạn giả lập 200.000 đ.
              </li>
              <li>
                Tuyệt đối không dùng thẻ ngân hàng thật. Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Bắt đầu 3 kỳ sao kê</span>
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
    const outcome = evaluateCreditCardOutcome(gameState);
    const isGood = outcome.type === 'good_management';
    const isMid = outcome.type === 'needs_improvement';

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
            Hoàn thành 3/3 kỳ
          </span>
        </div>

        <section className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E8EAF0] shadow-xs space-y-4">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                isGood
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isMid
                  ? 'bg-[#FFFBEB] text-[#D97706]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {isGood ? (
                <Trophy className="w-7 h-7" />
              ) : isMid ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>

            <span
              className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                isGood
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : isMid
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

          {/* 5 Required Summary Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng tiền đã chi</p>
              <p className="text-sm sm:text-base font-extrabold text-[#171923] mt-0.5 tabular-nums whitespace-nowrap">
                {formatCreditVnd(gameState.totalSpent)}
              </p>
            </div>

            <div className="bg-[#ECFDF5] border border-[#BBF7D0] rounded-2xl p-3 min-w-0">
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng tiền đã thanh toán</p>
              <p className="text-sm sm:text-base font-extrabold text-[#16A66A] mt-0.5 tabular-nums whitespace-nowrap">
                {formatCreditVnd(gameState.totalPaid)}
              </p>
            </div>

            <div
              className={`rounded-2xl p-3 border min-w-0 ${
                gameState.totalInterest + gameState.totalLateFees > 0
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : 'bg-[#ECFDF5] border-[#BBF7D0]'
              }`}
            >
              <p className="text-[11px] font-semibold text-[#64748B]">Tổng lãi & phí giả lập</p>
              <p
                className={`text-sm sm:text-base font-extrabold mt-0.5 tabular-nums whitespace-nowrap ${
                  gameState.totalInterest + gameState.totalLateFees > 0
                    ? 'text-[#EA580C]'
                    : 'text-[#16A66A]'
                }`}
              >
                {formatCreditVnd(gameState.totalInterest + gameState.totalLateFees)}
              </p>
              <p className="text-[10px] text-[#64748B] tabular-nums whitespace-nowrap">
                Lãi {formatCreditVnd(gameState.totalInterest)} • Phí {formatCreditVnd(gameState.totalLateFees)}
              </p>
            </div>

            <div
              className={`rounded-2xl p-3 border min-w-0 ${
                gameState.currentBalance > 0
                  ? 'bg-[#FEF2F2] border-[#FECACA]'
                  : 'bg-[#ECFDF5] border-[#BBF7D0]'
              }`}
            >
              <p className="text-[11px] font-semibold text-[#64748B]">Dư nợ còn lại</p>
              <p
                className={`text-sm sm:text-base font-extrabold mt-0.5 tabular-nums whitespace-nowrap ${
                  gameState.currentBalance > 0 ? 'text-[#EF4444]' : 'text-[#16A66A]'
                }`}
              >
                {formatCreditVnd(gameState.currentBalance)}
              </p>
              <p className="text-[10px] text-[#64748B] tabular-nums whitespace-nowrap">
                Hoàn thành {gameState.history.length}/3 kỳ
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

          {/* 3-Cycle Statement History */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Lịch sử 3 kỳ sao kê
            </h3>
            <div className="space-y-1.5">
              {gameState.history.map((item) => (
                <div
                  key={item.cycleNumber}
                  className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-xl p-2.5 text-xs flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#171923]">
                      Kỳ {item.cycleNumber} (Hạn {item.dueDateLabel})
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      Sao kê {formatCreditVnd(item.statementBalance)} • Trả {formatCreditVnd(item.paymentAmount)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 tabular-nums whitespace-nowrap">
                    <p
                      className={`font-extrabold ${
                        item.interestCharged + item.lateFeeCharged > 0
                          ? 'text-[#EA580C]'
                          : 'text-[#16A66A]'
                      }`}
                    >
                      Lãi/phí: {formatCreditVnd(item.interestCharged + item.lateFeeCharged)}
                    </p>
                    <p className="text-[10px] font-semibold text-[#64748B]">
                      Nợ cuối kỳ: {formatCreditVnd(item.closingBalance)}
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
            Mô phỏng giáo dục dùng lãi suất đơn giản hóa 2%/tháng (không đại diện biểu phí ngân hàng thực tế). Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN B: GAMEPLAY (CYCLES 1..3)
  // =========================================================================
  const confirmedRecord = getCreditCardCycleRecord(gameState, gameState.currentCycle);
  const currentMinPay = calculateMinimumPayment(projectedStatementBalance);
  const selectedQuoteObj =
    paymentQuotes.find((q) => q.id === selectedPaymentPlan && q.available) ??
    paymentQuotes.find((q) => q.available) ??
    null;

  const toggleCycle1Item = (itemId: string, itemAmount: number) => {
    setLimitWarning(null);
    setSelectedItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      const nextTotal = cycle1PurchasesTotal + itemAmount;
      if (gameState.currentBalance + nextTotal > gameState.creditLimit) {
        setLimitWarning(
          `Không thể chọn thêm vì tổng quẹt (${formatCreditVnd(nextTotal)}) vượt hạn mức ${formatCreditVnd(gameState.creditLimit)}!`
        );
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const handleConfirmCurrentCycle = () => {
    if (confirmedRecord || !selectedQuoteObj) return;
    if (gameState.currentBalance + cycleNewPurchases > gameState.creditLimit) {
      setLimitWarning('Tổng dư nợ vượt hạn mức thẻ cho phép.');
      return;
    }
    const submitKey = `${gameState.runId}:${gameState.currentCycle}`;
    if (lastSubmittedKeyRef.current === submitKey) return;
    lastSubmittedKeyRef.current = submitKey;

    onConfirmCycle({
      cycleNumber: gameState.currentCycle,
      newPurchases: cycleNewPurchases,
      purchaseSummary: cyclePurchaseSummary,
      paymentPlanId: selectedQuoteObj.id,
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

        <span className="text-xs font-extrabold text-[#0369A1] bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-1.5 rounded-xl tabular-nums whitespace-nowrap shrink-0">
          Kỳ sao kê {gameState.currentCycle} / 3
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
            Chơi lại Thẻ tín dụng từ Kỳ 1 với hạn mức 10.000.000 đ?
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

      {/* 3-Cycle Progress Bar */}
      <div className="grid grid-cols-3 gap-2">
        {CREDIT_CARD_CYCLES.map((c) => {
          const isDone = gameState.history.some((r) => r.cycleNumber === c.cycleNumber);
          const isCurrent = c.cycleNumber === gameState.currentCycle;
          return (
            <div
              key={c.cycleNumber}
              className={`h-2 rounded-full transition-all ${
                isDone ? 'bg-[#16A66A]' : isCurrent ? 'bg-[#0284C7]' : 'bg-[#E2E8F0]'
              }`}
            />
          );
        })}
      </div>

      {/* Simulated Credit Card HUD */}
      <section className="rounded-[22px] bg-gradient-to-br from-[#1E3A8A] via-[#2F5BEA] to-[#0284C7] text-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
              Dư nợ thẻ hiện tại (giả lập)
            </p>
            <p className="text-xl sm:text-2xl font-extrabold tabular-nums whitespace-nowrap">
              {formatCreditVnd(gameState.currentBalance)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-blue-100">Hạn mức khả dụng</p>
            <p className="text-sm font-extrabold text-emerald-200 tabular-nums whitespace-nowrap">
              {formatCreditVnd(gameState.availableLimit)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2 border-t border-white/20 text-[11px] text-blue-50">
          <span className="tabular-nums whitespace-nowrap">
            Hạn mức: <strong>{formatCreditVnd(gameState.creditLimit)}</strong>
          </span>
          <span className="tabular-nums whitespace-nowrap">
            Lãi & phí tích lũy: <strong>{formatCreditVnd(gameState.totalInterest + gameState.totalLateFees)}</strong>
          </span>
        </div>
      </section>

      {/* Ví Bé Banner */}
      <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-2xl p-3 flex items-center gap-3">
        <ViBeMascot variant="compact" className="w-12 h-11 shrink-0" />
        <p className="text-xs font-semibold text-[#1E3A8A] leading-relaxed">
          &ldquo;{confirmedRecord ? confirmedRecord.vibeReaction : currentCycleData.vibeIntro}&rdquo;
        </p>
      </div>

      {/* BEFORE CONFIRM */}
      {!confirmedRecord ? (
        <div className="space-y-3.5">
          {/* Step 1: Spending Decision */}
          <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0369A1] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                  {currentCycleData.tag}
                </span>
                <span className="text-[10px] font-bold text-[#64748B] tabular-nums whitespace-nowrap">
                  Sao kê {currentCycleData.statementDateLabel} • Hạn {currentCycleData.dueDateLabel}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#171923] leading-snug">
                {currentCycleData.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {currentCycleData.description}
              </p>
            </div>

            {gameState.currentCycle === 1 ? (
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-[#171923]">
                  Chọn các khoản chi bằng thẻ trong Kỳ 1 (không vượt 10.000.000 đ):
                </p>
                {CYCLE_1_PURCHASE_ITEMS.map((item) => {
                  const checked = selectedItemIds.includes(item.id);
                  const wouldExceed =
                    !checked &&
                    gameState.currentBalance + cycle1PurchasesTotal + item.amount >
                      gameState.creditLimit;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCycle1Item(item.id, item.amount)}
                      className={`w-full text-left rounded-2xl p-3 border-2 transition-all space-y-1 ${
                        checked
                          ? 'bg-[#F4F7FF] border-[#2F5BEA]'
                          : wouldExceed
                          ? 'bg-[#FEF2F2]/50 border-[#FECACA]'
                          : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                              checked
                                ? 'bg-[#2F5BEA] border-[#2F5BEA] text-white'
                                : 'bg-white border-[#CBD5E1]'
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </span>
                          <span className="text-xs font-extrabold text-[#171923] leading-snug">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded-lg tabular-nums whitespace-nowrap shrink-0">
                          {formatCreditVnd(item.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] pl-7 leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-[#171923]">
                  Quyết định chi tiêu mới trong Kỳ {gameState.currentCycle}:
                </p>
                {currentCycleData.spendingOptions.map((opt) => {
                  const isSelected = selectedSpendOptId === opt.id;
                  const exceedsLimit =
                    gameState.currentBalance + opt.amount > gameState.creditLimit;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={exceedsLimit}
                      onClick={() => {
                        setLimitWarning(null);
                        setSelectedSpendOptId(opt.id);
                      }}
                      className={`w-full text-left rounded-2xl p-3 border-2 transition-all space-y-1 ${
                        isSelected
                          ? 'bg-[#F4F7FF] border-[#2F5BEA]'
                          : exceedsLimit
                          ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-55 cursor-not-allowed'
                          : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#171923] leading-snug">
                          {opt.label}
                        </span>
                        <span className="text-xs font-extrabold text-[#2F5BEA] tabular-nums whitespace-nowrap shrink-0">
                          {opt.amount > 0 ? `+${formatCreditVnd(opt.amount)}` : '0 đ'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        {opt.description}
                      </p>
                      {exceedsLimit && (
                        <p className="text-[10px] font-bold text-[#EF4444]">
                          Vượt hạn mức khả dụng ({formatCreditVnd(gameState.availableLimit)})
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {limitWarning && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-2.5 text-xs font-bold text-[#DC2626] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{limitWarning}</span>
              </div>
            )}
          </section>

          {/* Step 2: Live Statement Preview & Payment Plan */}
          <section className="bg-white rounded-[22px] p-4 border border-[#E8EAF0] shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#2F5BEA]" />
                <h3 className="text-sm font-extrabold text-[#171923]">
                  Bảng sao kê Kỳ {gameState.currentCycle}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFF4E5] px-2 py-0.5 rounded-full whitespace-nowrap">
                Hạn: {currentCycleData.dueDateLabel}
              </span>
            </div>

            <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#64748B]">Dư nợ đầu kỳ (kèm lãi/phí kỳ trước):</span>
                <span className="font-bold text-[#171923] tabular-nums whitespace-nowrap">
                  {formatCreditVnd(gameState.currentBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#64748B]">Mua sắm trong kỳ {gameState.currentCycle}:</span>
                <span className="font-bold text-[#EF4444] tabular-nums whitespace-nowrap">
                  +{formatCreditVnd(cycleNewPurchases)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#E8EAF0]">
                <span className="font-extrabold text-[#171923]">Tổng dư nợ sao kê kỳ này:</span>
                <span className="font-extrabold text-[#2F5BEA] tabular-nums whitespace-nowrap">
                  {formatCreditVnd(projectedStatementBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[#64748B]">Thanh toán tối thiểu (5%):</span>
                <span className="font-bold text-[#EA580C] tabular-nums whitespace-nowrap">
                  {formatCreditVnd(currentMinPay)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[#64748B]">Ngân sách tiền mặt trả thẻ/kỳ:</span>
                <span className="font-bold text-[#16A66A] tabular-nums whitespace-nowrap">
                  {formatCreditVnd(CREDIT_CARD_CONFIG.monthlyPaymentBudget)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-extrabold text-[#171923]">
                Chọn phương án thanh toán sao kê Kỳ {gameState.currentCycle}:
              </p>
              {paymentQuotes.map((q) => {
                const isSelected = selectedQuoteObj?.id === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    disabled={!q.available}
                    onClick={() => setSelectedPaymentPlan(q.id)}
                    className={`w-full text-left rounded-2xl p-3 border-2 transition-all space-y-1 ${
                      isSelected
                        ? 'bg-[#F4F7FF] border-[#2F5BEA]'
                        : !q.available
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-55 cursor-not-allowed'
                        : 'bg-white border-[#E8EAF0] hover:border-[#BFD3FF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#171923] leading-snug">
                        {q.label}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full tabular-nums whitespace-nowrap shrink-0 ${
                          q.projectedInterest + q.projectedLateFee === 0
                            ? 'bg-[#ECFDF5] text-[#16A66A]'
                            : 'bg-[#FEF2F2] text-[#EF4444]'
                        }`}
                      >
                        {q.projectedInterest + q.projectedLateFee === 0
                          ? '0 đ lãi/phí'
                          : `+${formatCreditVnd(q.projectedInterest + q.projectedLateFee)} lãi/phí`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {q.disabledReason ?? q.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedQuoteObj}
              onClick={handleConfirmCurrentCycle}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                selectedQuoteObj
                  ? 'bg-[#2F5BEA] hover:bg-[#244CD9] text-white shadow-sm active:scale-[0.98]'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <span>Chốt thanh toán Kỳ {gameState.currentCycle} / 3</span>
            </button>
          </section>
        </div>
      ) : (
        /* POST-CONFIRM STATEMENT RECEIPT */
        <section className="bg-white rounded-[22px] p-4 border-2 border-[#DCE6FF] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-[#171923]">
              Kết quả sao kê Kỳ {confirmedRecord.cycleNumber}
            </h3>
            <span
              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                confirmedRecord.interestCharged + confirmedRecord.lateFeeCharged === 0
                  ? 'bg-[#ECFDF5] text-[#16A66A]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}
            >
              {confirmedRecord.interestCharged + confirmedRecord.lateFeeCharged === 0
                ? 'Miễn lãi 0 đ'
                : `Phát sinh ${formatCreditVnd(confirmedRecord.interestCharged + confirmedRecord.lateFeeCharged)}`}
            </span>
          </div>

          <div className="bg-[#FAFBFD] border border-[#E8EAF0] rounded-2xl p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Dư nợ đầu kỳ:</span>
              <span className="font-bold text-[#171923] tabular-nums whitespace-nowrap">
                {formatCreditVnd(confirmedRecord.openingBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Mua sắm trong kỳ:</span>
              <span className="font-bold text-[#EF4444] tabular-nums whitespace-nowrap">
                +{formatCreditVnd(confirmedRecord.newPurchases)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Đã thanh toán:</span>
              <span className="font-bold text-[#16A66A] tabular-nums whitespace-nowrap">
                -{formatCreditVnd(confirmedRecord.paymentAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Lãi giả lập (2%/tháng trên phần chưa trả):</span>
              <span className="font-bold text-[#EA580C] tabular-nums whitespace-nowrap">
                +{formatCreditVnd(confirmedRecord.interestCharged)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#64748B]">Phí trễ hạn giả lập:</span>
              <span className="font-bold text-[#EF4444] tabular-nums whitespace-nowrap">
                +{formatCreditVnd(confirmedRecord.lateFeeCharged)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#E8EAF0]">
              <span className="font-extrabold text-[#171923]">Dư nợ chuyển sang kỳ sau:</span>
              <span className="font-extrabold text-[#2F5BEA] tabular-nums whitespace-nowrap">
                {formatCreditVnd(confirmedRecord.closingBalance)}
              </span>
            </div>
          </div>

          {confirmedRecord.interestCharged + confirmedRecord.lateFeeCharged > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-2.5 text-[11px] text-[#92400E] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>
                Dư nợ chưa trả ({formatCreditVnd(confirmedRecord.unpaidAfterPayment)}) bị tính lãi mô phỏng 2%/tháng. Số dư chuyển kỳ mới là {formatCreditVnd(confirmedRecord.closingBalance)}.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onAdvanceCycle}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-sm font-extrabold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <span>
              {gameState.currentCycle < CREDIT_CARD_CONFIG.totalCycles
                ? `Sang Kỳ sao kê ${gameState.currentCycle + 1} / 3`
                : 'Xem tổng kết 3 kỳ sao kê'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      )}

      <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
        <span>
          Mô phỏng giáo dục (lãi suất giả lập 2%/tháng, không đại diện ngân hàng thật). Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.
        </span>
      </div>
    </div>
  );
};
