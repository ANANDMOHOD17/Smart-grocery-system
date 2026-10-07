import React, { useState } from 'react';
import {
  Settings,
  Store,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Database,
  Sliders,
} from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  currentUser: User;
  onResetDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onResetDatabase }) => {
  const [storeName, setStoreName] = useState('SmartStore Grocery & Supermarket');
  const [storeAddress, setStoreAddress] = useState('1400 Market Street, Suite 200, San Francisco, CA');
  const [storePhone, setStorePhone] = useState('+1 (555) 019-2834');
  const [taxRate, setTaxRate] = useState(5.0);
  const [expiryWarningDays, setExpiryWarningDays] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view" className="p-6 sm:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store metadata, tax rules, threshold triggers, and database maintenance.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Store Profile */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" />
            <span>Store Profile & Receipt Header</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Phone Number</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store Address</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Financial & Alerts Rules */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Operational Rules & Triggers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Expiry Alert Threshold (Days in Advance)
              </label>
              <input
                type="number"
                value={expiryWarningDays}
                onChange={(e) => setExpiryWarningDays(parseInt(e.target.value) || 30)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save System Settings</span>
        </button>
      </form>

      {/* Database Maintenance / Reset Section */}
      <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-rose-600" />
          <span>Database Maintenance & Seeding</span>
        </h3>
        <p className="text-xs text-slate-500">
          Reset all in-memory and local relational tables to initial 3NF sample dataset with clean transaction logs.
        </p>

        <button
          onClick={() => {
            if (confirm('Reset entire grocery database to initial sample records?')) {
              onResetDatabase();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Database</span>
        </button>
      </div>
    </div>
  );
};
