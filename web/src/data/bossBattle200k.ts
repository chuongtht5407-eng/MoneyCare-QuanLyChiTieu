export type HardCaseId =
  | 'boss-battle-200k'
  | 'ganh-xoi-khoi-nghiep'
  | 'mat-viec-bat-ngo'
  | 'the-tin-dung';

export interface HardCaseProfile {
  id: HardCaseId;
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  isPlayable: boolean;
  iconKey: 'noodles' | 'store' | 'briefcase' | 'credit-card';
  accentBg: string;
  accentText: string;
  metaSummary: string;
}

export const HARD_CASE_PROFILES: readonly HardCaseProfile[] = [
  {
    id: 'boss-battle-200k',
    title: 'Boss Battle – 7 ngày với 200k',
    subtitle: 'Thử thách sinh tồn tài chính',
    description:
      'Sống sót 7 ngày với ngân sách giả lập 200.000 đ cho ăn uống, đi lại và nhu cầu thiết yếu mà không mắc nợ hay bỏ bữa.',
    badgeText: 'Phổ biến',
    isPlayable: true,
    iconKey: 'noodles',
    accentBg: 'bg-[#FFF4E5]',
    accentText: 'text-[#EA580C]',
    metaSummary: '7 ngày • 200.000 đ giả lập',
  },
  {
    id: 'ganh-xoi-khoi-nghiep',
    title: 'Gánh xôi khởi nghiệp',
    subtitle: '7 ngày làm chủ kinh doanh nhỏ',
    description:
      'Kinh doanh xôi sáng với vốn giả lập 1.000.000 đ: nhập nguyên liệu, định giá bán, kiểm soát tồn kho và tối ưu lợi nhuận trong 7 ngày.',
    badgeText: '7 ngày',
    isPlayable: true,
    iconKey: 'store',
    accentBg: 'bg-[#FEF3C7]',
    accentText: 'text-[#B45309]',
    metaSummary: '7 ngày • Vốn 1.000.000 đ',
  },
  {
    id: 'mat-viec-bat-ngo',
    title: 'Mất việc bất ngờ',
    subtitle: '30 ngày giữ vững tài chính',
    description:
      'Xoay xở 30 ngày (6 chặng) với quỹ dự phòng 6.000.000 đ khi mất thu nhập chính: trả hóa đơn, giữ sức khỏe và tìm nguồn thu mới.',
    badgeText: '30 ngày',
    isPlayable: true,
    iconKey: 'briefcase',
    accentBg: 'bg-[#EDE9FE]',
    accentText: 'text-[#6D28D9]',
    metaSummary: '6 chặng • Quỹ 6.000.000 đ',
  },
  {
    id: 'the-tin-dung',
    title: 'Thẻ tín dụng không phải tiền miễn phí',
    subtitle: 'Quẹt thẻ trước, khóc sau!',
    description:
      'Trải nghiệm 3 kỳ sao kê với hạn mức 10.000.000 đ: hiểu cách dư nợ, thanh toán tối thiểu, lãi 2%/tháng và phí trễ hạn vận hành.',
    badgeText: '3 kỳ sao kê',
    isPlayable: true,
    iconKey: 'credit-card',
    accentBg: 'bg-[#E0F2FE]',
    accentText: 'text-[#0369A1]',
    metaSummary: '3 kỳ • Hạn mức 10.000.000 đ',
  },
];

export const BOSS_BATTLE_CONFIG = {
  id: 'boss-battle-200k' as const,
  initialBudget: 200_000,
  totalDays: 7,
  initialEssentialsScore: 100,
  maxSurvivedDebt: 50_000,
  minVictoryEssentialsScore: 70,
  minSurvivedEssentialsScore: 50,
  storageVersion: 1,
} as const;

export type BossOptionId = 'A' | 'B' | 'C';

export interface BossBattleOption {
  id: BossOptionId;
  label: string;
  description: string;
  /** Simulated expense in VND (>= 0) */
  cost: number;
  /** Optional simulated inflow in VND (>= 0), e.g., selling old textbooks on Day 6 */
  income: number;
  /** Change to essential-needs score (negative when skipping meals/essentials) */
  essentialDelta: number;
  /** True if player skipped a meal or neglected an essential need */
  missedEssential: boolean;
  /** Brief tag shown on option card */
  impactHint: string;
  /** Outcome explanation shown after confirming */
  consequence: string;
  /** Playful Ví Bé quote tailored to this exact choice */
  vibeReaction: string;
}

export interface BossBattleDayScenario {
  dayNumber: number;
  tag: string;
  title: string;
  description: string;
  vibeIntro: string;
  options: readonly [BossBattleOption, BossBattleOption, BossBattleOption];
}

export const BOSS_BATTLE_DAYS: readonly BossBattleDayScenario[] = [
  {
    dayNumber: 1,
    tag: 'Cám dỗ ăn uống',
    title: 'Bạn bè rủ ăn buffet 199k',
    description:
      'Mới đầu tuần, bạn còn đúng 200.000 đ cho cả 7 ngày trước khi lương về. Hội bạn thân nhắn tin rủ đi ăn buffet nướng 199.000 đ vì "chỉ giảm tối nay thôi".',
    vibeIntro: 'Còn 200k cho cả 7 ngày đó nha chủ nhân! Chọn kỹ không là ngày mai hít khí trời!',
    options: [
      {
        id: 'A',
        label: 'Đi ăn buffet cùng bạn cho vui',
        description: 'Góp mặt ngay kẻo lỡ kèo, tính chuyện 6 ngày sau sau vậy.',
        cost: 199_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Đủ bữa nhưng ví gần chạm đáy',
        consequence:
          'Bữa tối rất vui nhưng ngân sách chỉ còn đúng 1.000 đ cho 6 ngày tiếp theo — nguy cơ vay nợ cực cao!',
        vibeReaction:
          'Ủa, còn 200k mà buffet 199k hả chủ nhân? Sáu ngày còn lại uống nước lọc cầm hơi hả?',
      },
      {
        id: 'B',
        label: 'Hẹn kèo sau nhận lương, tự nấu bữa tối giản dị',
        description: 'Nói thật tình hình ngân sách với bạn, tự nấu cơm trứng rau ấm bụng.',
        cost: 25_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Đủ bữa & giữ ví an toàn',
        consequence:
          'Bạn vẫn ăn tối đủ chất, giữ được 175.000 đ cho 6 ngày tới và nhóm bạn cũng vui vẻ hẹn lại tuần sau.',
        vibeReaction:
          'Quá tỉnh táo! Hẹn kèo sau ngày nhận lương vừa giữ tình bạn vừa bảo toàn 175k!',
      },
      {
        id: 'C',
        label: 'Từ chối kèo và nhịn ăn tối luôn cho tiết kiệm',
        description: 'Uống nước lọc đi ngủ sớm để ngân sách giữ nguyên 200.000 đ.',
        cost: 0,
        income: 0,
        essentialDelta: -25,
        missedEssential: true,
        impactHint: 'Tốn 0đ nhưng bỏ bữa thiết yếu',
        consequence:
          'Không mất đồng nào nhưng bụng đói cồn cào, giảm tập trung và mất sức cho cả ngày hôm sau.',
        vibeReaction:
          'Khoan đã! Tiết kiệm kiểu bỏ bữa là phản khoa học nha, sức khỏe mới là vốn quý nhất!',
      },
    ],
  },
  {
    dayNumber: 2,
    tag: 'Mua sắm cảm xúc',
    title: 'Shopee Flash Sale 50% lúc 12h trưa',
    description:
      'Điện thoại báo mã Freeship + giảm 50% chiếc áo khoác bạn thích từ tháng trước (từ 240k còn 120k). Hôm nay bạn cũng cần 30.000 đ cho ăn uống thiết yếu.',
    vibeIntro: 'Shopee gọi rồi kìa! Nhớ phân biệt Cần và Muốn trước khi bấm thanh toán nhé!',
    options: [
      {
        id: 'A',
        label: 'Chốt đơn áo sale 120k + ăn uống bình thường (30k)',
        description: 'Nghĩ bụng "giảm nửa giá không mua thì phí", chốt luôn trong 30 giây.',
        cost: 150_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Chi vượt kế hoạch mạnh',
        consequence:
          'Có thêm chiếc áo khoác chưa thực sự gấp nhưng ngân sách bị thủng 150.000 đ chỉ trong một ngày.',
        vibeReaction:
          'Sale 50% không có nghĩa ví tự nhiên giàu hơn đâu! Bay màu 120k chỉ vì chiếc thông báo rồi kìa!',
      },
      {
        id: 'B',
        label: 'Tắt thông báo sale, chỉ chi cho bữa ăn trong ngày',
        description: 'Lưu áo vào danh sách yêu thích, ưu tiên giữ ngân sách ăn uống thiết yếu.',
        cost: 30_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Cân bằng & đúng nhu cầu',
        consequence:
          'Lý trí thắng cảm xúc! Không tốn tiền cho đồ chưa cần gấp mà vẫn ăn uống đủ bữa.',
        vibeReaction:
          'Đỉnh cao lý trí! Không mua là tiết kiệm 100%, chứ không phải 50% đâu chủ nhân nhé!',
      },
      {
        id: 'C',
        label: 'Mua áo sale 120k rồi nhịn ăn cả ngày để bù tiền',
        description: 'Quyết tâm săn sale bằng được và tự phạt mình không ăn trưa lẫn tối.',
        cost: 120_000,
        income: 0,
        essentialDelta: -30,
        missedEssential: true,
        impactHint: 'Vừa tốn tiền vừa bỏ bữa',
        consequence:
          'Vừa mất 120.000 đ vừa để cơ thể đói lả cả ngày — sức khỏe và ngân sách đều xuống dốc.',
        vibeReaction:
          'Đổi bữa ăn lấy áo sale hả chủ nhân? Ví Bé xin giơ thẻ đỏ cảnh cáo ngay lập tức!',
      },
    ],
  },
  {
    dayNumber: 3,
    tag: 'Chi phí di chuyển',
    title: 'Trời mưa lớn giờ đi học / đi làm',
    description:
      'Sáng nay trời đổ mưa rào đúng giờ cao điểm. Bạn cần đi quãng đường 8km đến trường/công ty và chi 25.000 đ cho bữa ăn trong ngày.',
    vibeIntro: 'Trời mưa dễ làm giá xe công nghệ tăng gấp đôi lắm đó, tính đường khôn ngoan nha!',
    options: [
      {
        id: 'A',
        label: 'Đặt xe công nghệ khứ hồi giờ cao điểm + ăn uống',
        description: 'Chấp nhận giá tăng đột biến 70k khứ hồi để đi lại khô ráo, cộng 25k ăn uống.',
        cost: 95_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Tiện lợi nhưng cước xe rất cao',
        consequence:
          'Di chuyển thoải mái nhưng riêng tiền xe ngày mưa đã ngốn 70.000 đ — bằng hơn hai ngày ăn.',
        vibeReaction:
          'Trời mưa cước xe nhân đôi, ví của chủ nhân cũng rưng rưng theo cơn mưa luôn!',
      },
      {
        id: 'B',
        label: 'Mặc áo mưa đi xe buýt / đi nhờ bạn + ăn đủ bữa',
        description: 'Tốn 10k vé xe buýt/chia xăng cùng bạn và giữ trọn 25k cho bữa ăn đủ chất.',
        cost: 35_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Tiết kiệm 60k & vẫn đảm bảo',
        consequence:
          'Hơi mất thêm 15 phút di chuyển nhưng tiết kiệm được 60.000 đ mà vẫn đến nơi an toàn và đủ bữa.',
        vibeReaction:
          'Chuẩn bài sinh viên vượt bão! Một chiếc áo mưa cứu nguy nguyên cả quỹ đi lại!',
      },
      {
        id: 'C',
        label: 'Đi bộ 8km dưới mưa không áo mưa & bỏ bữa trưa',
        description: 'Cố chịu ướt và nhịn đói để hôm nay không tốn đồng nào.',
        cost: 0,
        income: 0,
        essentialDelta: -30,
        missedEssential: true,
        impactHint: 'Nguy cơ cảm lạnh & thiếu bữa',
        consequence:
          'Giữ được vài chục nghìn nhưng ướt lạnh và bỏ bữa khiến cơ thể kiệt sức, dễ tốn tiền thuốc hơn nhiều.',
        vibeReaction:
          'Đừng đánh đổi sức khỏe lấy tiền lẻ nha chủ nhân, bị ốm tiền khám còn gấp 10 lần đó!',
      },
    ],
  },
  {
    dayNumber: 4,
    tag: 'Phát sinh thiết yếu',
    title: 'Xe thủng lốp & hơi đau họng giữa tuần',
    description:
      'Đúng giữa tuần lại gặp sự cố bất ngờ: xe bị thủng lốp cần vá (15k), cổ họng rát cần mua viên ngậm/thuốc cơ bản (10k), kèm bữa ăn tự chuẩn bị (15k).',
    vibeIntro: 'Chi phí bất ngờ không bao giờ báo trước! Ưu tiên xử lý đúng việc thiết yếu nhé!',
    options: [
      {
        id: 'A',
        label: 'Vá lốp + mua thuốc cơ bản + ăn cơm tự nấu',
        description: 'Giải quyết đúng những gì đang cần với tổng chi hợp lý 40.000 đ.',
        cost: 40_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Đáp ứng đủ nhu cầu thiết yếu',
        consequence:
          'Xe đi lại an toàn, cổ họng được chăm sóc kịp thời và bữa ăn vẫn đảm bảo mà không bị đội chi phí.',
        vibeReaction:
          'Xử lý gọn gàng chuẩn chỉnh! Chi đúng cho sức khỏe và an toàn luôn là ưu tiên số 1!',
      },
      {
        id: 'B',
        label: 'Tiện thay luôn cặp lốp đắt tiền + mua đồ uống tăng lực',
        description: 'Nghe thợ mời nâng cấp bộ lốp mới 145k cùng combo nước tăng lực 15k.',
        cost: 160_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Vượt ngân sách nghiêm trọng',
        consequence:
          'Xe chạy rất êm nhưng khoản nâng cấp chưa cần gấp khiến ví rơi vào cảnh thiếu hụt nặng.',
        vibeReaction:
          'Ví Bé đề nghị họp khẩn về ngân sách! Đang cần vá lốp chứ đâu cần độ siêu xe đâu chủ nhân!',
      },
      {
        id: 'C',
        label: 'Chỉ vá lốp 15k, bỏ qua thuốc và nhịn luôn bữa trưa',
        description: 'Cố chịu đau họng và bỏ ăn để tiết kiệm tối đa 25.000 đ.',
        cost: 15_000,
        income: 0,
        essentialDelta: -25,
        missedEssential: true,
        impactHint: 'Bỏ bữa & xem nhẹ sức khỏe',
        consequence:
          'Tiết kiệm được 25.000 đ trước mắt nhưng cơ thể mệt mỏi, dễ ốm nặng hơn vào cuối tuần.',
        vibeReaction:
          'Cơ thể đang báo động mà lại bỏ bữa không uống thuốc — Ví Bé không duyệt phương án này đâu nha!',
      },
    ],
  },
  {
    dayNumber: 5,
    tag: 'Áp lực xã giao',
    title: 'Bạn bè rủ đi cà phê sống ảo tối Thứ Sáu',
    description:
      'Hết giờ chiều Thứ Sáu, mấy người bạn rủ sang quán cà phê mới khai trương (nước 65k + bánh 45k), chưa kể tiền ăn tối khoảng 20k.',
    vibeIntro: 'Cuối tuần tụ tập rất vui, nhưng nhớ ngó lại ví trước khi gọi combo nước + bánh nhé!',
    options: [
      {
        id: 'A',
        label: 'Gọi full combo nước + bánh + ăn tối ngoài quán',
        description: 'Chơi hết mình tối Thứ Sáu cho đỡ stress, tổng cộng 130.000 đ.',
        cost: 130_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Chi giải trí quá lớn',
        consequence:
          'Có vài tấm ảnh check-in lung linh nhưng ngân sách hai ngày cuối gần như cạn sạch.',
        vibeReaction:
          'Một buổi sống ảo đổi lấy nguy cơ vay nợ cuối tuần — kèo này căng quá chủ nhân ơi!',
      },
      {
        id: 'B',
        label: 'Gợi ý ngồi trà đá công viên trò chuyện + cơm nhà',
        description: 'Chi 5k ly trà đá vỉa hè tán gẫu thoải mái rồi về ăn cơm tối 20k.',
        cost: 25_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Vui vẻ, đủ bữa & siêu hợp ví',
        consequence:
          'Vẫn gặp gỡ cười đùa thoải mái cùng bạn bè mà tiết kiệm được hơn 100.000 đ cho cuối tuần.',
        vibeReaction:
          'Vui là nhờ bạn bè chứ đâu phải nhờ ly nước 65k! Ví Bé chấm 10 điểm khéo léo!',
      },
      {
        id: 'C',
        label: 'Ra quán gọi ly nước 65k nhưng nhịn luôn bữa tối',
        description: 'Muốn có ảnh check-in nên uống nước trừ cơm luôn.',
        cost: 65_000,
        income: 0,
        essentialDelta: -25,
        missedEssential: true,
        impactHint: 'Ưu tiên đồ uống hơn bữa chính',
        consequence:
          'Chi nhiều cho thức uống không thiết yếu mà lại bỏ qua bữa ăn chính đầy đủ dinh dưỡng.',
        vibeReaction:
          'Uống cà phê thay cơm là bụng biểu tình đó chủ nhân! Đừng đánh đổi bữa chính nhé!',
      },
    ],
  },
  {
    dayNumber: 6,
    tag: 'Điều chỉnh ngân sách',
    title: 'Tái cơ cấu ví trước 2 ngày cuối',
    description:
      'Chỉ còn 2 ngày nữa là lương về! Bạn dọn kệ sách thấy có bộ giáo trình cũ còn mới có thể bán lại ngay cho sinh viên khóa dưới (+30.000 đ), và cần chuẩn bị đồ ăn hôm nay.',
    vibeIntro: 'Còn 2 ngày nữa thôi! Chủ động tối ưu cả thu lẫn chi là tuyệt chiêu giữ ví đó!',
    options: [
      {
        id: 'A',
        label: 'Bán giáo trình cũ (+30k) & đi chợ tự nấu ăn (-20k)',
        description: 'Chủ động tăng thêm 30k từ đồ không dùng nữa và nấu bữa ăn đủ chất hết 20k.',
        cost: 20_000,
        income: 30_000,
        essentialDelta: 5,
        missedEssential: false,
        impactHint: 'Dòng tiền dương +10k & đủ chất',
        consequence:
          'Vừa có thêm 30.000 đ hợp lệ vừa ăn uống đầy đủ chỉ với 20.000 đ — ngân sách tăng ròng +10.000 đ!',
        vibeReaction:
          'Quá đỉnh luôn chủ nhân! Dọn phòng thông minh vừa giúp khóa dưới vừa tăng ví thêm +10k!',
      },
      {
        id: 'B',
        label: 'Giữ giáo trình, tự nấu bữa ăn tiết kiệm trong ngày',
        description: 'Không phát sinh thêm nguồn thu nhưng giữ chi ăn uống gọn ở mức 20.000 đ.',
        cost: 20_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Ổn định & kiểm soát tốt',
        consequence:
          'Cơm nhà 20.000 đ giúp bạn no bụng và giữ vững kỷ luật ngân sách trước ngày cuối cùng.',
        vibeReaction:
          'Ổn áp! Cơm nhà giản dị nhưng đầy đủ chất luôn là đồng minh số một của ví tiền!',
      },
      {
        id: 'C',
        label: 'Nghĩ sắp nhận lương nên đặt combo đồ ăn + trà sữa',
        description: 'Tự thưởng sớm bằng đơn giao đồ ăn 110.000 đ vì "mốt có lương rồi lo gì".',
        cost: 110_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Tiêu trước lương rủi ro cao',
        consequence:
          'Thói quen tiêu trước lương khiến ngân sách hụt sâu ngay sát vạch đích.',
        vibeReaction:
          'Lương chưa ting ting mà đã mở tiệc sớm rồi! Ví Bé xin phép toát mồ hôi hột!',
      },
    ],
  },
  {
    dayNumber: 7,
    tag: 'Chặng cuối trước ngày lương',
    title: 'Ngày cuối cùng trước khi nhận lương',
    description:
      'Ngày 7/7 — vượt qua hôm nay là ngày mai lương về tài khoản! Bạn cần ăn uống đầy đủ và chi phí đi lại cơ bản để hoàn thành trọn vẹn thử thách.',
    vibeIntro: 'Ngày cuối rồi chủ nhân ơi! Giữ vững phong độ để chạm vạch đích chiến thắng nhé!',
    options: [
      {
        id: 'A',
        label: 'Tận dụng đồ ăn sẵn có, tự nấu đủ bữa + đi lại gọn nhẹ',
        description: 'Dọn sạch tủ lạnh nấu bữa cơm ngon bổ rẻ và di chuyển tiết kiệm tổng 20.000 đ.',
        cost: 20_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Về đích an toàn & đủ chất',
        consequence:
          'Bạn hoàn thành ngày thứ 7 trọn vẹn, ăn uống đầy đủ và sẵn sàng đón ngày nhận lương nhẹ nhõm.',
        vibeReaction:
          'Tuyệt vời! Bạn đã chứng minh sống 7 ngày với 200k một cách khoa học là hoàn toàn làm được!',
      },
      {
        id: 'B',
        label: 'Rủ bạn đi ăn lẩu ăn mừng sớm trước ngày lương',
        description: 'Đặt bàn lẩu 150.000 đ vì nghĩ mình sắp vượt qua thử thách rồi.',
        cost: 150_000,
        income: 0,
        essentialDelta: 0,
        missedEssential: false,
        impactHint: 'Nguy cơ vỡ kế hoạch phút 89',
        consequence:
          'Phút cuối lại vung tay quá trán khiến ngân sách âm và buộc phải mượn tiền ngay trước ngày lương.',
        vibeReaction:
          'Chạy 6 ngày mượt mà mà phút 89 lại vào kèo lẩu 150k hả chủ nhân?! Tiếc đứt ruột luôn!',
      },
      {
        id: 'C',
        label: 'Ăn mì gói khô cả ngày để giữ số dư đẹp hơn',
        description: 'Chỉ tốn 10.000 đ mua 2 gói mì không rau thịt để nhìn số dư cho cao.',
        cost: 10_000,
        income: 0,
        essentialDelta: -25,
        missedEssential: true,
        impactHint: 'Thiếu dinh dưỡng thiết yếu',
        consequence:
          'Giữ lại thêm 10.000 đ nhưng cơ thể thiếu dinh dưỡng — mục tiêu tài chính là sống khỏe trong khả năng, không phải hành xác.',
        vibeReaction:
          'Tiết kiệm thông minh là đủ chất trong ngân sách, không phải ép mình ăn mì gói cả ngày đâu nha!',
      },
    ],
  },
];

export type BossBattleStatus = 'intro' | 'playing' | 'completed';
export type BossBattleOutcomeType = 'victory' | 'survived_hard' | 'failed';

export interface BossBattleDayRecord {
  dayNumber: number;
  optionId: BossOptionId;
  optionLabel: string;
  cost: number;
  income: number;
  debtAdded: number;
  budgetAfter: number;
  debtAfter: number;
  essentialDelta: number;
  missedEssential: boolean;
  essentialsScoreAfter: number;
  consequence: string;
  vibeReaction: string;
  confirmedAt: string;
}

export interface BossBattleOutcomeSummary {
  type: BossBattleOutcomeType;
  title: string;
  badgeText: string;
  summary: string;
  vibeClosing: string;
  takeaway: string;
}

export interface BossBattleGameState {
  version: number;
  runId: string;
  status: BossBattleStatus;
  currentDay: number;
  budget: number;
  debt: number;
  totalSpent: number;
  totalIncome: number;
  essentialsScore: number;
  essentialsMissed: number;
  history: BossBattleDayRecord[];
  outcome: BossBattleOutcomeType | null;
  startedAt: string;
  updatedAt: string;
}

export function getBossBattleDay(dayNumber: number): BossBattleDayScenario | undefined {
  return BOSS_BATTLE_DAYS.find((d) => d.dayNumber === dayNumber);
}

export function getDayRecord(
  state: BossBattleGameState,
  dayNumber: number
): BossBattleDayRecord | undefined {
  return state.history.find((h) => h.dayNumber === dayNumber);
}

export function formatBossVnd(amount: number): string {
  const safe = Math.round(Math.abs(amount));
  return `${safe.toLocaleString('vi-VN')} đ`;
}

export function createInitialBossBattleState(nowIso: string = new Date().toISOString()): BossBattleGameState {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return {
    version: BOSS_BATTLE_CONFIG.storageVersion,
    runId: `boss-${Date.now()}-${randomPart}`,
    status: 'intro',
    currentDay: 1,
    budget: BOSS_BATTLE_CONFIG.initialBudget,
    debt: 0,
    totalSpent: 0,
    totalIncome: 0,
    essentialsScore: BOSS_BATTLE_CONFIG.initialEssentialsScore,
    essentialsMissed: 0,
    history: [],
    outcome: null,
    startedAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Transitions from 'intro' to 'playing'.
 * Never resets an already-playing or completed run!
 */
export function startBossBattle(
  state: BossBattleGameState,
  nowIso: string = new Date().toISOString()
): BossBattleGameState {
  if (state.status !== 'intro') {
    return state;
  }
  return {
    ...state,
    status: 'playing',
    currentDay: 1,
    updatedAt: nowIso,
  };
}

export interface ApplyChoiceResult {
  applied: boolean;
  reason: 'ok' | 'not-playing' | 'wrong-day' | 'already-confirmed' | 'invalid-option';
  state: BossBattleGameState;
}

/**
 * Pure financial state transition for confirming a day's option.
 * - Strictly blocks double confirmation / double deduction on the same day.
 * - Strictly blocks out-of-order day submission.
 * - Computes exact remaining budget, incurred debt, total spent, and essentials score.
 */
export function applyBossBattleChoice(
  state: BossBattleGameState,
  dayNumber: number,
  optionId: BossOptionId,
  nowIso: string = new Date().toISOString()
): ApplyChoiceResult {
  if (state.status !== 'playing') {
    return { applied: false, reason: 'not-playing', state };
  }

  if (dayNumber !== state.currentDay) {
    return { applied: false, reason: 'wrong-day', state };
  }

  if (state.history.some((record) => record.dayNumber === dayNumber)) {
    return { applied: false, reason: 'already-confirmed', state };
  }

  const scenario = getBossBattleDay(dayNumber);
  const option = scenario?.options.find((o) => o.id === optionId);
  if (!scenario || !option) {
    return { applied: false, reason: 'invalid-option', state };
  }

  // Exact pure money formula:
  // availableCash = budget + income
  // if availableCash >= cost -> nextBudget = availableCash - cost, debtAdded = 0
  // else -> nextBudget = 0, debtAdded = cost - availableCash
  const availableCash = state.budget + option.income;
  let nextBudget = 0;
  let debtAdded = 0;

  if (availableCash >= option.cost) {
    nextBudget = availableCash - option.cost;
    debtAdded = 0;
  } else {
    nextBudget = 0;
    debtAdded = option.cost - availableCash;
  }

  const nextDebt = state.debt + debtAdded;
  const nextTotalSpent = state.totalSpent + option.cost;
  const nextTotalIncome = state.totalIncome + option.income;
  const nextEssentialsScore = Math.max(
    0,
    Math.min(100, state.essentialsScore + option.essentialDelta)
  );
  const nextEssentialsMissed = state.essentialsMissed + (option.missedEssential ? 1 : 0);

  const record: BossBattleDayRecord = {
    dayNumber,
    optionId: option.id,
    optionLabel: option.label,
    cost: option.cost,
    income: option.income,
    debtAdded,
    budgetAfter: nextBudget,
    debtAfter: nextDebt,
    essentialDelta: option.essentialDelta,
    missedEssential: option.missedEssential,
    essentialsScoreAfter: nextEssentialsScore,
    consequence: option.consequence,
    vibeReaction: option.vibeReaction,
    confirmedAt: nowIso,
  };

  return {
    applied: true,
    reason: 'ok',
    state: {
      ...state,
      budget: nextBudget,
      debt: nextDebt,
      totalSpent: nextTotalSpent,
      totalIncome: nextTotalIncome,
      essentialsScore: nextEssentialsScore,
      essentialsMissed: nextEssentialsMissed,
      history: [...state.history, record],
      updatedAt: nowIso,
    },
  };
}

/**
 * Pure outcome evaluator after all 7 days are completed.
 * STRICT FAIRNESS RULES:
 * - Skipping meals or neglecting essentials NEVER counts as 'victory'.
 * - Neglecting essentials 2+ times OR essentialsScore < 50 OR debt > 50,000 -> 'failed'.
 * - Zero debt, positive budget (> 0), zero missed essentials, essentialsScore >= 70 -> 'victory'.
 * - Otherwise (e.g., 0đ balance, small debt <= 50k, or 1 minor essential slip) -> 'survived_hard'.
 */
export function evaluateBossBattleOutcome(state: BossBattleGameState): BossBattleOutcomeSummary {
  const { budget, debt, essentialsMissed, essentialsScore } = state;

  if (
    debt > BOSS_BATTLE_CONFIG.maxSurvivedDebt ||
    essentialsMissed >= 2 ||
    essentialsScore < BOSS_BATTLE_CONFIG.minSurvivedEssentialsScore
  ) {
    const failedByStarving = essentialsMissed >= 2 || essentialsScore < BOSS_BATTLE_CONFIG.minSurvivedEssentialsScore;
    return {
      type: 'failed',
      badgeText: 'Cần thử lại',
      title: failedByStarving
        ? 'Cần thử lại! Không được bỏ bê nhu cầu thiết yếu'
        : 'Cần thử lại! Ngân sách đã vỡ trận',
      summary: failedByStarving
        ? `Bạn đã bỏ bữa hoặc bỏ qua nhu cầu thiết yếu ${essentialsMissed} lần (điểm thiết yếu ${essentialsScore}/100). Giữ tiền bằng cách đánh đổi sức khỏe không được tính là chiến thắng!`
        : `Bạn phát sinh nợ ${formatBossVnd(debt)} sau 7 ngày. Chi tiêu vượt hạn mức ở những ngày đầu khiến ngân sách mất kiểm soát.`,
      vibeClosing: failedByStarving
        ? 'Ví đầy mà bụng đói là Ví Bé không chấm đậu đâu nha! Thử lại với kế hoạch vừa đủ chất vừa hợp ví nhé!'
        : 'Đừng nản chủ nhân ơi! Xem lại nhật ký 7 ngày để thấy khoản chi nào làm ví thủng rồi thử lại ngay nhé!',
      takeaway: failedByStarving
        ? 'Bài học: Quản lý tài chính bền vững luôn ưu tiên ăn uống và sức khỏe cơ bản trước, chỉ cắt giảm nhu cầu "Muốn".'
        : 'Bài học: Hãy chặn ngay các khoản chi cảm xúc (buffet, Flash Sale, cà phê đắt) khi ngân sách tuần đang eo hẹp.',
    };
  }

  if (
    debt === 0 &&
    budget > 0 &&
    essentialsMissed === 0 &&
    essentialsScore >= BOSS_BATTLE_CONFIG.minVictoryEssentialsScore
  ) {
    return {
      type: 'victory',
      badgeText: 'Chiến thắng',
      title: 'Hoàn thành xuất sắc thử thách 7 ngày!',
      summary: `Bạn đã sống sót đủ 7 ngày với số dư còn lại ${formatBossVnd(budget)}, không phát sinh nợ và đáp ứng trọn vẹn nhu cầu thiết yếu (${essentialsScore}/100).`,
      vibeClosing:
        'Ví Bé xin tuyên dương bậc thầy giữ ví! Bạn vừa ăn uống đầy đủ vừa còn dư tiền đón ngày nhận lương!',
      takeaway:
        'Bài học: Phân biệt rõ Cần vs Muốn, dự phòng sự cố bất ngờ và chủ động tạo dòng tiền dương giúp bạn làm chủ mọi ngân sách.',
    };
  }

  return {
    type: 'survived_hard',
    badgeText: 'Vượt qua khó khăn',
    title: 'Vượt qua 7 ngày trong gang tấc!',
    summary:
      debt > 0
        ? `Bạn đã đi hết 7 ngày nhưng vẫn phát sinh khoản nợ nhỏ ${formatBossVnd(debt)}. Hãy thử tối ưu lại để về đích với 0 đ nợ nhé.`
        : essentialsMissed > 0
        ? `Bạn giữ được ví không nợ (${formatBossVnd(budget)}) nhưng đã bỏ qua nhu cầu thiết yếu ${essentialsMissed} lần. Thử lại để vừa giữ tiền vừa đủ bữa 7/7 ngày nhé!`
        : `Bạn hoàn thành 7 ngày không nợ nhưng số dư về đúng 0 đ — hơi sát nút nếu có sự cố bất ngờ!`,
    vibeClosing:
      'Suýt nữa là điểm tuyệt đối rồi chủ nhân! Chỉnh lại 1–2 lựa chọn là lần sau thắng giòn giã luôn!',
    takeaway:
      'Bài học: Luôn giữ một khoản đệm nhỏ và đảm bảo đủ bữa mỗi ngày để ngân sách bền vững lâu dài.',
  };
}

export interface AdvanceDayResult {
  advanced: boolean;
  reason: 'ok' | 'not-playing' | 'day-not-confirmed';
  state: BossBattleGameState;
}

/**
 * Advances strictly from day N to day N+1 (or completes on day 7).
 * Cannot skip an unconfirmed day!
 */
export function advanceBossBattleDay(
  state: BossBattleGameState,
  nowIso: string = new Date().toISOString()
): AdvanceDayResult {
  if (state.status !== 'playing') {
    return { advanced: false, reason: 'not-playing', state };
  }

  const hasConfirmedCurrentDay = state.history.some(
    (record) => record.dayNumber === state.currentDay
  );
  if (!hasConfirmedCurrentDay) {
    return { advanced: false, reason: 'day-not-confirmed', state };
  }

  if (state.currentDay >= BOSS_BATTLE_CONFIG.totalDays) {
    const outcome = evaluateBossBattleOutcome(state);
    return {
      advanced: true,
      reason: 'ok',
      state: {
        ...state,
        status: 'completed',
        outcome: outcome.type,
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

/**
 * Strictly validates a serialized BossBattleGameState loaded from localStorage.
 * Rejects tampered, corrupted, or version-mismatched payloads so bad data never crashes UI.
 */
export function validateBossBattleState(raw: unknown): BossBattleGameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Partial<BossBattleGameState>;

  if (obj.version !== BOSS_BATTLE_CONFIG.storageVersion) return null;
  if (typeof obj.runId !== 'string' || obj.runId.length < 4 || obj.runId.length > 80) return null;
  if (obj.status !== 'intro' && obj.status !== 'playing' && obj.status !== 'completed') return null;
  if (
    typeof obj.currentDay !== 'number' ||
    !Number.isInteger(obj.currentDay) ||
    obj.currentDay < 1 ||
    obj.currentDay > BOSS_BATTLE_CONFIG.totalDays
  ) {
    return null;
  }
  if (typeof obj.budget !== 'number' || !Number.isFinite(obj.budget) || obj.budget < 0) return null;
  if (typeof obj.debt !== 'number' || !Number.isFinite(obj.debt) || obj.debt < 0) return null;
  if (typeof obj.totalSpent !== 'number' || !Number.isFinite(obj.totalSpent) || obj.totalSpent < 0) {
    return null;
  }
  if (
    typeof obj.totalIncome !== 'number' ||
    !Number.isFinite(obj.totalIncome) ||
    obj.totalIncome < 0
  ) {
    return null;
  }
  if (
    typeof obj.essentialsScore !== 'number' ||
    !Number.isFinite(obj.essentialsScore) ||
    obj.essentialsScore < 0 ||
    obj.essentialsScore > 100
  ) {
    return null;
  }
  if (
    typeof obj.essentialsMissed !== 'number' ||
    !Number.isInteger(obj.essentialsMissed) ||
    obj.essentialsMissed < 0 ||
    obj.essentialsMissed > BOSS_BATTLE_CONFIG.totalDays
  ) {
    return null;
  }
  if (!Array.isArray(obj.history) || obj.history.length > BOSS_BATTLE_CONFIG.totalDays) return null;

  // Verify contiguous unique day records in history and valid option IDs
  const seenDays = new Set<number>();
  for (let i = 0; i < obj.history.length; i += 1) {
    const rec = obj.history[i];
    if (!rec || typeof rec !== 'object') return null;
    const expectedDay = i + 1;
    if (rec.dayNumber !== expectedDay || seenDays.has(rec.dayNumber)) return null;
    if (rec.optionId !== 'A' && rec.optionId !== 'B' && rec.optionId !== 'C') return null;
    if (typeof rec.cost !== 'number' || rec.cost < 0) return null;
    if (typeof rec.income !== 'number' || rec.income < 0) return null;
    if (typeof rec.debtAdded !== 'number' || rec.debtAdded < 0) return null;
    seenDays.add(rec.dayNumber);
  }

  if (obj.status === 'completed' && obj.history.length !== BOSS_BATTLE_CONFIG.totalDays) {
    return null;
  }

  if (
    obj.outcome !== null &&
    obj.outcome !== 'victory' &&
    obj.outcome !== 'survived_hard' &&
    obj.outcome !== 'failed'
  ) {
    return null;
  }

  if (typeof obj.startedAt !== 'string' || typeof obj.updatedAt !== 'string') return null;

  return obj as BossBattleGameState;
}
