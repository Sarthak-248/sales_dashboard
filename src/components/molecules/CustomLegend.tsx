'use client';

import React from 'react';

export interface LegendItem {
  name: string;
  color: string;
}

export interface CustomLegendProps {
  items: LegendItem[];
}

export const CustomLegend: React.FC<CustomLegendProps> = ({ items }) => (
  <ul className="space-y-2 text-sm">
    {items.map((item) => (
      <li key={item.name} className="flex items-center">
        <span
          className="w-3 h-3 mr-2 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        {item.name}
      </li>
    ))}
  </ul>
);
