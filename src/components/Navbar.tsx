import React, { useState } from 'react';
import {
  Sprout,
  QrCode,
  Sparkles,
  Leaf,
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  X,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Award,
  Store,
  Factory,
  Tractor,
  Users,
  Truck,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    theme,
    toggleTheme,
    currentUser,
    activeRole,
    setActiveRole,
    cartItemsCount,
    orders,
    setIsAiModalOpen,
    setIsQrScannerOpen,
    openFoodScanner,
    setIsCartDrawerOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'smart-farming', label: 'Smart Farming' },
    { id: 'orders', label: 'Your Orders' },
    { id: 'dashboard', label: `${activeRole} Hub` },
  ];

  const secondaryNavLinks = [
    { id: 'logistics', label: 'AI Logistics' },
    { id: 'sustainability', label: 'Sustainability & Score' },
    { id: 'tutorials', label: 'Farmer Academy' },
    { id: 'pricing', label: 'Membership' },
    { id: 'founders', label: 'Founders' },
  ];

  const navLinks = [...primaryNavLinks, ...secondaryNavLinks];
  const isSecondaryActive = secondaryNavLinks.some((l) => l.id === currentTab);

  const roleOptions: { role: UserRole; icon: any; desc: string }[] = [
    { role: 'Farmer', icon: Tractor, desc: 'Cultivation & Harvest Listings' },
    { role: 'Producer', icon: Factory, desc: 'Processing & Batch Management' },
    { role: 'Retailer', icon: Store, desc: 'Wholesale Orders & Inventory' },
    { role: 'Consumer', icon: Users, desc: 'Fresh Produce & Nutrition' },
    { role: 'Admin', icon: ShieldAlert, desc: 'Platform Moderation & Rates' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors">
      {/* Top Banner Alert / Odisha Founders ticker */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs gap-4">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="truncate">
              <strong>AgriNutri Farm 2.0:</strong> Smart Circular Farm-to-Consumer Ecosystem · Founded by{' '}
              <strong className="underline decoration-emerald-400">Ayushman Panda</strong> (Sambalpur) &{' '}
              <strong className="underline decoration-emerald-400">Gourav Soren</strong> (Mayurbhanj)
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-emerald-200 whitespace-nowrap shrink-0">
            <span>Odisha Bio-Cluster V2.0</span>
            <span>·</span>
            <span>GI-Certified Produce</span>
            <span>·</span>
            <span>100% Traceable</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo & Tagline */}
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  AgriNutri <span className="text-emerald-600 dark:text-emerald-400">Farm 2.0</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-normal hidden xl:block">
                From Smart Farming to Trusted Food
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsMoreMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* More Dropdown for secondary ecosystem modules */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsMoreMenuOpen((prev) => !prev);
                  setIsRoleDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSecondaryActive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Explore</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50"
                  onClick={() => setIsMoreMenuOpen(false)}
                >
                  {secondaryNavLinks.map((link) => {
                    const isActive = currentTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          setCurrentTab(link.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                title="Switch User Role to test different dashboards"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-normal">Role:</span>
                <span>{activeRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Your Persona
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        setActiveRole(opt.role);
                        setCurrentTab('dashboard');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors ${
                        activeRole === opt.role
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <opt.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{opt.role}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Food Intelligence Scanner Button */}
            <button
              onClick={() => openFoodScanner()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Open Smart Food Intelligence Scanner & Nutrient Comparator"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Food Scanner</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
              title="Open AgriNutri AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AgriNutri AI</span>
            </button>

            {/* Your Orders Trigger */}
            <button
              onClick={() => {
                setCurrentTab('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative p-2 rounded-lg transition-colors ${
                currentTab === 'orders'
                  ? 'bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Track Your Orders & Shipments"
            >
              <Truck className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Account Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title="User Account"
            >
              <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover object-top border border-amber-400 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center uppercase shadow-sm">
                  {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{link.label}</span>
              {currentTab === link.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsQrScannerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
