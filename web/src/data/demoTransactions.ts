import { Transaction } from '../types/finance';

/**
 * DEMO DATA NOTE:
 * Trạng thái DEMO: Đây là dữ liệu kiểm thử UI cho Phase 1,
 * không phải dữ liệu thật từ Firebase hoặc backend.
 */
export const DEMO_MONTHLY_BUDGET_LIMIT = 3000000;

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    amount: 70000,
    categoryId: 'food',
    categoryName: 'Ăn uống',
    date: '2026-11-08',
    formattedTime: 'Hôm nay, 12:30',
    note: 'Ăn trưa cùng đồng nghiệp',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 200000,
    categoryId: 'shopping',
    categoryName: 'Mua sắm',
    date: '2026-11-08',
    formattedTime: 'Hôm nay, 10:15',
    note: 'Mua vật dụng cá nhân',
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 50000,
    categoryId: 'transport',
    categoryName: 'Di chuyển',
    date: '2026-11-08',
    formattedTime: 'Hôm nay, 08:20',
    note: 'Nạp thẻ xe bus / xe ôm',
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 2000000,
    categoryId: 'rent',
    categoryName: 'Tiền trọ',
    date: '2026-11-07',
    formattedTime: 'Hôm qua, 18:30',
    note: 'Thanh toán tiền phòng tháng 11',
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 580000,
    categoryId: 'food',
    categoryName: 'Ăn uống',
    date: '2026-11-05',
    formattedTime: '05/11, 20:00',
    note: 'Đi chợ tuần',
  },
  {
    id: 'tx-6',
    type: 'income',
    amount: 10000000,
    categoryId: 'salary',
    categoryName: 'Lương',
    date: '2026-11-01',
    formattedTime: '01/11, 09:00',
    note: 'Lương tháng 11',
  },
];
