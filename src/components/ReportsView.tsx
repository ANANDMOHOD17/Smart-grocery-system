import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  Package,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Product, Sale, Category } from '../types';

interface ReportsViewProps {
  products: Product[];
  sales: Sale[];
  categories: Category[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ products, sales, categories }) => {
  const [reportRange, setReportRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCostOfGoods = sales.reduce(
    (sum, s) =>
      sum +
      s.items.reduce((itemSum, item) => {
        const prod = products.find((p) => p.product_id === item.product_id);
        return itemSum + (prod ? prod.purchase_price * item.quantity : 0);
      }, 0),
    0
  );
  const grossProfit = totalRevenue - totalCostOfGoods;
  const profitMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Category sales breakdown
  const categoryRevenueMap: Record<string, { revenue: number; itemsSold: number }> = {};
  categories.forEach((c) => {
    categoryRevenueMap[c.category_name] = { revenue: 0, itemsSold: 0 };
  });

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const prod = products.find((p) => p.product_id === item.product_id);
      const catName = prod?.category_name || 'General';
      if (!categoryRevenueMap[catName]) {
        categoryRevenueMap[catName] = { revenue: 0, itemsSold: 0 };
      }
      categoryRevenueMap[catName].revenue += item.total_price;
      categoryRevenueMap[catName].itemsSold += item.quantity;
    });
  });

  // Top selling products
  const productSalesMap: Record<number, { name: string; quantity: number; revenue: number }> = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSalesMap[item.product_id]) {
        productSalesMap[item.product_id] = {
          name: item.product_name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.product_id].quantity += item.quantity;
      productSalesMap[item.product_id].revenue += item.total_price;
    });
  });

  const topSellingProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Invoice No,Date,Customer,Total Amount,Status\n';
    sales.forEach((s) => {
      csvContent += `${s.invoice_no},${s.sale_date},${s.customer_name || 'Walk-in'},${s.total_amount.toFixed(2)},${s.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartStore_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="reports-analytics-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Financial & Sales Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store profitability analysis, category revenue share, and SQL aggregation summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={reportRange}
            onChange={(e) => setReportRange(e.target.value as any)}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="daily">Daily Summary</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly">Monthly Summary</option>
            <option value="yearly">Annual Fiscal</option>
          </select>

          <button
            id="btn-export-csv"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Gross Revenue</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1 font-mono">
            ${totalRevenue.toFixed(2)}
          </h3>
          <p className="text-[11px] text-green-600 font-semibold mt-1">
            From {sales.length} completed transactions
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cost of Goods (COGS)</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1 font-mono">
            ${totalCostOfGoods.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Based on supplier purchase price</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Gross Profit</p>
          <h3 className="text-xl font-bold text-green-600 mt-1 font-mono">
            +${grossProfit.toFixed(2)}
          </h3>
          <p className="text-[11px] text-green-600 font-semibold mt-1">Net profit after inventory costs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Profit Margin</p>
          <h3 className="text-xl font-bold text-indigo-600 mt-1 font-mono">
            {profitMarginPercent.toFixed(1)}%
          </h3>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Average retail markup</p>
        </div>
      </div>

      {/* Grid: Category Revenue + Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Share */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Revenue by Category</h3>
            <span className="text-xs text-slate-400">3NF Department Analysis</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(categoryRevenueMap).map(([catName, data]) => {
              const share = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
              return (
                <div key={catName} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800 font-semibold">{catName}</span>
                    <span className="text-slate-900 font-mono text-[11px]">
                      ${data.revenue.toFixed(2)} ({share.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(share, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Top Performing Products</h3>
            <span className="text-xs text-slate-400">By Sales Volume</span>
          </div>

          <div className="space-y-2">
            {topSellingProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800">{p.name}</h4>
                    <p className="text-slate-400 text-[10px]">{p.quantity} units sold</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 font-mono text-xs">
                  ${p.revenue.toFixed(2)}
                </span>
              </div>
            ))}

            {topSellingProducts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                No products have been sold yet in this session.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
