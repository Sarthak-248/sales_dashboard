import React from 'react';

export interface ThresholdInputProps {
  threshold: number;
  onChange: (value: number) => void;
}

const ThresholdInput: React.FC<ThresholdInputProps> = ({
  threshold,
  onChange,
}) => {
  return (
    <input
      type="number"
      className="form-control bg-white border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={threshold}
      min={0}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="Min sales"
    />
  );
};

export default ThresholdInput;
