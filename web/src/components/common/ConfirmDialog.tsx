import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 text-[#EF4444] mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#16163F]">{title}</h3>
          <p className="text-xs sm:text-sm text-[#7A7B98] mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <PrimaryButton variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </PrimaryButton>
          <PrimaryButton variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
