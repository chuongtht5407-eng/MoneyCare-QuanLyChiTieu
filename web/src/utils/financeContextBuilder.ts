import { Transaction } from '../types/transaction';
import { MonthlyBudget } from '../types/budget';
import { AIFinanceContext } from '../types/ai';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateTotalBalance,
  calculateMonthlyCategoryExpense,
  calculateBudgetUsage,
  formatCurrency,
} from './finance';
import { DEFAULT_CATEGORIES } from '../services/categoryService';

export const MONEYCARE_AI_SYSTEM_INSTRUCTION = `Bạn là MoneyCare AI, trợ lý hỗ trợ quản lý tài chính cá nhân thông minh bằng tiếng Việt.

Bạn giúp người dùng:
- Hiểu các khoản thu nhập và chi tiêu.
- Theo dõi tình hình ngân sách và cảnh báo vượt hạn mức.
- Phân tích thói quen chi tiêu cá nhân.
- Lập kế hoạch tiết kiệm tài chính phù hợp.
- Giải thích các số liệu thống kê.

Quy tắc ứng xử quan trọng:
1. Trả lời tự nhiên, ngắn gọn, dễ hiểu và thân thiện.
2. Ưu tiên số liệu thực tế được hệ thống MoneyCare cung cấp trong ngữ cảnh.
3. Không tự tạo ra số tiền, giao dịch hoặc ngân sách không tồn tại.
4. Phân biệt rõ ràng giữa dữ liệu thực tế đã phát sinh với dự báo hoặc tư vấn giả định.
5. Khi không có đủ thông tin dữ liệu, hãy giải thích rõ cho người dùng.
6. Đưa ra lời khuyên mang tính chất tham khảo, không cam kết lợi nhuận.
7. Không tự ý thực hiện giao dịch tài chính.
8. Không bao giờ yêu cầu mật khẩu, mã OTP, số thẻ hoặc thông tin ngân hàng nhạy cảm.
9. Đơn vị tiền tệ chuẩn là Việt Nam Đồng (VNĐ).`;

/**
 * Build structured financial context for current user
 */
export function buildFinanceContext(
  transactions: Transaction[],
  budget: MonthlyBudget | null,
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
): AIFinanceContext {
  const totalIncome = calculateMonthlyIncome(transactions, year, month);
  const totalExpense = calculateMonthlyExpense(transactions, year, month);
  const balance = calculateTotalBalance(transactions);

  // Previous month logic
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth <= 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  const previousMonthIncome = calculateMonthlyIncome(transactions, prevYear, prevMonth);
  const previousMonthExpense = calculateMonthlyExpense(transactions, prevYear, prevMonth);

  // Category breakdown for current month
  const categorySpentMap = calculateMonthlyCategoryExpense(transactions, year, month);
  const topExpenseCategories = DEFAULT_CATEGORIES
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const amount = categorySpentMap[cat.id] || 0;
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        categoryName: cat.name,
        amount,
        percentage: Number(percentage.toFixed(1)),
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const budgetLimit = budget ? budget.totalLimit : 3000000;
  const budgetUsage = calculateBudgetUsage(totalExpense, budgetLimit);

  return {
    month,
    year,
    currency: 'VND',
    totalIncome,
    totalExpense,
    balance,
    topExpenseCategories,
    budgetLimit,
    budgetUsed: totalExpense,
    budgetRemaining: budgetUsage.remaining,
    budgetUsagePercent: budgetUsage.percentage,
    previousMonthIncome,
    previousMonthExpense,
  };
}

/**
 * Format finance context into readable system prompt text for Gemini
 */
export function formatContextPromptText(context: AIFinanceContext): string {
  const topCategoriesText =
    context.topExpenseCategories.length > 0
      ? context.topExpenseCategories
          .map((c) => `- ${c.categoryName}: ${formatCurrency(c.amount)} (${c.percentage}%)`)
          .join('\n')
      : '- Chưa có khoản chi tiêu nào trong tháng này.';

  return `[DỮ LIỆU TÀI CHÍNH TÀI KHOẢN HIỆN TẠI (Tháng ${context.month}/${context.year})]:
- Tổng số dư tích lũy hiện tại: ${formatCurrency(context.balance)}
- Thu nhập tháng ${context.month}/${context.year}: ${formatCurrency(context.totalIncome)}
- Chi tiêu tháng ${context.month}/${context.year}: ${formatCurrency(context.totalExpense)}
- Thu nhập tháng trước (${context.month === 1 ? 12 : context.month - 1}): ${formatCurrency(context.previousMonthIncome)}
- Chi tiêu tháng trước (${context.month === 1 ? 12 : context.month - 1}): ${formatCurrency(context.previousMonthExpense)}
- Hạn mức ngân sách tháng: ${formatCurrency(context.budgetLimit)}
- Ngân sách đã sử dụng: ${formatCurrency(context.budgetUsed)} (${context.budgetUsagePercent}%)
- Ngân sách còn lại: ${formatCurrency(context.budgetRemaining)} ${context.budgetRemaining < 0 ? '(Đã vượt hạn mức!)' : ''}
- Các danh mục chi tiêu lớn nhất tháng này:
${topCategoriesText}`;
}
