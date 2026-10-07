import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  Users,
  ShoppingCart,
  ReceiptText,
  Warehouse,
  BarChart3,
  Settings,
  LogOut,
  Database,
  Store,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { ActiveTab, User } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  onLogout: () => void;
  lowStockCount: number;
  expiringCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  lowStockCount,
  expiringCount,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as ActiveTab, label: 'Products', icon: Package },
    { id: 'categories' as ActiveTab, label: 'Categories', icon: Layers },
    { id: 'suppliers' as ActiveTab, label: 'Suppliers', icon: Truck },
    { id: 'customers' as ActiveTab, label: 'Customers', icon: Users },
    { id: 'purchases' as ActiveTab, label: 'Purchases', icon: ShoppingCart },
    { id: 'sales' as ActiveTab, label: 'Sales & POS', icon: ReceiptText },
    {
      id: 'inventory' as ActiveTab,
      label: 'Inventory',
      icon: Warehouse,
      badge: lowStockCount > 0 ? `${lowStockCount}` : undefined,
    },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: BarChart3 },
    {
      id: 'dbms_viva' as ActiveTab,
      label: 'DBMS Viva & SQL',
      icon: Database,
      highlight: true,
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-60 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0">
          S
        </div>
        <div className="overflow-hidden">
          <h1 className="text-white font-bold text-base tracking-tight leading-tight truncate">
            SMART STORE
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">DBMS Command Center</p>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              currentUser.role === 'Admin' ? 'bg-green-500' : 'bg-indigo-400'
            } animate-pulse`}
          />
          <span className="text-xs font-semibold text-slate-300">
            {currentUser.role} Mode
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold">
          3NF DB
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.highlight && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VIVA
                  </span>
                )}
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Alert Counters */}
      <div className="px-3 py-2.5 mx-3 mb-2 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Low Stock:
          </span>
          <span className="font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded text-[10px]">
            {lowStockCount} items
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Expiring (30d):
          </span>
          <span className="font-semibold text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded text-[10px]">
            {expiringCount} items
          </span>
        </div>
      </div>

      {/* Footer Nav (Settings, User & Logout) */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-2.5 bg-slate-800 p-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-indigo-400 text-slate-900 font-bold flex items-center justify-center text-xs flex-shrink-0">
            {currentUser.full_name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.full_name}</p>
            <p className="text-[10px] opacity-60 text-slate-300 truncate">{currentUser.role === 'Admin' ? 'Store Manager' : 'Cashier Staff'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 pt-1">
          <button
            id="nav-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <button
            id="nav-btn-logout"
            onClick={onLogout}
            className="flex items-center justify-center p-1.5 rounded-md text-xs text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
            title="Switch User"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
