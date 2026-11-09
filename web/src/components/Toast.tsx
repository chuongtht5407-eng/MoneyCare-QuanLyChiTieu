import React, { useEffect } from 'react';
import { Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#16163F]/90 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 border border-white/10 animate-fade-in max-w-[90%] text-center">
      <Info className="w-4 h-4 text-[#C4B5FD] shrink-0" />
      <span>{message}</span>
    </div>
  );
};
