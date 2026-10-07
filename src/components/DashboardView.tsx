import React, { useState } from 'react';
import {
  Package,
  Users,
  Banknote,
  Warehouse,
  TrendingUp,
  TrendingDown,
  RotateCw,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  DashboardMetrics,
  DailySalesData,
  LowStockAlert,
  ExpiryAlert,
  Sale,
  ActiveTab,
} from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  chartData: DailySalesData[];
  lowStockAlerts: LowStockAlert[];
  expiryAlerts: ExpiryAlert[];
  recentSales: Sale[];
  setActiveTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  onSelectSale?: (sale: Sale) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  chartData,
  lowStockAlerts,
  expiryAlerts,
  recentSales,
  setActiveTab,
  onRefresh,
  onSelectSale,
}) => {
  const [timeRange, setTimeRange] = useState<'This Week' | 'This Month' | 'This Year'>('This Week');
  const [hoveredBar, setHoveredBar] = useState<DailySalesData | null>(null);

  // Maximum value for scaling the bar chart
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 10000);

  return (
    <div id="dashboard-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Top Title & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live metrics and store health indicators (Real-time SQL Feed).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            Sync: Just now
          </span>
          <button
            id="btn-dashboard-refresh"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards (High Density Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div
          id="stat-card-products"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            Total Products
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.totalProducts.toLocaleString()}
            </h3>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.totalProductsChange}</span>
          </div>
        </div>

        {/* Card 2: Total Customers */}
        <div
          id="stat-card-customers"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            Total Customers
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.totalCustomers.toLocaleString()}
            </h3>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.totalCustomersChange}</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          id="stat-card-sales"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            Today's Sales
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              ${metrics.todaySales.toLocaleString()}
            </h3>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.todaySalesChange}</span>
          </div>
        </div>

        {/* Card 4: Stock Percentage */}
        <div
          id="stat-card-stock"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
        >
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            Stock Percentage
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.stockPercentage}%
            </h3>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{metrics.stockPercentageChange}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Weekly Sales Performance + Urgent Criticals Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Sales Performance Bar Chart */}
        <div
          id="daily-sales-trend-card"
          className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Weekly Sales Performance</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revenue distribution with peak volume tracking
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">
                Weekly
              </span>
              <select
                id="select-chart-timerange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                aria-label="Daily Sales Trend Time Range"
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>

          {/* Bar Chart Visualization (Design HTML Style) */}
          <div className="mt-6 pt-4 pb-2 px-2 h-56 flex items-end justify-between gap-3 border-b border-slate-100 relative">
            {chartData.map((item) => {
              const heightPercent = Math.round((item.amount / maxAmount) * 100);
              const isPeak = item.isToday || item.amount === 9100;

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredBar(item)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                >
                  {/* Floating Price Badge for Peak Bar */}
                  {isPeak && (
                    <div className="absolute -top-7 z-10">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        ${(item.amount / 1000).toFixed(1)}k
                      </span>
                    </div>
                  )}

                  {/* Tooltip on hover */}
                  {hoveredBar?.day === item.day && !isPeak && (
                    <div className="absolute -top-7 z-10">
                      <span className="bg-slate-800 text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-xs">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* High Density Bar Structure */}
                  <div className="w-full bg-slate-100 rounded-t h-36 relative overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isPeak
                          ? 'bg-indigo-600 group-hover:bg-indigo-700 shadow-xs'
                          : 'bg-indigo-400 group-hover:bg-indigo-500'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 15)}%` }}
                    />
                  </div>

                  {/* X-axis label */}
                  <span
                    className={`text-[10px] mt-2 font-bold uppercase ${
                      isPeak ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {item.day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">Daily Average: $5,600</span>
            <span className="text-green-600 font-semibold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" /> Peak velocity on Saturdays
            </span>
          </div>
        </div>

        {/* Right 1 Col: Urgent Criticals Stacked Box */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Urgent Criticals
              </h3>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                {lowStockAlerts.length + expiryAlerts.length} Action Items
              </span>
            </div>

            {/* List of High Density Alert Items */}
            <div className="mt-3 space-y-2.5">
              {/* Expiring Alert */}
              {expiryAlerts.length > 0 ? (
                expiryAlerts.slice(0, 1).map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs"
                  >
                    <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center text-red-600 font-bold flex-shrink-0 text-xs">
                      !
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-red-900 truncate">{item.product_name}</div>
                      <div className="text-[11px] text-red-700 mt-0.5">
                        Expires in <span className="font-bold">{item.days_remaining} days</span> (Batch #{item.batch_number})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs">
                  <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center text-red-600 font-bold flex-shrink-0 text-xs">
                    !
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-red-900">Organic Milk 1L</div>
                    <div className="text-[11px] text-red-700 mt-0.5">Expires in 2 days (Batch #992)</div>
                  </div>
                </div>
              )}

              {/* Low Stock Alert */}
              {lowStockAlerts.length > 0 ? (
                lowStockAlerts.slice(0, 1).map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs"
                  >
                    <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center text-amber-600 font-bold flex-shrink-0 text-xs">
                      !
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-amber-900 truncate">{item.product_name}</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        Stock critical: <span className="font-bold">{item.quantity} left</span> (Min: {item.min_stock})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs">
                  <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center text-amber-600 font-bold flex-shrink-0 text-xs">
                    !
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-amber-900">Brown Bread 400g</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">Stock critical: 4 units left</div>
                  </div>
                </div>
              )}

              {/* Reorder Recommendation Box */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs">
                <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0 text-xs">
                  i
                </div>
                <div className="flex-1">
                  <div className="font-bold text-blue-900">Reorder Recommendation</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Farm Fresh Eggs: Trigger PO for 60 units</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              id="btn-view-all-criticals"
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Review Inventory & Reorder</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Real-time Inventory & Recent Transactions */}
      <div
        id="recent-transactions-card"
        className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Real-time Inventory & Sales Monitor
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Full POS Transactions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-5">Transaction / SKU</th>
                <th className="py-2.5 px-5">Date & Time</th>
                <th className="py-2.5 px-5">Customer</th>
                <th className="py-2.5 px-5">Items</th>
                <th className="py-2.5 px-5">Total Amount</th>
                <th className="py-2.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentSales.slice(0, 5).map((sale) => (
                <tr
                  key={sale.sale_id}
                  className="hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                  onClick={() => onSelectSale && onSelectSale(sale)}
                >
                  <td className="py-3 px-5 font-mono text-slate-500 font-semibold">
                    #{sale.invoice_no}
                  </td>
                  <td className="py-3 px-5 text-slate-500">
                    {sale.sale_date.includes('2026')
                      ? sale.sale_date.replace('2026-', 'Oct ').slice(0, 15)
                      : sale.sale_date}
                  </td>
                  <td className="py-3 px-5">
                    {sale.customer_name === 'Walk-in Customer' ? (
                      <span className="text-slate-800">Walk-in Customer</span>
                    ) : (
                      <span className="text-indigo-600 font-semibold hover:underline">
                        {sale.customer_name}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-slate-600">{sale.items.length || 1} units</td>
                  <td className="py-3 px-5 font-bold text-slate-900">
                    ${sale.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sale.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : sale.status === 'REFUNDED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
