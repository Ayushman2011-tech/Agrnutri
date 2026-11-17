import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Package,
  ShoppingCart,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RetailerDashboard: React.FC = () => {
  const { currentUser, products, addToCart, setIsQrScannerOpen, showNotification } = useApp();

  const inventory = [
    {
      id: 'INV-01',
      title: 'Sambalpur Farm-Fresh Organic Vine Tomatoes',
      currentStock: '35 kg',
      reorderLevel: '50 kg',
      expiryStatus: 'Fresh (Best before 8 days)',
      alert: 'Low Stock Reorder Recommended',
      wholesalePrice: 28,
      source: 'Panda Krishi Bio-Farm',
    },
    {
      id: 'INV-02',
      title: 'GI-Tagged Kandhamal Pure Turmeric Powder',
      currentStock: '120 packs',
      reorderLevel: '30 packs',
      expiryStatus: 'Optimal (11 months)',
      alert: null,
      wholesalePrice: 125,
      source: 'Kandhamal Tribal Collective',
    },
    {
      id: 'INV-03',
      title: 'Koraput Kala Jeera Aromatic Rice',
      currentStock: '80 kg',
      reorderLevel: '40 kg',
      expiryStatus: 'Optimal (8 months)',
      alert: null,
      wholesalePrice: 110,
      source: 'Koraput Hill Agro',
    },
  ];

  const handleReorder = (item: typeof inventory[0]) => {
    const prod = products.find((p) => p.title.includes(item.title.slice(0, 15)));
    if (prod) {
      addToCart(prod, prod.minWholesaleQty || 50, true);
      showNotification(`Wholesale bulk re-order placed for ${prod.minWholesaleQty} ${prod.unit} of ${prod.title}!`);
    } else {
      showNotification(`Wholesale order for ${item.title} submitted to farmer cluster!`);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-amber-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-white shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Retail Storefront & Wholesale Hub
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                VERIFIED RETAILER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentUser.businessName || 'GreenRoots Organic Supermart'}
            </h1>
            <p className="text-xs text-amber-200">
              Retailer: {currentUser.name} · {currentUser.location || 'Bhubaneswar, Odisha'} (Multi-Store Direct Sourcing)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQrScannerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          <span>Verify Incoming QR Shipment</span>
        </button>
      </div>

      {/* Retail KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Retail GMV</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">₹1,42,800</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+22.4% vs last month</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Gross Retail Margin</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            28.5%
          </div>
          <span className="text-[10px] text-slate-500">Zero middleman markup</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Inventory Items</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">48 SKUs</div>
          <span className="text-[10px] text-slate-500">100% Traceability Bound</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Customer Re-Purchase</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">84%</div>
          <span className="text-[10px] text-slate-500">High Trust Verification</span>
        </div>
      </div>

      {/* AI Demand Forecasting Banner */}
      <div className="bg-amber-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-amber-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            AI Demand Forecast & Regional Trends (Odisha)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          • <strong>Organic Vine Tomatoes:</strong> Demand expected to surge by +34% ahead of the upcoming festival
          weekend in Bhubaneswar. Immediate wholesale re-order from Sambalpur cluster advised.
          <br />• <strong>Similipal Raw Honey:</strong> Consistent steady winter sales. Current stock buffer is 45 days.
        </p>
      </div>

      {/* Stock Inventory & Alerts Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Storefront Inventory & Expiry Management
          </h3>
          <span className="text-xs text-slate-500">Live stock sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Product Item</th>
                <th className="pb-3">Current Stock</th>
                <th className="pb-3">Wholesale Price (₹)</th>
                <th className="pb-3">Expiry / Freshness</th>
                <th className="pb-3">Supplier Origin</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {inventory.map((item) => (
                <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    <div>{item.title}</div>
                    {item.alert && (
                      <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        {item.alert}
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-bold">{item.currentStock}</td>
                  <td className="py-3 font-semibold text-emerald-600">₹{item.wholesalePrice}</td>
                  <td className="py-3">{item.expiryStatus}</td>
                  <td className="py-3">{item.source}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleReorder(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Wholesale Re-Order →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
