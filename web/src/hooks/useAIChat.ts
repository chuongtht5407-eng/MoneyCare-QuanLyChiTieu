import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, AIConversation, AIFinanceContext } from '../types/ai';
import { sendChatMessage } from '../services/aiService';
import { buildFinanceContext } from '../utils/financeContextBuilder';
import {
  fetchConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  fetchConversationMessages,
  saveConversationMessage,
} from '../services/aiConversationService';
import { useTransactions } from './useTransactions';
import { useBudgets } from './useBudgets';
import { useAuth } from './useAuth';

const LOCAL_CONSENT_KEY = 'moneycare_ai_consent';

export function useAIChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingConversations, setIsFetchingConversations] = useState<boolean>(true);

  const [includeFinanceContext, setIncludeFinanceContext] = useState<boolean>(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(LOCAL_CONSENT_KEY) !== 'false'
      : true;
  });

  const { transactions } = useTransactions();
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}`;
  const { budget } = useBudgets(monthKey);

  // Load conversations list whenever user changes
  const loadConversations = useCallback(async () => {
    setIsFetchingConversations(true);
    try {
      const list = await fetchConversations();
      setConversations(list);
      // Auto-select latest conversation if available and no active selection
      if (list.length > 0 && !activeConversationId) {
        setActiveConversationId(list[0].id);
        const msgs = await fetchConversationMessages(list[0].id);
        setMessages(msgs);
      }
    } catch (err) {
      console.warn('Error loading AI conversations:', err);
    } finally {
      setIsFetchingConversations(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages whenever activeConversationId changes
  const selectConversation = useCallback(async (convId: string) => {
    setActiveConversationId(convId);
    setIsLoading(true);
    try {
      const msgs = await fetchConversationMessages(convId);
      setMessages(msgs);
    } catch (err) {
      console.warn('Error loading conversation messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const toggleConsent = (value: boolean) => {
    setIncludeFinanceContext(value);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_CONSENT_KEY, value ? 'true' : 'false');
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || isLoading) return;

      let currentConvId = activeConversationId;

      // Lazy creation of conversation if none is active
      if (!currentConvId) {
        const newConv = await createConversation(cleanText);
        currentConvId = newConv.id;
        setActiveConversationId(newConv.id);
        setConversations((prev) => [newConv, ...prev]);
      }

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: currentConvId,
        role: 'user',
        content: cleanText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Save user message to Firestore / Local cache
      await saveConversationMessage(currentConvId, userMsg);

      try {
        let financeCtx: AIFinanceContext | null = null;
        if (includeFinanceContext) {
          financeCtx = buildFinanceContext(transactions, budget);
        }

        const responseText = await sendChatMessage(cleanText, [...messages, userMsg], financeCtx);

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId: currentConvId,
          role: 'model',
          content: responseText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);
        await saveConversationMessage(currentConvId, aiMsg);

        // Refresh conversation list preview
        const updatedList = await fetchConversations();
        setConversations(updatedList);
      } catch (err: unknown) {
        const errorMsg: ChatMessage = {
          id: `msg-err-${Date.now()}`,
          conversationId: currentConvId,
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
    [isLoading, messages, activeConversationId, includeFinanceContext, transactions, budget]
  );

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setMessages((prev) => prev.filter((m) => !m.isError));
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  const removeConversation = useCallback(async (convId: string) => {
    await deleteConversation(convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConversationId === convId) {
      createNewConversation();
    }
  }, [activeConversationId, createNewConversation]);

  const renameConv = useCallback(async (convId: string, newTitle: string) => {
    await updateConversation(convId, { title: newTitle });
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
    );
  }, []);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isFetchingConversations,
    includeFinanceContext,
    toggleConsent,
    sendMessage,
    retryLastMessage,
    createNewConversation,
    selectConversation,
    removeConversation,
    renameConv,
    reloadConversations: loadConversations,
  };
}
