import React, { useState } from 'react';
import {
  Sprout,
  QrCode,
  Sparkles,
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  X,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Store,
  Factory,
  Tractor,
  Users,
  Video,
  Package,
  Truck,
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
    { id: 'orders', label: 'Your Orders', badge: 'Live' },
    { id: 'dashboard', label: `${activeRole} Hub` },
  ];

  const secondaryNavLinks = [
    { id: 'logistics', label: 'Logistics Optimizer', badge: 'New', icon: Truck },
    { id: 'tutorials', label: 'Farmer Academy', badge: 'Video', icon: Video },
    { id: 'sustainability', label: 'Sustainability Score', icon: Sprout },
    { id: 'pricing', label: 'Membership Plans', icon: Package },
    { id: 'founders', label: 'Founders & Story', icon: Users },
  ];

  const navLinks = [...primaryNavLinks, ...secondaryNavLinks];
  const isSecondaryActive = secondaryNavLinks.some((l) => l.id === currentTab);

  const roleOptions: { role: UserRole; icon: any; desc: string }[] = [
    { role: 'Farmer', icon: Tractor, desc: 'Cultivation & Harvest Listings' },
    { role: 'Producer', icon: Factory, desc: 'Processing & Batch Records' },
    { role: 'Retailer', icon: Store, desc: 'Wholesale Orders & Inventory' },
    { role: 'Consumer', icon: Users, desc: 'Fresh Produce & Nutrition' },
    { role: 'Admin', icon: ShieldAlert, desc: 'Platform Moderation & Rates' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Announcement / Provenance Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-emerald-100 text-[11px] py-1.5 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">AgriNutri Farm 2.0</span>
            <span className="hidden sm:inline text-emerald-300/80">
              · Smart Circular Farm-to-Consumer Ecosystem · Founded by Ayushman Panda &amp; Gourav Soren (Odisha)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-emerald-300">
            <span className="hidden md:inline">0.00 ppm Chemical Assay</span>
            <span className="hidden md:inline text-emerald-700">|</span>
            <span>Gemini 4 AI Live</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:via-teal-300 dark:to-white bg-clip-text text-transparent">
                  AgriNutri Farm
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  2.0
                </span>
              </div>
              <span className="hidden xl:block text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                From Smart Farming to Trusted Food
              </span>
            </div>
          </button>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsMoreMenuOpen(false);
                    setIsRoleDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsMoreMenuOpen((prev) => !prev);
                  setIsRoleDropdownOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  isSecondaryActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50"
                  onClick={() => setIsMoreMenuOpen(false)}
                >
                  {secondaryNavLinks.map((link) => {
                    const Icon = link.icon;
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
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{link.label}</span>
                        </span>
                        {link.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold">
                            {link.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleDropdownOpen((prev) => !prev);
                  setIsMoreMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap shrink-0"
                title="Switch active stakeholder role"
              >
                <span className="hidden xl:inline text-emerald-600/80 dark:text-emerald-400/80 font-semibold">Role:</span>
                <span>{activeRole}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Switch Community Role
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        setActiveRole(opt.role);
                        setCurrentTab('dashboard');
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 text-left text-xs transition-colors ${
                        activeRole === opt.role
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <opt.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{opt.role}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Food Intelligence Scanner */}
            <button
              onClick={() => openFoodScanner()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              title="Open Smart Food Intelligence Scanner"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline">Scanner</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white font-extrabold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Account */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title="Account Profile"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-lg object-cover object-top shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center uppercase">
                  {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <span className="max-w-[76px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>

            {/* Primary AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap shrink-0"
              title="Open AgriNutri AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AgriNutri AI</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsQrScannerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white"
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
