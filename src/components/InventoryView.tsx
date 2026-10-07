import React, { useState } from 'react';
import {
  Warehouse,
  AlertTriangle,
  Clock,
  RotateCw,
  Plus,
  Minus,
  Sparkles,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import {
  Product,
  InventoryLog,
  LowStockAlert,
  ExpiryAlert,
  ReorderSuggestion,
  UserRole,
} from '../types';

interface InventoryViewProps {
  products: Product[];
  logs: InventoryLog[];
  lowStockAlerts: LowStockAlert[];
  expiryAlerts: ExpiryAlert[];
  reorderSuggestions: ReorderSuggestion[];
  userRole: UserRole;
  onAdjustStock: (
    productId: number,
    changeQty: number,
    changeType: InventoryLog['change_type'],
    remarks: string
  ) => void;
  onQuickReorder: (suggestion: ReorderSuggestion) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  logs,
  lowStockAlerts,
  expiryAlerts,
  reorderSuggestions,
  userRole,
  onAdjustStock,
  onQuickReorder,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all_stock' | 'low_stock' | 'expiring' | 'reorder' | 'audit_logs'
  >('all_stock');
  const [search, setSearch] = useState('');
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<InventoryLog['change_type']>('ADJUSTMENT');
  const [adjustRemarks, setAdjustRemarks] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;
    onAdjustStock(adjustModalProduct.product_id, adjustQty, adjustType, adjustRemarks);
    setAdjustModalProduct(null);
    setAdjustRemarks('');
  };

  return (
    <div id="inventory-management-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock audit ledger, automated expiry tracking (FIFO), and SQL reorder triggers.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex-wrap">
          <button
            onClick={() => setActiveTab('all_stock')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'all_stock'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('low_stock')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'low_stock'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockAlerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'expiring'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Expiring ({expiryAlerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reorder')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'reorder'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Reorder</span>
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'audit_logs'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'all_stock' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory items by name, SKU..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-5">SKU</th>
                  <th className="py-2.5 px-5">Product</th>
                  <th className="py-2.5 px-5">Batch No</th>
                  <th className="py-2.5 px-5">Expiry Date</th>
                  <th className="py-2.5 px-5">Current Stock</th>
                  <th className="py-2.5 px-5">Min Threshold</th>
                  <th className="py-2.5 px-5">Stock Status</th>
                  <th className="py-2.5 px-5 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => {
                  const isOut = p.quantity === 0;
                  const isLow = p.quantity > 0 && p.quantity <= p.min_stock;
                  return (
                    <tr key={p.product_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 font-mono text-slate-500">#{p.sku}</td>
                      <td className="py-3 px-5 font-bold text-slate-900">{p.product_name}</td>
                      <td className="py-3 px-5 font-mono text-slate-600">{p.batch_number || 'B-101'}</td>
                      <td className="py-3 px-5 text-slate-600">{p.expiry_date || 'N/A'}</td>
                      <td className="py-3 px-5 font-bold text-slate-900 font-mono">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="py-3 px-5 text-slate-500 font-mono">{p.min_stock} {p.unit}</td>
                      <td className="py-3 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => {
                            setAdjustModalProduct(p);
                            setAdjustQty(10);
                            setAdjustType('ADJUSTMENT');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                        >
                          Adjust Qty
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Alerts Tab (vw_low_stock_products) */}
      {activeTab === 'low_stock' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800 font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                Generated from MySQL Database View <strong>vw_low_stock_products</strong>. Threshold:
                Stock ≤ Min Reorder Level.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockAlerts.map((alert) => (
              <div
                key={alert.product_id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{alert.product_name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {alert.sku}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Deficit: {alert.reorder_deficit}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current In Stock:</span>
                    <span className="font-bold text-rose-600 font-mono">{alert.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum Required:</span>
                    <span className="font-semibold text-slate-700 font-mono">{alert.min_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Supplier:</span>
                    <span className="font-semibold text-indigo-700">{alert.supplier_name}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const prod = products.find((p) => p.product_id === alert.product_id);
                    if (prod) {
                      onQuickReorder({
                        product_id: alert.product_id,
                        product_name: alert.product_name,
                        sku: alert.sku,
                        category_name: alert.category_name,
                        current_stock: alert.quantity,
                        min_stock: alert.min_stock,
                        suggested_order_qty: alert.min_stock * 2,
                        supplier_id: prod.supplier_id,
                        supplier_name: alert.supplier_name,
                        lead_time_days: 3,
                        estimated_cost: (alert.min_stock * 2) * prod.purchase_price,
                      });
                    }
                  }}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Quick Reorder from Supplier
                </button>
              </div>
            ))}

            {lowStockAlerts.length === 0 && (
              <div className="col-span-full py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                All inventory items are well above minimum safety stock levels.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expiring Alerts Tab (vw_expiring_products) */}
      {activeTab === 'expiring' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>
                Generated from MySQL Database View <strong>vw_expiring_products</strong>. Items expiring
                within next 30 days.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiryAlerts.map((item) => (
              <div
                key={item.product_id}
                className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.product_name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Batch: {item.batch_number}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.days_remaining <= 3
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.days_remaining} Days Left
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expiry Date:</span>
                    <span className="font-bold text-rose-600 font-mono">{item.expiry_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining Quantity:</span>
                    <span className="font-bold text-slate-900 font-mono">{item.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Action Recommendation:</span>
                    <span className="font-semibold text-amber-700">Apply 20% Clearance Discount</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Clearance discount campaign activated for ${item.product_name}!`);
                  }}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Create Clearance Flash Sale
                </button>
              </div>
            ))}

            {expiryAlerts.length === 0 && (
              <div className="col-span-full py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                No perishable inventory nearing expiration within 30 days.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart Reorder Suggestions (Stored Procedure sp_generate_reorder_suggestions) */}
      {activeTab === 'reorder' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-800 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                Calculated using MySQL Stored Procedure <strong>sp_generate_reorder_suggestions</strong>.
                Formula: (Min Stock × 2) - Current Stock.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-5">Product</th>
                  <th className="py-2.5 px-5">Assigned Supplier</th>
                  <th className="py-2.5 px-5">Current Stock</th>
                  <th className="py-2.5 px-5">Min Stock</th>
                  <th className="py-2.5 px-5">Suggested Order Qty</th>
                  <th className="py-2.5 px-5">Est. Order Cost</th>
                  <th className="py-2.5 px-5 text-right">Procure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reorderSuggestions.map((sug) => (
                  <tr key={sug.product_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 font-bold text-slate-900">{sug.product_name}</td>
                    <td className="py-3 px-5 text-indigo-700 font-semibold">{sug.supplier_name}</td>
                    <td className="py-3 px-5 text-rose-600 font-bold font-mono">{sug.current_stock}</td>
                    <td className="py-3 px-5 text-slate-500 font-mono">{sug.min_stock}</td>
                    <td className="py-3 px-5 font-bold text-indigo-600 font-mono">
                      +{sug.suggested_order_qty} units
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-900 font-mono">
                      ${sug.estimated_cost.toFixed(2)}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => onQuickReorder(sug)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Auto-Order Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab (inventory_logs table) */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Audit Trail & Inventory Mutation Logs (3NF Table: inventory_logs)
            </span>
            <span className="text-[10px] text-slate-400">{logs.length} logged events</span>
          </div>

          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-5">Timestamp</th>
                <th className="py-2.5 px-5">Product</th>
                <th className="py-2.5 px-5">Type</th>
                <th className="py-2.5 px-5">Change Qty</th>
                <th className="py-2.5 px-5">Remaining Qty</th>
                <th className="py-2.5 px-5">Remarks / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono text-xs">
              {logs.slice(0, 15).map((log) => {
                const isPositive = log.quantity_changed > 0;
                return (
                  <tr key={log.log_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-slate-500 font-sans">
                      {log.logged_at ? log.logged_at.slice(0, 19) : ''}
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-900 font-sans">
                      {log.product_name}
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.change_type === 'PURCHASE'
                            ? 'bg-green-100 text-green-700'
                            : log.change_type === 'SALE'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {log.change_type}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-5 font-bold ${
                        isPositive ? 'text-green-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? `+${log.quantity_changed}` : log.quantity_changed}
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-800">{log.balance_quantity}</td>
                    <td className="py-3 px-5 text-slate-500 font-sans text-xs">{log.notes || log.reference_id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-2xl space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900">
              Adjust Stock for {adjustModalProduct.product_name}
            </h3>
            <p className="text-xs text-slate-500">
              Current inventory balance: <strong>{adjustModalProduct.quantity} units</strong>
            </p>

            <form onSubmit={handleExecuteAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adjustment Type
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ADJUSTMENT">Manual Stock Correction (±)</option>
                  <option value="DAMAGED">Damaged / Expired Write-off (-)</option>
                  <option value="RETURN_INWARD">Customer Return Inward (+)</option>
                  <option value="PURCHASE_INWARD">Restock (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity (Positive or Negative)
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Audit Reason / Remarks *
                </label>
                <input
                  type="text"
                  required
                  value={adjustRemarks}
                  onChange={(e) => setAdjustRemarks(e.target.value)}
                  placeholder="e.g. Physical count reconciliation"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Apply Audit Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
