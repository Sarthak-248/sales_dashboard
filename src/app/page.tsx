'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

import YearDropdown from '@/components/atoms/YearDropdown';
import ProductDropdown from '@/components/atoms/ProductDropdown';
import PaymentTypeDropdown from '@/components/atoms/PaymentTypeDropdown';
import ThresholdInput from '@/components/atoms/ThresholdInput';

import SalesChart, { Sale, ChartType } from '@/components/organisms/SalesChart';
import ProductPieChart from '@/components/organisms/ProductPieChart';
import PaymentTypePieChart from '@/components/organisms/PaymentTypePieChart';
import { CustomLegend, LegendItem } from '@/components/molecules/CustomLegend';

export default function DashboardPage() {
  // raw data + loading/error
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // filters
  const [years, setYears]                   = useState<number[]>([]);
  const [selectedYear, setSelectedYear]     = useState<number | ''>('');
  const [products, setProducts]             = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [paymentTypes, setPaymentTypes]     = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const [threshold, setThreshold]           = useState(0);

  // drill-in by month
  const [selectedMonth, setSelectedMonth]   = useState<string>('');

  // chart type
  const [chartType, setChartType]           = useState<ChartType>('bar');

  // fetch CSV
  useEffect(() => {
    setLoading(true);
    fetch('/sales.csv')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.text();
      })
      .then((csv) =>
        Papa.parse<Sale>(csv, {
          header: true,
          dynamicTyping: true,
          complete: ({ data: raw }) => {
            const clean = raw.filter((r) => r.date);
            setData(clean);
            setYears(
              Array.from(new Set(clean.map((r) => new Date(r.date).getFullYear())))
                .sort()
            );
            setProducts(
              Array.from(new Set(clean.map((r) => r.coffee_name))).sort()
            );
            setPaymentTypes(
              Array.from(new Set(clean.map((r) => r.cash_type))).sort()
            );
          },
          error: () => setError('Failed to parse CSV'),
        })
      )
      .catch(() => setError('Failed to load CSV'))
      .finally(() => setLoading(false));
  }, []);

  // reset all filters
  const resetAll = () => {
    setSelectedYear('');
    setSelectedProduct('');
    setSelectedPaymentType('');
    setThreshold(0);
    setSelectedMonth('');
  };

  // parent-child resets
  const onYearChange = (y: number | '') => {
    setSelectedYear(y);
    setSelectedProduct('');
    setSelectedPaymentType('');
    setThreshold(0);
    setSelectedMonth('');
  };
  const onProductChange = (p: string) => {
    setSelectedProduct(p);
    setSelectedPaymentType('');
    setThreshold(0);
    setSelectedMonth('');
  };
  const onPaymentChange = (t: string) => {
    setSelectedPaymentType(t);
    setThreshold(0);
    setSelectedMonth('');
  };
  const onThresholdChange = (v: number) => {
    setThreshold(v);
    setSelectedMonth('');
  };

  // apply filters
  let filtered = data;
  if (selectedYear !== '') {
    filtered = filtered.filter(
      (r) => new Date(r.date).getFullYear() === selectedYear
    );
  }
  if (selectedProduct) {
    filtered = filtered.filter((r) => r.coffee_name === selectedProduct);
  }
  if (selectedPaymentType) {
    filtered = filtered.filter((r) => r.cash_type === selectedPaymentType);
  }
  if (selectedMonth) {
    filtered = filtered.filter(
      (r) =>
        new Date(r.date)
          .toLocaleString('default', { month: 'short' }) === selectedMonth
    );
  }

  // legend data
  const productLegendItems: LegendItem[] = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((r) => (m[r.coffee_name] = (m[r.coffee_name] || 0) + r.money));
    const C = ['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6','#6366F1','#EC4899','#F97316'];
    return Object.keys(m).map((k,i) => ({ name: k, color: C[i % C.length] }));
  }, [filtered]);

  const paymentLegendItems: LegendItem[] = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((r) => (m[r.cash_type] = (m[r.cash_type] || 0) + r.money));
    const C = ['#3B82F6','#EF4444'];
    return Object.keys(m).map((k,i) => ({ name: k, color: C[i % C.length] }));
  }, [filtered]);

  // loading / error
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-700 min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

        {/* Sidebar */}
        <aside className="bg-pink-200 rounded-lg shadow p-6 space-y-6">
          <div className="text-center bg-pink-500 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Coffee sales dashboard
            </h2>
            <div className="h-48 overflow-hidden rounded">
              <img
                src="/coffee-banner.jpg"
                alt="Coffee Banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">
                Year
              </label>
              <YearDropdown
                years={years}
                selectedYear={selectedYear}
                onChange={onYearChange}
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">
                Product
              </label>
              <ProductDropdown
                products={products}
                selected={selectedProduct}
                onChange={onProductChange}
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">
                Payment Type
              </label>
              <PaymentTypeDropdown
                types={paymentTypes}
                selected={selectedPaymentType}
                onChange={onPaymentChange}
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">
                Min Sales
              </label>
              <ThresholdInput
                threshold={threshold}
                onChange={onThresholdChange}
              />
            </div>
            {selectedMonth && (
              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">
                  Month
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded">
                  {selectedMonth}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={resetAll}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded"
          >
            Reset All
          </button>

          <p className="text-sm text-gray-500">
            Showing <b>{filtered.length}</b> record
            {filtered.length !== 1 && 's'}
          </p>
        </aside>

        <div className="space-y-6">
          <div className="bg-pink-200 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Monthly Sales
              </h2>
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as ChartType)
                }
                className="border-gray-300 rounded px-2 py-1"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>
            </div>
            <div className="h-48 sm:h-64 lg:h-96">
              <SalesChart
                data={filtered}
                threshold={threshold}
                chartType={chartType}
                onMonthClick={setSelectedMonth}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-200 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Sales by Product
              </h2>
              <div className="flex items-stretch h-48">
                <div className="flex-1 h-full">
                  <ProductPieChart data={filtered} />
                </div>
                <div className="w-1/3 pl-4 h-full overflow-y-auto text-gray-700 text-sm">
                  <CustomLegend items={productLegendItems} />
                </div>
              </div>
            </div>

            <div className="bg-pink-200 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Sales by Payment Type
              </h2>
              <div className="flex items-center h-48">
                <div className="flex-1 h-full">
                  <PaymentTypePieChart data={filtered} />
                </div>
                <div className="w-1/3 pl-4 h-full overflow-y-auto text-gray-700 text-sm">
                  <CustomLegend items={paymentLegendItems} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
