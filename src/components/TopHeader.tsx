import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { User, LowStockAlert, ExpiryAlert } from '../types';

interface TopHeaderProps {
  currentUser: User;
  onSwitchUser: (role: 'Admin' | 'Staff') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lowStockAlerts: LowStockAlert[];
  expiryAlerts: ExpiryAlert[];
  onOpenViva: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onSwitchUser,
  searchQuery,
  setSearchQuery,
  lowStockAlerts,
  expiryAlerts,
  onOpenViva,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalAlertCount = lowStockAlerts.length + expiryAlerts.length;

  return (
    <header
      id="top-header"
      className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs"
    >
      {/* Title / Brand Context */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden md:block">
          Command Center Overview
        </h2>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-4 sm:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, categories, batches..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live MySQL / 3NF Link Status Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full text-xs text-slate-600 font-medium border border-slate-200/60">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          <span>Live 3NF SQL Link: Active</span>
        </div>

        {/* DBMS Viva Quick Badge */}
        <button
          id="btn-quick-viva"
          onClick={onOpenViva}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
          title="Open DBMS Viva & SQL Console"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>DBMS Viva</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alerts & Notifications</span>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  {totalAlertCount} active
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {lowStockAlerts.map((item) => (
                  <div key={item.product_id} className="p-3 hover:bg-slate-50 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{item.product_name}</p>
                      <p className="text-slate-500">
                        Low Stock: <strong className="text-amber-600">{item.quantity} left</strong> (Min: {item.min_stock})
                      </p>
                    </div>
                  </div>
                ))}

                {expiryAlerts.map((item) => (
                  <div key={item.product_id} className="p-3 hover:bg-slate-50 flex items-start gap-2.5 text-xs">
                    <Clock className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{item.product_name}</p>
                      <p className="text-slate-500">
                        Expires in <strong className="text-rose-600">{item.days_remaining} days</strong> (Batch: {item.batch_number})
                      </p>
                    </div>
                  </div>
                ))}

                {totalAlertCount === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active warnings or stock alerts.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help / DBMS Quick Guide */}
        <button
          id="btn-help-guide"
          onClick={onOpenViva}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="College Project Information & SQL Architecture"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar & Switcher */}
        <div className="relative">
          <button
            id="btn-user-profile"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {currentUser.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight">{currentUser.full_name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Account</p>
                <p className="font-semibold text-xs text-slate-800">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>

              <div className="p-2 space-y-1">
                <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role Persona</p>
                <button
                  onClick={() => {
                    onSwitchUser('Admin');
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    currentUser.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin (Full Access)</span>
                  </div>
                  {currentUser.role === 'Admin' && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('Staff');
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    currentUser.role === 'Staff' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Staff (Billing & Stock)</span>
                  </div>
                  {currentUser.role === 'Staff' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
