import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Store, Lock, User as UserIcon, Check } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (role: UserRole) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/30">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-2">SmartStore MS Login</h3>
          <p className="text-xs text-slate-500">
            Select an account persona to test Role-Based Access Control (RBAC).
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Admin Persona Card */}
          <div
            onClick={() => setSelectedRole('Admin')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedRole === 'Admin'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Administrator (Alex Morgan)</h4>
                <p className="text-[11px] text-slate-500">Full CRUD, Inventory, Settings & SQL</p>
              </div>
            </div>
            {selectedRole === 'Admin' && <Check className="w-4 h-4 text-indigo-600" />}
          </div>

          {/* Staff Persona Card */}
          <div
            onClick={() => setSelectedRole('Staff')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedRole === 'Staff'
                ? 'border-green-600 bg-green-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Staff Cashier (Sarah Jenkins)</h4>
                <p className="text-[11px] text-slate-500">Sales & POS Billing, Stock Lookup</p>
              </div>
            </div>
            {selectedRole === 'Staff' && <Check className="w-4 h-4 text-green-600" />}
          </div>
        </div>

        <button
          onClick={() => onLogin(selectedRole)}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Proceed into System as {selectedRole}
        </button>
      </div>
    </div>
  );
};
