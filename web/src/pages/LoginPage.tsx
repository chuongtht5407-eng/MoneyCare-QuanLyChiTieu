import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLogo } from '../components/AppLogo';
import { TextInput } from '../components/common/TextInput';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Mail, Lock } from 'lucide-react';
import { loginUser, sendPasswordReset } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email, password);
      localStorage.setItem('moneycare_onboarding_completed', 'true');
      navigate('/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập Email trước khi chọn Khôi phục mật khẩu.');
      return;
    }
    try {
      await sendPasswordReset(email);
      setSuccessMsg(`Đã gửi email khôi phục tới ${email}. Vui lòng kiểm tra hộp thư.`);
      setError('');
    } catch {
      setError('Không thể gửi email khôi phục. Vui lòng kiểm tra địa chỉ email.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7F8FC] text-[#171923]">
      <div className="pt-6 pb-2 text-center">
        <div className="w-16 h-16 bg-[#2F5BEA] rounded-2xl mx-auto flex items-center justify-center shadow-md">
          <AppLogo size="md" showText={false} />
        </div>
        <h1 className="text-xl font-bold text-[#171923] mt-3">MoneyCare</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#171923]">Chào mừng trở lại</h2>
          <p className="text-xs text-[#858A9B]">Vui lòng nhập thông tin để đăng nhập</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#EF4444] text-xs rounded-xl font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-[#16A66A] text-xs rounded-xl font-medium">
              {successMsg}
            </div>
          )}

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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-semibold text-[#2F5BEA] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <PrimaryButton type="submit" isLoading={isLoading}>
            Đăng nhập
          </PrimaryButton>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-[#858A9B]">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-bold text-[#2F5BEA] hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};
