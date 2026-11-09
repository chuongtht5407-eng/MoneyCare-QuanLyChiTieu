import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-[#16163F]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#7A7B98] pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={isPasswordType && showPassword ? 'text' : type}
          className={`w-full py-3 ${icon ? 'pl-10' : 'pl-4'} ${
            isPasswordType ? 'pr-11' : 'pr-4'
          } bg-white border ${
            error ? 'border-[#EF4444]' : 'border-gray-200 focus:border-[#6C5CE7]'
          } rounded-2xl text-sm font-medium text-[#16163F] placeholder:text-gray-400 outline-none transition-all shadow-sm ${className}`}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-[#7A7B98] hover:text-[#16163F] p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-[#EF4444] font-medium pt-0.5">{error}</p>}
    </div>
  );
};
