import React from 'react';
import { Home, ArrowLeftRight, Plus, BarChart3, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab?: string;
  onTabClick: (tabName: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabClick,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8EAF0] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Tab 1: Trang chủ */}
        <button
          onClick={() => onTabClick('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'home' ? 'text-[#2F5BEA]' : 'text-[#858A9B] hover:text-[#171923]'
          }`}
          type="button"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Trang chủ</span>
        </button>

        {/* Tab 2: Giao dịch */}
        <button
          onClick={() => onTabClick('transactions')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'transactions' ? 'text-[#2F5BEA]' : 'text-[#858A9B] hover:text-[#171923]'
          }`}
          type="button"
        >
          <ArrowLeftRight className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-medium mt-1">Giao dịch</span>
        </button>

        {/* Center Floating (+) Button */}
        <div className="relative -top-5 flex items-center justify-center">
          <button
            onClick={() => onTabClick('add')}
            className="w-13 h-13 rounded-full bg-[#2F5BEA] hover:bg-[#244CD9] text-white flex items-center justify-center shadow-lg shadow-[#2F5BEA]/40 hover:scale-105 active:scale-95 transition-all border-4 border-white"
            type="button"
            aria-label="Thêm giao dịch"
            title="Thêm giao dịch"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Thống kê */}
        <button
          onClick={() => onTabClick('statistics')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'statistics' ? 'text-[#2F5BEA]' : 'text-[#858A9B] hover:text-[#171923]'
          }`}
          type="button"
        >
          <BarChart3 className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-medium mt-1">Thống kê</span>
        </button>

        {/* Tab 5: Cá nhân */}
        <button
          onClick={() => onTabClick('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'profile' ? 'text-[#2F5BEA]' : 'text-[#858A9B] hover:text-[#171923]'
          }`}
          type="button"
        >
          <User className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-medium mt-1">Cá nhân</span>
        </button>
      </div>

      <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mt-2 opacity-60" />
    </div>
  );
};
