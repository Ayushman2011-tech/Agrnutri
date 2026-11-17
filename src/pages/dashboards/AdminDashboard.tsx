import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Users,
  Settings,
  DollarSign,
  TrendingUp,
  QrCode,
  CheckCircle2,
  Sliders,
  Sparkles,
  AlertCircle,
  Truck,
  Package,
  MapPin,
  Calendar,
  Radio,
  Plane,
  Droplets,
  Sun,
  Wind,
  Bell,
  Send,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  FileText,
  Check,
  ChevronRight,
  Award,
  Search,
  Filter,
  ArrowRight,
  CreditCard,
  Building2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderTrackingStage, Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    membershipPlans,
    updateMembershipPrice,
    commissionRate,
    setCommissionRate,
    orders,
    batchesRegistry,
    showNotification,
    products,
    updateOrderStatus,
    updateProduct,
    cancelOrder,
    telemetry,
  } = useApp();

  type AdminTab =
    | 'overview'
    | 'orders'
    | 'products'
    | 'drones'
    | 'payouts'
    | 'approvals'
    | 'rates'
    | 'broadcast'
    | 'ledger';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Order Management Filter & Selection State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Processing' | 'Harvested' | 'Dispatched' | 'Delivered'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStage, setEditingStage] = useState<{
    stageName: OrderTrackingStage['stageName'];
    locationNote: string;
    status: Order['status'];
  }>({
    stageName: 'Dispatched / Shipped',
    locationNote: '',
    status: 'Dispatched',
  });

  // Product Catalog Management State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Drone Fleet State
  const [droneFleet, setDroneFleet] = useState([
    {
      id: 'OD-DRN-01',
      model: 'DJI Agras T40 Hexacopter',
      baseHub: 'Sambalpur Rice Basin (Hirakud)',
      status: 'In Flight - Mission Active',
      battery: 84,
      payloadKg: 40,
      flowRateLMin: 4.8,
      altitudeM: 3.5,
      activeMission: 'Precision Nano-Urea Foliar Spray · 4.8 ha completed',
      pilot: 'Balaram Sahoo (DGCA Certified Drone Pilot)',
    },
    {
      id: 'OD-DRN-02',
      model: 'AgriScan Multispectral Quadcopter',
      baseHub: 'Koraput Eastern Ghats Highlands',
      status: 'NDVI Canopy Surveying',
      battery: 92,
      payloadKg: 5,
      flowRateLMin: 0,
      altitudeM: 38.0,
      activeMission: 'Shade-Grown Arabica Coffee Ripeness & Leaf Rust Mapping',
      pilot: 'Sukanti Majhi (Tribal Drone Cohort)',
    },
    {
      id: 'OD-DRN-03',
      model: 'AeroSpray Agro 25L',
      baseHub: 'Bargarh Organic Agro Cluster',
      status: 'Standby / Solar Recharging',
      battery: 100,
      payloadKg: 25,
      flowRateLMin: 0,
      altitudeM: 0,
      activeMission: 'Next Scheduled: Sunset Bio-Neem Oil Spraying (05:30 PM)',
      pilot: 'Rajesh Meher',
    },
    {
      id: 'OD-DRN-04',
      model: 'DJI Mavic 3 Enterprise Thermal',
      baseHub: 'Ganjam Horticultural Corridor',
      status: 'In Flight - Mission Active',
      battery: 68,
      payloadKg: 2,
      flowRateLMin: 0,
      altitudeM: 45.0,
      activeMission: 'Kewda Flower Moisture & Ambient Humidity Patrol',
      pilot: 'Niranjan Jena',
    },
  ]);

  // Farmer DBT Payouts Queue
  const [dbtPayouts, setDbtPayouts] = useState([
    {
      id: 'DBT-OD-9012',
      farmerName: 'Balaram Sahoo',
      district: 'Sambalpur',
      crop: 'Fresh Sambalpur Hybrid Tomatoes (500 kg)',
      batchId: 'AGRI-OD-2026-TOM',
      amountInr: 12500,
      bankUpi: 'balaram.sahoo@sbi',
      status: 'Ready for Disbursement',
      utr: '',
    },
    {
      id: 'DBT-OD-9013',
      farmerName: 'Sunita Majhi (Maa Tarini SHG)',
      district: 'Kandhamal',
      crop: 'Kandhamal Haldi Organic Curcumin (120 kg)',
      batchId: 'AGRI-OD-2026-TUR',
      amountInr: 28800,
      bankUpi: 'sunita.majhi@icici',
      status: 'Ready for Disbursement',
      utr: '',
    },
    {
      id: 'DBT-OD-9014',
      farmerName: 'Dambarudhar Jani',
      district: 'Koraput',
      crop: 'Highland Arabica Parchment Coffee (250 kg)',
      batchId: 'AGRI-OD-2026-COF',
      amountInr: 65000,
      bankUpi: 'dambaru.jani@barodampay',
      status: 'Settled',
      utr: 'UTR20261010889240',
    },
    {
      id: 'DBT-OD-9015',
      farmerName: 'Raghunath Soren',
      district: 'Mayurbhanj',
      crop: 'Similipal Wild Raw Honey (80 kg)',
      batchId: 'AGRI-OD-2026-HON',
      amountInr: 33600,
      bankUpi: 'raghu.soren@unionbank',
      status: 'Settled',
      utr: 'UTR20261009117231',
    },
  ]);

  // Pending Verifications
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'app-01',
      name: 'Maa Tarini Organic SHG',
      category: 'Farmer Cohort',
      district: 'Keonjhar, Odisha',
      landAcres: '18 Acres',
      status: 'Pending Verification',
      certDoc: 'NPOP-OD-2026-9921',
      crops: 'Phula Badi, Indigenous Black Gram, Desi Mustard',
      dateApplied: '2026-10-10',
    },
    {
      id: 'app-02',
      name: 'Kalahandi Millets Solar Mill',
      category: 'Processor / Producer',
      district: 'Kalahandi, Odisha',
      landAcres: 'Milling Unit (25 HP Solar)',
      status: 'Pending Verification',
      certDoc: 'FSSAI-120268800192',
      crops: 'Ragi Flour, Foxtail Millet, Kodo Puffs',
      dateApplied: '2026-10-11',
    },
    {
      id: 'app-03',
      name: 'Gajapati Tribal Cardamom Collective',
      category: 'Farmer Cohort',
      district: 'Gajapati, Odisha',
      landAcres: '32 Acres Hill Slope',
      status: 'Pending Verification',
      certDoc: 'PGS-INDIA-OD-4412',
      crops: 'Wild Hill Cardamom, Black Turmeric',
      dateApplied: '2026-10-12',
    },
  ]);

  // Weather Emergency Broadcast System
  const [broadcastMessage, setBroadcastMessage] = useState(
    'ADVISORY: IMD predicts heavy convective showers in Sambalpur & Bargarh over next 36 hrs. Drones paused. Secure paddy harvest in elevated dry storage.'
  );
  const [selectedTargetDistrict, setSelectedTargetDistrict] = useState('All 30 Odisha Districts');
  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'BC-01',
      timestamp: '2026-10-12 07:30 AM',
      target: 'Sambalpur, Bargarh',
      message: 'Optimal morning temperature for drone foliar spray (26°C, Wind 6 km/h). Hubs active.',
      recipientsCount: 420,
      deliveredRate: '99.2%',
    },
    {
      id: 'BC-02',
      timestamp: '2026-10-09 02:15 PM',
      target: 'Kandhamal, Koraput',
      message: 'Pest Alert: Low incidence of stem borer detected. Apply organic neem kernel extract.',
      recipientsCount: 680,
      deliveredRate: '98.7%',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    showNotification(`Account "${name}" verified & issued Cryptographic Organic Seal.`);
  };

  const handleDisburseDBT = (payoutId: string, farmerName: string, amount: number) => {
    const randomUtr = `UTR202610${Math.floor(10000000 + Math.random() * 90000000)}`;
    setDbtPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status: 'Settled', utr: randomUtr }
          : p
      )
    );
    showNotification(`DBT Payout of ₹${amount.toLocaleString()} settled to ${farmerName} (Ref: ${randomUtr})`);
  };

  const handleTriggerAllPendingDBT = () => {
    const pendingList = dbtPayouts.filter((p) => p.status !== 'Settled');
    if (pendingList.length === 0) {
      showNotification('All farmer payouts are already settled.');
      return;
    }
    setDbtPayouts((prev) =>
      prev.map((p) => ({
        ...p,
        status: 'Settled',
        utr: p.utr || `UTR202610${Math.floor(10000000 + Math.random() * 90000000)}`,
      }))
    );
    showNotification(`Batch Direct Benefit Transfer executed for ${pendingList.length} smallholder farmers!`);
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const newBc = {
      id: `BC-0${broadcastHistory.length + 1}`,
      timestamp: 'Just Now',
      target: selectedTargetDistrict,
      message: broadcastMessage,
      recipientsCount: selectedTargetDistrict === 'All 30 Odisha Districts' ? 1420 : 380,
      deliveredRate: '100% Pending',
    };

    setBroadcastHistory([newBc, ...broadcastHistory]);
    showNotification(`Emergency advisory broadcasted to ${newBc.recipientsCount} farmers across ${selectedTargetDistrict}!`);
  };

  const handleDeployDroneMission = (droneId: string) => {
    setDroneFleet((prev) =>
      prev.map((d) =>
        d.id === droneId
          ? {
              ...d,
              status: 'Mission Dispatched & Active',
              battery: Math.max(20, d.battery - 8),
            }
          : d
      )
    );
    showNotification(`Autonomous waypoint mission uploaded to Drone ${droneId}! Real-time RTK telemetry streaming.`);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.shippingPlace && o.shippingPlace.toLowerCase().includes(q)) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
          o.items.some((item) => item.product.title.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.sellerLocation.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  const totalDbtDisbursed = dbtPayouts.reduce((sum, p) => (p.status === 'Settled' ? sum + p.amountInr : sum), 0);
  const totalDbtPending = dbtPayouts.reduce((sum, p) => (p.status !== 'Settled' ? sum + p.amountInr : sum), 0);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                Platform Administrative Control
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded shadow-sm">
                CHIEF ROOT ADMIN
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/40 hidden sm:inline-block">
                Odisha Bio-Cluster V2.0
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              AgriNutri Farm 2.0 Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time platform governance, stage-based order fulfillment, GI-certified catalog regulation, drone fleet telemetry, and automated DBT farmer payouts.
            </p>
          </div>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto relative z-10">
          <button
            onClick={handleTriggerAllPendingDBT}
            className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-slate-950" />
            <span>Settle All DBT Payouts</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'orders', label: `Orders Logistics (${orders.length})`, icon: Truck, badge: orders.filter((o) => o.status === 'Dispatched').length },
            { id: 'products', label: `Catalog & GI MSP (${products.length})`, icon: Package },
            { id: 'drones', label: 'Drone Fleet (4 Active)', icon: Plane },
            { id: 'payouts', label: 'Farmer DBT Finance', icon: CreditCard },
            { id: 'approvals', label: `Pending Approvals (${pendingApprovals.length})`, icon: CheckCircle2, badge: pendingApprovals.length },
            { id: 'rates', label: 'Subscriptions & Commission', icon: Sliders },
            { id: 'broadcast', label: 'Weather Broadcast', icon: Radio },
            { id: 'ledger', label: 'Traceability Registry', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'}`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Platform Analytics KPIs Grid (Always Visible or Detailed in Overview) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Marketplace GMV</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">₹48,24,000</div>
          <span className="text-[10px] text-emerald-600 font-bold block">{commissionRate.toFixed(1)}% Platform Fee</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Live Orders</span>
            <Truck className="w-3.5 h-3.5 text-amber-500" />
          </span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">{orders.length} Active</div>
          <span className="text-[10px] text-slate-500 font-semibold block">{orders.filter((o) => o.status === 'Dispatched').length} in transit</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Odisha Farmers</span>
            <Users className="w-3.5 h-3.5 text-teal-500" />
          </span>
          <div className="text-xl font-black text-teal-600 dark:text-teal-400">1,420 Cultivators</div>
          <span className="text-[10px] text-slate-500 font-semibold block">Across 30 Districts</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>DBT Disbursed</span>
            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          </span>
          <div className="text-xl font-black text-emerald-600">₹{(totalDbtDisbursed / 100000).toFixed(2)} Lakh</div>
          <span className="text-[10px] text-slate-500 font-semibold block">₹{(totalDbtPending / 1000).toFixed(0)}k pending</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Drone Fleet</span>
            <Plane className="w-3.5 h-3.5 text-blue-500" />
          </span>
          <div className="text-xl font-black text-blue-600">4 Drones</div>
          <span className="text-[10px] text-emerald-600 font-bold block">100% Missions Safe</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Traceability</span>
            <QrCode className="w-3.5 h-3.5 text-purple-500" />
          </span>
          <div className="text-xl font-black text-purple-600">{Object.keys(batchesRegistry).length} Passports</div>
          <span className="text-[10px] text-slate-500 font-semibold block">Zero counterfeit</span>
        </div>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & COMMAND INSIGHTS
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Odisha Agro-Corridor Health Card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Odisha District Supply Corridors & Real-Time Logistics</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live telemetry across farm gate collections, cold vans, and regional distribution centers.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  ALL 8 HUBS ACTIVE
                </span>
              </div>

              {/* Corridor List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    hub: 'Koraput Highland Hub',
                    produce: 'Arabica Coffee & Kala Jeera Rice',
                    status: 'Cold Van Dispatched to BBSR',
                    temp: '14.2°C',
                    color: 'emerald',
                  },
                  {
                    hub: 'Sambalpur-Bargarh Plain',
                    produce: 'Organic Tomatoes, Corn & Paddy',
                    status: 'Drone Spray Completed (12 ha)',
                    temp: 'Optimal',
                    color: 'blue',
                  },
                  {
                    hub: 'Mayurbhanj Similipal Gate',
                    produce: 'Wild Forest Raw Honey & Spices',
                    status: 'Quality Lab Seal Attached',
                    temp: '18.0°C',
                    color: 'amber',
                  },
                  {
                    hub: 'Kandhamal Hill District',
                    produce: 'GI Certified Haldi Curcumin',
                    status: 'Solar Dehydration Unit Running',
                    temp: '32.5°C Dry',
                    color: 'purple',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{item.hub}</span>
                      <span className="font-mono text-[10px] text-slate-400">{item.temp}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{item.produce}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-400" />
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* IoT Sensor Health Bar */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Active IoT Farm Sensors</div>
                    <div className="text-slate-500 text-[11px]">
                      Soil Moisture: <strong className="text-emerald-600">{telemetry.soilMoisture}%</strong> · Pump:{' '}
                      <strong className="text-emerald-600">{telemetry.irrigationPumpStatus}</strong> · Solar:{' '}
                      <strong className="text-amber-500">{telemetry.solarBatteryCharge}%</strong>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('drones')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Manage Drone & IoT Fleet →
                </button>
              </div>
            </div>

            {/* Quick Actions & Recent Platform Alerts */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Admin Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Dispatch & Advance Order Stage</div>
                    <div className="text-[11px] text-slate-500">{orders.filter((o) => o.status !== 'Delivered').length} active shipments awaiting next stage</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Regulate Odisha Catalog & MSP</div>
                    <div className="text-[11px] text-slate-500">26 Products across 30 Odisha Districts</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('payouts')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Direct Benefit Transfer (DBT)</div>
                    <div className="text-[11px] text-amber-600 font-semibold">₹{(totalDbtPending / 1000).toFixed(0)}k ready for instant settlement</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('broadcast')}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Send SMS / Voice Weather Advisory</div>
                    <div className="text-[11px] text-slate-500">Instant broadcast to 1,420 registered farmers</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Security & Co-Founder Seal */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-400">
                  AgriNutri Platform Governance · Lead Admin: <strong>Ayushman Panda</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ORDERS LOGISTICS & STAGE DISPATCH MANAGER
         ======================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Live Order Logistics & Fulfillment Stage Manager</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update shipment stages in real time. Stage updates synchronize instantly with the customer's "Your Order" tracking screen.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'Processing', 'Harvested', 'Dispatched', 'Delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === st
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, district, item, or tracking number..."
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Order ID & Date</th>
                  <th className="pb-3">Customer & Delivery City</th>
                  <th className="pb-3">Origin Farm & Carrier</th>
                  <th className="pb-3">Current Tracking Stage</th>
                  <th className="pb-3">Total (₹)</th>
                  <th className="pb-3 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="py-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">#{ord.id}</div>
                        <div className="text-[11px] text-slate-400">{ord.date}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{ord.items.length} items</div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{ord.customerAddress}</div>
                        <div className="text-[10px] text-slate-400">{ord.customerPhone}</div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">{ord.shippingPlace || 'Odisha Central Hub'}</div>
                        <div className="text-[11px] text-slate-400">{ord.carrierName || 'AgriNutri Cold Logistics'}</div>
                        <div className="font-mono text-[10px] text-emerald-600">{ord.trackingNumber || 'OD-EXP-7729'}</div>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : ord.status === 'Dispatched'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          }`}
                        >
                          {ord.status === 'Dispatched' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                          {ord.status}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 max-w-[160px] truncate">
                          {ord.currentStage || 'Order Received'}
                        </div>
                      </td>

                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        ₹{ord.total.toLocaleString()}
                      </td>

                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setEditingStage({
                              stageName: 'In Transit',
                              locationNote: ord.currentLocation || 'Cuttack-Bhubaneswar Expressway Hub',
                              status: ord.status,
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                        >
                          Update Stage →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal / Panel: Update Order Stage */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Update Shipment Stage: #{selectedOrder.id}
                    </h4>
                    <p className="text-xs text-slate-500">Customer: {selectedOrder.customerName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Milestone Stage:
                    </label>
                    <select
                      value={editingStage.stageName}
                      onChange={(e) => {
                        const val = e.target.value as OrderTrackingStage['stageName'];
                        let newStat: Order['status'] = 'Dispatched';
                        if (val === 'Harvested & Packed') newStat = 'Harvested';
                        if (val === 'Delivered') newStat = 'Delivered';
                        if (val === 'Order Confirmed') newStat = 'Processing';

                        setEditingStage((prev) => ({
                          ...prev,
                          stageName: val,
                          status: newStat,
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="Harvested & Packed">1. Harvested & Packed (Farm Cold Packhouse)</option>
                      <option value="Dispatched / Shipped">2. Dispatched / Shipped (Carrier Assigned)</option>
                      <option value="In Transit">3. In Transit (Express Corridor Checkpoint)</option>
                      <option value="Out for Delivery">4. Out for Delivery (Local Courier Van)</option>
                      <option value="Delivered">5. Delivered (Final Customer Handover)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Live Checkpoint Location:
                    </label>
                    <input
                      type="text"
                      value={editingStage.locationNote}
                      onChange={(e) => setEditingStage({ ...editingStage, locationNote: e.target.value })}
                      placeholder="e.g. Cuttack-Bhubaneswar Expressway Hub (Cold Van OD-15-B-9901)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px]">
                    <strong>Sync Notice:</strong> Updating this stage immediately refreshes the timeline progress bar and courier status on the user's "Your Order" page.
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      cancelOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                  >
                    Cancel Order
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(
                          selectedOrder.id,
                          editingStage.status,
                          editingStage.stageName,
                          editingStage.locationNote || 'Odisha Express Agro-Corridor'
                        );
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    >
                      Save & Broadcast Stage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: PRODUCT CATALOG, GI BADGES & FAIR PRICE (MSP)
         ======================================================== */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Odisha Natural Products Catalog & Fair Price Regulation</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify GI Tags, regulate Minimum Support Prices (MSP) to safeguard tribal cultivators, and control active inventory stock.
              </p>
            </div>

            {/* Category Filter */}
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="All">All Odisha Categories</option>
              <option value="Fresh Vegetables">Fresh Vegetables</option>
              <option value="Farm Fresh Fruits">Farm Fresh Fruits</option>
              <option value="Specialty Coffee & Beverages">Specialty Coffee</option>
              <option value="Wild Forest Honey & Wellness">Wild Forest Honey</option>
              <option value="Cold-Pressed Oils & Spices">Oils & Spices</option>
              <option value="Indigenous Grains & Millets">Grains & Millets</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search product title, district origin, or grower name..."
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Product Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 text-xs"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.imageUrl || (prod.images && prod.images[0])}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                        {prod.category}
                      </span>
                      {prod.isOrganic && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Award className="w-3 h-3" />
                          GI Tag
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white truncate" title={prod.title}>
                      {prod.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {prod.sellerName} · <strong className="text-slate-700 dark:text-slate-300">{prod.sellerLocation}</strong>
                    </div>
                  </div>
                </div>

                {/* Price and Stock Stats */}
                <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Consumer (₹)</span>
                    <span className="font-black text-slate-900 dark:text-white">₹{prod.price}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Wholesale (₹)</span>
                    <span className="font-black text-emerald-600">₹{prod.wholesalePrice}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">In Stock</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{prod.stock} {prod.unit}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      updateProduct(prod.id, { isFeatured: !prod.isFeatured });
                      showNotification(`Product "${prod.title}" ${!prod.isFeatured ? 'featured on Homepage' : 'unfeatured'}.`);
                    }}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      prod.isFeatured
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    ★ {prod.isFeatured ? 'Featured' : 'Feature'}
                  </button>

                  <button
                    onClick={() => {
                      updateProduct(prod.id, { isOrganic: !prod.isOrganic });
                      showNotification(`GI Tag / Organic status updated for "${prod.title}".`);
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    Toggle GI Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: DRONE FLEET & SMART TELEMETRY OPERATIONS
         ======================================================== */}
      {activeTab === 'drones' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-500" />
                <span>Odisha Agricultural Drone Fleet Operations Center</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized telemetry command for precision foliar spraying, multispectral NDVI stress surveys, and microclimate surveillance.
              </p>
            </div>

            <button
              onClick={() => {
                showNotification('Fleet RTK satellite calibration synced across all 4 base hubs.');
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Fleet RTK Satellites</span>
            </button>
          </div>

          {/* Drones Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {droneFleet.map((drone) => (
              <div
                key={drone.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {drone.id}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                        {drone.model}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drone.baseHub}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      drone.status.includes('Active')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {drone.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Mission:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                      {drone.activeMission}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Certified Pilot:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{drone.pilot}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-center">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Battery</span>
                      <span className="font-black text-emerald-600">{drone.battery}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Payload Cap</span>
                      <span className="font-black text-slate-900 dark:text-white">{drone.payloadKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Altitude</span>
                      <span className="font-black text-slate-900 dark:text-white">{drone.altitudeM} m</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">RTK Latency: 12ms · Centimeter Accuracy</span>
                  <button
                    onClick={() => handleDeployDroneMission(drone.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Deploy Mission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: DIRECT BENEFIT TRANSFER (DBT) & FARMER FINANCE
         ======================================================== */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Smallholder Farmer Direct Benefit Transfer (DBT) Hub</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero-middleman instantaneous payment settlements directly to farmer UPI/Bank accounts upon batch QR code scan.
              </p>
            </div>

            <button
              onClick={handleTriggerAllPendingDBT}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Execute Instant Batch Settlement
            </button>
          </div>

          {/* Finance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Total Settled DBT</span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">₹{totalDbtDisbursed.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-600">Zero commission deductions</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Pending Settlement</span>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">₹{totalDbtPending.toLocaleString()}</div>
              <span className="text-[10px] text-amber-600">Awaiting single-click release</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Settlement Speed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1.8 Hours</div>
              <span className="text-[10px] text-slate-500">vs. 14 Days in traditional mandis</span>
            </div>
          </div>

          {/* Payout Queue Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Payout Ref</th>
                  <th className="pb-3">Farmer & District</th>
                  <th className="pb-3">Verified Harvest Crop</th>
                  <th className="pb-3">Bank / UPI Handle</th>
                  <th className="pb-3">Net Payout (₹)</th>
                  <th className="pb-3 text-right">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {dbtPayouts.map((p) => (
                  <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {p.id}
                      {p.utr && <div className="text-[10px] text-emerald-600 font-mono font-normal">{p.utr}</div>}
                    </td>

                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{p.farmerName}</div>
                      <div className="text-[11px] text-slate-400">{p.district}, Odisha</div>
                    </td>

                    <td className="py-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{p.crop}</div>
                      <div className="font-mono text-[10px] text-slate-400">Batch: {p.batchId}</div>
                    </td>

                    <td className="py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {p.bankUpi}
                    </td>

                    <td className="py-3.5 font-black text-emerald-600 text-sm">
                      ₹{p.amountInr.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-right">
                      {p.status === 'Settled' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          Settled via DBT
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDisburseDBT(p.id, p.farmerName, p.amountInr)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                        >
                          Disburse Funds →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: PENDING APPROVALS (FARMER & PROCESSOR ONBOARDING)
         ======================================================== */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Farmer & Producer SHG Verification Queue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit NPOP/PGS-India certificates, land tenure, and issue cryptographic verification seals.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">{pendingApprovals.length} pending audit</span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All grower and processor accounts are approved and verified.</p>
              <p className="text-slate-500">New self-help group onboarding applications will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{app.name}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.2 rounded">
                        {app.category}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      {app.district} · Land: <strong>{app.landAcres}</strong> · Applied: {app.dateApplied}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Produce: <strong className="text-emerald-600 dark:text-emerald-400">{app.crops}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      Certificate: {app.certDoc}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(app.id, app.name)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Approve & Issue Cryptographic Seal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 7: SUBSCRIPTIONS & COMMISSION RATES
         ======================================================== */}
      {activeTab === 'rates' && (
        <div className="space-y-6">
          {/* Commission Configuration Slider Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Marketplace Transaction Commission Rate
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Platform fee charged on verified commerce. Reinvested directly into Odisha drone hubs and farmer education.
                </p>
              </div>
              <span className="text-2xl font-black text-emerald-600">{commissionRate.toFixed(1)}%</span>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={commissionRate}
              onChange={(e) => {
                setCommissionRate(Number(e.target.value));
                showNotification(`Commission rate updated to ${e.target.value}%`);
              }}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1.0% (Subsidized Floor)</span>
              <span>5.0% (Current Standard)</span>
              <span>12.0% (Ceiling Cap)</span>
            </div>
          </div>

          {/* Membership Pricing Rates */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configure Membership Tier Rates (INR)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Administrators can dynamically regulate tier pricing for Farmers, Producers, Retailers, and Consumers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Role / Community</th>
                    <th className="pb-3">Plan Name</th>
                    <th className="pb-3">Monthly Price (₹)</th>
                    <th className="pb-3">Annual Price (₹)</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {membershipPlans.map((plan) => (
                    <tr key={plan.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 font-semibold">{plan.category}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{plan.name}</td>
                      <td className="py-3">
                        <input
                          type="number"
                          defaultValue={plan.monthlyPrice}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            updateMembershipPrice(plan.id, val, plan.annualPrice);
                          }}
                          className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          defaultValue={plan.annualPrice}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            updateMembershipPrice(plan.id, plan.monthlyPrice, val);
                          }}
                          className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                        />
                      </td>
                      <td className="py-3 text-[11px] text-emerald-600 font-semibold">
                        Auto-saved on blur
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: EMERGENCY WEATHER & ADVISORY BROADCAST
         ======================================================== */}
      {activeTab === 'broadcast' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              <span>Emergency Agricultural Weather Broadcast & SMS/IVR Gateway</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send instant high-priority weather warnings, cyclone alerts, or agronomic pest advisories directly to registered Odisha farmers.
            </p>
          </div>

          <form onSubmit={handleBroadcastAlert} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target District / Agro-Climatic Zone:
                </label>
                <select
                  value={selectedTargetDistrict}
                  onChange={(e) => setSelectedTargetDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="All 30 Odisha Districts">All 30 Odisha Districts (1,420 Farmers)</option>
                  <option value="Western Odisha (Sambalpur, Bargarh, Jharsuguda)">Western Plain (Sambalpur, Bargarh, Jharsuguda)</option>
                  <option value="Southern Hills (Koraput, Rayagada, Malkangiri)">Southern Highlands (Koraput, Rayagada, Malkangiri)</option>
                  <option value="Central High Plateau (Kandhamal, Keonjhar)">Central Plateau (Kandhamal, Keonjhar)</option>
                  <option value="Coastal Belt (Ganjam, Puri, Cuttack, Balasore)">Coastal Belt (Ganjam, Puri, Cuttack, Balasore)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Channels:
                </label>
                <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check className="w-3.5 h-3.5" /> SMS Push
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check className="w-3.5 h-3.5" /> WhatsApp Alerts
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check className="w-3.5 h-3.5" /> Voice Call (IVR Odia)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Advisory Message Content (English & Odia script compatible):
              </label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="Type emergency weather advisory here..."
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Emergency Advisory Now</span>
            </button>
          </form>

          {/* Broadcast History */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Broadcast History</h4>
            <div className="space-y-2">
              {broadcastHistory.map((bc) => (
                <div
                  key={bc.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-600">{bc.id}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{bc.target}</span>
                      <span className="text-[10px] text-slate-400">· {bc.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{bc.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {bc.recipientsCount} Recipients ({bc.deliveredRate})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 9: CRYPTOGRAPHIC BATCH TRACEABILITY REGISTRY
         ======================================================== */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>Cryptographic Batch Traceability Registry (SHA-256 Ledger)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every harvest batch carries an immutable timeline of geo-stamped hand-offs, zero-residue lab tests, and cold chain temperature logs.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 font-mono">
              {Object.keys(batchesRegistry).length} Verified Passports
            </span>
          </div>

          <div className="space-y-3">
            {Object.values(batchesRegistry).map((b) => (
              <div
                key={b.batchId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-emerald-600">#{b.batchId}</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{b.productName}</div>
                  <div className="text-slate-500 text-[11px]">
                    {b.farmerName} · {b.farmLocation.split('(')[0]} · Grade: {b.qualityGrade}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded font-bold">
                    Zero Chemical (0.00 ppm)
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {b.timeline.length} verified hand-offs · Hash: 0x{b.batchId.slice(-6).toLowerCase()}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
