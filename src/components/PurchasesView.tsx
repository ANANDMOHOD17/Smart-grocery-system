import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Package,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Purchase, Supplier, Product, UserRole } from '../types';

interface PurchasesViewProps {
  purchases: Purchase[];
  suppliers: Supplier[];
  products: Product[];
  userRole: UserRole;
  onCreatePurchase: (data: {
    supplier_id: number;
    notes?: string;
    items: {
      product_id: number;
      quantity: number;
      unit_cost: number;
      batch_number?: string;
      expiry_date?: string;
    }[];
  }) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  suppliers,
  products,
  userRole,
  onCreatePurchase,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(
    suppliers[0]?.supplier_id || 1
  );
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [lineItems, setLineItems] = useState<
    {
      product_id: number;
      quantity: number;
      unit_cost: number;
      batch_number: string;
      expiry_date: string;
    }[]
  >([
    {
      product_id: products[0]?.product_id || 1,
      quantity: 50,
      unit_cost: products[0]?.purchase_price || 1.0,
      batch_number: `B-${Math.floor(100 + Math.random() * 900)}`,
      expiry_date: '2026-09-30',
    },
  ]);

  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<Purchase | null>(null);

  const handleAddLineItem = () => {
    const defaultProd = products[0];
    setLineItems([
      ...lineItems,
      {
        product_id: defaultProd ? defaultProd.product_id : 1,
        quantity: 20,
        unit_cost: defaultProd ? defaultProd.purchase_price : 1.0,
        batch_number: `B-${Math.floor(100 + Math.random() * 900)}`,
        expiry_date: '2026-09-30',
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: number) => {
    const prod = products.find((p) => p.product_id === productId);
    const updated = [...lineItems];
    updated[index].product_id = productId;
    if (prod) {
      updated[index].unit_cost = prod.purchase_price;
    }
    setLineItems(updated);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    onCreatePurchase({
      supplier_id: Number(selectedSupplierId),
      notes: purchaseNotes,
      items: lineItems,
    });

    setIsModalOpen(false);
  };

  return (
    <div id="purchases-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Orders & Inward Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supplier deliveries, batch assignments, and automated stock increment triggers.
          </p>
        </div>

        {userRole === 'Admin' && (
          <button
            id="btn-create-purchase-order"
            onClick={() => {
              setSelectedSupplierId(suppliers[0]?.supplier_id || 1);
              setLineItems([
                {
                  product_id: products[0]?.product_id || 1,
                  quantity: 50,
                  unit_cost: products[0]?.purchase_price || 1.0,
                  batch_number: `B-${Math.floor(100 + Math.random() * 900)}`,
                  expiry_date: '2026-09-30',
                },
              ]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        )}
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-5">PO Number</th>
              <th className="py-2.5 px-5">Supplier</th>
              <th className="py-2.5 px-5">Date</th>
              <th className="py-2.5 px-5">Items Count</th>
              <th className="py-2.5 px-5">Total Cost</th>
              <th className="py-2.5 px-5">Status</th>
              <th className="py-2.5 px-5 text-right">Invoice Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {purchases.map((p) => (
              <tr key={p.purchase_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-5 font-mono font-bold text-slate-900">
                  {p.purchase_invoice_no}
                </td>
                <td className="py-3 px-5 text-slate-800 font-semibold">{p.supplier_name}</td>
                <td className="py-3 px-5 text-slate-500">{p.purchase_date.slice(0, 16)}</td>
                <td className="py-3 px-5 text-slate-700 font-medium">
                  {p.items.reduce((s, i) => s + i.quantity, 0)} units ({p.items.length} skus)
                </td>
                <td className="py-3 px-5 font-bold text-slate-900 font-mono">
                  ${p.total_amount.toFixed(2)}
                </td>
                <td className="py-3 px-5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                    {p.payment_status}
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  <button
                    onClick={() => setSelectedPurchaseDetails(p)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Breakdown</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Purchase Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-5 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Create Supplier Purchase Order (Inward Stock)
                </h3>
                <p className="text-[10px] text-slate-500">
                  Auto-increments product stock and records batch numbers upon confirmation (DBMS Trigger).
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Supplier *
                  </label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s.supplier_id} value={s.supplier_id}>
                        {s.supplier_name} ({s.contact_person})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notes / Memo</label>
                  <input
                    type="text"
                    value={purchaseNotes}
                    onChange={(e) => setPurchaseNotes(e.target.value)}
                    placeholder="e.g. Regular weekly reorder batch"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Purchase Order Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end text-xs"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Product
                        </label>
                        <select
                          value={item.product_id}
                          onChange={(e) => handleProductChange(index, Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs cursor-pointer"
                        >
                          {products.map((p) => (
                            <option key={p.product_id} value={p.product_id}>
                              {p.product_name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...lineItems];
                            updated[index].quantity = parseInt(e.target.value) || 1;
                            setLineItems(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Unit Cost ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={item.unit_cost}
                          onChange={(e) => {
                            const updated = [...lineItems];
                            updated[index].unit_cost = parseFloat(e.target.value) || 0;
                            setLineItems(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={item.expiry_date}
                          onChange={(e) => {
                            const updated = [...lineItems];
                            updated[index].expiry_date = e.target.value;
                            setLineItems(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Total Purchase Amount:</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Receive Inward Stock (Execute)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Breakdown Modal */}
      {selectedPurchaseDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full border border-slate-200 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  {selectedPurchaseDetails.purchase_invoice_no}
                </h3>
                <p className="text-xs text-slate-500">
                  Supplier: {selectedPurchaseDetails.supplier_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedPurchaseDetails(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {selectedPurchaseDetails.items.map((item, idx) => (
                <div key={idx} className="pt-1.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.product_name}</p>
                    <p className="text-slate-400 text-[10px]">
                      Batch: {item.batch_number} | Exp: {item.expiry_date}
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="font-bold text-slate-900">
                      {item.quantity} × ${item.unit_cost.toFixed(2)}
                    </p>
                    <p className="text-slate-500 font-semibold">${item.total_cost.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs font-bold">
              <span>Total Received:</span>
              <span className="text-indigo-700 font-mono text-xs">
                ${selectedPurchaseDetails.total_amount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setSelectedPurchaseDetails(null)}
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
