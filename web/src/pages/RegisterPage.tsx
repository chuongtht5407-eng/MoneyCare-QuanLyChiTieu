import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLogo } from '../components/AppLogo';
import { TextInput } from '../components/common/TextInput';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { User, Mail, Lock } from 'lucide-react';
import { registerUser } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(displayName, email, password);
      localStorage.setItem('moneycare_onboarding_completed', 'true');
      navigate('/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tạo tài khoản thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7F8FC] text-[#171923]">
      <div className="pt-4 pb-2 text-center">
        <div className="w-14 h-14 bg-[#2F5BEA] rounded-2xl mx-auto flex items-center justify-center shadow-md">
          <AppLogo size="sm" showText={false} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#171923]">Tạo tài khoản mới</h2>
          <p className="text-xs text-[#858A9B]">Quản lý tài chính cùng MoneyCare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#EF4444] text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <TextInput
            label="Họ và tên"
            placeholder="Minh Hùng"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="minhhung@student.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <TextInput
            label="Mật khẩu"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <TextInput
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="pt-2">
            <PrimaryButton type="submit" isLoading={isLoading}>
              Đăng ký tài khoản
            </PrimaryButton>
          </div>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-[#858A9B]">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-bold text-[#2F5BEA] hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};
