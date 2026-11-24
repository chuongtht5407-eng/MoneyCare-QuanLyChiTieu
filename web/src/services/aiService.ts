import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage, AIFinanceContext } from '../types/ai';
import {
  MONEYCARE_AI_SYSTEM_INSTRUCTION,
  formatContextPromptText,
} from '../utils/financeContextBuilder';
import { formatCurrency } from '../utils/finance';

const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY ||
  '';

export const isGeminiConfigured = Boolean(
  apiKey && apiKey !== 'your_api_key_here'
);

let genAI: GoogleGenerativeAI | null = null;
if (isGeminiConfigured) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Could not initialize GoogleGenerativeAI SDK:', err);
  }
}

/**
 * Generate intelligent financial response using Gemini API or smart local fallback
 */
export async function sendChatMessage(
  prompt: string,
  history: ChatMessage[],
  financeContext: AIFinanceContext | null
): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    throw new Error('Vui lòng nhập câu hỏi cho MoneyCare AI.');
  }

  // Build context prompt if consent enabled
  let fullPrompt = cleanPrompt;
  if (financeContext) {
    const contextText = formatContextPromptText(financeContext);
    fullPrompt = `${contextText}\n\n[CÂU HỎI NGƯỜI DÙNG]: ${cleanPrompt}`;
  }

  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: MONEYCARE_AI_SYSTEM_INSTRUCTION,
      });

      // Format previous chat history for Gemini API
      const formattedHistory = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      const text = response.text();
      if (text) return text;
    } catch (err: unknown) {
      console.warn('Gemini API call failed, falling back to smart finance engine:', err);
    }
  }

  // Smart local financial assistant fallback response engine
  return generateSmartFinanceResponse(cleanPrompt, financeContext);
}

/**
 * Smart Local Financial Assistant Response Engine (Fallback)
 */
function generateSmartFinanceResponse(
  query: string,
  context: AIFinanceContext | null
): string {
  const q = query.toLowerCase();

  if (q.includes('xin chào') || q.includes('chào') || q.includes('hi') || q.includes('hello')) {
    return 'Xin chào! Tôi là **MoneyCare AI** — Trợ lý tài chính cá nhân của bạn. Tôi có thể giúp bạn phân tích thu chi, kiểm tra ngân sách, và đưa ra lời khuyên tiết kiệm. Bạn muốn hỏi gì hôm nay?';
  }

  if (!context) {
    return 'Tôi sẵn sàng giải đáp các kiến thức quản lý tài chính cá nhân chung. Nếu bạn bật cờ đồng ý chia sẻ số liệu tài chính ở trên, tôi có thể phân tích chính xác từng khoản thu chi và ngân sách của riêng bạn!';
  }

  if (q.includes('chi bao nhiêu') || q.includes('tổng chi') || q.includes('chi tiêu')) {
    return `Tháng này (Tháng ${context.month}/${context.year}), tổng chi tiêu của bạn là **${formatCurrency(context.totalExpense)}**. ${
      context.previousMonthExpense > 0
        ? `So với tháng trước (${formatCurrency(context.previousMonthExpense)}), chi tiêu của bạn ${
            context.totalExpense > context.previousMonthExpense ? 'đã tăng' : 'đã giảm'
          } ${formatCurrency(Math.abs(context.totalExpense - context.previousMonthExpense))}.`
        : ''
    }`;
  }

  if (q.includes('thu nhập') || q.includes('lương') || q.includes('thu vào')) {
    return `Tổng thu nhập của bạn trong tháng ${context.month}/${context.year} là **${formatCurrency(context.totalIncome)}**. Số dư tích lũy hiện tại là **${formatCurrency(context.balance)}**.`;
  }

  if (q.includes('nhiều nhất') || q.includes('danh mục chi') || q.includes('chi khoản nào')) {
    if (context.topExpenseCategories.length === 0) {
      return `Tháng này bạn chưa ghi nhận khoản chi tiêu nào.`;
    }
    const topCat = context.topExpenseCategories[0];
    return `Danh mục bạn chi nhiều nhất trong tháng ${context.month}/${context.year} là **${topCat.categoryName}** với số tiền **${formatCurrency(topCat.amount)}** (chiếm **${topCat.percentage}%** tổng chi tiêu).`;
  }

  if (q.includes('ngân sách') || q.includes('vượt') || q.includes('hạn mức')) {
    if (context.budgetUsagePercent >= 100) {
      return `⚠️ **Cảnh báo!** Bạn đã sử dụng **${context.budgetUsagePercent}%** hạn mức ngân sách tháng này, vượt quá **${formatCurrency(Math.abs(context.budgetRemaining))}**. Bạn nên cân nhắc hoãn các khoản chi chưa cấp thiết.`;
    } else if (context.budgetUsagePercent >= 80) {
      return `💡 **Chú ý!** Bạn đã sử dụng **${context.budgetUsagePercent}%** ngân sách tháng (${formatCurrency(context.budgetUsed)}/${formatCurrency(context.budgetLimit)}). Còn lại **${formatCurrency(context.budgetRemaining)}**.`;
    } else {
      return `✅ Tình hình ngân sách của bạn đang rất an toàn! Bạn đã dùng **${context.budgetUsagePercent}%** ngân sách (${formatCurrency(context.budgetUsed)}/${formatCurrency(context.budgetLimit)}). Còn lại **${formatCurrency(context.budgetRemaining)}**.`;
    }
  }

  if (q.includes('tiết kiệm') || q.includes('kế hoạch') || q.includes('2 triệu')) {
    return `Để tiết kiệm hiệu quả trong tháng tới:\n1. 🎯 **Quy tắc 50/30/20**: Dành 50% cho nhu cầu thiết yếu, 30% cho sở thích và 20% cho tiết kiệm.\n2. 📊 Khoản chi lớn nhất của bạn là **${context.topExpenseCategories[0]?.categoryName || 'Ăn uống'}** (${formatCurrency(context.topExpenseCategories[0]?.amount || 0)}). Giảm 15-20% khoản này sẽ giúp bạn tiết kiệm thêm một khoản đáng kể!`;
  }

  return `Cảm ơn câu hỏi của bạn! Dựa trên dữ liệu tháng ${context.month}/${context.year}:\n- Tổng thu: **${formatCurrency(context.totalIncome)}**\n- Tổng chi: **${formatCurrency(context.totalExpense)}**\n- Số dư: **${formatCurrency(context.balance)}**\n- Ngân sách còn lại: **${formatCurrency(context.budgetRemaining)}**\n\nBạn có muốn tôi tư vấn cụ thể hơn về khoản chi nào không?`;
}
