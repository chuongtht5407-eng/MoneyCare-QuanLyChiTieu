import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, AIFinanceContext } from '../types/ai';
import { sendChatMessage } from '../services/aiService';
import { buildFinanceContext } from '../utils/financeContextBuilder';
import { useTransactions } from './useTransactions';
import { useBudgets } from './useBudgets';

const LOCAL_CONSENT_KEY = 'moneycare_ai_consent';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [includeFinanceContext, setIncludeFinanceContext] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_CONSENT_KEY) !== 'false';
  });

  const { transactions } = useTransactions();
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}`;
  const { budget } = useBudgets(monthKey);

  const toggleConsent = (value: boolean) => {
    setIncludeFinanceContext(value);
    localStorage.setItem(LOCAL_CONSENT_KEY, value ? 'true' : 'false');
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || isLoading) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: cleanText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        let financeCtx: AIFinanceContext | null = null;
        if (includeFinanceContext) {
          financeCtx = buildFinanceContext(transactions, budget);
        }

        const responseText = await sendChatMessage(cleanText, [...messages, userMsg], financeCtx);

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'model',
          content: responseText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: unknown) {
        const errorMsg: ChatMessage = {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          content: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi kết nối với MoneyCare AI. Vui lòng thử lại sau.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, includeFinanceContext, transactions, budget]
  );

  return {
    messages,
    isLoading,
    includeFinanceContext,
    toggleConsent,
    sendMessage,
    clearMessages,
  };
}
