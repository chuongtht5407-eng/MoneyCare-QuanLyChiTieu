import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = true,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#6C5CE7] to-[#887CF6] hover:from-[#5A4AD1] hover:to-[#776BE3] text-white shadow-[#6C5CE7]/30',
    secondary:
      'bg-[#EEF0F8] hover:bg-[#E2E6F5] text-[#16163F] shadow-none',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[#EF4444]/30',
    outline:
      'bg-transparent border-2 border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7]/5 shadow-none',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
