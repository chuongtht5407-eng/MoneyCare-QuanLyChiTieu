import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { CloudOff, AlertTriangle } from 'lucide-react';

export const SyncBanner: React.FC = () => {
  const { mode } = useSyncStatus();
  const location = useLocation();

  // Không hiển thị ở các màn hình khởi động, onboarding, đăng nhập, đăng ký
  const pathname = location.pathname;
  const isExcluded =
    pathname === '/splash' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/onboarding');

  if (isExcluded || mode === 'cloud') {
    return null;
  }

  if (mode === 'local') {
    return (
      <div className="w-full bg-[#FEF3C7] text-[#92400E] px-4 py-2 text-xs flex items-center gap-2 border-b border-[#FDE68A] shrink-0 transition-colors">
        <CloudOff className="w-4 h-4 shrink-0 text-[#D97706]" />
        <span className="font-medium leading-tight">
          Chế độ ngoại tuyến: dữ liệu chỉ lưu trên thiết bị này, chưa lên cloud.
        </span>
      </div>
    );
  }

  if (mode === 'degraded') {
    return (
      <div className="w-full bg-[#FEE2E2] text-[#991B1B] px-4 py-2 text-xs flex items-center gap-2 border-b border-[#FECACA] shrink-0 transition-colors">
        <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444]" />
        <span className="font-medium leading-tight">
          Không thể đồng bộ lên cloud. Dữ liệu đang lưu tạm trong máy.
        </span>
      </div>
    );
  }

  return null;
};
