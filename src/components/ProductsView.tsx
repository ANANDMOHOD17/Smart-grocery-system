import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Package,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  X,
  PlusCircle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Product, Category, Supplier, UserRole } from '../types';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  userRole: UserRole;
  onAddProduct: (prod: Omit<Product, 'product_id'>) => void;
  onUpdateProduct: (id: number, prod: Partial<Product>) => void;
  onDeleteProduct: (id: number) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  categories,
  suppliers,
  userRole,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    sku: string;
    product_name: string;
    category_id: number;
    supplier_id: number;
    barcode: string;
    unit: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    min_stock: number;
    manufacturing_date: string;
    expiry_date: string;
    batch_number: string;
  }>({
    sku: '',
    product_name: '',
    category_id: categories[0]?.category_id || 1,
    supplier_id: suppliers[0]?.supplier_id || 1,
    barcode: '',
    unit: 'pcs',
    purchase_price: 1.0,
    selling_price: 1.99,
    quantity: 50,
    min_stock: 15,
    manufacturing_date: '2026-08-10',
    expiry_date: '2026-09-10',
    batch_number: 'B-101',
  });

  const [formError, setFormError] = useState('');
  const [barcodeModalProduct, setBarcodeModalProduct] = useState<Product | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.product_name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search));

      const matchCat =
        selectedCategory === 'All' ||
        p.category_id.toString() === selectedCategory ||
        p.category_name === selectedCategory;

      const matchSup =
        selectedSupplier === 'All' ||
        p.supplier_id.toString() === selectedSupplier ||
        p.supplier_name === selectedSupplier;

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchSearch && matchCat && matchSup && matchStatus;
    });
  }, [products, search, selectedCategory, selectedSupplier, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const nextSkuNum = String(products.length + 1).padStart(3, '0');
    setFormData({
      sku: `PRD-${nextSkuNum}`,
      product_name: '',
      category_id: categories[0]?.category_id || 1,
      supplier_id: suppliers[0]?.supplier_id || 1,
      barcode: `890100${Math.floor(1000 + Math.random() * 9000)}`,
      unit: 'pcs',
      purchase_price: 1.5,
      selling_price: 2.99,
      quantity: 50,
      min_stock: 15,
      manufacturing_date: '2026-08-10',
      expiry_date: '2026-09-10',
      batch_number: `B-${Math.floor(100 + Math.random() * 900)}`,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      product_name: product.product_name,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      barcode: product.barcode || '',
      unit: product.unit || 'pcs',
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      quantity: product.quantity,
      min_stock: product.min_stock,
      manufacturing_date: product.manufacturing_date || '2026-08-10',
      expiry_date: product.expiry_date || '2026-09-10',
      batch_number: product.batch_number || 'B-101',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!formData.sku.trim()) {
      setFormError('SKU is required.');
      return;
    }
    if (formData.selling_price < formData.purchase_price) {
      setFormError('Selling price must be greater than or equal to purchase cost.');
      return;
    }

    if (editingProduct) {
      onUpdateProduct(editingProduct.product_id, {
        ...formData,
        category_name: categories.find((c) => c.category_id === Number(formData.category_id))?.category_name,
        supplier_name: suppliers.find((s) => s.supplier_id === Number(formData.supplier_id))?.supplier_name,
      });
    } else {
      onAddProduct({
        ...formData,
        category_id: Number(formData.category_id),
        supplier_id: Number(formData.supplier_id),
        status: formData.quantity === 0 ? 'Out of Stock' : formData.quantity <= formData.min_stock ? 'Low Stock' : 'In Stock',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div id="products-management-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header matching Image 3.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store inventory, 3NF schema pricing, and supplier records.
          </p>
        </div>

        {userRole === 'Admin' && (
          <button
            id="btn-add-new-product"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar (matching High Density) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-products"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products by title, SKU, or barcode..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <select
              id="select-filter-category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Category"
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id.toString()}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Dropdown */}
          <div className="w-full md:w-48">
            <select
              id="select-filter-supplier"
              value={selectedSupplier}
              onChange={(e) => {
                setSelectedSupplier(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Supplier"
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id.toString()}>
                  {s.supplier_name}
                </option>
              ))}
            </select>
          </div>

          {/* More Filters Toggle */}
          <button
            id="btn-more-filters"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              showMoreFilters || statusFilter !== 'All'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {showMoreFilters && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500">Filter by Status:</span>
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table (matching High Density) */}
      <div
        id="products-table-card"
        className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-5">ID / SKU</th>
                <th className="py-2.5 px-5">PRODUCT NAME</th>
                <th className="py-2.5 px-5">CATEGORY</th>
                <th className="py-2.5 px-5">SUPPLIER</th>
                <th className="py-2.5 px-5">COST</th>
                <th className="py-2.5 px-5">PRICE</th>
                <th className="py-2.5 px-5">STOCK</th>
                <th className="py-2.5 px-5">STATUS</th>
                <th className="py-2.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedProducts.map((product) => {
                const isOutOfStock = product.quantity === 0;
                const isLowStock = product.quantity > 0 && product.quantity <= product.min_stock;

                return (
                  <tr
                    key={product.product_id}
                    id={`product-row-${product.product_id}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* ID / SKU */}
                    <td className="py-3 px-5 text-slate-500 font-mono">
                      #{product.sku}
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-5 font-semibold text-slate-900">
                      <div>
                        <span>{product.product_name}</span>
                        {product.batch_number && (
                          <span className="ml-2 text-[10px] text-slate-400 font-mono">
                            [{product.batch_number}]
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-5 text-slate-700">
                      {product.category_name}
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-5 text-slate-700">
                      {product.supplier_name}
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-5 text-slate-500 font-mono">
                      ${product.purchase_price.toFixed(2)}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-5 text-slate-900 font-semibold font-mono">
                      ${product.selling_price.toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-5">
                      <span
                        className={`font-semibold ${
                          isOutOfStock
                            ? 'text-rose-600 font-bold'
                            : isLowStock
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-800'
                        }`}
                      >
                        {product.quantity} {product.unit}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isOutOfStock
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : isLowStock
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setBarcodeModalProduct(product)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          title="View Barcode / SKU Label"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        {userRole === 'Admin' && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${product.product_name}"?`)) {
                                onDeleteProduct(product.product_id);
                              }
                            }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                    No products matched your search filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product Catalog Item' : 'Add New Grocery Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="e.g. Organic Avocados (Pack of 4)"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SKU Code * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="PROD-001"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs uppercase font-mono"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Barcode / EAN-13
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="8901001001"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Category (3NF FK) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category (FK) *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier (3NF FK) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supplier (FK) *
                  </label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier_id: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    {suppliers.map((s) => (
                      <option key={s.supplier_id} value={s.supplier_id}>
                        {s.supplier_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="pack">Pack / Box</option>
                    <option value="bottle">Bottle</option>
                    <option value="litre">Litre</option>
                    <option value="loaf">Loaf</option>
                    <option value="carton">Carton</option>
                  </select>
                </div>

                {/* Batch Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    placeholder="B-101"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs uppercase"
                  />
                </div>

                {/* Purchase Cost */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Purchase Cost ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchase_price}
                    onChange={(e) =>
                      setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.selling_price}
                    onChange={(e) =>
                      setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Current Quantity */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Min Stock Alert Threshold */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Min Stock Threshold *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.min_stock}
                    onChange={(e) =>
                      setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Manufacturing Date */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    value={formData.manufacturing_date}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturing_date: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Preview Modal */}
      {barcodeModalProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full text-center space-y-3 border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Product Barcode Label</h3>
            <p className="text-xs text-slate-500">{barcodeModalProduct.product_name}</p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-1.5">
              <div className="font-mono text-2xl tracking-widest text-slate-800 font-bold">
                ||| | |||| | |||
              </div>
              <div className="font-mono text-xs font-bold text-slate-600">
                {barcodeModalProduct.barcode || barcodeModalProduct.sku}
              </div>
              <div className="text-xs font-bold text-indigo-600">
                ${barcodeModalProduct.selling_price.toFixed(2)} / {barcodeModalProduct.unit}
              </div>
            </div>

            <button
              onClick={() => setBarcodeModalProduct(null)}
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
