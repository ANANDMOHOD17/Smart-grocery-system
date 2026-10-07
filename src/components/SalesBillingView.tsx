import React, { useState } from 'react';
import {
  ReceiptText,
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  UserCheck,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { Product, Customer, Discount, Sale, Payment } from '../types';

interface SalesBillingViewProps {
  products: Product[];
  customers: Customer[];
  discounts: Discount[];
  sales: Sale[];
  onProcessSale: (data: {
    customer_id?: number | null;
    items: { product_id: number; quantity: number }[];
    discount_code?: string;
    payment_method: Payment['payment_method'];
    tax_rate?: number;
  }) => Sale;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const SalesBillingView: React.FC<SalesBillingViewProps> = ({
  products,
  customers,
  discounts,
  sales,
  onProcessSale,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Payment['payment_method']>('Card');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [transactionError, setTransactionError] = useState('');

  // Filter products for POS grid
  const availableProducts = products.filter((p) => {
    const matchSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    const matchCat =
      selectedCategory === 'All' || p.category_name === selectedCategory;

    return matchSearch && matchCat && p.quantity > 0;
  });

  const handleAddToCart = (product: Product) => {
    setTransactionError('');
    const existing = cart.find((item) => item.product.product_id === product.product_id);
    if (existing) {
      if (existing.quantity + 1 > product.quantity) {
        setTransactionError(`Cannot add more. Only ${product.quantity} units available in inventory.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setTransactionError('');
    setCart(
      cart
        .map((item) => {
          if (item.product.product_id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.quantity) {
              setTransactionError(
                `Max inventory reached: Only ${item.product.quantity} in stock.`
              );
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.product_id !== productId));
  };

  const handleApplyDiscount = () => {
    setDiscountError('');
    if (!discountCodeInput.trim()) return;

    const matched = discounts.find(
      (d) =>
        d.discount_code.toUpperCase() === discountCodeInput.trim().toUpperCase() &&
        d.status === 'Active'
    );

    if (!matched) {
      setDiscountError('Invalid or expired promo code.');
      setAppliedDiscount(null);
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.quantity * item.product.selling_price,
      0
    );

    if (subtotal < matched.min_purchase_amount) {
      setDiscountError(
        `Requires minimum purchase of $${matched.min_purchase_amount.toFixed(2)}.`
      );
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount(matched);
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.selling_price,
    0
  );

  let discountAmount = 0;
  if (appliedDiscount && subtotal >= appliedDiscount.min_purchase_amount) {
    if (appliedDiscount.discount_type === 'Percentage') {
      discountAmount = (subtotal * appliedDiscount.discount_value) / 100;
    } else {
      discountAmount = appliedDiscount.discount_value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxRate = 0.05; // 5% tax
  const taxAmount = discountedSubtotal * taxRate;
  const grandTotal = discountedSubtotal + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setTransactionError('');

    try {
      const saleResult = onProcessSale({
        customer_id: selectedCustomerId,
        items: cart.map((c) => ({
          product_id: c.product.product_id,
          quantity: c.quantity,
        })),
        discount_code: appliedDiscount?.discount_code,
        payment_method: paymentMethod,
        tax_rate: taxRate,
      });

      // Clear cart on success
      setCart([]);
      setAppliedDiscount(null);
      setDiscountCodeInput('');
      setCompletedSale(saleResult);
    } catch (err: any) {
      setTransactionError(err.message || 'Transaction failed');
    }
  };

  const categoriesList = ['All', ...new Set(products.map((p) => p.category_name || 'General'))];

  return (
    <div id="sales-pos-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Point of Sale & Billing Terminal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time barcode lookup, ACID sales transaction processing, and automated inventory deduction.
          </p>
        </div>
      </div>

      {transactionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{transactionError}</span>
        </div>
      )}

      {/* POS Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Catalog & Search (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Scan barcode or search by product name/SKU..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto p-0.5">
            {availableProducts.map((product) => (
              <div
                key={product.product_id}
                onClick={() => handleAddToCart(product)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">#{product.sku}</span>
                    <span className="font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                      {product.quantity} left
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.product_name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{product.category_name}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    ${product.selling_price.toFixed(2)}
                  </span>
                  <button className="w-6 h-6 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {availableProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                No items available in stock matching this filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Billing Cart & Order Summary (Span 5) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Current Sale Order</h3>
              </div>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            {/* Customer Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Customer (Optional - Loyalty Sync)
              </label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) =>
                  setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Walk-in Customer (Guest)</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_name} ({c.loyalty_points} pts) - {c.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map((item) => (
                <div key={item.product.product_id} className="pt-1.5 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.product.product_name}</p>
                    <p className="text-slate-400 text-[10px] font-mono">
                      ${item.product.selling_price.toFixed(2)} / {item.product.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-slate-200 rounded bg-slate-50">
                      <button
                        onClick={() => handleUpdateQty(item.product.product_id, -1)}
                        className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-200 rounded-l cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-800 font-mono text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product.product_id, 1)}
                        className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-200 rounded-r cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-slate-900 font-mono w-12 text-right text-xs">
                      ${(item.quantity * item.product.selling_price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleRemoveFromCart(item.product.product_id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                  <ShoppingBag className="w-7 h-7 mx-auto text-slate-300 stroke-1" />
                  <p>Cart is currently empty.</p>
                  <p className="text-[10px]">Click product card from the left catalog to ring up order.</p>
                </div>
              )}
            </div>

            {/* Discount Promo Input */}
            <div className="pt-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                    placeholder="Promo (SAVE10, FRESH20)"
                    className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {discountError && <p className="text-[10px] text-rose-600 mt-1">{discountError}</p>}
              {appliedDiscount && (
                <p className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Applied: {appliedDiscount.discount_name}
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Card', 'Cash', 'UPI', 'Store Credit'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 px-1 text-center rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount Promo</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Sales Tax (5%)</span>
              <span className="font-mono text-slate-800">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="font-mono text-indigo-700 text-base">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              id="btn-complete-checkout"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full mt-2.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Complete Sale & Print Bill (${grandTotal.toFixed(2)})
            </button>
          </div>
        </div>
      </div>

      {/* Sale Success & Thermal Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-2xl space-y-3.5">
            <div className="text-center space-y-0.5">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-1.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sale Completed!</h3>
              <p className="text-xs text-slate-500">
                Transaction recorded in MySQL database & product stock auto-decremented.
              </p>
            </div>

            {/* Thermal Receipt Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 font-mono text-xs text-slate-700 space-y-2.5">
              <div className="text-center border-b border-slate-200 pb-1.5">
                <p className="font-bold text-xs text-slate-900">SMARTSTORE GROCERY</p>
                <p className="text-[9px] text-slate-500">1400 Market Street, San Francisco, CA</p>
                <p className="text-[9px] text-slate-500">Invoice: #{completedSale.invoice_no}</p>
                <p className="text-[9px] text-slate-500">{completedSale.sale_date}</p>
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto">
                {completedSale.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <span className="truncate pr-2">
                      {i.quantity}x {i.product_name}
                    </span>
                    <span>${i.total_price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-1.5 space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${completedSale.subtotal.toFixed(2)}</span>
                </div>
                {completedSale.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({completedSale.discount_code}):</span>
                    <span>-${completedSale.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>${completedSale.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-xs pt-1 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span>${completedSale.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
                  <span>Payment:</span>
                  <span>{completedSale.payment?.payment_method} ({completedSale.payment?.payment_reference})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Next Sale Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
