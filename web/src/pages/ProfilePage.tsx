import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/Toast';
import { TextInput } from '../components/common/TextInput';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  ChevronRight,
  Grid,
  DollarSign,
  Bell,
  Cloud,
  LogOut,
  Sliders,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  CloudOff,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSyncStatus } from '../hooks/useSyncStatus';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateName } = useAuth();
  const { mode, lastSyncedAt } = useSyncStatus();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trạng thái modal sửa tên
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [editError, setEditError] = useState('');

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const displayName = user?.displayName || 'Minh Hùng';
  const email = user?.email || 'minhhung@student.edu.vn';

  const handleOpenEditProfile = () => {
    setEditName(displayName);
    setEditError('');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    const trimmed = editName.trim();
    if (!trimmed) {
      setEditError('Họ và tên không được để trống.');
      return;
    }
    if (trimmed.length > 50) {
      setEditError('Họ và tên không được vượt quá 50 ký tự.');
      return;
    }

    setIsSavingName(true);
    try {
      await updateName(trimmed);
      setIsEditProfileOpen(false);
      setToastMessage('Đã cập nhật hồ sơ');
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ');
    } finally {
      setIsSavingName(false);
    }
  };

  // Định dạng giờ đồng bộ gần nhất
  const formatSyncTime = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSyncRowClick = () => {
    if (mode === 'cloud') {
      const timeStr = lastSyncedAt ? ` lúc ${formatSyncTime(lastSyncedAt)}` : '';
      setToastMessage(`Đã đồng bộ an toàn với Cloud Firestore${timeStr}.`);
    } else if (mode === 'local') {
      setToastMessage('Chế độ ngoại tuyến: dữ liệu chỉ lưu trên thiết bị này, chưa lên cloud.');
    } else {
      setToastMessage('Không thể kết nối máy chủ. Dữ liệu đang được lưu tạm trên máy.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader title="Cá nhân" showBack={false} />

        <div className="p-4 space-y-4">
          {/* Thẻ thông tin tài khoản - Bấm để mở hộp thoại sửa tên */}
          <button
            type="button"
            onClick={handleOpenEditProfile}
            className="w-full bg-white rounded-[20px] p-4 border border-[#E8EAF0] shadow-2xs flex items-center justify-between text-left hover:border-[#2F5BEA]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2F5BEA] p-0.5 shadow-xs overflow-hidden shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="#E2E8F0" />
                    <path d="M 20 42 C 20 20, 80 20, 80 42 L 80 50 L 20 50 Z" fill="#1E293B" />
                    <circle cx="50" cy="50" r="20" fill="#FFEDD5" />
                    <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
                    <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
                    <path
                      d="M 44 56 Q 50 62 56 56"
                      stroke="#1E293B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path d="M 15 95 C 20 70, 80 70, 85 95 Z" fill="#2F5BEA" />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#171923] flex items-center gap-1.5">
                  {displayName}
                  <span className="text-[10px] text-[#2F5BEA] font-semibold bg-[#EAF0FF] px-1.5 py-0.5 rounded-md">
                    Sửa
                  </span>
                </h3>
                <p className="text-xs text-[#858A9B]">{email}</p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Menu cài đặt */}
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

            {/* Hàng "Sao lưu & đồng bộ" hiển thị trạng thái thực tế */}
            <button
              type="button"
              onClick={handleSyncRowClick}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#2F5BEA] flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#171923]">Sao lưu & đồng bộ</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {mode === 'cloud' && (
                  <span className="flex items-center gap-1 text-[#16A66A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã đồng bộ {lastSyncedAt ? `(${formatSyncTime(lastSyncedAt)})` : ''}
                  </span>
                )}
                {mode === 'local' && (
                  <span className="flex items-center gap-1 text-[#D97706]">
                    <CloudOff className="w-3.5 h-3.5" />
                    Ngoại tuyến
                  </span>
                )}
                {mode === 'degraded' && (
                  <span className="flex items-center gap-1 text-[#EF4444]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Lỗi đồng bộ {lastSyncedAt ? `(${formatSyncTime(lastSyncedAt)})` : ''}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
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

      <BottomNavigation
        activeTab="profile"
        onTabClick={(tab) => {
          if (tab === 'home') navigate('/home');
          if (tab === 'transactions') navigate('/transactions');
          if (tab === 'add') navigate('/transactions/new');
          if (tab === 'statistics') navigate('/analytics');
        }}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Modal Chỉnh sửa Họ và tên */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[24px] p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#171923]">Chỉnh sửa thông tin</h3>
              <p className="text-xs text-[#858A9B]">Cập nhật tên hiển thị trong hồ sơ của bạn</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#EF4444] text-xs rounded-xl font-medium">
                  {editError}
                </div>
              )}

              <TextInput
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
                maxLength={50}
              />

              <div className="space-y-1">
                <TextInput
                  label="Email (không thể thay đổi)"
                  value={email}
                  disabled
                  readOnly
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  disabled={isSavingName}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-[#858A9B] bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <div className="flex-1">
                  <PrimaryButton type="submit" isLoading={isSavingName}>
                    Lưu
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận đăng xuất */}
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
