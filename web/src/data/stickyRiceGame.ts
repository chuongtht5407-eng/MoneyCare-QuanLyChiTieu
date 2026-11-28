export const STICKY_RICE_CONFIG = {
  id: 'ganh-xoi-khoi-nghiep' as const,
  title: 'Gánh xôi khởi nghiệp – 7 ngày làm chủ',
  initialCapital: 1_000_000,
  totalDays: 7,
  baseIngredientCost: 8_000,
  basePackagingCost: 2_000,
  baseFixedOperatingCost: 50_000,
  minPortions: 0,
  maxPortions: 70,
  portionStep: 5,
  portionPresets: [20, 30, 40, 50, 60] as const,
  profitThreshold: 300_000,
  storageVersion: 1,
} as const;

export type StickyRicePrice = 15_000 | 20_000 | 25_000;
export type StickyRiceTacticId = 'A' | 'B';
export type StickyRiceStatus = 'intro' | 'playing' | 'completed';
export type StickyRiceOutcomeType = 'profit' | 'breakeven_low_profit' | 'loss';

export interface StickyRicePriceOption {
  price: StickyRicePrice;
  label: string;
  tagline: string;
  baseDemand: number;
}

export const STICKY_RICE_PRICE_OPTIONS: readonly StickyRicePriceOption[] = [
  {
    price: 15_000,
    label: '15.000 đ',
    tagline: 'Giá mềm • Nhiều khách nhưng biên lãi mỏng',
    baseDemand: 55,
  },
  {
    price: 20_000,
    label: '20.000 đ',
    tagline: 'Giá cân bằng • Hợp túi tiền sinh viên',
    baseDemand: 42,
  },
  {
    price: 25_000,
    label: '25.000 đ',
    tagline: 'Giá cao • Lãi mỗi suất lớn nhưng kén khách',
    baseDemand: 28,
  },
];

export interface StickyRiceTacticOption {
  id: StickyRiceTacticId;
  label: string;
  description: string;
  /** Additional operating/marketing cost in VND (>= 0) */
  extraCost: number;
  /** Additional portions prepared if the player takes an emergency batch (>= 0) */
  extraPortions: number;
  /** Shift in customer demand (integer portions) */
  demandDelta: number;
  /** Short badge hint shown in UI */
  impactHint: string;
  /** Reaction from Ví Bé */
  vibeReaction: string;
}

export interface StickyRiceDayEvent {
  dayNumber: number;
  tag: string;
  title: string;
  description: string;
  vibeIntro: string;
  ingredientCostPerPortion: number;
  packagingCostPerPortion: number;
  fixedOperatingCost: number;
  tactics: readonly [StickyRiceTacticOption, StickyRiceTacticOption];
}

export const STICKY_RICE_DAYS: readonly StickyRiceDayEvent[] = [
  {
    dayNumber: 1,
    tag: 'Khai trương',
    title: 'Ngày đầu mở bán trước cổng trường',
    description:
      'Sáng đầu tiên kéo xe xôi ra vỉa hè. Sinh viên đi học khá đông nhưng chưa nhiều người biết mùi vị gánh xôi của bạn.',
    vibeIntro:
      'Ngày khai trương nhớ tính kỹ số suất và giá bán nha chủ nhân! Nhập nhiều quá mà ế là xôi không để qua ngày được đâu!',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Tặng thêm hành phi & in bảng khai trương (+20.000 đ)',
        description: 'Chi thêm 20.000 đ làm biển nhỏ và topping khai trương để hút khách thử ngay.',
        extraCost: 20_000,
        extraPortions: 0,
        demandDelta: 8,
        impactHint: '+8 khách dự kiến',
        vibeReaction: 'Biển hiệu bắt mắt quá! Nhiều bạn ghé mua thử ngay buổi sáng đầu tiên!',
      },
      {
        id: 'B',
        label: 'Bán gọn nhẹ theo đúng kế hoạch (0 đ)',
        description: 'Giữ chi phí gọn nhất có thể để thăm dò sức mua thực tế ngày đầu.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: 0,
        impactHint: 'Không tốn thêm phí',
        vibeReaction: 'Khởi đầu thận trọng cũng là cách hay để đo đúng sức mua khu vực!',
      },
    ],
  },
  {
    dayNumber: 2,
    tag: 'Cạnh tranh giá',
    title: 'Đối thủ mở sát bên bán giá thấp hơn',
    description:
      'Cách xe bạn 50m có xe xôi mới mở bán đồng giá 14.000 đ/suất. Một lượng khách vãng lai đang bị kéo sang bên đó.',
    vibeIntro:
      'Đối thủ đánh giá rẻ kìa! Đừng vội hoảng, cân nhắc xem nên giữ chất lượng hay tiết kiệm chi phí nhé!',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Treo bảng "Xôi nóng đầy đặn" & tặng ớt rim nhà làm (+15.000 đ)',
        description: 'Tạo điểm khác biệt về chất lượng thay vì đua giảm giá lỗ vốn.',
        extraCost: 15_000,
        extraPortions: 0,
        demandDelta: -4,
        impactHint: 'Giảm ảnh hưởng cạnh tranh (-4 khách)',
        vibeReaction: 'Chuẩn kinh doanh! Cạnh tranh bằng chất lượng giúp giữ chân khách quay lại!',
      },
      {
        id: 'B',
        label: 'Không phản ứng, bán bình thường (0 đ)',
        description: 'Không chi thêm đồng nào nhưng chấp nhận mất một nhóm khách nhạy giá.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: -14,
        impactHint: 'Mất khoảng 14 khách sang đối thủ',
        vibeReaction: 'Khách bị kéo sang xe bên kia kha khá rồi, để ý lượng suất chuẩn bị kẻo tồn nha!',
      },
    ],
  },
  {
    dayNumber: 3,
    tag: 'Rủi ro thời tiết',
    title: 'Trời mưa sáng khiến lượng khách giảm mạnh',
    description:
      'Mưa rào từ 6h sáng làm đường vắng hẳn người dừng xe mua đồ ăn sáng. Nếu chuẩn bị quá tay hôm nay sẽ tồn kho rất lớn!',
    vibeIntro:
      'Trời mưa là bài test tồn kho kinh điển đó chủ nhân! Điều chỉnh số suất cho khéo kẻo ôm nồi xôi nha!',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Nhắn nhóm ký túc xá nhận giao tận cổng (+20.000 đ túi chống mưa)',
        description: 'Bọc hai lớp giữ nóng và gom đơn giao chung để cứu doanh thu ngày mưa.',
        extraCost: 20_000,
        extraPortions: 0,
        demandDelta: -5,
        impactHint: 'Cứu phần lớn đơn (-5 khách)',
        vibeReaction: 'Nhanh trí quá! Giao tận cổng ký túc xá cứu nguyên một buổi sáng mưa gió!',
      },
      {
        id: 'B',
        label: 'Đứng bán tại chỗ chờ tạnh mưa (0 đ)',
        description: 'Tiết kiệm chi phí giao nhưng chấp nhận lượng khách vãng lai giảm sâu.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: -18,
        impactHint: 'Khách giảm mạnh (-18 khách)',
        vibeReaction: 'Mưa to quá ít ai dừng lại, may mà nếu chuẩn bị vừa đủ thì vẫn tránh được lỗ nặng!',
      },
    ],
  },
  {
    dayNumber: 4,
    tag: 'Biến động giá vốn',
    title: 'Giá nếp và thịt tăng đột biến (+2.000 đ/suất)',
    description:
      'Chợ đầu mối tăng giá gạo nếp và thịt kho khiến giá vốn nguyên liệu hôm nay lên 10.000 đ + 2.000 đ bao bì = 12.000 đ/suất.',
    vibeIntro:
      'Giá vốn lên 12.000 đ/suất rồi! Nếu bán 15.000 đ thì biên lãi chỉ còn 3.000 đ/suất thôi — tính kỹ nha!',
    ingredientCostPerPortion: 10_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Giữ nguyên chất lượng chuẩn để bảo vệ uy tín (0 đ)',
        description: 'Chấp nhận giá vốn cao hơn hôm nay nhưng giữ trọn lòng tin khách quen.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: 2,
        impactHint: 'Giữ uy tín (+2 khách quen)',
        vibeReaction: 'Khách khen xôi vẫn đầy đặn dù chợ tăng giá — uy tín là tài sản dài hạn đó!',
      },
      {
        id: 'B',
        label: 'Nhập thêm bình trà đá miễn phí hút khách (+30.000 đ)',
        description: 'Chi 30.000 đ mua trà đá & cốc giấy để tăng sức hấp dẫn cho mức giá bán mới.',
        extraCost: 30_000,
        extraPortions: 0,
        demandDelta: 10,
        impactHint: '+10 khách dự kiến',
        vibeReaction: 'Mua xôi có trà đá mát lạnh nên khách kéo tới đông hẳn lên luôn!',
      },
    ],
  },
  {
    dayNumber: 5,
    tag: 'Đơn hàng lớn',
    title: 'Câu lạc bộ sinh viên muốn đặt số lượng lớn',
    description:
      'Sáng nay một CLB tổ chức hội thảo và hỏi mua gấp số lượng lớn (+20 suất nhu cầu). Tuy nhiên bạn chỉ bán được tối đa số suất mình thực sự có!',
    vibeIntro:
      'Cơ hội vàng đây rồi! Nhớ là không thể bán quá số suất đã chuẩn bị — tính xem có đủ hàng đáp ứng không nha!',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Nhận đơn trong phạm vi số suất đã chuẩn bị (0 đ)',
        description: 'Ưu tiên bán gọn số suất hiện có, không phát sinh chi phí nấu gấp.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: 20,
        impactHint: '+20 khách (bán tối đa theo hàng có)',
        vibeReaction: 'Bán đắt như tôm tươi! Nếu chuẩn bị đủ suất thì hôm nay doanh thu bật vọt!',
      },
      {
        id: 'B',
        label: 'Nấu gấp thêm +10 suất để kịp giao CLB (+100.000 đ vốn)',
        description: 'Chi ngay 100.000 đ nguyên liệu & bao bì làm thêm 10 suất nóng để không lỡ đơn lớn.',
        extraCost: 0,
        extraPortions: 10,
        demandDelta: 20,
        impactHint: '+10 suất sẵn bán & +20 khách',
        vibeReaction: 'Xoay xở kịp 10 suất nóng giao CLB — đúng tinh thần chủ gánh xôi chuyên nghiệp!',
      },
    ],
  },
  {
    dayNumber: 6,
    tag: 'Phản hồi khách hàng',
    title: 'Khách góp ý xôi hôm qua hơi khô',
    description:
      'Một vài khách quen nhắn tin góp ý xôi hôm qua hơi khô và thiếu độ béo. Cách bạn xử lý phản hồi sẽ ảnh hưởng ngay tới lượng khách hôm nay.',
    vibeIntro:
      'Phản hồi thật của khách quý như vàng đó chủ nhân! Nâng cấp ngay hay giữ nguyên đây?',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Mua thêm lá dứa & nước cốt dừa nâng cấp vị (+25.000 đ)',
        description: 'Cải thiện ngay hương vị và gửi lời cảm ơn khách quen đã góp ý.',
        extraCost: 25_000,
        extraPortions: 0,
        demandDelta: 10,
        impactHint: '+10 khách & tăng đánh giá tốt',
        vibeReaction: 'Thơm nức mũi cả góc phố luôn! Khách quen quay lại rủ thêm cả bạn đi cùng!',
      },
      {
        id: 'B',
        label: 'Bỏ qua góp ý, nấu y nguyên công thức cũ (0 đ)',
        description: 'Không tốn thêm chi phí nguyên liệu phụ nhưng một số khách quen không quay lại.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: -10,
        impactHint: 'Mất khoảng 10 khách quen',
        vibeReaction: 'Khách góp ý mà không chỉnh sửa nên hôm nay hơi vắng khách quen rồi chủ nhân ơi!',
      },
    ],
  },
  {
    dayNumber: 7,
    tag: 'Tổng kết tuần',
    title: 'Ngày cuối tuần — Chốt sổ 7 ngày khởi nghiệp',
    description:
      'Chủ nhật cuối cùng của tuần thử nghiệm! Bạn cần cân đối lượng hàng thật chuẩn để tối đa hóa lợi nhuận mà không để tồn kho ngày cuối.',
    vibeIntro:
      'Ngày 7/7 rồi! Đọc lại dòng tiền 6 ngày qua và chốt một ngày bán thật đẹp mắt nha chủ nhân!',
    ingredientCostPerPortion: 8_000,
    packagingCostPerPortion: 2_000,
    fixedOperatingCost: 50_000,
    tactics: [
      {
        id: 'A',
        label: 'Chạy combo "Xôi sáng cuối tuần" & trang trí quầy (+20.000 đ)',
        description: 'Chi 20.000 đ làm gói combo gọn đẹp để hút khách ăn sáng cuối tuần.',
        extraCost: 20_000,
        extraPortions: 0,
        demandDelta: 12,
        impactHint: '+12 khách cuối tuần',
        vibeReaction: 'Ngày cuối tuần đông vui rộn ràng! Quá đã cho một tuần khởi nghiệp!',
      },
      {
        id: 'B',
        label: 'Bán gọn gàng bình thường để chốt sổ an toàn (0 đ)',
        description: 'Kiểm soát chặt chi phí ngày cuối để bảo toàn tiền mặt.',
        extraCost: 0,
        extraPortions: 0,
        demandDelta: 4,
        impactHint: '+4 khách cuối tuần, 0 đ phí thêm',
        vibeReaction: 'Chốt sổ an toàn, giữ chặt dòng tiền cuối tuần là lựa chọn rất tỉnh táo!',
      },
    ],
  },
];

export interface StickyRiceDayRecord {
  dayNumber: number;
  eventTitle: string;
  tacticId: StickyRiceTacticId;
  tacticLabel: string;
  startingCash: number;
  basePortions: number;
  extraPortions: number;
  preparedPortions: number;
  effectiveDemand: number;
  soldPortions: number;
  unsoldPortions: number;
  unitPrice: StickyRicePrice;
  unitVariableCost: number;
  variableCost: number;
  fixedCost: number;
  eventCost: number;
  totalCost: number;
  /** Informational value of unsold portions (already included in variableCost, NEVER deducted twice) */
  spoilageValue: number;
  revenue: number;
  profit: number;
  endingCash: number;
  vibeReaction: string;
  confirmedAt: string;
}

export interface StickyRiceGameState {
  version: number;
  runId: string;
  status: StickyRiceStatus;
  currentDay: number;
  cash: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalPortionsPrepared: number;
  totalPortionsSold: number;
  totalPortionsUnsold: number;
  profitableDays: number;
  history: StickyRiceDayRecord[];
  outcome: StickyRiceOutcomeType | null;
  startedAt: string;
  updatedAt: string;
}

export interface StickyRiceOutcomeSummary {
  type: StickyRiceOutcomeType;
  badgeText: string;
  title: string;
  summary: string;
  vibeClosing: string;
  takeaway: string;
}

export function formatStickyRiceVnd(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  const abs = Math.abs(safe).toLocaleString('vi-VN');
  return safe < 0 ? `-${abs} đ` : `${abs} đ`;
}

export function formatSignedStickyRiceVnd(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  const abs = Math.abs(safe).toLocaleString('vi-VN');
  if (safe > 0) return `+${abs} đ`;
  if (safe < 0) return `-${abs} đ`;
  return '0 đ';
}

export function getStickyRiceDay(dayNumber: number): StickyRiceDayEvent | undefined {
  return STICKY_RICE_DAYS.find((d) => d.dayNumber === dayNumber);
}

export function getStickyRiceDayRecord(
  state: StickyRiceGameState,
  dayNumber: number
): StickyRiceDayRecord | undefined {
  return state.history.find((r) => r.dayNumber === dayNumber);
}

export function getUnitVariableCost(day: StickyRiceDayEvent): number {
  return day.ingredientCostPerPortion + day.packagingCostPerPortion;
}

export function getMaxAffordablePortions(cash: number, day: StickyRiceDayEvent): number {
  const unitVar = getUnitVariableCost(day);
  if (cash < day.fixedOperatingCost + unitVar) return 0;
  const rawMax = Math.floor((cash - day.fixedOperatingCost) / unitVar);
  return Math.max(0, Math.min(STICKY_RICE_CONFIG.maxPortions, rawMax));
}

export function calculateDayUpfrontCost(
  day: StickyRiceDayEvent,
  basePortions: number,
  tactic: StickyRiceTacticOption,
  availableCash: number
): {
  unitVariableCost: number;
  variableCost: number;
  fixedCost: number;
  eventCost: number;
  totalCost: number;
  canAfford: boolean;
} {
  const unitVariableCost = getUnitVariableCost(day);
  const totalPortions = basePortions + tactic.extraPortions;
  const variableCost = totalPortions * unitVariableCost;
  // If player prepares 0 portions (rest/low-cash day), fixed cost is capped at availableCash so cash never goes negative
  const fixedCost =
    totalPortions === 0 ? Math.min(availableCash, day.fixedOperatingCost) : day.fixedOperatingCost;
  const eventCost = tactic.extraCost;
  const totalCost = variableCost + fixedCost + eventCost;
  return {
    unitVariableCost,
    variableCost,
    fixedCost,
    eventCost,
    totalCost,
    canAfford: totalCost <= availableCash,
  };
}

export function createInitialStickyRiceState(
  nowIso: string = new Date().toISOString(),
  runId: string = `xoi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): StickyRiceGameState {
  return {
    version: STICKY_RICE_CONFIG.storageVersion,
    runId,
    status: 'intro',
    currentDay: 1,
    cash: STICKY_RICE_CONFIG.initialCapital,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalPortionsPrepared: 0,
    totalPortionsSold: 0,
    totalPortionsUnsold: 0,
    profitableDays: 0,
    history: [],
    outcome: null,
    startedAt: nowIso,
    updatedAt: nowIso,
  };
}

export function startStickyRiceGame(
  state: StickyRiceGameState,
  nowIso: string = new Date().toISOString()
): StickyRiceGameState {
  if (state.status !== 'intro') return state;
  return {
    ...state,
    status: 'playing',
    currentDay: 1,
    updatedAt: nowIso,
  };
}

export interface StickyRiceConfirmInput {
  dayNumber: number;
  basePortions: number;
  unitPrice: StickyRicePrice;
  tacticId: StickyRiceTacticId;
}

export interface StickyRiceConfirmResult {
  applied: boolean;
  reason:
    | 'ok'
    | 'not-playing'
    | 'wrong-day'
    | 'already-confirmed'
    | 'invalid-portions'
    | 'invalid-price'
    | 'invalid-tactic'
    | 'insufficient-cash';
  state: StickyRiceGameState;
}

/**
 * Pure integer VND business simulation step for one day.
 * - Strictly blocks double submission on the same day.
 * - Strictly blocks spending more cash than currently held.
 * - Never sells more portions than prepared.
 * - Zero double-deduction: unsold inventory cost is already inside variableCost.
 */
export function confirmStickyRiceDay(
  state: StickyRiceGameState,
  input: StickyRiceConfirmInput,
  nowIso: string = new Date().toISOString()
): StickyRiceConfirmResult {
  if (state.status !== 'playing') {
    return { applied: false, reason: 'not-playing', state };
  }
  if (input.dayNumber !== state.currentDay) {
    return { applied: false, reason: 'wrong-day', state };
  }
  if (state.history.some((r) => r.dayNumber === input.dayNumber)) {
    return { applied: false, reason: 'already-confirmed', state };
  }
  if (
    !Number.isInteger(input.basePortions) ||
    input.basePortions < STICKY_RICE_CONFIG.minPortions ||
    input.basePortions > STICKY_RICE_CONFIG.maxPortions
  ) {
    return { applied: false, reason: 'invalid-portions', state };
  }

  const priceOption = STICKY_RICE_PRICE_OPTIONS.find((p) => p.price === input.unitPrice);
  if (!priceOption) {
    return { applied: false, reason: 'invalid-price', state };
  }

  const day = getStickyRiceDay(input.dayNumber);
  const tactic = day?.tactics.find((t) => t.id === input.tacticId);
  if (!day || !tactic) {
    return { applied: false, reason: 'invalid-tactic', state };
  }

  const costBreakdown = calculateDayUpfrontCost(day, input.basePortions, tactic, state.cash);
  if (!costBreakdown.canAfford) {
    return { applied: false, reason: 'insufficient-cash', state };
  }

  const preparedPortions = input.basePortions + tactic.extraPortions;
  const effectiveDemand = Math.max(0, priceOption.baseDemand + tactic.demandDelta);
  const soldPortions = Math.min(preparedPortions, effectiveDemand);
  const unsoldPortions = preparedPortions - soldPortions;

  const revenue = soldPortions * input.unitPrice;
  const profit = revenue - costBreakdown.totalCost;
  const endingCash = state.cash + revenue - costBreakdown.totalCost;
  const spoilageValue = unsoldPortions * costBreakdown.unitVariableCost;

  const record: StickyRiceDayRecord = {
    dayNumber: day.dayNumber,
    eventTitle: day.title,
    tacticId: tactic.id,
    tacticLabel: tactic.label,
    startingCash: state.cash,
    basePortions: input.basePortions,
    extraPortions: tactic.extraPortions,
    preparedPortions,
    effectiveDemand,
    soldPortions,
    unsoldPortions,
    unitPrice: input.unitPrice,
    unitVariableCost: costBreakdown.unitVariableCost,
    variableCost: costBreakdown.variableCost,
    fixedCost: costBreakdown.fixedCost,
    eventCost: costBreakdown.eventCost,
    totalCost: costBreakdown.totalCost,
    spoilageValue,
    revenue,
    profit,
    endingCash,
    vibeReaction: tactic.vibeReaction,
    confirmedAt: nowIso,
  };

  return {
    applied: true,
    reason: 'ok',
    state: {
      ...state,
      cash: endingCash,
      totalRevenue: state.totalRevenue + revenue,
      totalCost: state.totalCost + costBreakdown.totalCost,
      totalProfit: state.totalProfit + profit,
      totalPortionsPrepared: state.totalPortionsPrepared + preparedPortions,
      totalPortionsSold: state.totalPortionsSold + soldPortions,
      totalPortionsUnsold: state.totalPortionsUnsold + unsoldPortions,
      profitableDays: state.profitableDays + (profit > 0 ? 1 : 0),
      history: [...state.history, record],
      updatedAt: nowIso,
    },
  };
}

export function evaluateStickyRiceOutcome(
  state: StickyRiceGameState
): StickyRiceOutcomeSummary {
  const { totalProfit, cash, totalPortionsSold, totalPortionsUnsold } = state;

  if (totalProfit < 0 || cash < STICKY_RICE_CONFIG.initialCapital) {
    return {
      type: 'loss',
      badgeText: 'Kinh doanh thua lỗ',
      title: 'Gánh xôi đang bị âm vốn sau 7 ngày!',
      summary: `Sau 7 ngày bạn ghi nhận lỗ ${formatStickyRiceVnd(Math.abs(totalProfit))} (tiền mặt còn ${formatStickyRiceVnd(cash)}). Nguyên nhân phổ biến là tồn kho xôi ế (${totalPortionsUnsold} suất) hoặc đặt giá bán chưa bù nổi chi phí cố định & biến đổi.`,
      vibeClosing:
        'Kinh doanh thật không chỉ nhìn doanh thu đâu chủ nhân ơi! Xem lại những ngày bị tồn nhiều suất để rút kinh nghiệm cho lượt chơi tiếp theo nhé!',
      takeaway:
        'Bài học: Luôn tính điểm hòa vốn (chi phí cố định + giá vốn mỗi suất) và giảm lượng nhập khi dự báo nhu cầu giảm (trời mưa, đối thủ giảm giá).',
    };
  }

  if (totalProfit >= STICKY_RICE_CONFIG.profitThreshold) {
    return {
      type: 'profit',
      badgeText: 'Kinh doanh có lãi',
      title: 'Chúc mừng! Gánh xôi khởi nghiệp lãi tốt!',
      summary: `Bạn đã bán thành công ${totalPortionsSold} suất xôi, đạt lợi nhuận ròng ${formatSignedStickyRiceVnd(totalProfit)} và nâng tiền mặt từ 1.000.000 đ lên ${formatStickyRiceVnd(cash)}!`,
      vibeClosing:
        'Bái phục chủ nhân! Cân đối nhập hàng, định giá và ứng phó sự cố 7 ngày đều sắc bén như chủ quán chuyên nghiệp!',
      takeaway:
        'Bài học: Lợi nhuận bền vững đến từ biên lãi hợp lý, kiểm soát chặt tồn kho thực phẩm tươi sống và giữ chất lượng ổn định.',
    };
  }

  return {
    type: 'breakeven_low_profit',
    badgeText: 'Hòa vốn hoặc lãi thấp',
    title: 'Giữ được vốn nhưng lợi nhuận còn mỏng!',
    summary: `Bạn bảo toàn vốn ban đầu với tiền mặt cuối kỳ ${formatStickyRiceVnd(cash)} (lợi nhuận ${formatSignedStickyRiceVnd(totalProfit)} sau ${totalPortionsSold} suất bán). Vẫn còn dư địa tối ưu giá bán và lượng nhập ở ngày đông khách.`,
    vibeClosing:
      'Không lỗ là bước đầu rất tốt rồi chủ nhân! Chỉnh lại lượng suất vào ngày mưa và ngày có đơn lớn là lãi bật tăng ngay!',
    takeaway:
      'Bài học: Doanh thu cao chưa chắc đã lãi cao — hãy tối ưu tỷ lệ bán hết hàng và chọn mức giá cân bằng giữa biên lãi với lượng khách.',
  };
}

export interface StickyRiceAdvanceResult {
  advanced: boolean;
  reason: 'ok' | 'not-playing' | 'day-not-confirmed';
  state: StickyRiceGameState;
}

export function advanceStickyRiceDay(
  state: StickyRiceGameState,
  nowIso: string = new Date().toISOString()
): StickyRiceAdvanceResult {
  if (state.status !== 'playing') {
    return { advanced: false, reason: 'not-playing', state };
  }
  const hasCurrent = state.history.some((r) => r.dayNumber === state.currentDay);
  if (!hasCurrent) {
    return { advanced: false, reason: 'day-not-confirmed', state };
  }

  if (state.currentDay >= STICKY_RICE_CONFIG.totalDays) {
    const outcome = evaluateStickyRiceOutcome(state).type;
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
      currentDay: state.currentDay + 1,
      updatedAt: nowIso,
    },
  };
}

export function validateStickyRiceState(raw: unknown): StickyRiceGameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (obj.version !== STICKY_RICE_CONFIG.storageVersion) return null;
  if (typeof obj.runId !== 'string' || obj.runId.trim().length === 0) return null;
  if (obj.status !== 'intro' && obj.status !== 'playing' && obj.status !== 'completed') {
    return null;
  }
  if (
    typeof obj.currentDay !== 'number' ||
    !Number.isInteger(obj.currentDay) ||
    obj.currentDay < 1 ||
    obj.currentDay > STICKY_RICE_CONFIG.totalDays
  ) {
    return null;
  }
  if (typeof obj.cash !== 'number' || !Number.isInteger(obj.cash) || obj.cash < 0) return null;
  if (typeof obj.totalRevenue !== 'number' || !Number.isInteger(obj.totalRevenue) || obj.totalRevenue < 0) return null;
  if (typeof obj.totalCost !== 'number' || !Number.isInteger(obj.totalCost) || obj.totalCost < 0) return null;
  if (typeof obj.totalProfit !== 'number' || !Number.isInteger(obj.totalProfit)) return null;
  if (typeof obj.totalPortionsPrepared !== 'number' || !Number.isInteger(obj.totalPortionsPrepared) || obj.totalPortionsPrepared < 0) return null;
  if (typeof obj.totalPortionsSold !== 'number' || !Number.isInteger(obj.totalPortionsSold) || obj.totalPortionsSold < 0) return null;
  if (typeof obj.totalPortionsUnsold !== 'number' || !Number.isInteger(obj.totalPortionsUnsold) || obj.totalPortionsUnsold < 0) return null;
  if (typeof obj.profitableDays !== 'number' || !Number.isInteger(obj.profitableDays) || obj.profitableDays < 0 || obj.profitableDays > STICKY_RICE_CONFIG.totalDays) return null;
  if (!Array.isArray(obj.history) || obj.history.length > STICKY_RICE_CONFIG.totalDays) return null;

  const seen = new Set<number>();
  for (const item of obj.history) {
    if (!item || typeof item !== 'object') return null;
    const rec = item as Record<string, unknown>;
    if (
      typeof rec.dayNumber !== 'number' ||
      !Number.isInteger(rec.dayNumber) ||
      rec.dayNumber < 1 ||
      rec.dayNumber > STICKY_RICE_CONFIG.totalDays ||
      seen.has(rec.dayNumber)
    ) {
      return null;
    }
    seen.add(rec.dayNumber);
    if (rec.tacticId !== 'A' && rec.tacticId !== 'B') return null;
    if (typeof rec.preparedPortions !== 'number' || !Number.isInteger(rec.preparedPortions) || rec.preparedPortions < 0) return null;
    if (typeof rec.soldPortions !== 'number' || !Number.isInteger(rec.soldPortions) || rec.soldPortions < 0 || rec.soldPortions > rec.preparedPortions) return null;
    if (typeof rec.revenue !== 'number' || !Number.isInteger(rec.revenue) || rec.revenue < 0) return null;
    if (typeof rec.totalCost !== 'number' || !Number.isInteger(rec.totalCost) || rec.totalCost < 0) return null;
    if (typeof rec.endingCash !== 'number' || !Number.isInteger(rec.endingCash) || rec.endingCash < 0) return null;
  }

  if (obj.status === 'completed' && obj.history.length !== STICKY_RICE_CONFIG.totalDays) {
    return null;
  }
  if (
    obj.outcome !== null &&
    obj.outcome !== 'profit' &&
    obj.outcome !== 'breakeven_low_profit' &&
    obj.outcome !== 'loss'
  ) {
    return null;
  }
  if (typeof obj.startedAt !== 'string' || typeof obj.updatedAt !== 'string') return null;

  return obj as unknown as StickyRiceGameState;
}
