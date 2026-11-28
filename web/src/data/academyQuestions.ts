export interface QuizOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: 'A' | 'B' | 'C';
  explanation: string;
  financialTip: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ACADEMY_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    category: 'Quy tắc 50/30/20',
    difficulty: 'easy',
    question: 'Theo quy tắc 50/30/20, khoản chi tiêu cho tiền trọ, điện nước và nhu yếu phẩm thiết yếu thuộc nhóm nào?',
    options: [
      { id: 'A', text: 'Nhu cầu thiết yếu (50%)' },
      { id: 'B', text: 'Sở thích cá nhân (30%)' },
      { id: 'C', text: 'Tiết kiệm & Đầu tư (20%)' },
    ],
    correctAnswerId: 'A',
    explanation: 'Tiền nhà, điện nước, ăn uống cơ bản là các khoản chi cố định bắt buộc phải duy trì để đảm bảo cuộc sống, thuộc nhóm Nhu cầu thiết yếu (50%).',
    financialTip: 'Nếu chi phí thiết yếu vượt quá 50%, hãy tìm cách cắt giảm các gói dịch vụ phụ hoặc tối ưu chi phí sinh hoạt trước.',
  },
  {
    id: 'q-2',
    category: 'Quỹ dự phòng',
    difficulty: 'easy',
    question: 'Quy mô Quỹ dự phòng khẩn cấp an toàn nhất cho người đi làm thông thường nên tương đương bao nhiêu tháng chi phí sinh hoạt?',
    options: [
      { id: 'A', text: '1 đến 2 tuần chi phí' },
      { id: 'B', text: '3 đến 6 tháng chi phí' },
      { id: 'C', text: '2 đến 3 năm chi phí' },
    ],
    correctAnswerId: 'B',
    explanation: 'Quỹ dự phòng từ 3-6 tháng chi phí giúp bạn an tâm duy trì cuộc sống khi gặp sự cố đột xuất như mất việc, ốm đau hay hỏng hóc thiết bị.',
    financialTip: 'Hãy cất Quỹ dự phòng ở tài khoản tiết kiệm có thể rút linh hoạt, không nên gửi kỳ hạn quá dài hoặc đầu tư mạo hiểm.',
  },
  {
    id: 'q-3',
    category: 'Quản lý thu nhập',
    difficulty: 'medium',
    question: 'Ngay khi vừa nhận lương hằng tháng, hành động tài chính thông minh nhất nên thực hiện đầu tiên là gì?',
    options: [
      { id: 'A', text: 'Mua sắm các món đồ trong danh sách yêu thích ngay' },
      { id: 'B', text: 'Chuyển ngay 10-20% lương vào tài khoản tiết kiệm ("Trả cho bản thân trước")' },
      { id: 'C', text: 'Để toàn bộ tiền trong tài khoản thanh toán và chi tiêu tự do đến cuối tháng' },
    ],
    correctAnswerId: 'B',
    explanation: 'Nguyên tắc "Pay Yourself First" (Trả cho bản thân trước) đảm bảo bạn luôn tích lũy được tiền trước khi bị chi tiêu cá nhân làm hao hụt.',
    financialTip: 'Cài đặt tự động trích tiền tiết kiệm vào ngày nhận lương là cách kỷ luật nhất để duy trì thói quen tích lũy.',
  },
  {
    id: 'q-4',
    category: 'Chi tiêu không cần thiết',
    difficulty: 'easy',
    question: 'Cách hiệu quả nhất để tránh việc mua sắm bốc đồng (Impulse Buying) đối với các món đồ giá trị cao là gì?',
    options: [
      { id: 'A', text: 'Áp dụng quy tắc hoãn lại 48 giờ hoặc 30 ngày trước khi mua' },
      { id: 'B', text: 'Quẹt thẻ tín dụng trả góp ngay để không thấy tiếc tiền mặt' },
      { id: 'C', text: 'Mua ngay khi thấy giảm giá sâu dù chưa cần dùng' },
    ],
    correctAnswerId: 'A',
    explanation: 'Quy tắc hoãn lại 48 giờ giúp loại bỏ cảm xúc bốc đồng nhất thời, giúp bạn đánh giá khách quan xem món đồ đó là "Cần" hay chỉ là "Muốn".',
    financialTip: 'Hãy tự hỏi: "Nếu không giảm giá, mình có sẵn sàng trả đúng giá gốc để mua món đồ này không?"',
  },
  {
    id: 'q-5',
    category: 'Nợ thẻ tín dụng',
    difficulty: 'medium',
    question: 'Khi sử dụng Thẻ tín dụng (Credit Card), để không bị tính lãi suất cao, bạn cần thanh toán như thế nào mỗi kỳ sao kê?',
    options: [
      { id: 'A', text: 'Chỉ cần thanh toán Số tiền tối thiểu (Minimum Payment)' },
      { id: 'B', text: 'Thanh toán toàn bộ 100% dư nợ sao kê đúng hạn' },
      { id: 'C', text: 'Chờ hết gia hạn 3 tháng rồi mới thanh toán một lần' },
    ],
    correctAnswerId: 'B',
    explanation: 'Thanh toán toàn bộ 100% dư nợ sao kê trước hoặc đúng ngày đến hạn giúp bạn tận dụng thời gian miễn lãi (thường 45-55 ngày) và không bị tính lãi phạt rất cao.',
    financialTip: 'Chỉ thanh toán số tiền tối thiểu sẽ khiến phần dư nợ còn lại gánh lãi suất từ 25-40%/năm.',
  },
  {
    id: 'q-6',
    category: 'Chi tiêu thiết yếu',
    difficulty: 'easy',
    question: 'Trong các khoản chi dưới đây, khoản nào được phân loại là Chi tiêu thiết yếu (Needs)?',
    options: [
      { id: 'A', text: 'Đăng ký dịch vụ xem phim trực tuyến hàng tháng' },
      { id: 'B', text: 'Tiền thuốc men và khám chữa bệnh định kỳ' },
      { id: 'C', text: 'Ăn uống tại nhà hàng sang trọng cuối tuần' },
    ],
    correctAnswerId: 'B',
    explanation: 'Sức khỏe và thuốc men là yếu tố duy trì sự sống và khả năng lao động, thuộc nhóm Chi tiêu thiết yếu bắt buộc.',
    financialTip: 'Xem phim hay ăn nhà hàng thuộc nhóm Sở thích cá nhân (Wants) – nhóm có thể cắt giảm linh hoạt khi ngân sách eo hẹp.',
  },
  {
    id: 'q-7',
    category: 'Ngân sách cá nhân',
    difficulty: 'medium',
    question: 'Nếu trong tháng tổng chi tiêu thực tế vượt quá Hạn mức ngân sách đã đề ra, bạn nên làm gì cho tháng tiếp theo?',
    options: [
      { id: 'A', text: 'Bỏ qua không cần lập ngân sách nữa vì không hiệu quả' },
      { id: 'B', text: 'Rà soát lại danh mục chi nhiều nhất, điều chỉnh hạn mức thực tế hơn hoặc cắt giảm chi giải trí' },
      { id: 'C', text: 'Vay mượn thêm tiền để nâng đôi hạn mức chi tiêu tháng sau' },
    ],
    correctAnswerId: 'B',
    explanation: 'Ngân sách là công cụ linh hoạt. Việc xem xét lại lý do vượt hạn mức giúp bạn điều chỉnh thực tế hơn hoặc kiểm soát các khoản chi không cấp thiết.',
    financialTip: 'Hãy đặt cảnh báo ngân sách khi chi tiêu chạm ngưỡng 80% hạn mức để điều chỉnh kịp thời trước khi quá tay.',
  },
  {
    id: 'q-8',
    category: 'Mua hàng trả góp',
    difficulty: 'medium',
    question: 'Khi cân nhắc mua một thiết bị công nghệ trả góp 0%, yếu tố ẩn nào bạn cần kiểm tra kỹ nhất?',
    options: [
      { id: 'A', text: 'Phí chuyển đổi trả góp, phí thu hộ và giá bán chênh lệch so với trả thẳng' },
      { id: 'B', text: 'Màu sắc của chiếc thẻ ngân hàng' },
      { id: 'C', text: 'Số lượng quà tặng kèm không dùng đến' },
    ],
    correctAnswerId: 'A',
    explanation: 'Nhiều gói trả góp 0% lãi suất nhưng lại kèm phí chuyển đổi 3-5% hoặc chênh lệch giá bán, khiến tổng tiền thực trả cao hơn mua trả thẳng.',
    financialTip: 'Luôn lấy (Số tiền trả mỗi tháng × Số tháng) + Các khoản phí để biết chính xác tổng chi phí thực tế.',
  },
  {
    id: 'q-9',
    category: 'Chi tiêu sinh viên',
    difficulty: 'easy',
    question: 'Đối với sinh viên hoặc người mới đi làm thu nhập thấp, phương pháp quản lý tiền sinh hoạt nào dễ thực hiện nhất?',
    options: [
      { id: 'A', text: 'Phương pháp 6 hũ tiền hoặc chia ngân sách theo tuần' },
      { id: 'B', text: 'Đầu tư toàn bộ tiền sinh hoạt vào chứng khoán mạo hiểm' },
      { id: 'C', text: 'Không ghi chép và chi tiêu theo cảm xúc hằng ngày' },
    ],
    correctAnswerId: 'A',
    explanation: 'Chia ngân sách theo từng tuần giúp bạn kiểm soát dòng tiền ngắn hạn dễ dàng, tránh tình trạng "đầu tháng ăn sang, cuối tháng ăn mì gói".',
    financialTip: 'Nếu hạn mức tuần là 700.000 đ, mỗi ngày bạn chỉ được chi trung bình 100.000 đ.',
  },
  {
    id: 'q-10',
    category: 'Lãi suất vay',
    difficulty: 'hard',
    question: 'Sự khác biệt giữa Lãi suất trên dư nợ ban đầu (Phẳng) và Lãi suất trên dư nợ giảm dần là gì?',
    options: [
      { id: 'A', text: 'Hai loại lãi suất này tính ra tiền lãi hoàn toàn giống nhau' },
      { id: 'B', text: 'Lãi trên dư nợ giảm dần tính tiền lãi dựa trên số tiền gốc thực tế còn nợ, giúp giảm dần tiền lãi qua từng tháng' },
      { id: 'C', text: 'Lãi phẳng luôn có lợi hơn cho người đi vay trong dài hạn' },
    ],
    correctAnswerId: 'B',
    explanation: 'Lãi suất giảm dần tính trên số tiền gốc còn lại sau mỗi lần trả, phản ánh đúng bản chất khoản vay và giúp tổng tiền lãi thấp hơn so với lãi phẳng cùng con số.',
    financialTip: 'Khi so sánh các gói vay, luôn quy đổi về Lãi suất giảm dần (Effective Interest Rate) để so sánh chính xác.',
  },
  {
    id: 'q-11',
    category: 'Tiết kiệm',
    difficulty: 'easy',
    question: 'Lãi suất kép (Compound Interest) hoạt động dựa trên nguyên lý cốt lõi nào?',
    options: [
      { id: 'A', text: 'Tiền lãi của kỳ này được cộng dồn vào gốc để tiếp tục sinh lãi cho kỳ sau ("Lãi mẹ đẻ lãi con")' },
      { id: 'B', text: 'Chỉ tính lãi trên số tiền gốc ban đầu suốt đời' },
      { id: 'C', text: 'Rút toàn bộ tiền lãi ra tiêu dùng mỗi tháng' },
    ],
    correctAnswerId: 'A',
    explanation: 'Lãi suất kép kết hợp giữa thời gian tích lũy và việc tái đầu tư tiền lãi giúp tài sản tăng trưởng theo hàm số nhân trong dài hạn.',
    financialTip: 'Bắt đầu tiết kiệm và đầu tư càng sớm thì sức mạnh của Lãi suất kép càng phát huy tối đa.',
  },
  {
    id: 'q-12',
    category: 'Lựa chọn khi nhận lương',
    difficulty: 'medium',
    question: 'Khi được thưởng một khoản tiền bất ngờ, phương án xử lý tài chính cân bằng nhất là gì?',
    options: [
      { id: 'A', text: 'Dành 100% tiền thưởng để mua sắm tự thưởng cho bản thân' },
      { id: 'B', text: 'Phân bổ: 70-80% cho Tiết kiệm/Dự phòng/Trả nợ, và 20-30% cho Sở thích cá nhân' },
      { id: 'C', text: 'Cho bạn bè vay mượn hết không cần giấy tờ' },
    ],
    correctAnswerId: 'B',
    explanation: 'Cách phân bổ hợp lý giúp bạn vừa gia tăng tích lũy tài chính bền vững vừa duy trì động lực tinh thần làm việc.',
    financialTip: 'Đừng nâng tiêu chuẩn sống (Lifestyle Creep) quá nhanh mỗi khi thu nhập hay tiền thưởng gia tăng.',
  },
  {
    id: 'q-13',
    category: 'Kế hoạch tài chính ngắn hạn',
    difficulty: 'easy',
    question: 'Mục tiêu tài chính ngắn hạn thường có thời gian thực hiện trong khoảng bao lâu?',
    options: [
      { id: 'A', text: 'Dưới 1 năm (như mua điện thoại, đi du lịch, quỹ lễ tết)' },
      { id: 'B', text: 'Từ 10 đến 20 năm' },
      { id: 'C', text: 'Sau khi nghỉ hưu' },
    ],
    correctAnswerId: 'A',
    explanation: 'Mục tiêu ngắn hạn dưới 12 tháng đòi hỏi tính thanh khoản cao và sự an toàn vốn tuyệt đối.',
    financialTip: 'Nên để tiền cho mục tiêu ngắn hạn ở các khoản tiết kiệm gửi góp hoặc tài khoản có thể rút bất kỳ lúc nào.',
  },
  {
    id: 'q-14',
    category: 'Quản lý tài chính khi thu nhập giảm',
    difficulty: 'hard',
    question: 'Khi đột ngột bị giảm 30% thu nhập hằng tháng, bước điều chỉnh tài chính khẩn cấp đầu tiên nên là gì?',
    options: [
      { id: 'A', text: 'Rà soát và cắt giảm ngay các khoản chi thuộc nhóm Sở thích cá nhân (Wants)' },
      { id: 'B', text: 'Tăng cường vay nợ thẻ tín dụng để giữ nguyên mức chi tiêu cũ' },
      { id: 'C', text: 'Ngừng trả tiền nhà và tiền điện nước' },
    ],
    correctAnswerId: 'A',
    explanation: 'Cắt giảm nhóm Sở thích (ăn tiệm, giải trí, mua sắm) giúp đưa ngân sách về mức an toàn mà không ảnh hưởng nhu cầu sống cơ bản.',
    financialTip: 'Tạm thời đóng các gói đăng ký hàng tháng (Netflix, Spotify, Gym) nếu chưa thực sự cấp thiết.',
  },
  {
    id: 'q-15',
    category: 'Quản lý tiền sinh hoạt',
    difficulty: 'medium',
    question: 'Đi chợ/siêu thị như thế nào giúp tiết kiệm chi phí ăn uống hiệu quả nhất?',
    options: [
      { id: 'A', text: 'Lập sẵn danh sách đồ cần mua (Shopping List) và đi siêu thị khi bụng không đói' },
      { id: 'B', text: 'Đi mua sắm khi đang rất đói bụng' },
      { id: 'C', text: 'Thấy đồ gì hay cũng mua tích trữ số lượng lớn dù dễ hỏng' },
    ],
    correctAnswerId: 'A',
    explanation: 'Đi siêu thị với cái bụng đói khiến não bộ thèm ăn và dễ mua sắm bốc đồng các món đồ ngọt, đồ ăn nhanh đắt tiền.',
    financialTip: 'Lên thực đơn tuần trước khi đi chợ giúp tránh lãng phí thực phẩm hết hạn trong tủ lạnh.',
  },
  {
    id: 'q-16',
    category: 'Nợ thẻ tín dụng',
    difficulty: 'hard',
    question: 'Rút tiền mặt từ thẻ tín dụng tại cây ATM có phải là một ý tưởng tài chính tốt không?',
    options: [
      { id: 'A', text: 'Không, vì bị tính phí rút tiền mặt (3-4%) ngay lập tức và bị tính lãi suất cao ngay từ thời điểm rút' },
      { id: 'B', text: 'Có, vì rút tiền mặt thẻ tín dụng hoàn toàn miễn phí' },
      { id: 'C', text: 'Có, vì ngân hàng khuyến khích rút tiền mặt thường xuyên' },
    ],
    correctAnswerId: 'A',
    explanation: 'Rút tiền mặt qua thẻ tín dụng bị mất phí ngay 3-4% và bị tính lãi suất 30-40%/năm ngay từ phút đầu tiên, không có thời gian miễn lãi.',
    financialTip: 'Chỉ rút tiền mặt thẻ tín dụng trong tình huống cực kỳ khẩn cấp khi không còn phương án nào khác.',
  },
  {
    id: 'q-17',
    category: 'Tiết kiệm',
    difficulty: 'easy',
    question: 'Quy tắc "10% Tiết kiệm" nghĩa là gì?',
    options: [
      { id: 'A', text: 'Trích tối thiểu 10% thu nhập hằng tháng vào quỹ tiết kiệm tích lũy dài hạn' },
      { id: 'B', text: 'Chỉ tiêu 10% thu nhập và nhịn ăn 90% còn lại' },
      { id: 'C', text: 'Giảm giá 10% khi mua sắm' },
    ],
    correctAnswerId: 'A',
    explanation: 'Trích 10% thu nhập là con số khởi đầu vừa sức với đa số mọi người để xây dựng thói quen tích lũy tài sản.',
    financialTip: 'Khi thu nhập tăng lên, hãy nâng tỷ lệ tiết kiệm lên 15% hoặc 20%.',
  },
  {
    id: 'q-18',
    category: 'Quy tắc 50/30/20',
    difficulty: 'medium',
    question: 'Khoản chi tiêu cho việc học thêm ngoại ngữ, kỹ năng nghề nghiệp hoặc mua sách chuyên môn nên thuộc nhóm nào?',
    options: [
      { id: 'A', text: 'Đầu tư cho bản thân (Tương đương Tiết kiệm & Phát triển 20%)' },
      { id: 'B', text: 'Giải trí cá nhân (30%)' },
      { id: 'C', text: 'Khoản chi lãng phí cần loại bỏ' },
    ],
    correctAnswerId: 'A',
    explanation: 'Đầu tư vào tri thức và kỹ năng là khoản đầu tư mang lại tỷ suất sinh lời cao nhất, giúp gia tăng thu nhập chủ động trong tương lai.',
    financialTip: 'Dành 5-10% ngân sách mỗi tháng cho việc học tập sẽ tạo ra bước ngoặt sự nghiệp lớn.',
  },
  {
    id: 'q-19',
    category: 'Quản lý thu nhập',
    difficulty: 'medium',
    question: 'Khái niệm "Thu nhập ròng" (Take-home Pay) được hiểu đúng là gì?',
    options: [
      { id: 'A', text: 'Số tiền thực nhận về tài khoản sau khi đã trừ các khoản thuế, bảo hiểm bắt buộc' },
      { id: 'B', text: 'Tổng lương gross ghi trên hợp đồng lao động' },
      { id: 'C', text: 'Tổng tiền doanh số của công ty' },
    ],
    correctAnswerId: 'A',
    explanation: 'Thu nhập ròng là con số thực tế bạn có quyền phân bổ cho ngân sách sinh hoạt hằng tháng.',
    financialTip: 'Luôn lập ngân sách cá nhân dựa trên Thu nhập ròng thực nhận, không dựa trên lương Gross.',
  },
  {
    id: 'q-20',
    category: 'Ngân sách cá nhân',
    difficulty: 'easy',
    question: 'Lợi ích lớn nhất của việc duy trì ứng dụng quản lý chi tiêu như MoneyCare hằng ngày là gì?',
    options: [
      { id: 'A', text: 'Nắm rõ bức tranh dòng tiền, phát hiện khoản chi vô lý và chủ động kiểm soát tài chính' },
      { id: 'B', text: 'Để ứng dụng tự động trả hết nợ thay cho mình' },
      { id: 'C', text: 'Để khoe với bạn bè' },
    ],
    correctAnswerId: 'A',
    explanation: 'Ghi chép và theo dõi giúp bạn minh bạch hóa thói quen tài chính, từ đó đưa ra quyết định tiêu dùng thông minh hơn.',
    financialTip: 'Dành 1 phút mỗi tối mở MoneyCare ghi chép sẽ giúp bạn tiết kiệm hàng triệu đồng mỗi tháng!',
  },
];

/**
 * Get daily question deterministically based on Asia/Ho_Chi_Minh local date
 */
export function getDailyQuestion(dateObj: Date = new Date()): QuizQuestion {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // Deterministic index calculation
  const dayHash = year * 366 + month * 31 + day;
  const index = Math.abs(dayHash) % ACADEMY_QUESTIONS.length;

  return ACADEMY_QUESTIONS[index];
}
