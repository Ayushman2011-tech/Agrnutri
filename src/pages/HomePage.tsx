import React from 'react';
import {
  QrCode,
  ArrowRight,
  Tractor,
  Factory,
  Store,
  Users,
  ShieldAlert,
  Droplets,
  Sun,
  Sprout,
  Truck,
  Package,
  MapPin,
  Sparkles,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Play,
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

  const corridors = [
    {
      district: 'Koraput Highlands',
      produce: 'Shade-Grown Arabica & Kala Jeera Rice',
      detail: 'GI Certified · 1,000m Elevation',
      category: 'Specialty Coffee',
    },
    {
      district: 'Kandhamal Hills',
      produce: 'Pure Curcumin Haldi & Dry Ginger',
      detail: '5.2% Curcumin · Zero Chemical',
      category: 'GI Spice',
    },
    {
      district: 'Mayurbhanj Similipal',
      produce: 'Similipal Wild Forest Raw Honey',
      detail: 'Tribal Khadia Foraged · Raw',
      category: 'Wild Honey',
    },
    {
      district: 'Sambalpur & Bargarh',
      produce: 'Field Vine Tomatoes & Desi Corn',
      detail: 'Mahanadi Basin · High Lycopene',
      category: 'Fresh Produce',
    },
    {
      district: 'Nayagarh (Kantilo)',
      produce: 'Kantilo Green Brinjal & Phula Badi',
      detail: 'GI Protected · Heirloom Variety',
      category: 'Heritage Crop',
    },
    {
      district: 'Rayagada (Niyamgiri)',
      produce: 'Dongria Kondh Hill Honey Pineapple',
      detail: 'Brix 16.5° · Forest Mulched',
      category: 'Orchard Fruit',
    },
    {
      district: 'Nuapada Orchards',
      produce: 'Sun-Ripened Desi Guavas (Amrud)',
      detail: 'Tree Ripened · Vitamin C Rich',
      category: 'Farm Fruit',
    },
    {
      district: 'Keonjhar Plateau',
      produce: 'Artisanal Hand-Rolled Phula Badi',
      detail: 'Sun-Dried Urad · Zero Additives',
      category: 'Heritage Pulse',
    },
  ];

  const communities: {
    role: UserRole;
    title: string;
    summary: string;
    cta: string;
    icon: React.ElementType;
    accent: string;
  }[] = [
    {
      role: 'Farmer',
      title: 'Farmers & Growers',
      summary:
        'Crop yield forecasting, soil nutrient heat-maps, solar drip control, climate alerts, fair-price harvest listings, and batch QR generation.',
      cta: 'Open Farmer Hub',
      icon: Tractor,
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      role: 'Producer',
      title: 'Producers & Mills',
      summary:
        'Raw crop sourcing, NABL batch laboratory records, residue recovery into compost, and verified provenance passports.',
      cta: 'Open Producer Unit',
      icon: Factory,
      accent: 'from-teal-500 to-cyan-600',
    },
    {
      role: 'Retailer',
      title: 'Retailers & Grocers',
      summary:
        'Direct wholesale ordering, minimum order quantity tracking, demand forecasting, and QR authenticity inspections.',
      cta: 'Open Retail Portal',
      icon: Store,
      accent: 'from-amber-500 to-orange-600',
    },
    {
      role: 'Consumer',
      title: 'Conscious Consumers',
      summary:
        'Fresh seasonal vegetables, highland coffee, wild honey, and millets backed by harvest dates and 0.00 ppm residue tests.',
      cta: 'Open Consumer View',
      icon: Users,
      accent: 'from-emerald-600 to-green-700',
    },
    {
      role: 'Admin',
      title: 'Platform Governance',
      summary:
        'Order stage management, agricultural fleet telemetry, direct farmer disbursements, and GI certification oversight.',
      cta: 'Open Admin Console',
      icon: ShieldAlert,
      accent: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="pb-20 space-y-16 sm:space-y-24">
      {/* 1. Vibrant Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/90 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950 pt-14 sm:pt-20 pb-16 border-b border-emerald-100 dark:border-slate-800/80">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AgriNutri Farm 2.0 · Smart Circular Food Ecosystem · Odisha</span>
            </div>

            {/* Exact 3 single-line hero headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] space-y-1">
              <span className="block sm:whitespace-nowrap">One Smart Platform.</span>
              <span className="block sm:whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Four Connected Communities.
              </span>
              <span className="block sm:whitespace-nowrap">A More Sustainable Food Future.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Founded by <strong className="text-slate-900 dark:text-white">Ayushman Panda</strong> (Sambalpur) &amp;{' '}
              <strong className="text-slate-900 dark:text-white">Gourav Soren</strong> (Mayurbhanj). Connecting farmers, processors, retailers, and households through AI agronomy, solar IoT sensors, and verified QR farm-to-fork traceability.
            </p>

            {/* Primary CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all inline-flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsQrScannerOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm transition-all inline-flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Scan Product QR</span>
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-emerald-950 hover:bg-slate-800 dark:hover:bg-emerald-900 text-white border border-emerald-500/30 font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AgriNutri AI</span>
              </button>
            </div>

            {/* Quick Live Stats Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                <div className="text-[10px] font-bold uppercase text-slate-400">Active Harvest Lots</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{products.length} Lots</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% QR Verified</div>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                <div className="text-[10px] font-bold uppercase text-slate-400">Live Soil Moisture</div>
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">{telemetry.soilMoisture}%</div>
                <div className="text-[11px] text-slate-500">Pump: {telemetry.irrigationPumpStatus}</div>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                <div className="text-[10px] font-bold uppercase text-slate-400">Chemical Residue</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">0.00 ppm</div>
                <div className="text-[11px] text-slate-500">NABL Lab Certified</div>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                <div className="text-[10px] font-bold uppercase text-slate-400">Solar Micro-Grid</div>
                <div className="text-2xl font-black text-amber-500 mt-0.5">{telemetry.solarGenerationKw} kW</div>
                <div className="text-[11px] text-slate-500">{telemetry.solarBatteryCharge}% Battery Stored</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Connected Communities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Connected Stakeholder Workspaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tailored Hubs for Every Role in the Food Chain
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Switch instantaneously between Farmer, Producer, Retailer, Consumer, and Admin dashboards with synced real-time state.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {communities.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.role}
                onClick={() => handleRoleSelect(item.role)}
                className="group text-left bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Farm-Fresh Produce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Certified Direct Harvests
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Fresh from Odisha’s Organic Bio-Clusters
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentTab('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5"
          >
            <span>Browse all {products.length} harvests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOpenTraceability={handleQuickTrace} />
          ))}
        </div>
      </section>

      {/* 4. Smart Food Intelligence & Lab Provenance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart Food Intelligence &amp; NABL Laboratory Provenance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Scan Any Produce QR for Instant Nutrition, Allergens &amp; Residue Reports
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Inspect verified nutritional breakdowns, farm GPS origin, harvest timestamps, and 0.00 ppm chemical residue lab reports across 26+ Odisha cooperative batches.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => openFoodScanner()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all inline-flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Open Food Intelligence Scanner</span>
              </button>
              <button
                onClick={() => openFoodScanner('AGRI-OD-2026-TOM')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                Inspect Sample Batch
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/60 rounded-2xl p-5 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <span className="font-mono font-bold text-emerald-300">AGRI-OD-2026-TOM</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                0.00 ppm PASS
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accredited Lab</span>
              <span className="font-semibold text-white">OSFL Bhubaneswar (NABL)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Declared Allergens</span>
              <span className="font-semibold text-emerald-300">Gluten · Dairy · Nut Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Packhouse Telemetry</span>
              <span className="font-mono text-white">12.8°C · 88% RH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Glycemic Index</span>
              <span className="font-mono text-amber-300 font-bold">15 (Low GI)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cold-Chain Logistics & Live Order Tracking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Cold-Chain Logistics &amp; Real-Time Order Tracking
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Route Optimization, Refrigerated Transit &amp; Order Pooling
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Follow every order from dawn farm harvest to doorstep delivery while consolidating regional highway shipments across Odisha to cut transport emissions and keep perishables crisp at 4.2°C.
            </p>

            <div className="space-y-2 pt-1 max-w-xl">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  In Transit · Cuttack–Bhubaneswar Expressway Hub
                </span>
                <span className="font-mono text-slate-500">80%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-4/5" />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400">Confirmed</span>
                <span className="text-emerald-600 dark:text-emerald-400">Packed</span>
                <span className="text-emerald-600 dark:text-emerald-400">Dispatched</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">In Transit</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setCurrentTab('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Track Your Orders</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab('logistics');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-all inline-flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Open Logistics Optimizer</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700">
              <span className="font-mono font-black text-slate-900 dark:text-white">ORD-98210</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                In Transit
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Origin Hub</span>
              <span className="font-semibold text-slate-900 dark:text-white">Koraput Agro Collective</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dispatch Date</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">2026-10-10 · 06:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Carrier Unit</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">OD-15-B-9901 (AgriCold)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cabin Temp</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">4.2°C (Optimal)</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
              <span className="text-slate-500">Koraput Coffee, Kala Jeera Rice</span>
              <span className="text-slate-900 dark:text-white">₹1,940</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Odisha Heritage Bio-Corridors & Sustainability Telemetry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Regional Provenance Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              GI-Tagged Harvest Corridors Across Odisha
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentTab('tutorials');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Kisan Video Academy</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corridors.map((corridor) => (
            <button
              key={corridor.district}
              onClick={() => {
                setCurrentTab('marketplace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  <span>{corridor.category}</span>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {corridor.district}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {corridor.produce}
                </p>
                <p className="text-[11px] text-slate-400">{corridor.detail}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                <span>Explore harvest</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>

        {/* 3-Column Circular Sustainability Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
              <Droplets className="w-4 h-4" />
              <span>Solar Drip Irrigation</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {telemetry.soilMoisture}% <span className="text-xs font-semibold text-slate-500">moisture</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conserving up to 45% agricultural groundwater with automated IoT drip schedules.
            </p>
            <button
              onClick={() => setCurrentTab('sustainability')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              Open Sustainability Ledger →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sun className="w-4 h-4" />
              <span>Solar Micro-Grid Array</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {telemetry.solarGenerationKw} kW <span className="text-xs font-semibold text-slate-500">· {telemetry.solarBatteryCharge}%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean off-grid generation powering field pumps and rural cold packhouses.
            </p>
            <button
              onClick={() => setCurrentTab('smart-farming')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              Open Smart Farming Telemetry →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sprout className="w-4 h-4" />
              <span>Circular Bio-Upcycling</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {telemetry.compostWasteDivertedKg.toLocaleString()} kg <span className="text-xs font-semibold text-slate-500">· {telemetry.co2OffsetTons}T CO₂</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Agricultural crop residue converted into vermicompost for next-season soil fertility.
            </p>
            <button
              onClick={() => setCurrentTab('tutorials')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              Open Farmer Video Academy →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Founders Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Leadership from Odisha
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Conceived by Ayushman Panda &amp; Gourav Soren
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentTab('founders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5"
          >
            <span>Read Founders Profile &amp; Origin Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-5 items-start">
            <img
              src={ayushmanPhoto || '/images/ayushman_panda.jpg'}
              alt="Ayushman Panda"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-emerald-500/40 shrink-0 shadow-md"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {FOUNDERS[0].name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Co-Founder
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {FOUNDERS[0].hometown}, {FOUNDERS[0].state} · {FOUNDERS[0].title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                National awarded entrepreneur and strategic visionary. Architect of scalable web platforms and co-creator of the AgriNutri V1.0 prototype.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-5 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              GS
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {FOUNDERS[1].name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  Co-Founder
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {FOUNDERS[1].hometown}, {FOUNDERS[1].state} · {FOUNDERS[1].title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                Web systems architect and co-creator of AgriNutri V1.0, focused on connecting indigenous tribal farm produce to transparent digital markets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
