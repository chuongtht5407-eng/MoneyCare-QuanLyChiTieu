export const JOB_LOSS_CONFIG = {
  id: 'mat-viec-bat-ngo' as const,
  title: 'Mất việc bất ngờ – 30 ngày giữ vững tài chính',
  initialCash: 6_000_000,
  totalStages: 6,
  totalDays: 30,
  initialEssentialsScore: 100,
  initialJobProgress: 10,
  minStrongRecoveryCash: 1_500_000,
  minStrongRecoveryJobProgress: 60,
  minStrongRecoveryEssentials: 75,
  maxSurvivedDebt: 1_000_000,
  maxSurvivedUnpaidBills: 1_000_000,
  minSurvivedEssentials: 55,
  storageVersion: 1,
} as const;

export type JobLossOptionId = 'A' | 'B' | 'C';
export type JobLossStatus = 'intro' | 'playing' | 'completed';
export type JobLossOutcomeType =
  | 'strong_recovery'
  | 'survived_strengthen'
  | 'need_rebuild';

export interface JobLossConditionalIncome {
  minJobProgress: number;
  amount: number;
  bonusJobProgress: number;
  successNote: string;
  missNote: string;
}

export interface JobLossOption {
  id: JobLossOptionId;
  label: string;
  description: string;
  essentialCost: number;
  nonEssentialCost: number;
  guaranteedIncome: number;
  conditionalIncome?: JobLossConditionalIncome;
  /** Direct debt borrowed (e.g., high-interest app loan) */
  borrowedDebt: number;
  /** True if this choice uses predatory / high-risk borrowing */
  isRiskyDebt: boolean;
  /** Change to unpaid bills (positive = deferred/unpaid bills added) */
  unpaidBillsDelta: number;
  /** True if player uses available cash to pay down unpaid bills in this turn */
  payDownUnpaidBills?: boolean;
  /** Progress towards getting a new job (0..100 scale) */
  jobProgressDelta: number;
  /** Change to essential-needs satisfaction (0..100 scale) */
  essentialsDelta: number;
  /** True if player skips meals or neglects essential health/housing */
  missedEssential: boolean;
  impactHint: string;
  consequence: string;
  vibeReaction: string;
}

export interface JobLossStageScenario {
  stageNumber: number;
  dayRangeLabel: string;
  tag: string;
  title: string;
  description: string;
  vibeIntro: string;
  options: readonly [JobLossOption, JobLossOption, JobLossOption];
}

export const JOB_LOSS_STAGES: readonly JobLossStageScenario[] = [
  {
    stageNumber: 1,
    dayRangeLabel: 'Ngày 1–5',
    tag: 'Mất việc',
    title: 'Tin bất ngờ: Công ty cắt giảm nhân sự',
    description:
      'Bạn vừa nhận thông báo nghỉ việc ngay đầu tháng. Quỹ dự phòng giả lập hiện có đúng 6.000.000 đ trong khi các chi phí sinh hoạt vẫn chạy đều.',
    vibeIntro:
      'Bình tĩnh hít sâu nha chủ nhân! 5 ngày đầu tiên là lúc lập "ngân sách sinh tồn" để kéo dài thời gian trụ vững!',
    options: [
      {
        id: 'A',
        label: 'Lập ngân sách khẩn cấp, cắt toàn bộ chi giải trí & cập nhật CV',
        description:
          'Chỉ chi 500.000 đ ăn uống/đi lại thiết yếu trong 5 ngày, dừng các gói đăng ký không cần thiết và viết lại CV.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 25,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thiết yếu -500k • Tiến độ việc +25%',
        consequence:
          'Bạn giữ được 5.500.000 đ dự phòng, ăn uống đủ chất và có bản CV sẵn sàng nộp ngay sang chặng sau.',
        vibeReaction:
          'Phản ứng quá chuẩn! Giữ cái đầu lạnh và cắt ngay khoản không thiết yếu giúp quỹ dự phòng bền hơn nhiều!',
      },
      {
        id: 'B',
        label: 'Đi ăn uống giải sầu với bạn bè rồi tuần sau mới tính',
        description:
          'Chi 500.000 đ thiết yếu cộng 900.000 đ tụ tập xả stress và mua sắm vặt.',
        essentialCost: 500_000,
        nonEssentialCost: 900_000,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 5,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Tổng chi -1.400k • Tiến độ việc +5%',
        consequence:
          'Tâm trạng tạm khuây khỏa nhưng quỹ dự phòng hụt mất 1.400.000 đ ngay 5 ngày đầu.',
        vibeReaction:
          'Buồn thì Ví Bé hiểu, nhưng xả stress kiểu bay 900k lúc mất thu nhập là áp lực lắm đó nha!',
      },
      {
        id: 'C',
        label: 'Cắt cực đoan: chỉ ăn mì gói 5 ngày & không làm gì ngoài lo lắng',
        description:
          'Chi vỏn vẹn 150.000 đ ăn uống thiếu chất và đóng cửa ở nhà vì quá hoang mang.',
        essentialCost: 150_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 0,
        essentialsDelta: -25,
        missedEssential: true,
        impactHint: 'Giữ tiền nhưng bỏ bê sức khỏe (-25 thiết yếu)',
        consequence:
          'Bạn tiết kiệm được 350.000 đ nhưng cơ thể suy nhược và không có tiến triển nào cho việc tìm thu nhập.',
        vibeReaction:
          'Đừng bỏ bữa nha chủ nhân! Phải đủ sức khỏe mới đủ tỉnh táo đi phỏng vấn và kiếm việc mới được!',
      },
    ],
  },
  {
    stageNumber: 2,
    dayRangeLabel: 'Ngày 6–10',
    tag: 'Hóa đơn đến hạn',
    title: 'Tiền thuê nhà, điện nước & ăn uống đến hạn',
    description:
      'Chủ trọ nhắn đóng tiền nhà 2.400.000 đ + điện nước internet 400.000 đ. Bạn cũng cần 500.000 đ cho ăn uống 5 ngày này.',
    vibeIntro:
      'Hóa đơn cố định không đợi chúng ta có lương mới tới! Ưu tiên giữ chỗ ở ổn định và tránh nợ xấu nhé!',
    options: [
      {
        id: 'A',
        label: 'Thanh toán đầy đủ tiền nhà, điện nước & tự nấu ăn tiết kiệm',
        description:
          'Trả dứt 2.800.000 đ tiền nhà/điện nước và 500.000 đ thực phẩm tự nấu, không để nợ hóa đơn.',
        essentialCost: 3_300_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 5,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Chi thiết yếu -3.300k • 0 đ hóa đơn nợ',
        consequence:
          'Chỗ ở và sinh hoạt hoàn toàn yên tâm, bạn không bị áp lực chủ trọ giục nợ hay phí phạt chậm thanh toán.',
        vibeReaction:
          'Trả dứt hóa đơn thiết yếu giúp tâm trí nhẹ tênh để tập trung kiếm thu nhập ở chặng tiếp theo!',
      },
      {
        id: 'B',
        label: 'Thương lượng trả trước một nửa tiền nhà (1.200k), nợ lại 1.200k',
        description:
          'Nói thật hoàn cảnh với chủ trọ để giãn 1.200.000 đ sang cuối tháng, vẫn trả điện nước (400k) và ăn đủ bữa (500k).',
        essentialCost: 2_100_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 1_200_000,
        jobProgressDelta: 5,
        essentialsDelta: -5,
        missedEssential: false,
        impactHint: 'Chi -2.100k • Hóa đơn còn nợ +1.200k',
        consequence:
          'Giữ được thêm tiền mặt xoay xở trước mắt, nhưng bạn vẫn còn khoản hóa đơn 1.200.000 đ phải giải quyết.',
        vibeReaction:
          'Chủ trọ thông cảm cho giãn nợ là may lắm, nhưng nhớ ghi rõ khoản 1,2 triệu này để trả sớm nha!',
      },
      {
        id: 'C',
        label: 'Khất toàn bộ tiền nhà & điện nước, dùng tiền mua sắm giải trí',
        description:
          'Không thanh toán 2.800.000 đ hóa đơn đến hạn, chỉ ăn uống cơ bản 500.000 đ và tiêu thêm 400.000 đ đặt đồ ăn ngoài.',
        essentialCost: 500_000,
        nonEssentialCost: 400_000,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 2_800_000,
        jobProgressDelta: 0,
        essentialsDelta: -20,
        missedEssential: true,
        impactHint: 'Hóa đơn nợ +2.800k • Nguy cơ mất chỗ ở',
        consequence:
          'Hóa đơn tồn đọng tăng vọt lên 2.800.000 đ, nguy cơ bị cắt điện nước hoặc mất cọc phòng trọ rất cao.',
        vibeReaction:
          'Cảnh báo đỏ! Bỏ mặc hóa đơn thiết yếu mà vẫn tiêu giải trí là tự đẩy mình vào thế kẹt đó chủ nhân!',
      },
    ],
  },
  {
    stageNumber: 3,
    dayRangeLabel: 'Ngày 11–15',
    tag: 'Tìm kiếm thu nhập',
    title: 'Chiến lược 5 ngày giữa tháng: Kiếm tiền ngay hay săn việc dài hạn?',
    description:
      'Quỹ dự phòng đã giảm đáng kể sau đợt hóa đơn. Bạn cần chọn cách phân bổ thời gian trong 5 ngày này (ăn uống thiết yếu vẫn cần 500.000 đ).',
    vibeIntro:
      'Giai đoạn bản lề đây rồi! Cân đối giữa thu nhập tạm thời ngay lập tức và tiến độ tìm việc dài hạn nhé!',
    options: [
      {
        id: 'A',
        label: 'Làm bán thời gian ban ngày (+1.200k thực nhận) + nộp CV buổi tối',
        description:
          'Nhận ca phụ việc ngắn hạn thu về 1.200.000 đ ngay trong kỳ, tối vẫn gửi hồ sơ và ôn phỏng vấn.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 1_200_000,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 20,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thu nhập +1.200k • Thiết yếu -500k • Việc +20%',
        consequence:
          'Bạn có ngay 1.200.000 đ tiền mặt giúp dòng tiền dương trong chặng này, đồng thời đẩy tiến độ tìm việc tăng đều.',
        vibeReaction:
          'Vừa có tiền tươi giữ quỹ vừa không ngừng nộp CV — chiến lược hai chân vững chắc quá chủ nhân!',
      },
      {
        id: 'B',
        label: 'Dồn toàn lực nộp CV chất lượng & học kỹ năng phỏng vấn (chưa có thu nhập)',
        description:
          'Không có thu nhập ngay trong 5 ngày này (chỉ là cơ hội tương lai), nhưng nâng mạnh tiến độ tìm việc để mở khóa vòng phỏng vấn có trả phí ở Chặng 5.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 35,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thu nhập 0 đ • Thiết yếu -500k • Việc +35%',
        consequence:
          'Chưa có tiền vào ví ngay nhưng hồ sơ của bạn nổi bật hẳn lên — tăng mạnh khả năng nhận dự án/offer ở chặng sau.',
        vibeReaction:
          'Đầu tư thời gian bài bản không cộng tiền liền nhưng tạo đà cực mạnh cho vòng phỏng vấn sắp tới!',
      },
      {
        id: 'C',
        label: 'Mua khóa học "làm giàu nhanh" 1.500k từ quảng cáo mạng',
        description:
          'Tin lời hứa kiếm 30 triệu/tháng sau 3 ngày, chi 1.500.000 đ mua khóa học không kiểm chứng cộng 500.000 đ sinh hoạt.',
        essentialCost: 500_000,
        nonEssentialCost: 1_500_000,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 0,
        essentialsDelta: -5,
        missedEssential: false,
        impactHint: 'Chi không thiết yếu -1.500k • Việc +0%',
        consequence:
          'Khóa học toàn lý thuyết chung chung không giúp tạo thu nhập, còn quỹ dự phòng bốc hơi thêm 1.500.000 đ.',
        vibeReaction:
          'Ối! Đang mất việc là dễ dính bẫy khóa học "làm giàu nhanh" lắm đó, cảnh giác cao độ nha chủ nhân!',
      },
    ],
  },
  {
    stageNumber: 4,
    dayRangeLabel: 'Ngày 16–20',
    tag: 'Chi phí bất ngờ',
    title: 'Phát sinh khẩn: Khám bệnh & sửa xe đi phỏng vấn',
    description:
      'Đúng lúc eo hẹp thì bạn bị sốt kèm hỏng bình ắc-quy xe máy. Chi phí khám/thuốc cơ bản + sửa xe là 1.000.000 đ, cộng 500.000 đ ăn uống 5 ngày.',
    vibeIntro:
      'Sự cố bất ngờ là lý do tồn tại của quỹ dự phòng đó! Tuyệt đối tránh vay nóng lãi cắt cổ nhé!',
    options: [
      {
        id: 'A',
        label: 'Dùng quỹ dự phòng xử lý gọn (khám cơ bản + sửa đúng chỗ hỏng)',
        description:
          'Chi 1.500.000 đ tổng chi phí thiết yếu (1.000k y tế/sửa xe + 500k ăn uống), giữ sức khỏe và phương tiện sẵn sàng.',
        essentialCost: 1_500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 5,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thiết yếu -1.500k • Sức khỏe & xe ổn định',
        consequence:
          'Bạn hồi phục nhanh và xe hoạt động tốt để đi phỏng vấn mà không phải vay nợ lãi cao.',
        vibeReaction:
          'Xử lý chuẩn mực! Quỹ dự phòng sinh ra là để đỡ đúng những cú đánh bất ngờ như thế này!',
      },
      {
        id: 'B',
        label: 'Vay nóng qua app lãi suất cao 2.000k để tiêu xài thoải mái',
        description:
          'Vay app tín dụng nhanh 2.000.000 đ (ghi nhận nợ rủi ro 2.400.000 đ gồm phí/lãi ban đầu), chi 1.500k thiết yếu và 500k mua sắm.',
        essentialCost: 1_500_000,
        nonEssentialCost: 500_000,
        guaranteedIncome: 2_000_000,
        borrowedDebt: 2_400_000,
        isRiskyDebt: true,
        unpaidBillsDelta: 0,
        jobProgressDelta: 0,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Nợ rủi ro +2.400k • Cạm bẫy lãi cao',
        consequence:
          'Tiền mặt tạm đầy nhưng bạn lập tức gánh khoản nợ vay nóng 2.400.000 đ đầy rủi ro.',
        vibeReaction:
          'Báo động khẩn cấp! Vay nóng app lãi cắt cổ là con đường ngắn nhất dẫn tới xoáy nợ đó chủ nhân!',
      },
      {
        id: 'C',
        label: 'Không đi khám, bỏ mặc xe hỏng & nhịn bớt bữa ăn để giữ tiền',
        description:
          'Chỉ chi 250.000 đ cầm chừng, chịu sốt và không sửa xe.',
        essentialCost: 250_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: -10,
        essentialsDelta: -30,
        missedEssential: true,
        impactHint: 'Bỏ bê sức khỏe (-30 thiết yếu, -10% việc)',
        consequence:
          'Bệnh kéo dài khiến bạn bỏ lỡ cơ hội trao đổi với nhà tuyển dụng và suy giảm nghiêm trọng sức khỏe.',
        vibeReaction:
          'Giữ tiền mà đánh đổi sức khỏe là lỗ nặng nhất luôn đó chủ nhân ơi!',
      },
    ],
  },
  {
    stageNumber: 5,
    dayRangeLabel: 'Ngày 21–25',
    tag: 'Cơ hội việc làm',
    title: 'Cơ hội phỏng vấn chính thức & dự án ngắn hạn',
    description:
      'Cuối tuần thứ 4 có hai hướng rõ ràng: tham gia bài test thử việc có trả thù lao (chỉ nhận tiền khi Tiến độ tìm việc ≥ 45%) hoặc nhận dự án freelance ngắn hạn trả tiền ngay.',
    vibeIntro:
      'Xem kỹ điều kiện nhận tiền nhé! Cơ hội chỉ thành tiền thật khi bạn đã chuẩn bị đủ nền tảng!',
    options: [
      {
        id: 'A',
        label: 'Dự phỏng vấn + làm dự án thử việc có trả thù lao (cần Tiến độ ≥ 45%)',
        description:
          'Nếu Tiến độ tìm việc hiện tại ≥ 45%: vượt qua vòng lọc và nhận thực 2.400.000 đ + tăng tiến độ việc. Nếu < 45%: chỉ được kinh nghiệm phỏng vấn (0 đ thu nhập).',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        conditionalIncome: {
          minJobProgress: 45,
          amount: 2_400_000,
          bonusJobProgress: 30,
          successNote:
            'Đủ điều kiện (Tiến độ ≥ 45%)! Bạn vượt qua bài test thử việc và thực nhận +2.400.000 đ!',
          missNote:
            'Chưa đủ điều kiện (Tiến độ < 45%) nên chưa vượt vòng sàng lọc — không có thu nhập trong kỳ này.',
        },
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 15,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Đạt ≥45% việc: +2.400k thực nhận; ngược lại 0 đ',
        consequence:
          'Kết quả thu nhập phụ thuộc trực tiếp vào sự chuẩn bị tìm việc ở các chặng trước.',
        vibeReaction:
          'Cơ hội lớn chỉ thưởng cho người đã chuẩn bị kỹ hồ sơ và kỹ năng từ sớm đó chủ nhân!',
      },
      {
        id: 'B',
        label: 'Nhận dự án freelance ngắn hạn trả công chắc chắn (+1.500k)',
        description:
          'Nhận gói công việc ngắn hạn đảm bảo thu nhập thực 1.500.000 đ, trừ 500.000 đ ăn uống 5 ngày.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 1_500_000,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 15,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thu nhập chắc chắn +1.500k • Thiết yếu -500k',
        consequence:
          'Bạn bổ sung ngay 1.500.000 đ tiền mặt vào quỹ dự phòng và có thêm sản phẩm đưa vào hồ sơ năng lực.',
        vibeReaction:
          'Tiền về ví chắc chắn +1,5 triệu giúp quỹ dự phòng thở phào nhẹ nhõm luôn!',
      },
      {
        id: 'C',
        label: 'Từ chối cả hai vì thấy lương thấp, chờ việc "trong mơ"',
        description:
          'Không nhận thu nhập và tiếp tục tiêu 500.000 đ thiết yếu + 300.000 đ cà phê giải khuây.',
        essentialCost: 500_000,
        nonEssentialCost: 300_000,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 0,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thu nhập 0 đ • Tổng chi -800k',
        consequence:
          'Bỏ qua dòng tiền thực tế khiến quỹ dự phòng cạn dần trong khi chưa có đề nghị công việc nào chắc chắn.',
        vibeReaction:
          'Lúc khó khăn thì một nguồn thu nhập cầu nối quý lắm đó chủ nhân, đừng kén quá nha!',
      },
    ],
  },
  {
    stageNumber: 6,
    dayRangeLabel: 'Ngày 26–30',
    tag: 'Vượt qua tháng đầu tiên',
    title: '5 ngày cuối tháng: Chốt sổ & tái thiết kế hoạch tài chính',
    description:
      'Bạn sắp đi hết 30 ngày đầu tiên sau khi mất việc. Hãy quyết định cách chi tiêu 5 ngày cuối, xử lý hóa đơn tồn (nếu có) và chốt kế hoạch tháng tới.',
    vibeIntro:
      'Chặng cuối cùng rồi! Giải quyết gọn hóa đơn còn nợ (nếu có) và giữ kỷ luật chi tiêu để về đích an toàn nhé!',
    options: [
      {
        id: 'A',
        label: 'Giữ kỷ luật ăn uống 500k, tất toán hóa đơn còn nợ & chốt lịch đi làm',
        description:
          'Chi 500.000 đ thiết yếu, dùng tiền mặt còn dư ưu tiên trả hóa đơn đang nợ (nếu có) và hoàn thiện hồ sơ nhận việc mới.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        payDownUnpaidBills: true,
        jobProgressDelta: 15,
        essentialsDelta: 5,
        missedEssential: false,
        impactHint: 'Thiết yếu -500k • Trả hóa đơn nợ (nếu có) • Việc +15%',
        consequence:
          'Bạn kết thúc 30 ngày trong thế chủ động, xử lý minh bạch nghĩa vụ thanh toán và sẵn sàng bước sang tháng mới.',
        vibeReaction:
          'Chốt tháng quá gọn gàng và có trách nhiệm! Bạn đã giữ được nhịp tài chính cực kỳ vững!',
      },
      {
        id: 'B',
        label: 'Nhận thêm ca làm cuối tuần (+600k) & ăn uống giản dị (500k)',
        description:
          'Làm thêm 2 ngày cuối tuần thu về 600.000 đ thực nhận để gia cố lại quỹ dự phòng.',
        essentialCost: 500_000,
        nonEssentialCost: 0,
        guaranteedIncome: 600_000,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 10,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Thu nhập +600k • Thiết yếu -500k • Việc +10%',
        consequence:
          'Dòng tiền 5 ngày cuối dương +100.000 đ giúp củng cố thêm lớp đệm an toàn cho tháng tiếp theo.',
        vibeReaction:
          'Chăm chỉ có thưởng! Bổ sung thêm lớp đệm tiền mặt cuối tháng rất đáng khen!',
      },
      {
        id: 'C',
        label: 'Mừng sắp qua tháng đầu bằng bữa tiệc + mua sắm 1.200k',
        description:
          'Chi 500.000 đ thiết yếu và vung tay 1.200.000 đ ăn mừng trước khi thực sự có lương ổn định.',
        essentialCost: 500_000,
        nonEssentialCost: 1_200_000,
        guaranteedIncome: 0,
        borrowedDebt: 0,
        isRiskyDebt: false,
        unpaidBillsDelta: 0,
        jobProgressDelta: 0,
        essentialsDelta: 0,
        missedEssential: false,
        impactHint: 'Tổng chi -1.700k • Bào mòn quỹ dự phòng',
        consequence:
          'Chi tiêu ăn mừng quá sớm làm suy yếu mạnh quỹ dự phòng ngay trước khi thu nhập chính quay lại.',
        vibeReaction:
          'Lương mới chưa về mà đã mở tiệc 1,2 triệu rồi! Quỹ dự phòng lại mỏng đi trông thấy luôn!',
      },
    ],
  },
];

export interface JobLossStageRecord {
  stageNumber: number;
  dayRangeLabel: string;
  stageTitle: string;
  optionId: JobLossOptionId;
  optionLabel: string;
  essentialCost: number;
  nonEssentialCost: number;
  incomeReceived: number;
  conditionalTriggered: boolean | null;
  billsPaidOff: number;
  debtAdded: number;
  unpaidBillsAfter: number;
  cashAfter: number;
  debtAfter: number;
  jobProgressAfter: number;
  essentialsScoreAfter: number;
  consequenceNote: string;
  vibeReaction: string;
  confirmedAt: string;
}

export interface JobLossGameState {
  version: number;
  runId: string;
  status: JobLossStatus;
  currentStage: number;
  cash: number;
  totalEssentialSpent: number;
  totalNonEssentialSpent: number;
  totalTempIncome: number;
  debt: number;
  unpaidBills: number;
  jobSearchProgress: number;
  essentialsScore: number;
  essentialsMissed: number;
  usedRiskyDebt: boolean;
  history: JobLossStageRecord[];
  outcome: JobLossOutcomeType | null;
  startedAt: string;
  updatedAt: string;
}

export interface JobLossOutcomeSummary {
  type: JobLossOutcomeType;
  badgeText: string;
  title: string;
  summary: string;
  vibeClosing: string;
  takeaway: string;
}

export function formatJobLossVnd(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  const abs = Math.abs(safe).toLocaleString('vi-VN');
  return safe < 0 ? `-${abs} đ` : `${abs} đ`;
}

export function getJobLossStage(stageNumber: number): JobLossStageScenario | undefined {
  return JOB_LOSS_STAGES.find((s) => s.stageNumber === stageNumber);
}

export function getJobLossStageRecord(
  state: JobLossGameState,
  stageNumber: number
): JobLossStageRecord | undefined {
  return state.history.find((r) => r.stageNumber === stageNumber);
}

export function createInitialJobLossState(
  nowIso: string = new Date().toISOString(),
  runId: string = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
): JobLossGameState {
  return {
    version: JOB_LOSS_CONFIG.storageVersion,
    runId,
    status: 'intro',
    currentStage: 1,
    cash: JOB_LOSS_CONFIG.initialCash,
    totalEssentialSpent: 0,
    totalNonEssentialSpent: 0,
    totalTempIncome: 0,
    debt: 0,
    unpaidBills: 0,
    jobSearchProgress: JOB_LOSS_CONFIG.initialJobProgress,
    essentialsScore: JOB_LOSS_CONFIG.initialEssentialsScore,
    essentialsMissed: 0,
    usedRiskyDebt: false,
    history: [],
    outcome: null,
    startedAt: nowIso,
    updatedAt: nowIso,
  };
}

export function startJobLossGame(
  state: JobLossGameState,
  nowIso: string = new Date().toISOString()
): JobLossGameState {
  if (state.status !== 'intro') return state;
  return {
    ...state,
    status: 'playing',
    currentStage: 1,
    updatedAt: nowIso,
  };
}

export interface ApplyJobLossChoiceResult {
  applied: boolean;
  reason: 'ok' | 'not-playing' | 'wrong-stage' | 'already-confirmed' | 'invalid-option';
  state: JobLossGameState;
}

/**
 * Pure integer VND transition for one 5-day stage.
 * - Blocks duplicate confirmation on the same stage.
 * - Conditional income ONLY pays when minJobProgress condition is genuinely satisfied.
 */
export function applyJobLossChoice(
  state: JobLossGameState,
  stageNumber: number,
  optionId: JobLossOptionId,
  nowIso: string = new Date().toISOString()
): ApplyJobLossChoiceResult {
  if (state.status !== 'playing') {
    return { applied: false, reason: 'not-playing', state };
  }
  if (stageNumber !== state.currentStage) {
    return { applied: false, reason: 'wrong-stage', state };
  }
  if (state.history.some((r) => r.stageNumber === stageNumber)) {
    return { applied: false, reason: 'already-confirmed', state };
  }

  const stage = getJobLossStage(stageNumber);
  const option = stage?.options.find((o) => o.id === optionId);
  if (!stage || !option) {
    return { applied: false, reason: 'invalid-option', state };
  }

  let incomeReceived = option.guaranteedIncome;
  let conditionalTriggered: boolean | null = null;
  let extraJobDelta = 0;
  let consequenceNote = option.consequence;

  if (option.conditionalIncome) {
    if (state.jobSearchProgress >= option.conditionalIncome.minJobProgress) {
      conditionalTriggered = true;
      incomeReceived += option.conditionalIncome.amount;
      extraJobDelta = option.conditionalIncome.bonusJobProgress;
      consequenceNote = option.conditionalIncome.successNote;
    } else {
      conditionalTriggered = false;
      consequenceNote = option.conditionalIncome.missNote;
    }
  }

  // Note: borrowedDebt represents cash received via risky loan; guaranteedIncome already models cash received,
  // but we DO NOT count risky borrowed cash as "temp income"!
  const tempIncomeToRecord = option.isRiskyDebt ? 0 : incomeReceived;

  const baseOutflow = option.essentialCost + option.nonEssentialCost;
  const availableBeforePaydown = state.cash + incomeReceived;

  let nextCash = 0;
  let shortfallDebt = 0;

  if (availableBeforePaydown >= baseOutflow) {
    nextCash = availableBeforePaydown - baseOutflow;
  } else {
    nextCash = 0;
    shortfallDebt = baseOutflow - availableBeforePaydown;
  }

  // Optional paydown of unpaid bills using remaining positive cash
  let billsPaidOff = 0;
  let nextUnpaidBills = Math.max(0, state.unpaidBills + option.unpaidBillsDelta);
  if (option.payDownUnpaidBills && nextUnpaidBills > 0 && nextCash > 0) {
    billsPaidOff = Math.min(nextCash, nextUnpaidBills);
    nextCash -= billsPaidOff;
    nextUnpaidBills -= billsPaidOff;
    if (billsPaidOff > 0) {
      consequenceNote = `${option.consequence} Bạn cũng đã trích ${formatJobLossVnd(billsPaidOff)} để thanh toán hóa đơn còn nợ.`;
    }
  }

  const debtAdded = shortfallDebt + option.borrowedDebt;
  const nextDebt = state.debt + debtAdded;
  const nextJobProgress = Math.max(
    0,
    Math.min(100, state.jobSearchProgress + option.jobProgressDelta + extraJobDelta)
  );
  const nextEssentialsScore = Math.max(
    0,
    Math.min(100, state.essentialsScore + option.essentialsDelta)
  );
  const nextEssentialsMissed = state.essentialsMissed + (option.missedEssential ? 1 : 0);
  const nextUsedRiskyDebt = state.usedRiskyDebt || option.isRiskyDebt;

  const record: JobLossStageRecord = {
    stageNumber: stage.stageNumber,
    dayRangeLabel: stage.dayRangeLabel,
    stageTitle: stage.title,
    optionId: option.id,
    optionLabel: option.label,
    essentialCost: option.essentialCost + billsPaidOff,
    nonEssentialCost: option.nonEssentialCost,
    incomeReceived: tempIncomeToRecord,
    conditionalTriggered,
    billsPaidOff,
    debtAdded,
    unpaidBillsAfter: nextUnpaidBills,
    cashAfter: nextCash,
    debtAfter: nextDebt,
    jobProgressAfter: nextJobProgress,
    essentialsScoreAfter: nextEssentialsScore,
    consequenceNote,
    vibeReaction: option.vibeReaction,
    confirmedAt: nowIso,
  };

  return {
    applied: true,
    reason: 'ok',
    state: {
      ...state,
      cash: nextCash,
      totalEssentialSpent: state.totalEssentialSpent + option.essentialCost + billsPaidOff,
      totalNonEssentialSpent: state.totalNonEssentialSpent + option.nonEssentialCost,
      totalTempIncome: state.totalTempIncome + tempIncomeToRecord,
      debt: nextDebt,
      unpaidBills: nextUnpaidBills,
      jobSearchProgress: nextJobProgress,
      essentialsScore: nextEssentialsScore,
      essentialsMissed: nextEssentialsMissed,
      usedRiskyDebt: nextUsedRiskyDebt,
      history: [...state.history, record],
      updatedAt: nowIso,
    },
  };
}

export function evaluateJobLossOutcome(state: JobLossGameState): JobLossOutcomeSummary {
  const {
    cash,
    debt,
    unpaidBills,
    jobSearchProgress,
    essentialsScore,
    essentialsMissed,
    usedRiskyDebt,
  } = state;

  // Never count starving, unpaid essential collapse, or risky debt as success
  if (
    usedRiskyDebt ||
    debt > JOB_LOSS_CONFIG.maxSurvivedDebt ||
    unpaidBills > JOB_LOSS_CONFIG.maxSurvivedUnpaidBills ||
    essentialsScore < JOB_LOSS_CONFIG.minSurvivedEssentials ||
    essentialsMissed >= 2
  ) {
    return {
      type: 'need_rebuild',
      badgeText: 'Cần xây dựng lại kế hoạch',
      title: 'Kế hoạch 30 ngày đang gặp rủi ro tài chính lớn!',
      summary: usedRiskyDebt
        ? `Khoản vay nóng rủi ro khiến bạn mang nợ ${formatJobLossVnd(debt)}. Hãy ưu tiên cắt chi không thiết yếu và kiếm thu nhập tạm thay vì vay lãi cao.`
        : essentialsMissed >= 2 || essentialsScore < JOB_LOSS_CONFIG.minSurvivedEssentials
        ? `Mức đáp ứng nhu cầu thiết yếu giảm xuống ${essentialsScore}/100 (bỏ qua ${essentialsMissed} chặng). Không thể coi việc bỏ ăn hay bỏ bê sức khỏe là vượt khó thành công.`
        : `Bạn kết thúc 30 ngày với nợ ${formatJobLossVnd(debt)} và hóa đơn chưa thanh toán ${formatJobLossVnd(unpaidBills)}. Cần sắp xếp lại thứ tự ưu tiên chi tiêu ngay.`,
      vibeClosing:
        'Đừng lo, đây là mô phỏng để tập dượt trước rủi ro thật! Xem lại 6 chặng để thấy quyết định nào làm thủng quỹ rồi thử lại nha!',
      takeaway:
        'Bài học: Khi mất thu nhập, hãy cắt ngay khoản "Muốn", bảo vệ sức khỏe + chỗ ở, tuyệt đối tránh vay nóng và chủ động tạo dòng tiền tạm thời.',
    };
  }

  if (
    debt === 0 &&
    unpaidBills === 0 &&
    essentialsMissed === 0 &&
    essentialsScore >= JOB_LOSS_CONFIG.minStrongRecoveryEssentials &&
    cash >= JOB_LOSS_CONFIG.minStrongRecoveryCash &&
    jobSearchProgress >= JOB_LOSS_CONFIG.minStrongRecoveryJobProgress
  ) {
    return {
      type: 'strong_recovery',
      badgeText: 'Vượt khó tốt',
      title: 'Xuất sắc! Bạn đã giữ vững tài chính suốt 30 ngày!',
      summary: `Bạn bảo toàn ${formatJobLossVnd(cash)} quỹ dự phòng, 0 đ nợ, 0 đ hóa đơn tồn, đáp ứng trọn vẹn nhu cầu thiết yếu (${essentialsScore}/100) và đạt ${jobSearchProgress}% tiến độ tìm việc mới!`,
      vibeClosing:
        'Quá bản lĩnh chủ nhân ơi! Khi có quỹ dự phòng và kỷ luật chi tiêu, cú sốc mất việc không thể làm gục ngã bạn được!',
      takeaway:
        'Bài học: Quỹ dự phòng 3–6 tháng chi phí thiết yếu kết hợp với kỹ năng tìm thu nhập cầu nối là lá chắn an toàn nhất trước biến cố nghề nghiệp.',
    };
  }

  return {
    type: 'survived_strengthen',
    badgeText: 'Vượt qua nhưng cần củng cố tài chính',
    title: 'Bạn đã vượt qua 30 ngày đầu, nhưng lớp đệm còn mỏng!',
    summary: `Tiền mặt còn ${formatJobLossVnd(cash)}, nợ ${formatJobLossVnd(debt)}, hóa đơn còn nợ ${formatJobLossVnd(unpaidBills)} và tiến độ tìm việc ${jobSearchProgress}%. Bạn cần tiếp tục củng cố quỹ dự phòng và đẩy nhanh kế hoạch thu nhập.`,
    vibeClosing:
      'Đi qua được tháng đầu tiên là đáng khích lệ rồi! Tối ưu thêm 1–2 chặng là bạn sẽ đạt mức Vượt khó tốt ngay!',
    takeaway:
      'Bài học: Ngoài việc trụ qua tháng đầu, hãy giữ tiến độ tìm việc đều đặn và thanh toán gọn hóa đơn cố định để không dồn áp lực sang tháng sau.',
  };
}

export interface AdvanceJobLossResult {
  advanced: boolean;
  reason: 'ok' | 'not-playing' | 'stage-not-confirmed';
  state: JobLossGameState;
}

export function advanceJobLossStage(
  state: JobLossGameState,
  nowIso: string = new Date().toISOString()
): AdvanceJobLossResult {
  if (state.status !== 'playing') {
    return { advanced: false, reason: 'not-playing', state };
  }
  if (!state.history.some((r) => r.stageNumber === state.currentStage)) {
    return { advanced: false, reason: 'stage-not-confirmed', state };
  }

  if (state.currentStage >= JOB_LOSS_CONFIG.totalStages) {
    const outcome = evaluateJobLossOutcome(state).type;
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
      currentStage: state.currentStage + 1,
      updatedAt: nowIso,
    },
  };
}

export function validateJobLossState(raw: unknown): JobLossGameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (obj.version !== JOB_LOSS_CONFIG.storageVersion) return null;
  if (typeof obj.runId !== 'string' || obj.runId.trim().length === 0) return null;
  if (obj.status !== 'intro' && obj.status !== 'playing' && obj.status !== 'completed') {
    return null;
  }
  if (
    typeof obj.currentStage !== 'number' ||
    !Number.isInteger(obj.currentStage) ||
    obj.currentStage < 1 ||
    obj.currentStage > JOB_LOSS_CONFIG.totalStages
  ) {
    return null;
  }
  const intNonNegFields = [
    'cash',
    'totalEssentialSpent',
    'totalNonEssentialSpent',
    'totalTempIncome',
    'debt',
    'unpaidBills',
    'essentialsMissed',
  ] as const;
  for (const field of intNonNegFields) {
    const val = obj[field];
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) return null;
  }
  if (
    typeof obj.jobSearchProgress !== 'number' ||
    !Number.isInteger(obj.jobSearchProgress) ||
    obj.jobSearchProgress < 0 ||
    obj.jobSearchProgress > 100
  ) {
    return null;
  }
  if (
    typeof obj.essentialsScore !== 'number' ||
    !Number.isInteger(obj.essentialsScore) ||
    obj.essentialsScore < 0 ||
    obj.essentialsScore > 100
  ) {
    return null;
  }
  if (typeof obj.usedRiskyDebt !== 'boolean') return null;
  if (!Array.isArray(obj.history) || obj.history.length > JOB_LOSS_CONFIG.totalStages) return null;

  const seen = new Set<number>();
  for (const item of obj.history) {
    if (!item || typeof item !== 'object') return null;
    const rec = item as Record<string, unknown>;
    if (
      typeof rec.stageNumber !== 'number' ||
      !Number.isInteger(rec.stageNumber) ||
      rec.stageNumber < 1 ||
      rec.stageNumber > JOB_LOSS_CONFIG.totalStages ||
      seen.has(rec.stageNumber)
    ) {
      return null;
    }
    seen.add(rec.stageNumber);
    if (rec.optionId !== 'A' && rec.optionId !== 'B' && rec.optionId !== 'C') return null;
  }

  if (obj.status === 'completed' && obj.history.length !== JOB_LOSS_CONFIG.totalStages) return null;
  if (
    obj.outcome !== null &&
    obj.outcome !== 'strong_recovery' &&
    obj.outcome !== 'survived_strengthen' &&
    obj.outcome !== 'need_rebuild'
  ) {
    return null;
  }
  if (typeof obj.startedAt !== 'string' || typeof obj.updatedAt !== 'string') return null;

  return obj as unknown as JobLossGameState;
}
