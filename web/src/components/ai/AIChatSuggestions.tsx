import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIChatSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
}

export const AIChatSuggestions: React.FC<AIChatSuggestionsProps> = ({
  onSelectSuggestion,
}) => {
  const suggestions = [
    'Tháng này tôi chi bao nhiêu?',
    'Tôi chi nhiều nhất vào khoản nào?',
    'Tôi có sắp vượt ngân sách không?',
    'So sánh chi tiêu tháng này và tháng trước',
    'Làm sao để tiết kiệm 2 triệu/tháng?',
  ];

  return (
    <div className="space-y-2.5 my-2">
      <div className="flex items-center gap-1.5 text-xs text-[#858A9B] font-semibold px-1">
        <Sparkles className="w-3.5 h-3.5 text-[#2F5BEA]" />
        <span>Gợi ý câu hỏi phổ biến:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggestion(item)}
            type="button"
            className="px-3 py-1.5 bg-white border border-[#E8EAF0] hover:border-[#2F5BEA] hover:text-[#2F5BEA] text-[11px] font-semibold text-[#171923] rounded-full transition-all shadow-2xs text-left active:scale-95"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
