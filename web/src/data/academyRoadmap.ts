export type RoadmapInteractionType = 'quiz' | 'calculation' | 'classification';

export interface RoadmapQuizInteraction {
  type: 'quiz';
  prompt: string;
  options: { id: 'A' | 'B' | 'C'; text: string }[];
  correctOptionId: 'A' | 'B' | 'C';
  explanation: string;
}

export interface RoadmapCalculationInteraction {
  type: 'calculation';
  prompt: string;
  formulaHint: string;
  options: { id: string; label: string; value: number }[];
  correctValue: number;
  explanation: string;
}

export interface ClassificationItem {
  id: string;
  label: string;
  detail: string;
  correctCategory: 'need' | 'want';
  explanation: string;
}

export interface RoadmapClassificationInteraction {
  type: 'classification';
  prompt: string;
  categoryALabel?: string;
  categoryBLabel?: string;
  items: ClassificationItem[];
  summaryExplanation: string;
}

export type RoadmapLessonInteraction =
  | RoadmapQuizInteraction
  | RoadmapCalculationInteraction
  | RoadmapClassificationInteraction;

export interface RoadmapLessonContent {
  objectives: string[];
  paragraphs: string[];
  exampleTitle: string;
  exampleBody: string;
  vibeQuote: string;
  interaction: RoadmapLessonInteraction;
}

export interface RoadmapDay {
  /** Firestore document ID — kept as 'day-1'..'day-90' for compatibility with deployed Rules & existing progress */
  lessonId: string;
  /** Lesson sequence number (1..90) — stored as dayNumber in Firestore */
  dayNumber: number;
  /** Chapter ID (1..4) — stored as stageId in Firestore */
  stageId: 1 | 2 | 3 | 4;
  title: string;
  shortDescription: string;
  durationMinutes: number;
  /** True ONLY when full interactive lesson content is complete (never time-locked) */
  isAvailable: boolean;
  content?: RoadmapLessonContent;
}

export interface RoadmapStage {
  id: 1 | 2 | 3 | 4;
  label: string;
  title: string;
  dayStart: number;
  dayEnd: number;
  description: string;
  isUnlockedByDefault: boolean;
  unlockRequirementText: string;
}

export const ROADMAP_STAGES: readonly RoadmapStage[] = [
  {
    id: 1,
    label: 'Chương 1',
    title: 'Tiền đi đâu hết rồi?',
    dayStart: 1,
    dayEnd: 15,
    description:
      'Thu nhập, chi tiêu, ghi chép giao dịch, phân loại nhu cầu và nhận diện thói quen tiêu dùng.',
    isUnlockedByDefault: true,
    unlockRequirementText: 'Mở sẵn — học tự do theo tốc độ của bạn',
  },
  {
    id: 2,
    label: 'Chương 2',
    title: 'Shopee gọi, lý trí có nghe?',
    dayStart: 16,
    dayEnd: 30,
    description:
      'Ngân sách, quy tắc 50/30/20, mua sắm thông minh và kiểm soát chi tiêu cảm xúc.',
    isUnlockedByDefault: false,
    unlockRequirementText: 'Hoàn thành đủ 15/15 bài Chương 1 để mở khóa',
  },
  {
    id: 3,
    label: 'Chương 3',
    title: 'Cuối tháng không ăn mì gói',
    dayStart: 31,
    dayEnd: 60,
    description:
      'Tiết kiệm, quỹ dự phòng khẩn cấp, kiểm soát nợ và sử dụng thẻ tín dụng an toàn.',
    isUnlockedByDefault: false,
    unlockRequirementText: 'Hoàn thành đủ 15/15 bài Chương 2 để mở khóa',
  },
  {
    id: 4,
    label: 'Chương 4',
    title: 'Ví chưa giàu nhưng đã trưởng thành',
    dayStart: 61,
    dayEnd: 90,
    description:
      'Tích lũy, mục tiêu dài hạn, kiến thức đầu tư cơ bản và kế hoạch tài chính cá nhân.',
    isUnlockedByDefault: false,
    unlockRequirementText: 'Hoàn thành đủ 30/30 bài Chương 3 để mở khóa',
  },
];

const CHAPTER_1_LESSONS: Record<number, RoadmapDay> = {
  1: {
    lessonId: 'day-1',
    dayNumber: 1,
    stageId: 1,
    title: 'Tiền đi đâu hết rồi?',
    shortDescription: 'Hiểu vì sao cần ghi chép thu nhập và chi tiêu mỗi ngày.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu vì sao tiền thường hao hụt nhanh dù không mua món đồ lớn.',
        'Nắm rõ lợi ích của việc ghi chép thu nhập và chi tiêu hằng ngày.',
        'Hình thành thói quen theo dõi dòng tiền 1 phút mỗi ngày cùng MoneyCare.',
      ],
      paragraphs: [
        'Rất nhiều người có cảm giác lương hoặc tiền sinh hoạt vừa về đầu tháng đã cạn dần mà không biết đã tiêu vào việc gì. Nguyên nhân không nằm ở trí nhớ kém, mà vì não bộ thường bỏ quên các khoản chi nhỏ lẻ phát sinh mỗi ngày.',
        'Khi bạn bắt đầu ghi chép đầy đủ thu nhập và chi tiêu, bức tranh dòng tiền sẽ hiện ra rõ ràng. Bạn không thể quản lý tốt thứ mà mình không đo lường được — ghi chép chính là bước đầu tiên giúp bạn làm chủ chiếc ví của mình.',
      ],
      exampleTitle: 'Ví dụ thực tế: 3 triệu đồng đi đâu mất?',
      exampleBody:
        'Một sinh viên nhận 3.000.000 đ mỗi tháng từ gia đình và việc làm thêm. Sau khi đóng tiền trọ 1.200.000 đ, bạn còn 1.800.000 đ cho sinh hoạt. Nhưng đến ngày 20, trong ví chỉ còn 150.000 đ mà bạn hoàn toàn không nhớ đã tiêu gì. Khi nhìn lại lịch sử chuyển khoản và hóa đơn, hóa ra hơn 700.000 đ đã đi vào trà sữa, phí ship đồ ăn, ăn vặt và các món đồ nhỏ mua ngẫu hứng.',
      vibeQuote: 'Tiền không tự biến mất, chỉ là mình chưa ghi lại thôi!',
      interaction: {
        type: 'quiz',
        prompt:
          'Với tình huống sinh viên có 3.000.000 đ/tháng nhưng chưa hết tháng đã cạn tiền mà không rõ lý do, bước đầu tiên hợp lý nhất là gì?',
        options: [
          {
            id: 'A',
            text: 'Cố gắng nhớ nhẩm lại trong đầu vào cuối tháng.',
          },
          {
            id: 'B',
            text: 'Ghi chép lại mọi khoản thu và chi mỗi ngày để nhìn rõ tiền đang đi đâu.',
          },
          {
            id: 'C',
            text: 'Nhịn ăn uống đột ngột mà không cần kiểm tra các khoản chi trước đó.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Ghi chép thu chi hằng ngày giúp bạn nhìn thấy chính xác các khoản chi nhỏ đang làm hao hụt ngân sách. Khi đã có số liệu thật, bạn mới biết cần điều chỉnh danh mục nào một cách hợp lý và bền vững.',
      },
    },
  },
  2: {
    lessonId: 'day-2',
    dayNumber: 2,
    stageId: 1,
    title: 'Cà phê 30k, một tháng thành bao nhiêu?',
    shortDescription: 'Nhận diện tác động tích lũy của những khoản chi nhỏ lặp lại.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Nhận diện các khoản chi nhỏ lặp lại hằng ngày dễ bị xem nhẹ.',
        'Tính chính xác tổng chi phí theo tháng từ một thói quen chi tiêu nhỏ.',
        'Biết cách chọn tần suất chi tiêu phù hợp ngân sách mà vẫn thoải mái.',
      ],
      paragraphs: [
        'Một ly cà phê hay trà sữa giá 30.000 đ nghe rất nhẹ nhàng ở thời điểm rút ví. Tuy nhiên, điều tạo ra khác biệt lớn trong tài chính cá nhân không chỉ là các khoản mua sắm đắt tiền, mà chính là những khoản nhỏ lặp lại đều đặn mỗi ngày.',
        'Điều quan trọng cần nhớ: không phải mọi khoản cà phê đều xấu! Uống cà phê giúp bạn tỉnh táo, gặp gỡ bạn bè hoặc thư giãn. Mục tiêu của bài học là giúp bạn nhìn rõ tổng chi phí thực tế trong một tháng để chủ động điều chỉnh tần suất phù hợp với ngân sách của mình.',
      ],
      exampleTitle: 'Bài toán nhỏ từ thói quen mỗi sáng',
      exampleBody:
        'Giả sử mỗi ngày bạn chi 30.000 đ cho một ly cà phê sáng và duy trì đều đặn suốt 30 ngày trong tháng. Nếu biết trước tổng số tiền này, bạn có thể quyết định giữ nguyên, giảm xuống 3–4 buổi/tuần, hoặc tự pha vài ngày để tiết kiệm thêm cho mục tiêu khác.',
      vibeQuote: '30k nghe nhỏ, nhưng 30 lần thì ví bắt đầu họp khẩn!',
      interaction: {
        type: 'calculation',
        prompt:
          'Nếu bạn chi 30.000 đ cho cà phê mỗi ngày trong suốt 30 ngày, tổng số tiền sau 1 tháng là bao nhiêu?',
        formulaHint: 'Gợi ý phép tính: 30.000 đ × 30 ngày',
        options: [
          { id: 'opt-300', label: '300.000 đ', value: 300000 },
          { id: 'opt-600', label: '600.000 đ', value: 600000 },
          { id: 'opt-900', label: '900.000 đ', value: 900000 },
          { id: 'opt-1200', label: '1.200.000 đ', value: 1200000 },
        ],
        correctValue: 900000,
        explanation:
          'Chính xác: 30.000 đ × 30 ngày = 900.000 đ mỗi tháng (tương đương 10.800.000 đ/năm). Bạn không cần cắt bỏ hoàn toàn cà phê, chỉ cần nắm rõ con số 900.000 đ này để chọn mức chi cân đối với thu nhập của mình.',
      },
    },
  },
  3: {
    lessonId: 'day-3',
    dayNumber: 3,
    stageId: 1,
    title: 'Cần hay muốn?',
    shortDescription: 'Phân biệt nhu cầu thiết yếu và mong muốn cá nhân trước khi chi.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Phân biệt rõ ràng giữa Nhu cầu thiết yếu (Cần) và Mong muốn (Muốn).',
        'Thực hành phân loại các khoản chi phổ biến trong đời sống hằng ngày.',
        'Ưu tiên nhóm Cần trước khi phân bổ tiền cho nhóm Muốn.',
      ],
      paragraphs: [
        'Nhu cầu thiết yếu (Cần) là những khoản chi bắt buộc để duy trì cuộc sống cơ bản, sức khỏe và khả năng học tập/làm việc — ví dụ như nơi ở, ăn uống cơ bản, đi lại thiết yếu và thuốc men.',
        'Mong muốn (Muốn) là những khoản chi mang lại sự tiện nghi, giải trí hoặc niềm vui thêm — như mua thêm giày mới khi vẫn còn giày dùng tốt, nâng cấp đồ công nghệ hoặc đăng ký nhiều gói giải trí. Nhóm Muốn không xấu, nhưng cần được chi sau khi nhóm Cần và tiết kiệm đã an toàn.',
      ],
      exampleTitle: 'Nguyên tắc ưu tiên trước khi thanh toán',
      exampleBody:
        'Trước khi quyết định chi một khoản tiền, hãy tự hỏi trong 10 giây: "Nếu chưa mua khoản này trong tuần tới, cuộc sống hoặc công việc của mình có bị ảnh hưởng nghiêm trọng không?" Nếu câu trả lời là Không, đó thường thuộc nhóm Muốn.',
      vibeQuote: 'Chủ nhân ghi chép chi tiêu rồi! Ví Bé cảm động quá.',
      interaction: {
        type: 'classification',
        prompt:
          'Hãy phân loại 4 khoản chi quen thuộc dưới đây vào nhóm "Cần" (thiết yếu) hoặc "Muốn" (mong muốn):',
        categoryALabel: 'Cần (Thiết yếu)',
        categoryBLabel: 'Muốn (Mong muốn)',
        items: [
          {
            id: 'rent',
            label: 'Tiền trọ hằng tháng',
            detail: 'Chi phí chỗ ở cố định mỗi tháng',
            correctCategory: 'need',
            explanation:
              'Tiền trọ là nhu cầu chỗ ở bắt buộc để sinh hoạt và học tập/làm việc → thuộc nhóm Cần.',
          },
          {
            id: 'food',
            label: 'Ăn uống cơ bản hằng ngày',
            detail: 'Các bữa cơm hằng ngày đảm bảo sức khỏe',
            correctCategory: 'need',
            explanation:
              'Ăn uống cơ bản giúp duy trì sức khỏe và năng lượng mỗi ngày → thuộc nhóm Cần.',
          },
          {
            id: 'shoes',
            label: 'Mua thêm đôi giày mới',
            detail: 'Đang giảm giá dù bạn vẫn có giày đi tốt',
            correctCategory: 'want',
            explanation:
              'Khi đã có giày dùng ổn, việc mua thêm vì thích hoặc thấy khuyến mãi có thể trì hoãn → thuộc nhóm Muốn.',
          },
          {
            id: 'streaming',
            label: 'Đăng ký dịch vụ giải trí',
            detail: 'Gói xem phim / nghe nhạc trả phí hằng tháng',
            correctCategory: 'want',
            explanation:
              'Dịch vụ giải trí giúp thư giãn nhưng không bắt buộc để duy trì cuộc sống cơ bản → thuộc nhóm Muốn.',
          },
        ],
        summaryExplanation:
          'Phân biệt đúng Cần và Muốn giúp bạn bảo vệ các khoản sống còn trước, sau đó mới phân bổ một phần ngân sách hợp lý cho sở thích cá nhân.',
      },
    },
  },
  4: {
    lessonId: 'day-4',
    dayNumber: 4,
    stageId: 1,
    title: 'Thu nhập thực nhận là bao nhiêu?',
    shortDescription: 'Phân biệt lương hợp đồng (Gross) và số tiền thực sự về tài khoản (Net).',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu rõ sự khác biệt giữa lương Gross và thu nhập thực nhận (Net).',
        'Biết cách tổng hợp đầy đủ các nguồn thu nhập ổn định và không ổn định.',
        'Lập kế hoạch chi tiêu dựa trên số tiền thực sự cầm trong tay.',
      ],
      paragraphs: [
        'Một sai lầm phổ biến của người mới đi làm là lập kế hoạch chi tiêu dựa trên mức lương ghi trên hợp đồng (lương Gross). Trên thực tế, trước khi tiền về tài khoản, bạn sẽ phải trích 10,5% cho bảo hiểm bắt buộc (BHXH, BHYT, BHTN) và thuế TNCN nếu đến ngưỡng.',
        'Ngoài ra, nếu bạn có thêm thu nhập phụ (làm thêm, thưởng doanh số, freelance), hãy tách riêng phần thu ổn định để lo chi phí sống, còn phần thu thất thường ưu tiên cho tiết kiệm hoặc mục tiêu riêng.',
      ],
      exampleTitle: 'Ví dụ thực tế: Lương 10 triệu nhưng thực nhận bao nhiêu?',
      exampleBody:
        'Anh Huy ký hợp đồng lương Gross 10.000.000 đ/tháng tại Hà Nội. Sau khi trừ 10,5% bảo hiểm bắt buộc (1.050.000 đ), số tiền thực nhận về tài khoản mỗi tháng là 8.950.000 đ. Nếu anh Huy chia chi tiêu dựa trên mốc 10.000.000 đ, mỗi tháng anh sẽ hụt ngay hơn 1.000.000 đ.',
      vibeQuote: 'Đếm tiền trong tài khoản, đừng đếm tiền trên giấy hợp đồng nhé!',
      interaction: {
        type: 'quiz',
        prompt:
          'Khi lập ngân sách chi tiêu hằng tháng trên MoneyCare, bạn nên dựa vào con số nào để không bị hụt tiền?',
        options: [
          {
            id: 'A',
            text: 'Tổng lương Gross ghi trên hợp đồng cộng thêm tiền thưởng dự kiến cuối năm.',
          },
          {
            id: 'B',
            text: 'Thu nhập thực nhận (Net) thực sự chuyển vào tài khoản hằng tháng.',
          },
          {
            id: 'C',
            text: 'Hạn mức thẻ tín dụng mà ngân hàng vừa cấp cho bạn.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Thu nhập thực nhận (Net) là số tiền thực tế bạn có quyền chi tiêu và tiết kiệm. Dùng hạn mức thẻ tín dụng hay lương Gross làm chuẩn chi tiêu rất dễ dẫn đến thâm hụt cuối tháng.',
      },
    },
  },
  5: {
    lessonId: 'day-5',
    dayNumber: 5,
    stageId: 1,
    title: 'Phân loại giao dịch để đọc biểu đồ rõ ràng',
    shortDescription: 'Sắp xếp khoản chi vào đúng danh mục thay vì gom hết vào "Chi khác".',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu tác hại của việc dồn mọi giao dịch vào mục "Chi khác".',
        'Biết cách chọn đúng danh mục chi tiêu quen thuộc trên MoneyCare.',
        'Đọc nhanh biểu đồ thống kê cuối tháng để phát hiện nhóm chi vượt mức.',
      ],
      paragraphs: [
        'Ghi chép số tiền đã tốt, nhưng nếu 70% giao dịch đều gắn nhãn "Chi khác" thì cuối tháng bạn vẫn không biết mình cần tối ưu điều gì. Phân loại đúng danh mục giúp biểu đồ tròn ở mục Thống kê trở thành chiếc gương phản chiếu trung thực lối sống của bạn.',
        'Bạn không cần tạo hàng chục danh mục phức tạp. Chỉ cần bám đều 8 nhóm cơ bản trên MoneyCare (Ăn uống, Tiền trọ, Di chuyển, Hóa đơn, Mua sắm, Giải trí, Sức khỏe, Chi khác) là đủ nhìn ra ngay khoản nào đang "ăn" nhiều ngân sách nhất.',
      ],
      exampleTitle: 'Ví dụ thực tế: Chiếc bánh "Chi khác" 4,5 triệu',
      exampleBody:
        'Bạn Nam chăm chỉ ghi chi tiêu suốt tháng 10 nhưng lười chọn danh mục nên bấm đại "Chi khác". Cuối tháng tổng chi 6.200.000 đ thì riêng "Chi khác" chiếm tới 4.500.000 đ. Khi ngồi tách lại từng khoản, Nam mới giật mình thấy ăn uống ngoài hàng và mua đồ công nghệ chiếm hơn nửa số đó.',
      vibeQuote: 'Gắn đúng danh mục, cuối tháng nhìn biểu đồ là hiểu ví mình liền!',
      interaction: {
        type: 'quiz',
        prompt:
          'Bạn vừa thanh toán 180.000 đ tiền đổ xăng + gửi xe tuần này và 250.000 đ tiền mua thuốc cảm. Cách ghi nhận nào giúp biểu đồ cuối tháng chính xác nhất?',
        options: [
          {
            id: 'A',
            text: 'Gộp chung thành 1 giao dịch 430.000 đ vào mục "Chi khác" cho nhanh.',
          },
          {
            id: 'B',
            text: 'Tách riêng 180.000 đ vào mục "Di chuyển" và 250.000 đ vào mục "Sức khỏe".',
          },
          {
            id: 'C',
            text: 'Không cần ghi tiền thuốc vì đây là khoản phát sinh bất ngờ.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Tách đúng danh mục Di chuyển và Sức khỏe giúp bạn nắm rõ chi phí đi lại hằng tháng và theo dõi được cả những khoản y tế đột xuất để dự phòng tốt hơn.',
      },
    },
  },
  6: {
    lessonId: 'day-6',
    dayNumber: 6,
    stageId: 1,
    title: 'Chi phí cố định và chi phí biến đổi',
    shortDescription: 'Phân biệt khoản bắt buộc trả đều mỗi tháng và khoản có thể điều chỉnh linh hoạt.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Phân biệt chính xác Chi phí cố định và Chi phí biến đổi.',
        'Biết nên cắt giảm nhóm chi phí nào trước khi ngân sách bị eo hẹp.',
        'Chủ động để riêng phần tiền cố định ngay đầu tháng.',
      ],
      paragraphs: [
        'Chi phí cố định là những khoản lặp lại đều đặn mỗi tháng với số tiền gần như không đổi — như tiền thuê trọ, phí gửi xe tháng, cước internet, tiền trả góp định kỳ. Nhóm này khó thay đổi trong ngắn hạn nên bạn cần giữ sẵn tiền ngay khi nhận lương.',
        'Chi phí biến đổi thay đổi theo lựa chọn hằng ngày của bạn — như ăn ngoài, cà phê, mua quần áo, đi chơi cuối tuần. Đây chính là "van điều chỉnh" linh hoạt nhất mỗi khi bạn muốn tiết kiệm nhanh hoặc cân đối lại ngân sách trong tháng.',
      ],
      exampleTitle: 'Ví dụ thực tế: Cân đối chi tiêu 6 triệu ở TP.HCM',
      exampleBody:
        'Thu Hà có ngân sách sinh hoạt 6.000.000 đ/tháng: tiền trọ 2.500.000 đ + gửi xe & Wi-Fi 350.000 đ là chi phí cố định (2.850.000 đ). Phần còn lại 3.150.000 đ là chi phí biến đổi cho ăn uống, đi lại và giải trí. Nhờ tách rõ hai nhóm, Hà không bao giờ tiêu lạm vào tiền trọ.',
      vibeQuote: 'Tiền cố định cất riêng một góc, phần biến đổi mới là sân chơi của bạn!',
      interaction: {
        type: 'classification',
        prompt:
          'Hãy phân loại 4 khoản chi dưới đây vào nhóm "Chi phí cố định" hoặc "Chi phí biến đổi":',
        categoryALabel: 'Chi phí cố định',
        categoryBLabel: 'Chi phí biến đổi',
        items: [
          {
            id: 'fixed-rent',
            label: 'Tiền thuê phòng trọ 2.500.000 đ',
            detail: 'Đóng đúng ngày 5 hằng tháng theo hợp đồng',
            correctCategory: 'need',
            explanation:
              'Tiền trọ đóng đều mỗi tháng theo hợp đồng cố định → Chi phí cố định.',
          },
          {
            id: 'fixed-wifi',
            label: 'Cước Wi-Fi & gửi xe tháng 300.000 đ',
            detail: 'Mức phí cố định mỗi tháng tại chung cư/nhà trọ',
            correctCategory: 'need',
            explanation:
              'Cước mạng và gửi xe tháng có mức thu ổn định mỗi kỳ → Chi phí cố định.',
          },
          {
            id: 'var-dining',
            label: 'Đi ăn lẩu nướng cùng bạn cuối tuần',
            detail: 'Chi phí thay đổi tùy số buổi đi chơi trong tháng',
            correctCategory: 'want',
            explanation:
              'Bạn có thể tăng giảm số buổi ăn ngoài tùy ngân sách → Chi phí biến đổi.',
          },
          {
            id: 'var-clothes',
            label: 'Mua sắm quần áo, phụ kiện online',
            detail: 'Phát sinh theo nhu cầu và lựa chọn từng tháng',
            correctCategory: 'want',
            explanation:
              'Khoản mua sắm linh hoạt, không cố định hằng tháng → Chi phí biến đổi.',
          },
        ],
        summaryExplanation:
          'Tách rõ chi phí cố định và biến đổi giúp bạn luôn bảo toàn được các hóa đơn bắt buộc, đồng thời biết ngay có thể điều chỉnh phần nào khi cần tiết kiệm.',
      },
    },
  },
  7: {
    lessonId: 'day-7',
    dayNumber: 7,
    stageId: 1,
    title: 'Bẫy phí ship và các khoản phụ phí ẩn',
    shortDescription: 'Tính tổng những khoản phí nhỏ đi kèm mỗi lần đặt đồ ăn hay chuyển khoản.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Nhận ra các khoản phụ phí âm thầm làm đội giá thực tế của đơn hàng.',
        'Biết tính tổng phí giao hàng và phí dịch vụ trong cả tháng.',
        'Áp dụng 2 cách đơn giản để giảm phí ship mà không bất tiện.',
      ],
      paragraphs: [
        'Một phần cơm trưa giá niêm yết 35.000 đ nhưng khi bấm đặt qua ứng dụng giao đồ ăn thường cộng thêm phí giao hàng, phí đơn nhỏ và phí nền tảng — tổng thanh toán dễ lên 55.000–60.000 đ. Sự chênh lệch 20.000–25.000 đ mỗi đơn tưởng nhỏ nhưng lặp lại nhiều lần sẽ thành khoản tiền lớn.',
        'Bạn có thể giảm đáng kể khoản rò rỉ này bằng cách gom đơn cùng đồng nghiệp/bạn cùng phòng, tự ghé mua trên đường về, hoặc chỉ đặt giao hàng vào những hôm thực sự bận rộn hay trời mưa.',
      ],
      exampleTitle: 'Ví dụ thực tế: Phí ship của dân văn phòng',
      exampleBody:
        'Trung bình mỗi tuần Minh đặt đồ ăn và trà sữa qua app 4 lần, mỗi đơn tốn trung bình 25.000 đ tiền phí ship và phí dịch vụ (chưa tính tiền đồ ăn). Trong 4 tuần (16 đơn/tháng), riêng tiền phí đã bằng cả một buổi mua thực phẩm cho cả tuần.',
      vibeQuote: 'Tiền ăn có 35k mà tiền ship thêm 25k, ví nhìn mà cay khóe mắt!',
      interaction: {
        type: 'calculation',
        prompt:
          'Nếu bạn đặt giao hàng 16 đơn mỗi tháng và mỗi đơn tốn trung bình 25.000 đ tiền phí ship + phí dịch vụ, tổng tiền phí 1 tháng là bao nhiêu?',
        formulaHint: 'Gợi ý phép tính: 25.000 đ × 16 đơn',
        options: [
          { id: 'ship-200', label: '200.000 đ', value: 200000 },
          { id: 'ship-300', label: '300.000 đ', value: 300000 },
          { id: 'ship-400', label: '400.000 đ', value: 400000 },
          { id: 'ship-550', label: '550.000 đ', value: 550000 },
        ],
        correctValue: 400000,
        explanation:
          'Chính xác: 25.000 đ × 16 đơn = 400.000 đ mỗi tháng (4.800.000 đ/năm) chỉ riêng cho tiền phí! Chỉ cần gom đơn chung hoặc tự đi mua một nửa số lần, bạn đã giữ lại ngay 200.000 đ mỗi tháng.',
      },
    },
  },
  8: {
    lessonId: 'day-8',
    dayNumber: 8,
    stageId: 1,
    title: 'Tự nấu hay ăn ngoài — Tính thử mới biết',
    shortDescription: 'So sánh chi phí thực tế giữa ăn ngoài hoàn toàn và kết hợp tự nấu linh hoạt.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Tính được mức chênh lệch chi phí ăn uống hằng tháng giữa ăn ngoài và tự nấu.',
        'Chọn mô hình ăn uống cân bằng giữa tiền bạc, thời gian và sức khỏe.',
        'Tránh bẫy mua quá nhiều nguyên liệu tự nấu rồi bỏ phí trong tủ lạnh.',
      ],
      paragraphs: [
        'Ăn uống thường là khoản chi biến đổi lớn nhất của sinh viên và người đi làm. Nếu ăn ngoài đủ 3 bữa mỗi ngày tại thành phố lớn, chi phí dễ chạm 120.000–150.000 đ/ngày. Trong khi đó, tự nấu đơn giản bữa tối và mang cơm trưa có thể giảm chi phí xuống còn khoảng 60.000–75.000 đ/ngày.',
        'Bạn không nhất thiết phải tự nấu 100% nếu lịch học/làm quá bận. Chỉ cần tự nấu 4–5 ngày trong tuần (20 ngày/tháng) và dành cuối tuần ăn ngoài thoải mái, bạn vừa tiết kiệm đáng kể vừa giữ được niềm vui ăn uống.',
      ],
      exampleTitle: 'Ví dụ thực tế: Mang cơm trưa 20 ngày đi làm',
      exampleBody:
        'Chị Thảo trước đây ăn sáng, ăn trưa và ăn tối ngoài hàng hết khoảng 120.000 đ/ngày. Khi chuyển sang tự nấu cơm tối và mang theo hộp cơm trưa vào 20 ngày đi làm trong tháng, chi phí ăn uống ngày đi làm giảm còn 70.000 đ/ngày — tiết kiệm được 50.000 đ mỗi ngày.',
      vibeQuote: 'Tự nấu vài bữa không chỉ tốt cho ví mà còn tốt cho chiếc bụng nữa!',
      interaction: {
        type: 'calculation',
        prompt:
          'Nếu kết hợp tự nấu giúp bạn giảm chi ăn uống từ 120.000 đ xuống 70.000 đ/ngày (tiết kiệm 50.000 đ/ngày) trong 20 ngày làm việc, một tháng bạn tiết kiệm được bao nhiêu?',
        formulaHint: 'Gợi ý phép tính: 50.000 đ × 20 ngày',
        options: [
          { id: 'cook-500', label: '500.000 đ', value: 500000 },
          { id: 'cook-800', label: '800.000 đ', value: 800000 },
          { id: 'cook-1000', label: '1.000.000 đ', value: 1000000 },
          { id: 'cook-1500', label: '1.500.000 đ', value: 1500000 },
        ],
        correctValue: 1000000,
        explanation:
          'Chính xác: 50.000 đ × 20 ngày = 1.000.000 đ mỗi tháng — và bạn vẫn hoàn toàn thoải mái ăn ngoài vào 10 ngày cuối tuần còn lại!',
      },
    },
  },
  9: {
    lessonId: 'day-9',
    dayNumber: 9,
    stageId: 1,
    title: 'Đi siêu thị đừng để bụng đói',
    shortDescription: 'Mẹo đi chợ và siêu thị giúp mua đúng thứ cần, tránh hóa đơn tăng gấp đôi.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu vì sao đi siêu thị lúc đói bụng dễ khiến hóa đơn vượt ngân sách.',
        'Áp dụng thói quen lập danh sách mua sắm (Shopping List) trước khi ra khỏi nhà.',
        'Giảm lãng phí thực phẩm hết hạn trong tủ lạnh.',
      ],
      paragraphs: [
        'Siêu thị được thiết kế rất khéo để kích thích giác quan: quầy bánh nóng, snack và nước giải khát luôn đặt ở tầm mắt và ngay cạnh quầy thanh toán. Khi bạn đi mua đồ với cái bụng đói, não bộ sẽ ưu tiên cảm giác thèm ăn tức thì và dễ nhặt thêm nhiều món không có trong kế hoạch.',
        'Trước khi đi chợ hoặc siêu thị, hãy mở tủ lạnh kiểm tra đồ còn sẵn, lên danh sách đúng những món cần mua cho 3–5 ngày và ăn nhẹ trước khi đi. Chỉ một thói quen nhỏ này có thể giúp bạn giảm 20–30% hóa đơn thực phẩm.',
      ],
      exampleTitle: 'Ví dụ thực tế: Hóa đơn 200k hóa thành 520k lúc 18h',
      exampleBody:
        'Chị Lan tan làm lúc 18h đang rất đói nên ghé siêu thị dự định mua thịt, rau và trứng hết khoảng 200.000 đ. Nhưng đi ngang quầy đồ ăn sẵn, bánh ngọt và trà sữa đóng chai, chị nhặt thêm nhiều món nên ra quầy tính tiền hết 520.000 đ — một phần đồ tươi sau đó còn bị quên đến hỏng trong tủ lạnh.',
      vibeQuote: 'Đi siêu thị lúc đói là một môn thể thao mạo hiểm cho chiếc ví!',
      interaction: {
        type: 'quiz',
        prompt:
          'Cách nào dưới đây giúp bạn kiểm soát hóa đơn đi siêu thị hiệu quả nhất?',
        options: [
          {
            id: 'A',
            text: 'Đi siêu thị lúc thật đói để có nhiều cảm hứng nấu ăn.',
          },
          {
            id: 'B',
            text: 'Kiểm tra tủ lạnh, lập sẵn danh sách cần mua và ăn nhẹ trước khi đi.',
          },
          {
            id: 'C',
            text: 'Cứ thấy thực phẩm giảm giá 30% là mua tích trữ thật nhiều dù chưa lên thực đơn.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Lập danh sách sẵn và đi siêu thị khi bụng không đói giúp bạn mua đúng món cần thiết, tránh mua bốc đồng đồ ăn vặt và hạn chế lãng phí đồ hỏng.',
      },
    },
  },
  10: {
    lessonId: 'day-10',
    dayNumber: 10,
    stageId: 1,
    title: 'Chi tiêu theo cảm xúc (Emotional Spending)',
    shortDescription: 'Nhận diện những lúc buồn, mệt hay stress khiến bạn rút ví không kiểm soát.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Nhận diện các tín hiệu của việc mua sắm để giải tỏa cảm xúc.',
        'Hiểu vì sao niềm vui mua sắm bốc đồng thường qua rất nhanh nhưng áp lực tiền bạc ở lại lâu.',
        'Chuẩn bị sẵn 2–3 hoạt động xả stress miễn phí thay thế cho việc bấm "Đặt hàng".',
      ],
      paragraphs: [
        'Chi tiêu theo cảm xúc xảy ra khi bạn mua một món đồ không phải vì cần dùng, mà để lấp đầy cảm giác mệt mỏi, chán nản, căng thẳng hoặc áp lực sau giờ làm. Cảm giác hào hứng khi bấm nút thanh toán thường chỉ kéo dài vài giờ, nhưng số dư tài khoản giảm đi lại khiến bạn lo lắng hơn vào cuối tháng.',
        'Bước quan trọng nhất là nhận diện "giờ nguy hiểm" của bản thân (thường là buổi tối muộn sau 22h khi lướt điện thoại) và có sẵn danh sách cách xả stress tốn 0 đồng như đi bộ, nghe nhạc, tắm nước ấm hoặc trò chuyện với bạn bè.',
      ],
      exampleTitle: 'Ví dụ thực tế: 3 đơn hàng lúc 11h đêm vì áp lực deadline',
      exampleBody:
        'Tuần thi cuối kỳ căng thẳng, Minh có thói quen lướt sàn thương mại điện tử trước khi ngủ để "tự thưởng". Chỉ trong 5 tối, Minh đặt liền 3 đơn gồm đèn bàn trang trí, áo thun và cốc giữ nhiệt tổng 850.000 đ — đến khi nhận hàng mới thấy cả 3 món đều đã có sẵn ở nhà.',
      vibeQuote: 'Hôm nay mệt thì đi ngủ sớm nha chủ nhân, đừng rủ Ví Bé thức khuya chốt đơn!',
      interaction: {
        type: 'quiz',
        prompt:
          'Lúc 23h đêm sau một ngày rất mệt, bạn thấy mình đang chuẩn bị chốt đơn 450.000 đ đồ trang trí không thực sự cần. Hành động nào thông minh nhất?',
        options: [
          {
            id: 'A',
            text: 'Chốt đơn ngay để thấy vui rồi tháng sau tính tiếp.',
          },
          {
            id: 'B',
            text: 'Thoát ứng dụng mua sắm, lưu vào giỏ hàng nếu muốn và đi nghỉ ngơi; sáng mai tỉnh táo mới xem lại.',
          },
          {
            id: 'C',
            text: 'Mượn thẻ tín dụng mua thêm món khác để đủ điều kiện miễn phí vận chuyển.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Tạm dừng và rời khỏi ứng dụng mua sắm khi đang mệt mỏi giúp cảm xúc lắng xuống. Đa số các đơn hàng cảm xúc ban đêm đều không còn hấp dẫn vào sáng hôm sau.',
      },
    },
  },
  11: {
    lessonId: 'day-11',
    dayNumber: 11,
    stageId: 1,
    title: 'Quy tắc hoãn mua 48 giờ',
    shortDescription: 'Tạo khoảng nghỉ lý trí trước các món đồ không thiết yếu để tránh mua hớ.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Biết cách áp dụng quy tắc hoãn mua 48 giờ cho các khoản thuộc nhóm Muốn.',
        'Phân biệt giữa nhu cầu thật sự và cảm giác sợ bỏ lỡ (FOMO) khi thấy Flash Sale.',
        'Đưa ra quyết định mua sắm tự tin, không hối tiếc sau khi nhận hàng.',
      ],
      paragraphs: [
        'Các chương trình Flash Sale và đồng hồ đếm ngược được tạo ra để buộc bạn quyết định thật nhanh trước khi lý trí kịp lên tiếng. Quy tắc hoãn mua 48 giờ cực kỳ đơn giản: với mọi món đồ không thiết yếu (nhóm Muốn) có giá từ 200.000 đ trở lên, hãy bỏ vào giỏ và đợi đúng 48 giờ rồi mới quyết định.',
        'Nếu sau 2 ngày bạn vẫn thực sự cần, món đồ phù hợp với ngân sách tháng và bạn biết rõ sẽ dùng nó thường xuyên — hãy mua một cách vui vẻ. Ngược lại, nếu cơn thèm đã nguội đi, bạn vừa tiết kiệm 100% số tiền đó!',
      ],
      exampleTitle: 'Ví dụ thực tế: Chiếc tai nghe 650k đang giảm giá sốc',
      exampleBody:
        'An thấy một mẫu tai nghe mới giảm giá còn 650.000 đ chỉ trong 2 tiếng. Thay vì bấm mua ngay, An áp dụng quy tắc 48 giờ và tự hỏi: "Nếu không giảm giá mình có mua không?". Hai ngày sau, An nhận ra tai nghe hiện tại vẫn hoạt động tốt và giữ lại được 650.000 đ cho quỹ du lịch.',
      vibeQuote: 'Hết sale hôm nay còn sale mùng 1, giữa tháng, cuối tháng — đừng vội nha!',
      interaction: {
        type: 'quiz',
        prompt:
          'Bạn thấy một chiếc áo khoác giá 590.000 đ đang Flash Sale, nhưng trong tủ bạn đã có 3 chiếc áo khoác dùng tốt. Áp dụng quy tắc 48 giờ nghĩa là bạn nên làm gì?',
        options: [
          {
            id: 'A',
            text: 'Mua ngay lập tức vì sợ hết khung giờ Flash Sale.',
          },
          {
            id: 'B',
            text: 'Lưu lại sản phẩm, chờ 48 giờ và kiểm tra lại ngân sách mua sắm trước khi quyết định.',
          },
          {
            id: 'C',
            text: 'Mua hẳn 2 chiếc khác màu để tận dụng mã giảm giá lớn hơn.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Hoãn lại 48 giờ giúp bạn thoát khỏi bẫy FOMO của đồng hồ đếm ngược. Một món đồ giảm giá 40% mà bạn không thực sự dùng vẫn là mất 60% số tiền chứ không phải tiết kiệm.',
      },
    },
  },
  12: {
    lessonId: 'day-12',
    dayNumber: 12,
    stageId: 1,
    title: 'Rà soát các gói đăng ký trừ tiền âm thầm',
    shortDescription: 'Kiểm tra và cắt bỏ những gói thuê bao tự động gia hạn mà bạn ít dùng.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Biết cách kiểm tra định kỳ các khoản tự động trừ tiền từ thẻ và ví điện tử.',
        'Tính được chi phí cả năm của những gói đăng ký nhỏ lẻ bị bỏ quên.',
        'Chỉ giữ lại những gói dịch vụ mang lại giá trị sử dụng thường xuyên.',
      ],
      paragraphs: [
        'Ngày nay rất nhiều dịch vụ hoạt động theo mô hình gia hạn tự động hằng tháng: gói xem phim, nghe nhạc, lưu trữ đám mây, hội viên giao hàng, ứng dụng chỉnh ảnh hay thẻ tập gym. Vì mỗi gói chỉ 49.000–120.000 đ nên chúng trừ tiền rất êm mà bạn ít để ý.',
        'Hãy tạo thói quen 3 tháng một lần mở sao kê ngân hàng, App Store / Google Play và mục "Liên kết tự động" trên ví điện tử để hủy ngay những dịch vụ đã hơn 30 ngày không đụng tới.',
      ],
      exampleTitle: 'Ví dụ thực tế: 3 gói thuê bao bị lãng quên',
      exampleBody:
        'Hoàng kiểm tra sao kê mới phát hiện mỗi tháng thẻ tự động trừ: gói xem phim 70.000 đ (cả tháng mở 1 lần), gói nhạc 59.000 đ (trùng với gói gia đình) và gói ứng dụng học tập 121.000 đ đã ngưng dùng — tổng cộng 250.000 đ/tháng trôi đi vô ích.',
      vibeQuote: 'Gói nào không dùng thì hủy sớm, để nó tự trừ tiền là Ví Bé xót lắm!',
      interaction: {
        type: 'calculation',
        prompt:
          'Nếu bạn hủy được các gói đăng ký ít dùng có tổng phí 250.000 đ/tháng, sau 1 năm (12 tháng) bạn tiết kiệm được bao nhiêu tiền?',
        formulaHint: 'Gợi ý phép tính: 250.000 đ × 12 tháng',
        options: [
          { id: 'sub-1500', label: '1.500.000 đ', value: 1500000 },
          { id: 'sub-2400', label: '2.400.000 đ', value: 2400000 },
          { id: 'sub-3000', label: '3.000.000 đ', value: 3000000 },
          { id: 'sub-3600', label: '3.600.000 đ', value: 3600000 },
        ],
        correctValue: 3000000,
        explanation:
          'Chính xác: 250.000 đ × 12 tháng = 3.000.000 đ mỗi năm! Chỉ cần 10 phút rà soát sao kê định kỳ, bạn có thể tiết kiệm nguyên một khoản lớn mà không ảnh hưởng chất lượng cuộc sống.',
      },
    },
  },
  13: {
    lessonId: 'day-13',
    dayNumber: 13,
    stageId: 1,
    title: 'Tính chi phí sống tối thiểu 1 tháng',
    shortDescription: 'Xác định con số nền tảng cần có để duy trì cuộc sống cơ bản an toàn.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu ý nghĩa của "Chi phí sống tối thiểu 1 tháng" (Survival Number).',
        'Biết cách cộng đúng các nhóm chi bắt buộc để tìm ra con số của riêng mình.',
        'Dùng con số này làm nền tảng để thiết lập ngân sách và quỹ dự phòng sau này.',
      ],
      paragraphs: [
        'Chi phí sống tối thiểu 1 tháng là tổng số tiền ít nhất bạn cần để trang trải trọn vẹn các nhu cầu thiết yếu: chỗ ở, điện nước, ăn uống cơ bản, đi lại và liên lạc. Đây không phải mức sống kham khổ lâu dài, mà là "vạch an toàn" giúp bạn biết mình cần tối thiểu bao nhiêu tiền khi thu nhập biến động.',
        'Biết chính xác con số này giúp bạn bớt lo âu về tiền bạc, dễ dàng xây dựng hạn mức ngân sách tháng trên MoneyCare và tính chính xác quy mô quỹ dự phòng 3–6 tháng ở các chương tiếp theo.',
      ],
      exampleTitle: 'Ví dụ thực tế: Vạch an toàn của người trẻ đi làm',
      exampleBody:
        'Chi phí thiết yếu hằng tháng của Bảo gồm: tiền trọ 2.200.000 đ, ăn uống cơ bản 1.800.000 đ, điện nước & internet 400.000 đ, và chi phí đi lại + điện thoại 400.000 đ (chưa tính giải trí hay mua sắm).',
      vibeQuote: 'Biết rõ mức sống tối thiểu là biết ranh giới an toàn của bản thân!',
      interaction: {
        type: 'calculation',
        prompt:
          'Dựa theo bảng chi phí thiết yếu của Bảo ở trên (Trọ 2.200.000 đ + Ăn cơ bản 1.800.000 đ + Điện nước & mạng 400.000 đ + Đi lại & liên lạc 400.000 đ), chi phí sống tối thiểu 1 tháng là bao nhiêu?',
        formulaHint: 'Gợi ý: 2.200.000 + 1.800.000 + 400.000 + 400.000',
        options: [
          { id: 'surv-4200', label: '4.200.000 đ', value: 4200000 },
          { id: 'surv-4600', label: '4.600.000 đ', value: 4600000 },
          { id: 'surv-4800', label: '4.800.000 đ', value: 4800000 },
          { id: 'surv-5200', label: '5.200.000 đ', value: 5200000 },
        ],
        correctValue: 4800000,
        explanation:
          'Chính xác: 2.200.000 + 1.800.000 + 400.000 + 400.000 = 4.800.000 đ/tháng. Từ con số này, Bảo biết ngay quỹ dự phòng 3 tháng của mình cần hướng tới là 14.400.000 đ.',
      },
    },
  },
  14: {
    lessonId: 'day-14',
    dayNumber: 14,
    stageId: 1,
    title: 'Quy tắc 1 phút mỗi tối cùng MoneyCare',
    shortDescription: 'Bí quyết duy trì thói quen ghi chép tài chính lâu dài mà không bỏ cuộc giữa chừng.',
    durationMinutes: 4,
    isAvailable: true,
    content: {
      objectives: [
        'Hiểu 2 lý do phổ biến khiến người mới bỏ ghi chép chi tiêu sau vài ngày.',
        'Thiết lập khung giờ cố định 1 phút mỗi tối để tổng hợp giao dịch trong ngày.',
        'Ưu tiên tính đều đặn và đơn giản thay vì cầu toàn từng đồng lẻ.',
      ],
      paragraphs: [
        'Rất nhiều người bắt đầu ghi chi tiêu đầy hào hứng nhưng bỏ cuộc sau 5 ngày vì 2 lý do: cố gắng ghi quá cầu kỳ từng chi tiết nhỏ đến mức mệt mỏi, hoặc dồn đến cuối tuần mới nhớ lại rồi bỏ sót sạch.',
        'Bí quyết để đi đường dài là làm cho thói quen thật nhẹ nhàng: chỉ cần bấm nút (+) trên MoneyCare ngay khi vừa chi tiền, hoặc dành đúng 1 phút lúc 21h mỗi tối đối chiếu lịch sử chuyển khoản để ghi nốt các khoản trong ngày.',
      ],
      exampleTitle: 'Ví dụ thực tế: 1 phút lúc 21h thay đổi cả tháng',
      exampleBody:
        'Trước đây Linh hay quên ghi tiền mặt nên cuối tuần nản rồi bỏ hẳn. Sau khi đặt thói quen mở MoneyCare đúng 1 phút lúc 21h trước khi đi ngủ — mỗi ngày chỉ nhập 3–4 giao dịch gọn nhẹ — Linh duy trì liên tục được hơn 2 tháng và giảm 18% chi tiêu không cần thiết.',
      vibeQuote: 'Chỉ 1 phút mỗi tối thôi, Ví Bé hứa không làm chủ nhân buồn ngủ đâu!',
      interaction: {
        type: 'quiz',
        prompt:
          'Cách nào dưới đây giúp bạn duy trì thói quen ghi chép thu chi bền vững nhất?',
        options: [
          {
            id: 'A',
            text: 'Chờ đến ngày cuối tháng mới ngồi nhớ lại toàn bộ 30 ngày chi tiêu.',
          },
          {
            id: 'B',
            text: 'Ghi nhanh ngay khi chi hoặc dành cố định 1 phút mỗi tối kiểm tra và nhập giao dịch trong ngày.',
          },
          {
            id: 'C',
            text: 'Chỉ ghi các khoản chi trên 500.000 đ, bỏ qua toàn bộ các khoản nhỏ hằng ngày.',
          },
        ],
        correctOptionId: 'B',
        explanation:
          'Ghi nhanh trong ngày hoặc dành đúng 1 phút mỗi tối giúp thao tác nhẹ nhàng, không bị quên các khoản nhỏ và duy trì được thói quen lâu dài.',
      },
    },
  },
  15: {
    lessonId: 'day-15',
    dayNumber: 15,
    stageId: 1,
    title: 'Tổng kết Chương 1 – Nền tảng giữ ví vững chắc',
    shortDescription: 'Hệ thống lại toàn bộ tư duy theo dõi thu chi và sẵn sàng cho Chương 2.',
    durationMinutes: 5,
    isAvailable: true,
    content: {
      objectives: [
        'Hệ thống hóa 5 trụ cột quản lý dòng tiền căn bản của Chương 1.',
        'Đánh giá nhanh các thói quen tài chính nên duy trì và cần hạn chế.',
        'Sẵn sàng bước sang Chương 2: Lập ngân sách và kiểm soát mua sắm.',
      ],
      paragraphs: [
        'Chúc mừng bạn đã đi tới bài cuối cùng của Chương 1! Từ việc hiểu "tiền đi đâu hết rồi", tính tác động của ly cà phê 30k và phí ship, phân biệt Cần/Muốn, tách chi phí cố định/biến đổi cho tới kiểm soát cảm xúc và duy trì 1 phút ghi chép mỗi tối — bạn đã xây xong phần móng vững chắc nhất.',
        'Trong tài chính cá nhân, bạn không cần thu nhập thật cao ngay lập tức để bắt đầu quản lý tiền tốt. Chính thói quen rõ ràng với từng khoản thu chi hôm nay sẽ quyết định độ vững vàng của ví tiền trong tương lai.',
      ],
      exampleTitle: 'Nhìn lại hành trình Chương 1',
      exampleBody:
        'Người làm chủ tài chính không phải người sống quá khắt khe, mà là người luôn biết rõ: mình thực nhận bao nhiêu, chi phí tối thiểu là bao nhiêu, khoản nào đang rò rỉ và luôn chủ động quyết định trước khi thanh toán.',
      vibeQuote: 'Hoàn thành Chương 1 rồi! Ví Bé xin trao danh hiệu Người Giữ Ví Tập Sự xuất sắc!',
      interaction: {
        type: 'classification',
        prompt:
          'Ôn tập cuối Chương 1 — Hãy phân loại 4 thói quen dưới đây thành "Nên duy trì" hoặc "Cần hạn chế":',
        categoryALabel: 'Nên duy trì',
        categoryBLabel: 'Cần hạn chế',
        items: [
          {
            id: 'sum-log',
            label: 'Ghi chép thu chi đều đặn & gắn đúng danh mục',
            detail: 'Dành 1 phút mỗi tối cập nhật trên MoneyCare',
            correctCategory: 'need',
            explanation:
              'Ghi chép đều đặn và đúng danh mục giúp bạn kiểm soát dòng tiền minh bạch → Nên duy trì.',
          },
          {
            id: 'sum-net',
            label: 'Lập kế hoạch chi tiêu dựa trên thu nhập thực nhận (Net)',
            detail: 'Tách riêng chi phí cố định ngay đầu tháng',
            correctCategory: 'need',
            explanation:
              'Chi tiêu theo thu nhập thực nhận và giữ sẵn tiền cố định giúp không bị hụt cuối tháng → Nên duy trì.',
          },
          {
            id: 'sum-late-sale',
            label: 'Bấm chốt đơn ngay mỗi khi thấy Flash Sale lúc 23h đêm',
            detail: 'Mua sắm theo cảm xúc mà không chờ 48 giờ',
            correctCategory: 'want',
            explanation:
              'Chốt đơn bốc đồng lúc khuya rất dễ tốn tiền cho món đồ không thực sự cần → Cần hạn chế.',
          },
          {
            id: 'sum-subs',
            label: 'Để các gói thuê bao ít dùng tự gia hạn nhiều tháng liền',
            detail: 'Không kiểm tra sao kê và phí dịch vụ ẩn',
            correctCategory: 'want',
            explanation:
              'Các gói đăng ký và phí ẩn bị bỏ quên làm hao hụt hàng triệu đồng mỗi năm → Cần hạn chế.',
          },
        ],
        summaryExplanation:
          'Tuyệt vời! Bạn đã nắm vững toàn bộ kiến thức nền tảng Chương 1. Hãy áp dụng đều đặn trên MoneyCare mỗi ngày để thấy ví tiền gọn gàng hơn rõ rệt!',
      },
    },
  },
};

function buildAll90RoadmapDays(): RoadmapDay[] {
  const days: RoadmapDay[] = [];

  for (const stage of ROADMAP_STAGES) {
    for (let lessonNum = stage.dayStart; lessonNum <= stage.dayEnd; lessonNum += 1) {
      if (CHAPTER_1_LESSONS[lessonNum]) {
        days.push(CHAPTER_1_LESSONS[lessonNum]);
        continue;
      }

      days.push({
        lessonId: `day-${lessonNum}`,
        dayNumber: lessonNum,
        stageId: stage.id,
        title: `Bài ${lessonNum} – ${stage.title}`,
        shortDescription: `Nội dung chi tiết thuộc ${stage.label} đang được phát triển.`,
        durationMinutes: 5,
        isAvailable: false,
      });
    }
  }

  return days;
}

export const ROADMAP_DAYS: readonly RoadmapDay[] = buildAll90RoadmapDays();

export function getStageById(stageId: number): RoadmapStage | undefined {
  return ROADMAP_STAGES.find((stage) => stage.id === stageId);
}

export function getDaysByStage(stageId: number): RoadmapDay[] {
  return ROADMAP_DAYS.filter((day) => day.stageId === stageId);
}

export function getLessonById(lessonId: string): RoadmapDay | undefined {
  return ROADMAP_DAYS.find((day) => day.lessonId === lessonId);
}

export function hasStageAvailableContent(stageId: number): boolean {
  return getDaysByStage(stageId).some((day) => day.isAvailable && Boolean(day.content));
}

/**
 * Pure progress-based chapter unlocking (ZERO calendar/time/streak/XP checks):
 * - Chapter 1: Unlocked by default.
 * - Chapter 2: Unlocks automatically when all 15 lessons of Chapter 1 are completed.
 * - Chapter 3: Unlocks automatically when all 15 lessons of Chapter 2 are completed.
 * - Chapter 4: Unlocks automatically when all 30 lessons of Chapter 3 are completed.
 */
export function isStageUnlocked(
  stageId: number,
  completedLessonIds: Record<string, unknown> = {}
): boolean {
  const stage = getStageById(stageId);
  if (!stage) return false;
  if (stage.isUnlockedByDefault) return true;

  const prevStageDays = getDaysByStage(stageId - 1);
  if (prevStageDays.length === 0) return false;
  return prevStageDays.every((d) => Boolean(completedLessonIds[d.lessonId]));
}

/**
 * Strict access guard for URL & UI navigation:
 * - Self-paced: ANY available lesson inside an unlocked chapter can be opened in ANY order.
 * - Never blocks by date/time or previous lesson inside the same chapter.
 * - Strictly blocks locked chapters AND lessons whose content is still in development (isAvailable === false).
 */
export function canAccessLesson(
  lessonId: string,
  completedLessonIds: Record<string, unknown> = {}
): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  if (!lesson.isAvailable || !lesson.content) return false;
  return isStageUnlocked(lesson.stageId, completedLessonIds);
}

export interface StageProgressStats {
  stageId: number;
  completedCount: number;
  totalDays: number;
  availableCount: number;
  progressPercent: number;
  isCompleted: boolean;
}

export function getStageProgress(
  stageId: number,
  completedLessonIds: Record<string, unknown>
): StageProgressStats {
  const stageDays = getDaysByStage(stageId);
  const totalDays = stageDays.length;
  const availableCount = stageDays.filter((d) => d.isAvailable).length;
  const completedCount = stageDays.filter((d) => Boolean(completedLessonIds[d.lessonId])).length;
  const progressPercent =
    totalDays > 0 ? Math.min(100, Math.round((completedCount / totalDays) * 100)) : 0;

  return {
    stageId,
    completedCount,
    totalDays,
    availableCount,
    progressPercent,
    isCompleted: totalDays > 0 && completedCount === totalDays,
  };
}
