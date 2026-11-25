import React, { useRef, useEffect } from 'react';
import { AIChatHeader } from '../components/ai/AIChatHeader';
import { AIChatMessage } from '../components/ai/AIChatMessage';
import { AIChatSuggestions } from '../components/ai/AIChatSuggestions';
import { AIChatLoading } from '../components/ai/AIChatLoading';
import { AIChatInput } from '../components/ai/AIChatInput';
import { AIFinanceConsent } from '../components/ai/AIFinanceConsent';
import { useAIChat } from '../hooks/useAIChat';
import { RotateCw } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const {
    messages,
    isLoading,
    includeFinanceContext,
    toggleConsent,
    sendMessage,
    retryLastMessage,
    clearMessages,
  } = useAIChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const hasError = messages.some((m) => m.isError);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923] h-screen max-h-screen overflow-hidden">
      {/* 1. Sticky Header */}
      <AIChatHeader onClear={clearMessages} />

      {/* 2. Scrollable Chat Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {/* Privacy Consent Banner */}
        <AIFinanceConsent
          includeFinanceContext={includeFinanceContext}
          onToggle={toggleConsent}
        />

        {/* Welcome Empty State */}
        {messages.length === 0 && (
          <div className="py-6 space-y-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF0FF] border border-[#2F5BEA]/20 flex items-center justify-center mx-auto text-[#2F5BEA]">
              <span className="text-2xl font-extrabold">🤖</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#171923]">
                Trợ lý tài chính MoneyCare AI
              </h3>
              <p className="text-xs text-[#858A9B] max-w-[280px] mx-auto leading-relaxed">
                Tôi có thể giúp bạn giải đáp các thắc mắc về thu chi, ngân sách và gợi ý kế hoạch tiết kiệm!
              </p>
            </div>

            <AIChatSuggestions onSelectSuggestion={sendMessage} />
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}

        {/* Retry Button if last response had error */}
        {hasError && !isLoading && (
          <div className="flex justify-center my-2">
            <button
              onClick={retryLastMessage}
              type="button"
              className="px-4 py-2 rounded-full bg-[#2F5BEA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#244CD9] transition-all active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Loading Dots Indicator */}
        {isLoading && <AIChatLoading />}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input & Disclaimer Bar */}
      <div>
        <AIChatInput onSend={sendMessage} isLoading={isLoading} />
        <p className="text-[10px] text-[#858A9B] text-center bg-white pb-1 pt-0.5">
          Thông tin từ AI chỉ mang tính chất tham khảo.
        </p>
      </div>
    </div>
  );
};
