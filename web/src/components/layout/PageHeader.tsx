import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightElement,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between py-3.5 px-5 bg-[#F8F9FE] border-b border-gray-100/80 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={handleBackClick}
            type="button"
            className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#16163F] hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
        <h1 className="text-base sm:text-lg font-bold text-[#16163F] tracking-tight">
          {title}
        </h1>
      </div>

      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
