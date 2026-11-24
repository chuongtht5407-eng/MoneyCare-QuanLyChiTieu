import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface AIFinanceConsentProps {
  includeFinanceContext: boolean;
  onToggle: (value: boolean) => void;
}

export const AIFinanceConsent: React.FC<AIFinanceConsentProps> = ({
  includeFinanceContext,
  onToggle,
}) => {
  return (
    <div className="bg-[#EAF0FF] border border-[#2F5BEA]/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#2F5BEA] shrink-0" />
        <div className="space-y-0.5">
          <p className="font-bold text-[#171923]">Quyền riêng tư dữ liệu AI</p>
          <p className="text-[#858A9B] text-[11px] leading-tight">
            Cho phép AI đọc tổng quan thu chi & ngân sách để tư vấn chính xác.
          </p>
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={includeFinanceContext}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F5BEA]" />
      </label>
    </div>
  );
};
