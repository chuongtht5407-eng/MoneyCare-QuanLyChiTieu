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
    'py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm';

  const variants = {
    primary:
      'bg-[#2F5BEA] hover:bg-[#244CD9] text-white shadow-[#2F5BEA]/30 shadow-md',
    secondary:
      'bg-[#F0F2F5] hover:bg-[#E4E7EC] text-[#171923] shadow-none',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[#EF4444]/30',
    outline:
      'bg-transparent border-2 border-[#2F5BEA] text-[#2F5BEA] hover:bg-[#2F5BEA]/5 shadow-none',
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
