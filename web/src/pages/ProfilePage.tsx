import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/Toast';
import { ChevronRight, Grid, DollarSign, Bell, Cloud, LogOut, Sliders } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const displayName = user?.displayName || 'Minh Hùng';
  const email = user?.email || 'minhhung@student.edu.vn';

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Cá nhân" showBack={false} />

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-[20px] p-4 border border-[#E8EAF0] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2F5BEA] p-0.5 shadow-xs overflow-hidden shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="#E2E8F0" />
                    <path d="M 20 42 C 20 20, 80 20, 80 42 L 80 50 L 20 50 Z" fill="#1E293B" />
                    <circle cx="50" cy="50" r="20" fill="#FFEDD5" />
                    <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
                    <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
                    <path d="M 44 56 Q 50 62 56 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 15 95 C 20 70, 80 70, 85 95 Z" fill="#2F5BEA" />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#171923]">{displayName}</h3>
                <p className="text-xs text-[#858A9B]">{email}</p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-white rounded-[20px] border border-[#E8EAF0] shadow-2xs divide-y divide-[#F0F2F5] overflow-hidden">
            <button
              type="button"
              onClick={() => setToastMessage('Chức năng quản lý danh mục đã được đồng bộ.')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Danh mục chi tiêu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/budget')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Thiết lập ngân sách</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <div className="p-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Đơn vị tiền tệ</span>
              </div>
              <span className="text-xs font-bold text-[#858A9B]">VND (đ)</span>
            </div>

            <button
              type="button"
              onClick={() => setToastMessage('Cài đặt thông báo đang ở trạng thái bật.')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Thông báo</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => setToastMessage('Dữ liệu đã được tự động sao lưu & đồng bộ.')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Sao lưu & đồng bộ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-red-50 text-left transition-colors text-[#EF4444]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="profile" onTabClick={(tab) => {
        if (tab === 'home') navigate('/home');
        if (tab === 'transactions') navigate('/transactions');
        if (tab === 'add') navigate('/transactions/new');
        if (tab === 'statistics') navigate('/analytics');
      }} />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Đăng xuất?"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản MoneyCare?"
        confirmText="Đăng xuất"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};
