import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/finance';

export interface CategoryExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface ExpenseDonutChartProps {
  data: CategoryExpenseData[];
  totalExpense: number;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  data,
  totalExpense,
}) => {
  const chartData = data.filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-[#16163F]">Phân bổ chi tiêu</h3>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.length > 0 ? chartData : [{ name: 'Trống', value: 1, color: '#E2E8F0', percentage: 100 }]}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {(chartData.length > 0 ? chartData : [{ name: 'Trống', value: 1, color: '#E2E8F0', percentage: 100 }]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="text-sm font-extrabold text-[#16163F]">
            {formatCurrency(totalExpense)}
          </p>
          <p className="text-[10px] text-[#7A7B98] font-medium">Tổng chi</p>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="space-y-2 pt-1 border-t border-gray-50">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-gray-700">{item.name}</span>
            </div>
            <span className="font-bold text-[#16163F]">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
