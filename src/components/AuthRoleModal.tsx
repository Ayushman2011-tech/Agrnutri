import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Tractor, Factory, Store, Users, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/mockData';
import { UserRole } from '../types';

export const AuthRoleModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    setActiveRole,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Farmer');
  const [newUserLocation, setNewUserLocation] = useState('Odisha, India');

  if (!isAuthModalOpen) return null;

  const handleSelectUser = (user: typeof INITIAL_USERS[0]) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsAuthModalOpen(false);
    showNotification(`Active account switched to ${user.name} (${user.role})`);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const createdUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '')}@agrinutrifarm.org`,
      role: newUserRole,
      location: newUserLocation,
      membershipTier: `${newUserRole} Starter`,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    setCurrentUser(createdUser);
    setActiveRole(newUserRole);
    setIsAuthModalOpen(false);
    showNotification(`Welcome to AgriNutri Farm 2.0, ${newUserName}! Profile activated.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account & Persona Hub
              </h3>
              <p className="text-[11px] text-slate-500">
                Experience dashboards across all 4 ecosystem roles
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="mt-4 flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'switch'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Switch Existing Persona
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Register New Account
          </button>
        </div>

        {activeTab === 'switch' ? (
          <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">
              Select any role to test its custom dashboard:
            </span>
            {INITIAL_USERS.map((usr) => {
              const isSelected = currentUser.id === usr.id;
              return (
                <button
                  key={usr.id}
                  onClick={() => handleSelectUser(usr)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {usr.avatar ? (
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-10 h-10 rounded-2xl object-cover object-top border-2 border-amber-400 shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm uppercase">
                        {usr.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{usr.name}</span>
                        {usr.id.startsWith('user-ayushman') && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-extrabold">
                            Co-Founder
                          </span>
                        )}
                        {usr.id.startsWith('user-gourav') && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-extrabold">
                            Co-Founder
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {usr.role} · {usr.location}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600">
                    {isSelected ? 'Active ✓' : 'Switch →'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyadarshi Dash"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Account Category / Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Farmer">Farmer (Cultivator & Seller)</option>
                <option value="Producer">Producer / Processor (Milling & Batching)</option>
                <option value="Retailer">Retailer (Wholesale & Storefront)</option>
                <option value="Consumer">Consumer (Fresh Produce Buyer)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Location / State</label>
              <input
                type="text"
                value={newUserLocation}
                onChange={(e) => setNewUserLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md mt-2"
            >
              Register & Launch Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
