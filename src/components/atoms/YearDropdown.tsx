import React from 'react';

export interface YearDropdownProps {
  years: number[];
  selectedYear: number | '';
  onChange: (year: number | '') => void;
}

const YearDropdown: React.FC<YearDropdownProps> = ({
  years,
  selectedYear,
  onChange,
}) => {
  return (
    <select
      className="form-control bg-white border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedYear}
      onChange={(e) =>
        onChange(e.target.value === '' ? '' : Number(e.target.value))
      }
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropdown;
