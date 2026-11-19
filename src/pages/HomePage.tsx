import React from 'react';
import {
  Sprout,
  QrCode,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Tractor,
  Factory,
  Store,
  Users,
  Sun,
  Droplets,
  Award,
  Leaf,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Search,
  ShieldAlert,
  Truck,
  Package,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { FOUNDERS } from '../data/mockData';
import ayushmanPhoto from '../assets/images/ayushman_panda_photo_1791617825930.jpg';
import { UserRole } from '../types';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const {
    products,
    setIsAiModalOpen,
    setIsQrScannerOpen,
    openFoodScanner,
    setActiveRole,
    inspectBatch,
    telemetry,
  } = useApp();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickTrace = (batchId: string) => {
    inspectBatch(batchId);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 py-16 sm:py-24 border-b border-emerald-100/60 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-6">
            {/* Super Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>AGRINUTRI FARM 2.0 · Founded by Ayushman Panda & Gourav Soren (Odisha)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.18] space-y-1">
              <span className="block sm:whitespace-nowrap">One Smart Platform.</span>
              <span className="block sm:whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:to-teal-300">
                Four Connected Communities.
              </span>
              <span className="block sm:whitespace-nowrap">A More Sustainable Food Future.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              AgriNutri Farm connects farmers, producers, retailers, and consumers through AI-powered
              farming insights, agricultural e-commerce, verified product journeys, and sustainable resource
              management.
            </p>

            {/* Main CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsQrScannerOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Scan Product QR</span>
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask AgriNutri AI</span>
              </button>
            </div>

            {/* Quick 4-Role Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium mr-1">Join as:</span>
              <button
                onClick={() => handleRoleSelect('Farmer')}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 font-semibold"
              >
                🌱 Farmer
              </button>
              <button
                onClick={() => handleRoleSelect('Producer')}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 font-semibold"
              >
                🏭 Producer
              </button>
              <button
                onClick={() => handleRoleSelect('Retailer')}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 font-semibold"
              >
                🏪 Retailer
              </button>
              <button
                onClick={() => handleRoleSelect('Consumer')}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 font-semibold"
              >
                🥗 Consumer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Connected Communities (Role Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Unified Circular Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Each community receives an intelligent dashboard designed specifically for their operational and
            nutritional decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Farmer */}
          <div
            onClick={() => handleRoleSelect('Farmer')}
            className="group cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Farmers & Growers
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                AI crop yield forecasting, soil sensor telemetry, solar drip pump control, direct fair-price crop listings & batch QR generator.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
              <span>Open Farmer Hub</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: Producer */}
          <div
            onClick={() => handleRoleSelect('Producer')}
            className="group cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Processors & Mills
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Raw crop sourcing, batch lab tests, crop residue recovery into compost & certified provenance passports.
              </p>
            </div>
            <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
              <span>Open Producer Unit</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3: Retailer */}
          <div
            onClick={() => handleRoleSelect('Retailer')}
            className="group cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Retailers & Grocers
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Wholesale bulk ordering, MOQ tracking, AI demand forecasting & QR shipment authenticity inspections.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
              <span>Open Retail Portal</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4: Consumer */}
          <div
            onClick={() => handleRoleSelect('Consumer')}
            className="group cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Conscious Consumers
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Fresh organic vegetables, coffee, honey & millets. Scan QR for harvest date, nutrition profile & 0.00 ppm tests.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
              <span>Shop as Consumer</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 5: Platform Admin */}
          <div
            onClick={() => handleRoleSelect('Admin')}
            className="group cursor-pointer bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-700 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                  Platform Admin
                </h3>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Command center, real-time order stage manager, drone fleet telemetry, DBT farmer finance & GI certification.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
              <span>Open Admin Command</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Farm-Fresh Produce Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
              <span>Certified Natural Harvest</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Direct from Odisha’s Organic Fields
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentTab('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOpenTraceability={handleQuickTrace} />
          ))}
        </div>
      </section>

      {/* 4. Smart Food Intelligence Scanner & Comparator Banner (Feature 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-emerald-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>INNOVATION 10: SMART FOOD INTELLIGENCE SCANNER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Complete Food Transparency, Not Just a QR Page
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl">
                Scan any packaging barcode or pick from 26+ verified Odisha batches to inspect declared allergens, 0.00 ppm laboratory chemical assay certificates, exact farm GPS origin, storage cold-chain humidity, and compare verified nutritional profiles side-by-side.
              </p>

              {/* Note on food safety callout */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-emerald-100 space-y-1">
                <span className="font-bold text-amber-300 block">Verified Laboratory Records Assured:</span>
                <span>A camera image alone cannot reliably establish exact nutrients, pesticide residues or food safety. All claims and chemical residue limits (0.00 ppm) displayed are backed by accredited FSSAI & NPOP lab assay records.</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => openFoodScanner()}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-slate-950" />
                  <span>Launch Food Intelligence Scanner</span>
                </button>
                <button
                  onClick={() => openFoodScanner('AGRI-OD-2026-TOM')}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
                >
                  <span>Compare Nutrients Side-by-Side →</span>
                </button>
              </div>
            </div>

            {/* Visual Intelligence Profile Preview Card */}
            <div className="lg:col-span-5 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-emerald-300 font-bold">BATCH #AGRI-OD-2026-TOM</span>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded">
                  0.00 ppm ZERO RESIDUE
                </span>
              </div>

              {/* Ingredients & Allergens preview */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Declared Allergens:</span>
                  <span className="font-bold text-emerald-300">Gluten-Free · Dairy-Free · Nut-Free</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Testing Lab:</span>
                  <span className="font-semibold text-white">OSFL Bhubaneswar (NABL Accredited)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Glycemic Index:</span>
                  <span className="font-semibold text-amber-300">GI: 15 (Ultra Low / Diabetic Safe)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Storage Vault:</span>
                  <span className="font-semibold text-teal-300">Solar Cold Packhouse (12.8°C / 88% RH)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Eco-Score:</span>
                  <span className="font-bold text-emerald-400">96/100 (Grade A+ Carbon Negative)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-mono">Cert: NABL-OSFL-2026-90412</span>
                <button
                  onClick={() => openFoodScanner('AGRI-OD-2026-TOM')}
                  className="text-emerald-300 font-bold hover:underline"
                >
                  Full Food Profile →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Order Tracking & AI Logistics Optimizer (Feature 11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                <Truck className="w-3.5 h-3.5" />
                <span>INNOVATION 11: AI LOGISTICS & DELIVERY OPTIMIZER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Dynamic Routing, Cold Chain Telemetry & Order Pooling
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Suggest efficient delivery routes across Odisha's corridors, monitor temperature-sensitive shipments in real time, predict arrival times with terrain ML models, and combine nearby orders to cut transportation costs.
              </p>

              {/* Progress Bar Demo */}
              <div className="pt-2 space-y-3 max-w-xl">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Current Stage: In Transit · Cuttack-Bhubaneswar Expressway Hub
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">80% Complete</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-1.5 rounded-full w-4/5 animate-pulse" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span className="text-emerald-300">✓ Farm Confirmed</span>
                  <span className="text-emerald-300">✓ Dawn Packed</span>
                  <span className="text-emerald-300">✓ Dispatched</span>
                  <span className="text-amber-300 font-bold">● In Transit</span>
                  <span>Doorstep Delivery</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setCurrentTab('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Open "Your Orders" Tracking Hub</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('logistics');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>AI Logistics & Route Optimizer Hub →</span>
                </button>
              </div>
            </div>

            {/* Live Order Card Simulation */}
            <div className="lg:col-span-5 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                    #
                  </div>
                  <span className="font-mono text-xs font-bold text-white">ORD-98210 (Live Shipment)</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  In Transit
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Place of Shipping:</span>
                  <span className="font-semibold text-white">Koraput Agro Collective Hub, Odisha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Shipping Date:</span>
                  <span className="font-mono text-emerald-300">2026-10-10 (Dawn Dispatch)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Carrier Vehicle:</span>
                  <span className="font-semibold text-white">Odisha AgriCold Van OD-15-B-9901</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expected Delivery:</span>
                  <span className="font-bold text-amber-400">2026-10-12 · 02:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cold-Chain Temperature:</span>
                  <span className="font-mono text-teal-300 font-bold">4.2°C (Optimal)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium">Items: Koraput Coffee, Kala Jeera Rice</span>
                <span className="text-emerald-400 font-bold">₹1,940 Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Odisha Natural Heritage Agro-Corridors (District Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>Odisha Bio-Diversity Corridors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Natural Heritage Produce by District
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              From the mist-shrouded tribal highlands of Koraput to the pristine Similipal biosphere, explore GI-tagged organic treasures directly from indigenous growers.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentTab('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 shrink-0"
          >
            <span>Explore Entire 26+ Odisha Harvest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              district: 'Koraput Highlands',
              produce: 'Shade-Grown Arabica & Kala Jeera Rice',
              highlight: 'GI Certified · 1,000m Elevation',
              badge: 'Specialty Coffee',
              color: 'from-amber-600 to-amber-800',
            },
            {
              district: 'Kandhamal Hills',
              produce: 'Pure Curcumin Haldi & Dry Ginger',
              highlight: '5.2% High Curcumin · Zero Chemical',
              badge: 'GI Tagged Spice',
              color: 'from-yellow-600 to-amber-700',
            },
            {
              district: 'Mayurbhanj Similipal',
              produce: 'Similipal Wild Forest Raw Honey',
              highlight: 'Tribal Khadia Foraged · Unpasteurized',
              badge: 'Wild Honey',
              color: 'from-amber-500 to-amber-700',
            },
            {
              district: 'Sambalpur & Bargarh',
              produce: 'Hybrid Field Tomatoes & Desi Corn',
              highlight: 'Mahanadi Basin · High Lycopene',
              badge: 'Fresh Veggies',
              color: 'from-emerald-600 to-teal-700',
            },
            {
              district: 'Nayagarh (Kantilo)',
              produce: 'Crisp Kantilo Green Brinjal & Phula Badi',
              highlight: 'GI Protected · Rare Thornless Variety',
              badge: 'GI Vegetable',
              color: 'from-purple-600 to-indigo-700',
            },
            {
              district: 'Rayagada (Niyamgiri)',
              produce: 'Dongria Kondh Hill Honey Pineapple',
              highlight: 'Brix 16.5° Ultra Sweet · Forest Mulched',
              badge: 'Tribal Fruit',
              color: 'from-teal-600 to-emerald-700',
            },
            {
              district: 'Nuapada Orchards',
              produce: 'Sun-Ripened Desi Guavas (Amrud)',
              highlight: 'Vitamin C Rich · Natural Tree Ripened',
              badge: 'Farm Fruit',
              color: 'from-emerald-500 to-green-700',
            },
            {
              district: 'Keonjhar Plateau',
              produce: 'Artisanal Hand-Rolled Phula Badi',
              highlight: 'Sun-Dried Urad Fluff · Zero Additives',
              badge: 'Heritage Pulse',
              color: 'from-rose-600 to-pink-700',
            },
          ].map((corridor, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentTab('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    {corridor.badge}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                  {corridor.district}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 line-clamp-1">
                  {corridor.produce}
                </p>
                <div className="text-[11px] text-slate-500 mt-1">
                  {corridor.highlight}
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-700/50">
                <span>View Products</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Founders Spotlight Section (Ayushman Panda & Gourav Soren) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Pioneering Leadership from Odisha
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Conceived by Ayushman Panda & Gourav Soren
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentTab('founders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Full Founders Profile & Awards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner 1 Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start shadow-sm">
              <img
                src={ayushmanPhoto || '/images/ayushman_panda.jpg'}
                alt="Ayushman Panda"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-top shadow-md shrink-0 border-2 border-amber-400 ring-2 ring-amber-400/30"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {FOUNDERS[0].name}
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                    Co-Founder
                  </span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {FOUNDERS[0].hometown}, {FOUNDERS[0].state} · {FOUNDERS[0].title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  National awarded entrepreneur and strategic visionary. Master at creating high-scale websites
                  and co-architect of AgriNutri V1.0 prototype.
                </p>
              </div>
            </div>

            {/* Owner 2 Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-start shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-teal-400 via-teal-300 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0 ring-2 ring-teal-400/30">
                GS
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {FOUNDERS[1].name}
                  </h3>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                    Co-Founder
                  </span>
                </div>
                <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                  {FOUNDERS[1].hometown}, {FOUNDERS[1].state} · {FOUNDERS[1].title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Master at web designing & framework architecture. Ideation engine behind AgriNutri V1.0,
                  turning indigenous tribal farm produce into accessible digital commerce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Smart Farming & Sustainability Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Solar Drip Irrigation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Conserving up to 40% agricultural groundwater. Current soil moisture telemetry registers{' '}
              <strong className="text-emerald-600">{telemetry.soilMoisture}% (Optimal)</strong>.
            </p>
            <button
              onClick={() => setCurrentTab('sustainability')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              View Telemetry Hub →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Solar Energy & Storage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Micro-grid solar array generated{' '}
              <strong className="text-amber-600">{telemetry.solarGenerationKw} kW</strong> with battery charge at{' '}
              <strong className="text-amber-600">{telemetry.solarBatteryCharge}%</strong>.
            </p>
            <button
              onClick={() => setCurrentTab('sustainability')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Simulate Solar Pumps →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Circular Waste Upcycling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Over <strong className="text-teal-600">{telemetry.compostWasteDivertedKg.toLocaleString()} kg</strong>{' '}
              of farm residue transformed into rich bio-fertilizer, offsetting {telemetry.co2OffsetTons}T CO₂.
            </p>
            <button
              onClick={() => setCurrentTab('sustainability')}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              Circular Reports →
            </button>
          </div>
        </div>

        {/* Farmer Video Academy Promo Banner on HomePage */}
        <div className="mt-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Agronomy Learning
            </span>
            <h3 className="text-xl font-extrabold text-white">
              Farmer Interactive Video Academy: Drones, Weather & Sensors
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step-by-step masterclasses with animated flight HUDs, Doppler weather radar sweeps, soil moisture depth curves, and custom AI video generation.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentTab('tutorials');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <span>Explore Video Academy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
