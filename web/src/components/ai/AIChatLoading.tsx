import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIChatLoading: React.FC = () => {
  return (
    <div className="flex gap-3 my-3 flex-row animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-[#2F5BEA] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <Sparkles className="w-4 h-4 fill-white" />
      </div>

      <div className="bg-white border border-[#E8EAF0] p-3.5 rounded-2xl rounded-tl-xs text-xs text-[#858A9B] flex items-center gap-2 shadow-2xs">
        <span>MoneyCare AI đang phân tích dữ liệu</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#2F5BEA] rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-[#2F5BEA] rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-[#2F5BEA] rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};
