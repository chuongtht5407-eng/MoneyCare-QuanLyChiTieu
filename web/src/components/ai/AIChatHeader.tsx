import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';

interface AIChatHeaderProps {
  onClear: () => void;
}

export const AIChatHeader: React.FC<AIChatHeaderProps> = ({ onClear }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-3.5 px-5 bg-white border-b border-[#E8EAF0] sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="w-9 h-9 rounded-full bg-[#F7F8FC] border border-[#E8EAF0] flex items-center justify-center text-[#171923] hover:bg-gray-100 transition-all active:scale-95"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2F5BEA] to-[#60A5FA] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#171923] tracking-tight leading-tight">
              MoneyCare AI
            </h1>
            <p className="text-[10px] text-[#16A66A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A66A] inline-block animate-pulse" />
              Sẵn sàng tư vấn
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        type="button"
        className="p-2 text-[#858A9B] hover:text-[#2F5BEA] rounded-full transition-colors hover:bg-gray-50"
        title="Xóa đoạn chat"
        aria-label="Xóa đoạn chat"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
