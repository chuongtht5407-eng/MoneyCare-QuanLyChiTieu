import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export interface BarChartDataPoint {
  month: string;
  income: number;
  expense: number;
}

interface FinanceBarChartProps {
  data: BarChartDataPoint[];
}

export const FinanceBarChart: React.FC<FinanceBarChartProps> = ({ data }) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return `${value}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#16163F]">Biểu đồ thu chi</h3>
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6C5CE7]" />
            <span className="text-gray-600">Thu nhập</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#C4B5FD]" />
            <span className="text-gray-600">Chi tiêu</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7A7B98' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 10, fill: '#7A7B98' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(val: any) => [
                `${new Intl.NumberFormat('vi-VN').format(Number(val) || 0)} đ`,
              ]}
              contentStyle={{ borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
            />
            <Bar dataKey="income" fill="#6C5CE7" radius={[4, 4, 0, 0]} barSize={10} name="Thu nhập" />
            <Bar dataKey="expense" fill="#C4B5FD" radius={[4, 4, 0, 0]} barSize={10} name="Chi tiêu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
