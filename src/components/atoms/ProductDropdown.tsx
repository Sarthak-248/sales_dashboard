import React from 'react';

export interface ProductDropdownProps {
  products: string[];
  selected: string;
  onChange: (prod: string) => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  products,
  selected,
  onChange,
}) => {
  return (
    <select
      className="form-control bg-white border border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Products</option>
      {products.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
};

export default ProductDropdown;
