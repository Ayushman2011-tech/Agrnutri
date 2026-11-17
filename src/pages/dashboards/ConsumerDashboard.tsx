import React from 'react';
import {
  ShoppingBag,
  Heart,
  QrCode,
  ShieldCheck,
  Truck,
  FileText,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConsumerDashboard: React.FC = () => {
  const { currentUser, orders, wishlist, products, inspectBatch, setIsQrScannerOpen } = useApp();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center uppercase shadow-md shrink-0 ring-2 ring-emerald-400/40">
            {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Conscious Consumer Hub
              </span>
              <span className="text-[10px] bg-emerald-400 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded">
                {currentUser.membershipTier || 'Consumer Plus'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-emerald-200">
              Address: {currentUser.location || 'Cuttack, Odisha'} · Farm-Fresh Clean Food Subscriber
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQrScannerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md transition-all hover:bg-emerald-50 flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4 text-emerald-600" />
          <span>Scan Any Food QR Code</span>
        </button>
      </div>

      {/* Nutrition Health & Carbon Intake Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Farm Deliveries</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {orders.length} Orders
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Traceable</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Chemical Pesticides Avoided</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            0.00 ppm
          </div>
          <span className="text-[10px] text-slate-500">Zero synthetic residues</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Groundwater Conserved</span>
          <div className="text-xl sm:text-2xl font-black text-teal-600 mt-1">14,200 L</div>
          <span className="text-[10px] text-slate-500">Via solar drip partners</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Saved Farm Favorites</span>
          <div className="text-xl sm:text-2xl font-black text-rose-500 mt-1">
            {favoriteProducts.length} Items
          </div>
          <span className="text-[10px] text-slate-500">Direct cultivator alerts</span>
        </div>
      </div>

      {/* Orders & Invoices List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Your Farm Orders & Dispatch Journey
        </h3>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Order #{ord.id}
                  </div>
                  <div className="text-xs text-slate-500">
                    Placed on {ord.date} · Invoice: {ord.invoiceNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Status: {ord.status}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{ord.total} ({ord.paymentMethod})
                  </span>
                </div>
              </div>

              {/* Items row */}
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-medium">
                      {it.quantity}x {it.product.title} ({it.product.unit})
                    </span>
                    <button
                      onClick={() => inspectBatch(it.product.batchId)}
                      className="font-mono text-emerald-600 font-bold hover:underline"
                    >
                      Trace #{it.product.batchId} →
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <span>Estimated Arrival: {ord.deliveryDateEstimated}</span>
                <span className="text-emerald-600 font-bold">Doorstep Eco-Cooled Dispatch</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
