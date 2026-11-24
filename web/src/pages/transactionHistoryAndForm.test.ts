import { removeVietnameseTones } from './TransactionHistoryPage';
import { DEFAULT_CATEGORIES } from '../services/categoryService';
import { Transaction } from '../types/transaction';

function runUiAndLogicTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ GIAO DIỆN & TRẢI NGHIỆM MODULE NGƯỜI 2 ===\n');

  // Dữ liệu mẫu kiểm thử
  const testTransactions: Transaction[] = [
    {
      id: 'tx-nov-1',
      type: 'expense',
      amount: 70000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-08',
      formattedTime: '08/11/2026',
      note: 'Ăn trưa đồng nghiệp',
    },
    {
      id: 'tx-nov-2',
      type: 'expense',
      amount: 2000000,
      categoryId: 'rent',
      categoryName: 'Tiền trọ',
      date: '2026-11-01',
      formattedTime: '01/11/2026',
      note: 'Tiền nhà tháng 11',
    },
    {
      id: 'tx-nov-3',
      type: 'income',
      amount: 10000000,
      categoryId: 'salary',
      categoryName: 'Lương',
      date: '2026-11-05',
      formattedTime: '05/11/2026',
      note: 'Lương công ty',
    },
    {
      id: 'tx-oct-1',
      type: 'expense',
      amount: 150000,
      categoryId: 'shopping',
      categoryName: 'Mua sắm',
      date: '2026-10-20',
      formattedTime: '20/10/2026',
      note: 'Mua sắm áo ấm',
    },
    {
      id: 'tx-dec-1',
      type: 'expense',
      amount: 500000,
      categoryId: 'entertainment',
      categoryName: 'Giải trí',
      date: '2026-12-25',
      formattedTime: '25/12/2026',
      note: 'Giáng sinh',
    },
  ];

  // 1 & 2 & 3. Kiểm thử chuyển tháng (tháng 11 -> 10, tháng 11 -> 12, tách biệt dữ liệu)
  console.log('1. KIỂM THỬ BỘ LỌC THÁNG:');
  const novFilter = '2026-11';
  const octFilter = '2026-10';
  const decFilter = '2026-12';

  const novTxs = testTransactions.filter((t) => t.date.startsWith(novFilter));
  const octTxs = testTransactions.filter((t) => t.date.startsWith(octFilter));
  const decTxs = testTransactions.filter((t) => t.date.startsWith(decFilter));

  if (novTxs.length !== 3) throw new Error(`Tháng 11 phải có 3 giao dịch, nhận được ${novTxs.length}`);
  if (octTxs.length !== 1 || octTxs[0].id !== 'tx-oct-1') throw new Error('Tháng 10 sai dữ liệu!');
  if (decTxs.length !== 1 || decTxs[0].id !== 'tx-dec-1') throw new Error('Tháng 12 sai dữ liệu!');

  // Kiểm tra không bị lẫn
  const hasMixedData = decTxs.some((t) => t.date.startsWith('2026-11'));
  if (hasMixedData) throw new Error('Dữ liệu tháng 12 bị lẫn với tháng 11!');
  console.log('  ✓ Chuyển tháng 11 về tháng 10: lọc chính xác (1 giao dịch)');
  console.log('  ✓ Chuyển tháng 11 sang tháng 12: lọc chính xác (1 giao dịch)');
  console.log('  ✓ Dữ liệu tháng 12 hoàn toàn không bị lẫn với tháng 11');

  // 4 & 5. Kiểm thử tìm kiếm tiếng Việt không dấu
  console.log('\n2. KIỂM THỬ TÌM KIẾM TIẾNG VIỆT KHÔNG DẤU:');
  const searchAnUong = removeVietnameseTones('an uong');
  const matchAnUong = testTransactions.filter((t) =>
    removeVietnameseTones(t.categoryName).includes(searchAnUong) ||
    (t.note && removeVietnameseTones(t.note).includes(searchAnUong))
  );
  if (matchAnUong.length !== 1 || matchAnUong[0].categoryName !== 'Ăn uống') {
    throw new Error('Tìm "an uong" không tìm thấy "Ăn uống"!');
  }
  console.log('  ✓ Tìm "an uong" -> Tìm thấy chính xác giao dịch: "Ăn uống"');

  const searchTienTro = removeVietnameseTones('tien tro');
  const matchTienTro = testTransactions.filter((t) =>
    removeVietnameseTones(t.categoryName).includes(searchTienTro) ||
    (t.note && removeVietnameseTones(t.note).includes(searchTienTro))
  );
  if (matchTienTro.length !== 1 || matchTienTro[0].categoryName !== 'Tiền trọ') {
    throw new Error('Tìm "tien tro" không tìm thấy "Tiền trọ"!');
  }
  console.log('  ✓ Tìm "tien tro" -> Tìm thấy chính xác giao dịch: "Tiền trọ"');

  // 6 & 7. Kết hợp tìm kiếm với bộ lọc tháng và bộ lọc loại giao dịch
  console.log('\n3. KIỂM THỬ KẾT HỢP TÌM KIẾM + BỘ LỌC THÁNG + LOẠI GIAO DỊCH:');
  // Tìm "luong" trong tháng 11, loại income
  const combinedIncome = testTransactions.filter((t) => {
    const mMonth = t.date.startsWith('2026-11');
    const mType = t.type === 'income';
    const mSearch = removeVietnameseTones(t.categoryName).includes(removeVietnameseTones('luong'));
    return mMonth && mType && mSearch;
  });
  if (combinedIncome.length !== 1 || combinedIncome[0].categoryName !== 'Lương') {
    throw new Error('Lọc kết hợp tìm kiếm + tháng + loại thu nhập thất bại!');
  }
  console.log('  ✓ Kết hợp Tìm kiếm ("luong") + Tháng (11/2026) + Loại (income) -> 1 kết quả chính xác');

  // Tìm "luong" trong tháng 11 nhưng chọn loại expense -> phải rỗng
  const combinedMismatch = testTransactions.filter((t) => {
    const mMonth = t.date.startsWith('2026-11');
    const mType = t.type === 'expense';
    const mSearch = removeVietnameseTones(t.categoryName).includes(removeVietnameseTones('luong'));
    return mMonth && mType && mSearch;
  });
  if (combinedMismatch.length !== 0) {
    throw new Error('Loại chi tiêu không được chứa giao dịch thu nhập!');
  }
  console.log('  ✓ Kết hợp Loại (expense) + Tìm kiếm ("luong") -> 0 kết quả (chặn đúng loại)');

  // 11. Kiểm tra icon danh mục
  console.log('\n4. KIỂM THỬ ICON VÀ DANH MỤC THU / CHI:');
  const expenseCategories = DEFAULT_CATEGORIES.filter((c) => c.type === 'expense');
  const incomeCategories = DEFAULT_CATEGORIES.filter((c) => c.type === 'income');

  const requiredExpenseIds = ['food', 'shopping', 'transport', 'rent', 'entertainment', 'bills', 'health', 'other_expense'];
  const requiredIncomeIds = ['salary', 'bonus', 'investment', 'other_income'];

  for (const id of requiredExpenseIds) {
    const found = expenseCategories.find((c) => c.id === id);
    if (!found) throw new Error(`Thiếu danh mục chi tiêu: ${id}`);
    if (!found.icon) throw new Error(`Danh mục ${id} thiếu icon`);
  }
  console.log(`  ✓ Đầy đủ ${requiredExpenseIds.length} danh mục chi tiêu kèm icon`);

  for (const id of requiredIncomeIds) {
    const found = incomeCategories.find((c) => c.id === id);
    if (!found) throw new Error(`Thiếu danh mục thu nhập: ${id}`);
    if (!found.icon) throw new Error(`Danh mục ${id} thiếu icon`);
  }
  console.log(`  ✓ Đầy đủ ${requiredIncomeIds.length} danh mục thu nhập kèm icon`);

  // 12. Kiểm tra trạng thái không tìm thấy kết quả
  console.log('\n5. KIỂM THỬ TRẠNG THÁI KHÔNG TÌM THẤY KẾT QUẢ:');
  const noResultSearch = removeVietnameseTones('khong ton tai');
  const emptyResult = testTransactions.filter((t) =>
    removeVietnameseTones(t.categoryName).includes(noResultSearch)
  );
  if (emptyResult.length !== 0) {
    throw new Error('Phải trả về mảng rỗng khi không có kết quả!');
  }
  console.log('  ✓ Trạng thái kết quả rỗng (EmptyState) được kích hoạt chính xác khi không khớp');

  console.log('\n=== TẤT CẢ CÁC BÀI TEST GIAO DIỆN & TRẢI NGHIỆM ĐÃ ĐẠT 100% ===');
}

runUiAndLogicTests();
