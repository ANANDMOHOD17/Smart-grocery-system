import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Phone,
  Mail,
  Award,
  DollarSign,
  ShoppingBag,
  Search,
  X,
} from 'lucide-react';
import { Customer, UserRole } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  userRole: UserRole;
  onAddCustomer: (cust: Omit<Customer, 'customer_id'>) => void;
  onUpdateCustomer: (id: number, cust: Partial<Customer>) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  userRole,
  onAddCustomer,
  onUpdateCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    loyalty_points: 0,
    total_spent: 0,
  });

  const filtered = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      customer_name: '',
      phone: '',
      email: '',
      loyalty_points: 0,
      total_spent: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData({
      customer_name: cust.customer_name,
      phone: cust.phone,
      email: cust.email,
      loyalty_points: cust.loyalty_points,
      total_spent: cust.total_spent,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.customer_id, formData);
    } else {
      onAddCustomer(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div id="customers-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Profiles & Loyalty
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store memberships, points ledger, purchase histories, and contact info (3NF Entity).
          </p>
        </div>

        <button
          id="btn-add-customer"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, phone, email..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Customer Name</th>
              <th className="py-2.5 px-4">Phone</th>
              <th className="py-2.5 px-4">Email</th>
              <th className="py-2.5 px-4">Loyalty Points</th>
              <th className="py-2.5 px-4">Orders</th>
              <th className="py-2.5 px-4">Total Spent</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.map((c) => (
              <tr key={c.customer_id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                    {c.customer_name[0]}
                  </div>
                  <span>{c.customer_name}</span>
                </td>
                <td className="py-2.5 px-4 text-slate-600">{c.phone}</td>
                <td className="py-2.5 px-4 text-slate-500">{c.email || 'N/A'}</td>
                <td className="py-2.5 px-4">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] border border-amber-200">
                    <Award className="w-3 h-3" />
                    {c.loyalty_points} pts
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-700 font-semibold">{c.order_count || 0}</td>
                <td className="py-2.5 px-4 text-slate-900 font-bold font-mono">
                  ${c.total_spent.toFixed(2)}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                    title="Edit Customer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCustomer ? 'Edit Customer Info' : 'New Customer Registration'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 234-9988"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah.j@example.com"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loyalty Points</label>
                <input
                  type="number"
                  min="0"
                  value={formData.loyalty_points}
                  onChange={(e) =>
                    setFormData({ ...formData, loyalty_points: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
