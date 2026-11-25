import { getAI, GoogleAIBackend, getGenerativeModel } from 'firebase/ai';
import { app, isFirebaseConfigured } from '../lib/firebase';
import { ChatMessage, AIFinanceContext } from '../types/ai';
import {
  MONEYCARE_AI_SYSTEM_INSTRUCTION,
  formatContextPromptText,
} from '../utils/financeContextBuilder';

let aiInstance: ReturnType<typeof getAI> | null = null;

if (isFirebaseConfigured && app) {
  try {
    aiInstance = getAI(app, {
      backend: new GoogleAIBackend(),
    });
  } catch (err) {
    console.warn('Could not initialize Firebase AI Logic SDK:', err);
  }
}

export const isGeminiConfigured = Boolean(aiInstance);

const MODEL_NAME = 'gemini-3.5-flash-lite';

/**
 * Call single model attempt with system instruction using gemini-3.5-flash-lite
 */
async function callGeminiModel(
  ai: ReturnType<typeof getAI>,
  fullPrompt: string,
  history: ChatMessage[]
): Promise<string> {
  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: MONEYCARE_AI_SYSTEM_INSTRUCTION,
  });

  const formattedHistory: Array<{
    role: 'user' | 'model';
    parts: Array<{ type: 'text'; text: string }>;
  }> = history
    .filter((msg) => !msg.isError)
    .map((msg) => ({
      role: msg.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ type: 'text' as const, text: msg.content }],
    }));

  const chat = model.startChat({
    history: formattedHistory,
  });

  const result = await chat.sendMessage(fullPrompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Không nhận được văn bản phản hồi từ model AI.');
  }

  return text;
}

/**
 * Send message using Firebase AI Logic with gemini-3.5-flash-lite
 * Handles retry only on temporary 500 / 503 server busy errors.
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

  let fullPrompt = cleanPrompt;
  if (financeContext) {
    const contextText = formatContextPromptText(financeContext);
    fullPrompt = `${contextText}\n\n[CÂU HỎI NGƯỜI DÙNG]: ${cleanPrompt}`;
  }

  if (!aiInstance) {
    throw new Error(
      'Chưa thể khởi tạo Firebase AI Logic. Vui lòng kiểm tra lại cấu hình Firebase trong tệp .env.local.'
    );
  }

  let lastError: Error | null = null;

  // Try up to 2 attempts for temporary 500/503 errors
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await callGeminiModel(aiInstance, fullPrompt, history);
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      lastError = err instanceof Error ? err : new Error(errStr);

      const isTemporaryBusy =
        errStr.includes('500') ||
        errStr.includes('503') ||
        errStr.includes('high demand') ||
        errStr.includes('overloaded') ||
        errStr.includes('try again later');

      if (isTemporaryBusy && attempt < 1) {
        // Wait 1.2s before retry attempt
        await new Promise((resolve) => setTimeout(resolve, 1200));
        continue;
      }

      break;
    }
  }

  if (lastError) {
    const errStr = lastError.message;
    if (
      errStr.includes('500') ||
      errStr.includes('503') ||
      errStr.includes('high demand') ||
      errStr.includes('overloaded')
    ) {
      throw new Error(
        'MoneyCare AI hiện tại đang quá tải do lưu lượng truy cập cao từ máy chủ Google. Vui lòng nhấn "Thử lại" sau ít phút.'
      );
    }
    throw lastError;
  }

  throw new Error('Không thể kết nối dịch vụ MoneyCare AI.');
}
