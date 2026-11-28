export const CREDIT_CARD_CONFIG = {
  id: 'the-tin-dung' as const,
  title: 'Thẻ tín dụng không phải tiền miễn phí',
  subtitle: 'Quẹt thẻ trước, khóc sau!',
  creditLimit: 10_000_000,
  monthlyPaymentBudget: 4_500_000,
  totalCycles: 3,
  annualInterestRatePercent: 24,
  monthlyInterestRatePercent: 2,
  minPaymentRatePercent: 5,
  minPaymentFloorVnd: 100_000,
  lateFeeVnd: 200_000,
  highRiskBalanceThreshold: 3_000_000,
  highRiskInterestThreshold: 250_000,
  storageVersion: 1,
} as const;

export type CreditCardStatus = 'intro' | 'playing' | 'completed';
export type CreditCardPaymentPlanId = 'full' | 'major' | 'minimum' | 'missed';
export type CreditCardOutcomeType =
  | 'good_management'
  | 'needs_improvement'
  | 'high_debt_risk';

export interface CreditCardPurchaseItem {
  id: string;
  label: string;
  description: string;
  amount: number;
  categoryTag: string;
  isEssential: boolean;
}

export const CYCLE_1_PURCHASE_ITEMS: readonly CreditCardPurchaseItem[] = [
  {
    id: 'course-fee',
    label: 'Khóa học chuyên môn & tài liệu học tập',
    description: 'Khoản đầu tư thiết yếu phục vụ học tập và kỹ năng nghề nghiệp.',
    amount: 2_000_000,
    categoryTag: 'Cần thiết',
    isEssential: true,
  },
  {
    id: 'new-phone',
    label: 'Lên đời điện thoại mới bản cao cấp',
    description: 'Điện thoại cũ vẫn dùng ổn nhưng cửa hàng quảng cáo "quẹt thẻ 0đ trả trước".',
    amount: 5_500_000,
    categoryTag: 'Quá tay',
    isEssential: false,
  },
  {
    id: 'food-delivery',
    label: 'Quẹt thẻ đặt đồ ăn & trà sữa suốt tháng',
    description: 'Quẹt từng đơn nhỏ không cảm giác mất tiền mặt, cộng dồn cả tháng.',
    amount: 1_500_000,
    categoryTag: 'Chi vặt',
    isEssential: false,
  },
  {
    id: 'limited-sneaker',
    label: 'Đôi giày sneaker phiên bản giới hạn',
    description: 'Săn đợt mở bán giới hạn vì sợ hết size.',
    amount: 1_800_000,
    categoryTag: 'Cảm xúc',
    isEssential: false,
  },
];

export interface CreditCardCycleSpendingOption {
  id: string;
  label: string;
  description: string;
  amount: number;
}

export interface CreditCardCycleScenario {
  cycleNumber: number;
  statementDateLabel: string;
  dueDateLabel: string;
  tag: string;
  title: string;
  description: string;
  vibeIntro: string;
  spendingOptions: readonly CreditCardCycleSpendingOption[];
}

export const CREDIT_CARD_CYCLES: readonly CreditCardCycleScenario[] = [
  {
    cycleNumber: 1,
    statementDateLabel: '10/11',
    dueDateLabel: '25/11',
    tag: 'Quẹt thẻ quá tay',
    title: 'Kỳ 1 – Cám dỗ quẹt thẻ hạn mức 10 triệu',
    description:
      'Bạn vừa mở thẻ tín dụng giả lập hạn mức 10.000.000 đ. Ngân sách tiền mặt mỗi tháng bạn có thể trích ra trả thẻ là 4.500.000 đ. Hãy chọn các khoản muốn quẹt thẻ và phương án thanh toán kỳ 1.',
    vibeIntro:
      'Hạn mức 10 triệu là tiền vay ngân hàng, KHÔNG phải tiền của mình đâu nha chủ nhân! Quẹt vượt ngân sách trả nợ là dính lãi liền!',
    spendingOptions: [],
  },
  {
    cycleNumber: 2,
    statementDateLabel: '10/12',
    dueDateLabel: '25/12',
    tag: 'Sao kê đã về',
    title: 'Kỳ 2 – Bảng sao kê chính thức gửi về',
    description:
      'Sao kê Kỳ 2 đã hiển thị rõ dư nợ đầu kỳ (nếu kỳ 1 chưa trả hết) kèm lãi và phí giả lập. Bạn chọn có quẹt thêm cuối năm hay không và chốt số tiền thanh toán kỳ này.',
    vibeIntro:
      'Sao kê về rồi kìa! Nhìn kỹ phần lãi 2%/tháng và thanh toán tối thiểu nhé — trả toàn bộ đúng hạn là cách duy nhất được miễn lãi!',
    spendingOptions: [
      {
        id: 'c2-none',
        label: 'Khóa chi tiêu thẻ kỳ này (0 đ)',
        description: 'Tập trung kiểm soát sao kê, không tạo thêm dư nợ mới.',
        amount: 0,
      },
      {
        id: 'c2-sale',
        label: 'Quẹt thêm mua sắm sale cuối năm (+1.500.000 đ)',
        description: 'Tiện có mã giảm giá cuối năm nên quẹt thêm qua thẻ.',
        amount: 1_500_000,
      },
    ],
  },
  {
    cycleNumber: 3,
    statementDateLabel: '10/01',
    dueDateLabel: '25/01',
    tag: 'Thoát bẫy nợ',
    title: 'Kỳ 3 – Quyết định chốt sổ thoát bẫy nợ thẻ',
    description:
      'Kỳ sao kê cuối cùng! Bạn cần cân đối giữa chi tiêu mới và khoản nợ cũ để kết thúc 3 kỳ với dư nợ và chi phí lãi thấp nhất có thể.',
    vibeIntro:
      'Kỳ cuối rồi chủ nhân ơi! Nếu còn dư nợ hãy ưu tiên trả tối đa khả năng và tránh quẹt thêm để thoát bẫy lãi kép nhé!',
    spendingOptions: [
      {
        id: 'c3-none',
        label: 'Không quẹt thêm — Ưu tiên tất toán nợ (0 đ)',
        description: 'Giữ chặt thẻ trong ví và dồn ngân sách thanh toán dư nợ.',
        amount: 0,
      },
      {
        id: 'c3-tet',
        label: 'Tiếp tục quẹt thẻ mua quà & tiệc (+2.000.000 đ)',
        description: 'Tiếp tục chi tiêu bằng hạn mức thẻ dù có thể vẫn đang còn dư nợ.',
        amount: 2_000_000,
      },
    ],
  },
];

export interface CreditCardCycleRecord {
  cycleNumber: number;
  statementDateLabel: string;
  dueDateLabel: string;
  openingBalance: number;
  newPurchases: number;
  purchaseSummary: string;
  statementBalance: number;
  minimumPayment: number;
  paymentPlanId: CreditCardPaymentPlanId;
  paymentAmount: number;
  unpaidAfterPayment: number;
  interestCharged: number;
  lateFeeCharged: number;
  closingBalance: number;
  availableLimitAfter: number;
  vibeReaction: string;
  confirmedAt: string;
}

export interface CreditCardGameState {
  version: number;
  runId: string;
  status: CreditCardStatus;
  currentCycle: number;
  creditLimit: number;
  currentBalance: number;
  availableLimit: number;
  totalSpent: number;
  totalPaid: number;
  totalInterest: number;
  totalLateFees: number;
  history: CreditCardCycleRecord[];
  outcome: CreditCardOutcomeType | null;
  startedAt: string;
  updatedAt: string;
}

export interface CreditCardOutcomeSummary {
  type: CreditCardOutcomeType;
  badgeText: string;
  title: string;
  summary: string;
  vibeClosing: string;
  takeaway: string;
}

export function formatCreditVnd(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  const abs = Math.abs(safe).toLocaleString('vi-VN');
  return safe < 0 ? `-${abs} đ` : `${abs} đ`;
}

export function getCreditCardCycle(cycleNumber: number): CreditCardCycleScenario | undefined {
  return CREDIT_CARD_CYCLES.find((c) => c.cycleNumber === cycleNumber);
}

export function getCreditCardCycleRecord(
  state: CreditCardGameState,
  cycleNumber: number
): CreditCardCycleRecord | undefined {
  return state.history.find((r) => r.cycleNumber === cycleNumber);
}

/**
 * Minimum payment = 5% of statementBalance, floored at 100,000 đ when statementBalance > 0,
 * and never exceeding statementBalance. Integer VND only.
 */
export function calculateMinimumPayment(statementBalance: number): number {
  if (statementBalance <= 0) return 0;
  const fivePercent = Math.round(
    (statementBalance * CREDIT_CARD_CONFIG.minPaymentRatePercent) / 100
  );
  return Math.min(statementBalance, Math.max(CREDIT_CARD_CONFIG.minPaymentFloorVnd, fivePercent));
}

export interface PaymentPlanQuote {
  id: CreditCardPaymentPlanId;
  label: string;
  description: string;
  paymentAmount: number;
  available: boolean;
  disabledReason?: string;
  projectedInterest: number;
  projectedLateFee: number;
  projectedClosingBalance: number;
}

/**
 * Pure educational calculator for payment options on a given statementBalance.
 * - Interest (2%/month) applies ONLY to unpaid statement balance when NOT paid in full.
 * - Never charges interest on creditLimit.
 * - Never produces negative balance.
 */
export function calculatePaymentQuotes(
  statementBalance: number,
  paymentBudget: number = CREDIT_CARD_CONFIG.monthlyPaymentBudget
): PaymentPlanQuote[] {
  const minPay = calculateMinimumPayment(statementBalance);

  const buildQuote = (
    id: CreditCardPaymentPlanId,
    label: string,
    description: string,
    rawAmount: number,
    available: boolean,
    disabledReason?: string
  ): PaymentPlanQuote => {
    const paymentAmount = Math.max(0, Math.min(statementBalance, Math.round(rawAmount)));
    const unpaid = Math.max(0, statementBalance - paymentAmount);
    const projectedInterest =
      unpaid > 0
        ? Math.round((unpaid * CREDIT_CARD_CONFIG.monthlyInterestRatePercent) / 100)
        : 0;
    const projectedLateFee =
      statementBalance > 0 && paymentAmount < minPay ? CREDIT_CARD_CONFIG.lateFeeVnd : 0;
    const projectedClosingBalance = unpaid + projectedInterest + projectedLateFee;

    return {
      id,
      label,
      description,
      paymentAmount,
      available,
      disabledReason,
      projectedInterest,
      projectedLateFee,
      projectedClosingBalance,
    };
  };

  if (statementBalance === 0) {
    return [
      buildQuote(
        'full',
        'Không phát sinh dư nợ (0 đ)',
        'Kỳ sao kê này bạn không có dư nợ cần thanh toán — miễn lãi hoàn toàn.',
        0,
        true
      ),
    ];
  }

  const canPayFull = statementBalance <= paymentBudget;
  const majorAmount = Math.min(
    statementBalance,
    Math.max(minPay, Math.min(paymentBudget, Math.round((statementBalance * 60) / 100)))
  );
  // If major equals full (when statementBalance <= paymentBudget), make major 50% so user sees clear distinction
  const distinctMajorAmount =
    majorAmount >= statementBalance
      ? Math.max(minPay, Math.round((statementBalance * 50) / 100))
      : Math.min(statementBalance, paymentBudget);

  return [
    buildQuote(
      'full',
      `Thanh toán toàn bộ (${formatCreditVnd(statementBalance)})`,
      'Trả 100% dư nợ sao kê đúng hạn → 0 đ lãi, 0 đ phí (miễn lãi hoàn toàn).',
      statementBalance,
      canPayFull,
      canPayFull
        ? undefined
        : `Vượt ngân sách trả thẻ ${formatCreditVnd(paymentBudget)}/kỳ do quẹt quá tay`
    ),
    buildQuote(
      'major',
      `Thanh toán phần lớn (${formatCreditVnd(distinctMajorAmount)})`,
      'Trả tối đa theo ngân sách để giảm nhanh dư nợ chịu lãi 2%/tháng, không bị phí trễ hạn.',
      distinctMajorAmount,
      distinctMajorAmount < statementBalance && distinctMajorAmount >= minPay,
      distinctMajorAmount >= statementBalance
        ? 'Hãy chọn Thanh toán toàn bộ để được miễn lãi'
        : undefined
    ),
    buildQuote(
      'minimum',
      `Chỉ thanh toán tối thiểu 5% (${formatCreditVnd(minPay)})`,
      'Tránh phí trễ hạn nhưng 95% dư nợ còn lại bị tính lãi giả lập 2%/tháng.',
      minPay,
      minPay < statementBalance,
      minPay >= statementBalance ? 'Dư nợ nhỏ — chọn Thanh toán toàn bộ' : undefined
    ),
    buildQuote(
      'missed',
      'Trễ hạn / không thanh toán kỳ này (0 đ)',
      'Bị tính cả lãi giả lập 2% trên toàn bộ dư nợ sao kê lẫn phí trễ hạn 200.000 đ!',
      0,
      true
    ),
  ];
}

export function createInitialCreditCardState(
  nowIso: string = new Date().toISOString(),
  runId: string = `cc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): CreditCardGameState {
  return {
    version: CREDIT_CARD_CONFIG.storageVersion,
    runId,
    status: 'intro',
    currentCycle: 1,
    creditLimit: CREDIT_CARD_CONFIG.creditLimit,
    currentBalance: 0,
    availableLimit: CREDIT_CARD_CONFIG.creditLimit,
    totalSpent: 0,
    totalPaid: 0,
    totalInterest: 0,
    totalLateFees: 0,
    history: [],
    outcome: null,
    startedAt: nowIso,
    updatedAt: nowIso,
  };
}

export function startCreditCardGame(
  state: CreditCardGameState,
  nowIso: string = new Date().toISOString()
): CreditCardGameState {
  if (state.status !== 'intro') return state;
  return {
    ...state,
    status: 'playing',
    currentCycle: 1,
    updatedAt: nowIso,
  };
}

export interface ConfirmCreditCycleInput {
  cycleNumber: number;
  newPurchases: number;
  purchaseSummary: string;
  paymentPlanId: CreditCardPaymentPlanId;
}

export interface ConfirmCreditCycleResult {
  applied: boolean;
  reason:
    | 'ok'
    | 'not-playing'
    | 'wrong-cycle'
    | 'already-confirmed'
    | 'invalid-purchases'
    | 'exceeds-credit-limit'
    | 'invalid-payment-plan';
  state: CreditCardGameState;
}

/**
 * Pure integer VND billing cycle transition.
 * - Blocks double submission (no double payment, no double interest).
 * - Blocks purchases exceeding creditLimit.
 * - Never creates negative balance.
 * - Charges interest (2%/month) ONLY once per cycle on unpaid statement balance when not paid in full.
 */
export function confirmCreditCardCycle(
  state: CreditCardGameState,
  input: ConfirmCreditCycleInput,
  nowIso: string = new Date().toISOString()
): ConfirmCreditCycleResult {
  if (state.status !== 'playing') {
    return { applied: false, reason: 'not-playing', state };
  }
  if (input.cycleNumber !== state.currentCycle) {
    return { applied: false, reason: 'wrong-cycle', state };
  }
  if (state.history.some((r) => r.cycleNumber === input.cycleNumber)) {
    return { applied: false, reason: 'already-confirmed', state };
  }
  if (!Number.isInteger(input.newPurchases) || input.newPurchases < 0) {
    return { applied: false, reason: 'invalid-purchases', state };
  }

  const cycle = getCreditCardCycle(input.cycleNumber);
  if (!cycle) {
    return { applied: false, reason: 'wrong-cycle', state };
  }

  const openingBalance = state.currentBalance;
  if (openingBalance + input.newPurchases > state.creditLimit) {
    return { applied: false, reason: 'exceeds-credit-limit', state };
  }

  const statementBalance = openingBalance + input.newPurchases;
  const quotes = calculatePaymentQuotes(statementBalance);
  const selectedQuote = quotes.find((q) => q.id === input.paymentPlanId);
  if (!selectedQuote || !selectedQuote.available) {
    return { applied: false, reason: 'invalid-payment-plan', state };
  }

  const minimumPayment = calculateMinimumPayment(statementBalance);
  const paymentAmount = selectedQuote.paymentAmount;
  const unpaidAfterPayment = Math.max(0, statementBalance - paymentAmount);
  const interestCharged = selectedQuote.projectedInterest;
  const lateFeeCharged = selectedQuote.projectedLateFee;
  const closingBalance = unpaidAfterPayment + interestCharged + lateFeeCharged;
  const availableLimitAfter = Math.max(0, state.creditLimit - closingBalance);

  let vibeReaction = '';
  if (statementBalance === 0) {
    vibeReaction = 'Không quẹt linh tinh, không dư nợ — giữ thẻ sạch bóng quá đỉnh chủ nhân ơi!';
  } else if (paymentAmount >= statementBalance) {
    vibeReaction = 'Tuyệt vời! Thanh toán 100% đúng hạn giúp bạn được miễn lãi hoàn toàn 0 đ!';
  } else if (input.paymentPlanId === 'major') {
    vibeReaction = `Bạn đã cắt giảm mạnh dư nợ, chỉ phát sinh ${formatCreditVnd(interestCharged)} lãi giả lập kỳ này — cố tất toán sớm kỳ sau nha!`;
  } else if (input.paymentPlanId === 'minimum') {
    vibeReaction = `Chỉ trả tối thiểu 5% khiến ${formatCreditVnd(unpaidAfterPayment)} bị tính lãi ${formatCreditVnd(interestCharged)} — nợ sẽ phình rất nhanh đó!`;
  } else {
    vibeReaction = `Báo động đỏ! Trễ hạn khiến bạn gánh thêm ${formatCreditVnd(interestCharged)} lãi và ${formatCreditVnd(lateFeeCharged)} phí phạt!`;
  }

  const record: CreditCardCycleRecord = {
    cycleNumber: cycle.cycleNumber,
    statementDateLabel: cycle.statementDateLabel,
    dueDateLabel: cycle.dueDateLabel,
    openingBalance,
    newPurchases: input.newPurchases,
    purchaseSummary: input.purchaseSummary,
    statementBalance,
    minimumPayment,
    paymentPlanId: input.paymentPlanId,
    paymentAmount,
    unpaidAfterPayment,
    interestCharged,
    lateFeeCharged,
    closingBalance,
    availableLimitAfter,
    vibeReaction,
    confirmedAt: nowIso,
  };

  return {
    applied: true,
    reason: 'ok',
    state: {
      ...state,
      currentBalance: closingBalance,
      availableLimit: availableLimitAfter,
      totalSpent: state.totalSpent + input.newPurchases,
      totalPaid: state.totalPaid + paymentAmount,
      totalInterest: state.totalInterest + interestCharged,
      totalLateFees: state.totalLateFees + lateFeeCharged,
      history: [...state.history, record],
      updatedAt: nowIso,
    },
  };
}

export function evaluateCreditCardOutcome(
  state: CreditCardGameState
): CreditCardOutcomeSummary {
  const { currentBalance, totalInterest, totalLateFees } = state;

  if (currentBalance === 0 && totalInterest === 0 && totalLateFees === 0) {
    return {
      type: 'good_management',
      badgeText: 'Quản lý thẻ tốt',
      title: 'Bậc thầy làm chủ thẻ tín dụng — 0 đ lãi, 0 đ phí!',
      summary:
        'Bạn chỉ chi tiêu trong phạm vi ngân sách tiền mặt có thể trả và thanh toán đầy đủ đúng hạn suốt 3 kỳ sao kê. Thẻ tín dụng thực sự trở thành công cụ tiện lợi chứ không phải bẫy nợ!',
      vibeClosing:
        'Chuẩn không cần chỉnh! Quẹt thẻ có kiểm soát và trả đủ 100% đúng hạn là công thức vàng đó chủ nhân!',
      takeaway:
        'Bài học: Luôn coi hạn mức thẻ là tiền vay ngắn hạn; chỉ quẹt số tiền bạn đã có sẵn trong tài khoản để thanh toán 100% vào ngày đến hạn.',
    };
  }

  if (
    currentBalance >= CREDIT_CARD_CONFIG.highRiskBalanceThreshold ||
    totalLateFees > 0 ||
    totalInterest >= CREDIT_CARD_CONFIG.highRiskInterestThreshold
  ) {
    return {
      type: 'high_debt_risk',
      badgeText: 'Rủi ro nợ cao',
      title: 'Cảnh báo bẫy nợ thẻ tín dụng!',
      summary: `Sau 3 kỳ sao kê, bạn vẫn còn dư nợ ${formatCreditVnd(currentBalance)} với tổng lãi và phí giả lập lên tới ${formatCreditVnd(totalInterest + totalLateFees)}. Chỉ trả tối thiểu hoặc tiếp tục quẹt thẻ khi đang nợ làm gánh nặng tài chính tăng theo cấp số nhân.`,
      vibeClosing:
        'Thấy rõ sức nặng của câu "Quẹt thẻ trước, khóc sau" chưa chủ nhân ơi! Thử chơi lại với kỷ luật chỉ tiêu trong ngân sách trả nợ nhé!',
      takeaway:
        'Bài học: Trả tối thiểu 5% chỉ giúp tránh phí trễ hạn chứ không giúp thoát nợ — lãi suất thẻ tín dụng rất cao và dễ tạo vòng xoáy nợ kéo dài.',
    };
  }

  return {
    type: 'needs_improvement',
    badgeText: 'Cần cải thiện',
    title: 'Kiểm soát tạm ổn nhưng vẫn mất tiền lãi không đáng có!',
    summary: `Bạn tránh được phí trễ hạn nhưng vẫn phát sinh ${formatCreditVnd(totalInterest)} tiền lãi giả lập và còn dư nợ ${formatCreditVnd(currentBalance)}. Hãy điều chỉnh mức quẹt thẻ thấp hơn ngân sách trả nợ để đạt 0 đ lãi.`,
    vibeClosing:
      'Gần đạt chuẩn Quản lý thẻ tốt rồi! Chỉ cần dừng quẹt vượt ngân sách 4,5 triệu/tháng là bạn không tốn một đồng lãi nào luôn!',
    takeaway:
      'Bài học: Khi đang có dư nợ chưa tất toán, ưu tiên số 1 là ngừng quẹt thêm và thanh toán nhanh phần gốc để cắt đứt tiền lãi.',
  };
}

export interface AdvanceCreditCycleResult {
  advanced: boolean;
  reason: 'ok' | 'not-playing' | 'cycle-not-confirmed';
  state: CreditCardGameState;
}

export function advanceCreditCardCycle(
  state: CreditCardGameState,
  nowIso: string = new Date().toISOString()
): AdvanceCreditCycleResult {
  if (state.status !== 'playing') {
    return { advanced: false, reason: 'not-playing', state };
  }
  if (!state.history.some((r) => r.cycleNumber === state.currentCycle)) {
    return { advanced: false, reason: 'cycle-not-confirmed', state };
  }

  if (state.currentCycle >= CREDIT_CARD_CONFIG.totalCycles) {
    const outcome = evaluateCreditCardOutcome(state).type;
    return {
      advanced: true,
      reason: 'ok',
      state: {
        ...state,
        status: 'completed',
        outcome,
        updatedAt: nowIso,
      },
    };
  }

  return {
    advanced: true,
    reason: 'ok',
    state: {
      ...state,
      currentCycle: state.currentCycle + 1,
      updatedAt: nowIso,
    },
  };
}

export function validateCreditCardState(raw: unknown): CreditCardGameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (obj.version !== CREDIT_CARD_CONFIG.storageVersion) return null;
  if (typeof obj.runId !== 'string' || obj.runId.trim().length === 0) return null;
  if (obj.status !== 'intro' && obj.status !== 'playing' && obj.status !== 'completed') {
    return null;
  }
  if (
    typeof obj.currentCycle !== 'number' ||
    !Number.isInteger(obj.currentCycle) ||
    obj.currentCycle < 1 ||
    obj.currentCycle > CREDIT_CARD_CONFIG.totalCycles
  ) {
    return null;
  }

  const nonNegIntFields = [
    'creditLimit',
    'currentBalance',
    'availableLimit',
    'totalSpent',
    'totalPaid',
    'totalInterest',
    'totalLateFees',
  ] as const;
  for (const field of nonNegIntFields) {
    const val = obj[field];
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) return null;
  }

  if (!Array.isArray(obj.history) || obj.history.length > CREDIT_CARD_CONFIG.totalCycles) {
    return null;
  }

  const seen = new Set<number>();
  for (const item of obj.history) {
    if (!item || typeof item !== 'object') return null;
    const rec = item as Record<string, unknown>;
    if (
      typeof rec.cycleNumber !== 'number' ||
      !Number.isInteger(rec.cycleNumber) ||
      rec.cycleNumber < 1 ||
      rec.cycleNumber > CREDIT_CARD_CONFIG.totalCycles ||
      seen.has(rec.cycleNumber)
    ) {
      return null;
    }
    seen.add(rec.cycleNumber);
    if (typeof rec.closingBalance !== 'number' || !Number.isInteger(rec.closingBalance) || rec.closingBalance < 0) {
      return null;
    }
  }

  if (obj.status === 'completed' && obj.history.length !== CREDIT_CARD_CONFIG.totalCycles) {
    return null;
  }
  if (
    obj.outcome !== null &&
    obj.outcome !== 'good_management' &&
    obj.outcome !== 'needs_improvement' &&
    obj.outcome !== 'high_debt_risk'
  ) {
    return null;
  }
  if (typeof obj.startedAt !== 'string' || typeof obj.updatedAt !== 'string') return null;

  return obj as unknown as CreditCardGameState;
}
