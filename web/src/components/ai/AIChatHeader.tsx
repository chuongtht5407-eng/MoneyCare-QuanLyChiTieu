import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Menu, Plus } from 'lucide-react';

interface AIChatHeaderProps {
  onToggleDrawer: () => void;
  onNewChat: () => void;
  activeTitle?: string;
}

export const AIChatHeader: React.FC<AIChatHeaderProps> = ({
  onToggleDrawer,
  onNewChat,
  activeTitle,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-3.5 px-4 bg-white border-b border-[#E8EAF0] sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="w-8 h-8 rounded-full bg-[#F7F8FC] border border-[#E8EAF0] flex items-center justify-center text-[#171923] hover:bg-gray-100 transition-all active:scale-95"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onToggleDrawer}
          type="button"
          className="w-8 h-8 rounded-full bg-[#F7F8FC] border border-[#E8EAF0] flex items-center justify-center text-[#171923] hover:bg-gray-100 transition-all active:scale-95"
          title="Lịch sử trò chuyện"
          aria-label="Lịch sử trò chuyện"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2F5BEA] to-[#60A5FA] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#171923] tracking-tight leading-tight truncate max-w-[140px] sm:max-w-[200px]">
              {activeTitle || 'MoneyCare AI'}
            </h1>
            <p className="text-[10px] text-[#16A66A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A66A] inline-block animate-pulse" />
              Sẵn sàng tư vấn
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNewChat}
        type="button"
        className="px-3 py-1.5 bg-[#EAF0FF] hover:bg-[#2F5BEA] text-[#2F5BEA] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 border border-[#2F5BEA]/20"
        title="Cuộc trò chuyện mới"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Tạo mới</span>
      </button>
    </div>
  );
};
