import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface AIChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const AIChatInput: React.FC<AIChatInputProps> = ({
  onSend,
  isLoading,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white border-t border-[#E8EAF0] flex items-center gap-2 sticky bottom-0 z-30"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Hỏi MoneyCare AI về thu chi, ngân sách..."
        className="flex-1 py-3 px-4 bg-[#F7F8FC] border border-[#E8EAF0] rounded-xl text-xs sm:text-sm text-[#171923] placeholder:text-[#858A9B] outline-none focus:border-[#2F5BEA] focus:bg-white transition-all"
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="w-11 h-11 rounded-xl bg-[#2F5BEA] hover:bg-[#244CD9] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs shrink-0 active:scale-95"
        aria-label="Gửi câu hỏi"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
};
