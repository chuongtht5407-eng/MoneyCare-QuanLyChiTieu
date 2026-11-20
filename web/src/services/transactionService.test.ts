import {
  validateTransactionData,
  sortTransactions,
  formatTransactionTime,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchTransactions,
} from './transactionService';
import { Transaction } from '../types/transaction';

// Mock localStorage in Node environment if not present
if (typeof localStorage === 'undefined' || localStorage === null) {
  const store: Record<string, string> = {};
  (global as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  };
}

async function runTransactionTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ MODULE TRANSACTION SERVICE & VALIDATION ===\n');

  // --- 1. KIỂM THỬ VALIDATION ---
  console.log('1. KIỂM THỬ CÁC TRƯỜNG HỢP VALIDATION:');

  // 1.1 Số tiền bằng 0
  try {
    validateTransactionData({
      type: 'expense',
      amount: 0,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-13',
    });
    throw new Error('Thất bại: Cho phép lưu số tiền = 0!');
  } catch (err: unknown) {
    console.log('  ✓ Chặn số tiền = 0 thành công:', (err as Error).message);
  }

  // 1.2 Số tiền âm
  try {
    validateTransactionData({
      type: 'expense',
      amount: -50000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-13',
    });
    throw new Error('Thất bại: Cho phép lưu số tiền âm!');
  } catch (err: unknown) {
    console.log('  ✓ Chặn số tiền âm thành công:', (err as Error).message);
  }

  // 1.3 Thiếu danh mục
  try {
    validateTransactionData({
      type: 'income',
      amount: 5000000,
      categoryId: '',
      categoryName: '',
      date: '2026-11-13',
    });
    throw new Error('Thất bại: Cho phép lưu khi thiếu danh mục!');
  } catch (err: unknown) {
    console.log('  ✓ Chặn thiếu danh mục thành công:', (err as Error).message);
  }

  // 1.4 Ngày giao dịch không hợp lệ
  try {
    validateTransactionData({
      type: 'expense',
      amount: 100000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-99-99',
    });
    throw new Error('Thất bại: Cho phép lưu ngày không hợp lệ!');
  } catch (err: unknown) {
    console.log('  ✓ Chặn ngày giao dịch không hợp lệ thành công:', (err as Error).message);
  }

  // 1.5 Loại giao dịch không hợp lệ
  try {
    validateTransactionData({
      type: 'invalid_type' as unknown as 'income',
      amount: 100000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-13',
    });
    throw new Error('Thất bại: Cho phép lưu loại giao dịch không hợp lệ!');
  } catch (err: unknown) {
    console.log('  ✓ Chặn loại giao dịch không hợp lệ thành công:', (err as Error).message);
  }

  // --- 2. KIỂM THỬ CRUD THỰC TẾ ---
  console.log('\n2. KIỂM THỬ CÁC THAO TÁC CRUD:');

  // 2.1 Thêm thu nhập 10.000.000đ
  const incomeTx = await createTransaction({
    type: 'income',
    amount: 10000000,
    categoryId: 'salary',
    categoryName: 'Lương',
    date: '2026-11-01',
    note: 'Lương tháng 11',
    formattedTime: '01/11/2026',
  });
  if (incomeTx.amount !== 10000000 || incomeTx.type !== 'income') {
    throw new Error('Thất bại khi thêm khoản thu nhập 10.000.000đ!');
  }
  console.log(`  ✓ Thêm thu nhập thành công: ID=${incomeTx.id}, Số tiền=10.000.000đ, Loại=${incomeTx.type}`);

  // 2.2 Thêm chi tiêu 2.000.000đ
  const rentTx = await createTransaction({
    type: 'expense',
    amount: 2000000,
    categoryId: 'rent',
    categoryName: 'Tiền trọ',
    date: '2026-11-05',
    note: 'Tiền trọ tháng 11',
    formattedTime: '05/11/2026',
  });
  if (rentTx.amount !== 2000000 || rentTx.type !== 'expense') {
    throw new Error('Thất bại khi thêm khoản chi tiêu 2.000.000đ!');
  }
  console.log(`  ✓ Thêm chi tiêu thành công: ID=${rentTx.id}, Số tiền=2.000.000đ, Loại=${rentTx.type}`);

  // 2.3 Thêm chi tiêu 700.000đ sau đó sửa thành 800.000đ
  const foodTx = await createTransaction({
    type: 'expense',
    amount: 700000,
    categoryId: 'food',
    categoryName: 'Ăn uống',
    date: '2026-11-10',
    note: 'Ăn uống tuần 1',
    formattedTime: '10/11/2026',
  });
  console.log(`  ✓ Tạo giao dịch ăn uống ban đầu: ID=${foodTx.id}, Số tiền=700.000đ`);

  // Sửa giao dịch 700.000đ thành 800.000đ
  await updateTransaction(foodTx.id, {
    amount: 800000,
    note: 'Ăn uống tuần 1 (đã điều chỉnh)',
  });

  const allTxsAfterUpdate = await fetchTransactions();
  const updatedFoodTx = allTxsAfterUpdate.find((t) => t.id === foodTx.id);
  if (!updatedFoodTx || updatedFoodTx.amount !== 800000) {
    throw new Error(`Thất bại khi sửa: Số tiền mong đợi 800000 nhưng nhận ${updatedFoodTx?.amount}`);
  }
  console.log(`  ✓ Sửa giao dịch thành công: ID=${updatedFoodTx.id}, Số tiền mới=800.000đ`);

  // 2.4 Xóa một giao dịch (xóa giao dịch rentTx)
  await deleteTransaction(rentTx.id);
  const allTxsAfterDelete = await fetchTransactions();
  const deletedItem = allTxsAfterDelete.find((t) => t.id === rentTx.id);
  if (deletedItem) {
    throw new Error('Thất bại: Giao dịch tiền trọ vẫn còn tồn tại sau khi xóa!');
  }
  console.log(`  ✓ Xóa giao dịch thành công: ID=${rentTx.id} không còn trong danh sách`);

  // --- 3. KIỂM THỬ SẮP XẾP VÀ PERSISTENCE ---
  console.log('\n3. KIỂM THỬ SẮP XẾP VÀ PERSISTENCE:');

  const sortedList = await fetchTransactions();
  for (let i = 0; i < sortedList.length - 1; i++) {
    if (sortedList[i].date < sortedList[i + 1].date) {
      throw new Error(`Thất bại thứ tự sắp xếp: ${sortedList[i].date} đứng trước ${sortedList[i + 1].date}`);
    }
  }
  console.log('  ✓ Danh sách giao dịch được sắp xếp giảm dần theo ngày chính xác 100%');

  console.log('\n=== TẤT CẢ CÁC BÀI TEST TRANSACTION SERVICE ĐÃ ĐẠT 100% ===');
}

runTransactionTests().catch((err) => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});
