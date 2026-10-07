import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  X,
  Apple,
  Milk,
  Croissant,
  Beef,
  Coffee,
  Cookie,
  Snowflake,
  HelpCircle,
} from 'lucide-react';
import { Category, UserRole } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  userRole: UserRole;
  onAddCategory: (cat: Omit<Category, 'category_id'>) => void;
  onUpdateCategory: (id: number, cat: Partial<Category>) => void;
  onDeleteCategory: (id: number) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  userRole,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    icon_name: 'Layers',
    color_code: '#3B82F6',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      category_name: '',
      description: '',
      icon_name: 'Layers',
      color_code: '#3B82F6',
      status: 'Active',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      category_name: cat.category_name,
      description: cat.description || '',
      icon_name: cat.icon_name || 'Layers',
      color_code: cat.color_code || '#3B82F6',
      status: cat.status,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        onUpdateCategory(editingCategory.category_id, formData);
      } else {
        onAddCategory(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category');
    }
  };

  const renderIcon = (name: string, color: string) => {
    const iconProps = { className: 'w-5 h-5', style: { color } };
    switch (name) {
      case 'Apple':
        return <Apple {...iconProps} />;
      case 'Milk':
        return <Milk {...iconProps} />;
      case 'Croissant':
        return <Croissant {...iconProps} />;
      case 'Beef':
        return <Beef {...iconProps} />;
      case 'Coffee':
        return <Coffee {...iconProps} />;
      case 'Cookie':
        return <Cookie {...iconProps} />;
      case 'Snowflake':
        return <Snowflake {...iconProps} />;
      default:
        return <Layers {...iconProps} />;
    }
  };

  return (
    <div id="categories-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize grocery aisles, departments, and catalog classifications (3NF Entity).
          </p>
        </div>

        {userRole === 'Admin' && (
          <button
            id="btn-add-category"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.category_id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{ backgroundColor: `${cat.color_code}15`, borderColor: `${cat.color_code}30` }}
                >
                  {renderIcon(cat.icon_name, cat.color_code)}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    cat.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2.5">{cat.category_name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                {cat.product_count || 0} Products
              </span>

              {userRole === 'Admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.category_name}"?`)) {
                        try {
                          onDeleteCategory(cat.category_id);
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5">
              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="e.g. Organic Produce"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of items..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-full h-8 p-0.5 border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
