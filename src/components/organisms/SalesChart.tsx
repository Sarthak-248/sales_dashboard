'use client';

import React, { useMemo } from 'react';


import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
} from 'recharts';

export interface Sale {
  date: string;
  money: number;
  coffee_name: string;
  cash_type: string;
  datetime: string;
  card: string;
}

export type ChartType = 'bar' | 'line' | 'pie';

export interface SalesChartProps {
  data: Sale[];
  threshold: number;
  chartType: ChartType;
  onMonthClick?: (month: string) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

type BarClickEntry = {
  month: string;
  [key: string]: unknown;
};

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  threshold,
  chartType,
  onMonthClick,
}) => {
  const monthlyData = useMemo(() => {
    const totals: Record<string, number> = {};
    data.forEach((r) => {
      const m = new Date(r.date).toLocaleString('default', { month: 'short' });
      totals[m] = (totals[m] || 0) + r.money;
    });
    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec',
    ];
    return months.map((m) => ({ month: m, sales: totals[m] || 0 }));
  }, [data]);

  if (chartType !== 'bar') {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={monthlyData}
        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label
            value="Month"
            position="insideBottom"
            offset={-10}
            style={{ fill: '#64748b' }}
          />
        </XAxis>
        <YAxis width={60} tickFormatter={(v) => v.toLocaleString()}>
          <Label
            value="Sales ($)"
            angle={-90}
            position="insideLeft"
            offset={-10}
            style={{ fill: '#64748b' }}
          />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: 4 }}
          labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
          itemStyle={{ color: '#1f2937' }}
          formatter={(v: number) =>
            `$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
          }
        />
        {threshold > 0 && (
          <ReferenceLine
            y={threshold}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              position: 'top',
              value: `Threshold: $${threshold}`,
              fill: '#ef4444',
              fontSize: 12,
            }}
          />
        )}

      <Bar
        dataKey="sales"
        fill={COLORS[0]}
        cursor="pointer"
        onClick={(entry: BarClickEntry) => {
          if (onMonthClick) onMonthClick(entry.month);
        }}
      />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
