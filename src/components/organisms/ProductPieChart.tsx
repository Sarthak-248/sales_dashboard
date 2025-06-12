'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Sale } from './SalesChart';

export interface ProductPieChartProps {
  data: Sale[];
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#6366F1', '#EC4899', '#F97316',
];

const ProductPieChart: React.FC<ProductPieChartProps> = ({ data }) => {
  const pieData = useMemo(() => {
    const totals: Record<string, number> = {};
    data.forEach((r) => {
      totals[r.coffee_name] = (totals[r.coffee_name] || 0) + r.money;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="80%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProductPieChart;
