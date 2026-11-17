import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Thermometer,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Wind,
  Sun,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Fuel,
  Activity,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  MOCK_DELIVERY_ROUTES,
  MOCK_COLD_CHAIN_MONITORING,
  MOCK_ORDER_BUNDLES,
} from '../data/foodIntelligenceData';
import { LogisticsRouteSuggestion, ColdChainTelemetrySnapshot, CombinedOrderBundle } from '../types';

interface LogisticsOptimizerPageProps {
  setCurrentTab?: (tab: string) => void;
}

export const LogisticsOptimizerPage: React.FC<LogisticsOptimizerPageProps> = ({ setCurrentTab }) => {
  const { orders, showNotification } = useApp();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(MOCK_DELIVERY_ROUTES[0].id);
  const [selectedVanId, setSelectedVanId] = useState<string>(MOCK_COLD_CHAIN_MONITORING[0].shipmentId);
  const [activeSubTab, setActiveSubTab] = useState<'routes' | 'coldchain' | 'bundling' | 'eta'>('routes');
  const [simulatedTemp, setSimulatedTemp] = useState<number>(4.2);
  const [isSimulatingReRoute, setIsSimulatingReRoute] = useState(false);
  const [orderQuery, setOrderQuery] = useState('ORD-98210');

  const activeRoute =
    MOCK_DELIVERY_ROUTES.find((r) => r.id === selectedRouteId) || MOCK_DELIVERY_ROUTES[0];
  const activeColdChain =
    MOCK_COLD_CHAIN_MONITORING.find((v) => v.shipmentId === selectedVanId) ||
    MOCK_COLD_CHAIN_MONITORING[0];

  const handleSimulateOptimize = () => {
    setIsSimulatingReRoute(true);
    setTimeout(() => {
      setIsSimulatingReRoute(false);
      showNotification(
        'AI Corridor Optimization complete: Avoided Cuttack bridge congestion via Ring Expressway. Saved 14 minutes and 3.2L diesel!'
      );
    }, 900);
  };

  const handleAuthorizeBundle = (bundle: CombinedOrderBundle) => {
    showNotification(
      `Bundle #${bundle.bundleId} authorized for dispatch on ${bundle.assignedVehicle}! Saved ₹${bundle.costSavingsInr} and ${bundle.carbonSavingsKg}kg CO₂.`
    );
  };

  const totalFuelSaved = MOCK_DELIVERY_ROUTES.reduce((sum, r) => sum + r.fuelSavedLiters, 0);
  const totalCo2Saved = MOCK_DELIVERY_ROUTES.reduce((sum, r) => sum + r.co2SavedKg, 0);
  const totalCostSaved = MOCK_DELIVERY_ROUTES.reduce((sum, r) => sum + r.costSavedInr, 0);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                AI Logistics & Delivery Optimizer
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded shadow-sm">
                DYNAMIC ROUTING V2.0
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Intelligent Farm-to-Door Logistics & Reefer Cold Chain
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Eliminate transit delays, prevent thermal spoilage in sensitive perishables, and slash transportation carbon by clustering co-located orders into consolidated solar-reefer runs.
            </p>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Total Fuel Saved</div>
              <div className="text-2xl font-black text-white mt-0.5">{totalFuelSaved.toFixed(1)} Liters</div>
              <div className="text-[10px] text-emerald-400 font-bold">₹{totalCostSaved.toLocaleString()} cost reduced</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-teal-300">Transport Carbon Cut</div>
              <div className="text-2xl font-black text-white mt-0.5">{totalCo2Saved.toFixed(1)} kg CO₂</div>
              <div className="text-[10px] text-teal-400 font-bold">100% Eco-Routed Fleet</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Innovation Callout Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white block font-bold">
              Innovation Rationale: Eliminating Supply Chain Friction
            </strong>
            <span className="text-slate-600 dark:text-slate-300 text-[11px]">
              Traditional agriculture loses 25% of perishable crop value to inefficient multi-stop hauling and cold chain breaks. Our AI engine dynamically groups orders and matches real-time terrain telemetry.
            </span>
          </div>
        </div>

        <button
          onClick={handleSimulateOptimize}
          disabled={isSimulatingReRoute}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingReRoute ? 'animate-spin' : ''}`} />
          <span>{isSimulatingReRoute ? 'Optimizing Routes...' : 'Recalculate AI Routes'}</span>
        </button>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
        {[
          { id: 'routes', label: '1. Efficient Delivery Routes', icon: Navigation },
          { id: 'coldchain', label: '2. Cold-Chain Temperature Monitor', icon: Thermometer },
          { id: 'bundling', label: '3. Smart Order Bundling & Pooling', icon: Layers },
          { id: 'eta', label: '4. AI Arrival Time (ETA) Predictor', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: EFFICIENT DELIVERY ROUTES & CORRIDOR MAP
         ======================================================== */}
      {activeSubTab === 'routes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Corridor List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Odisha Agricultural Corridors
              </h3>

              {MOCK_DELIVERY_ROUTES.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-600">{route.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {route.trafficCondition}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                      {route.corridorName}
                    </h4>

                    <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-700/60">
                      <div>
                        <span className="block text-[9px] uppercase text-slate-400 font-bold">Distance</span>
                        <strong className="text-slate-800 dark:text-slate-200">{route.distanceKm} km</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase text-slate-400 font-bold">Transit Time</span>
                        <strong className="text-slate-800 dark:text-slate-200">{Math.floor(route.etaMinutes / 60)}h {route.etaMinutes % 60}m</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase text-slate-400 font-bold">Fuel Saved</span>
                        <strong className="text-emerald-600">+{route.fuelSavedLiters} L</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Route Waypoints & Telemetry */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Live Highway Telemetry
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">#{activeRoute.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {activeRoute.corridorName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    From <strong>{activeRoute.origin}</strong> to <strong>{activeRoute.destination}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                    {activeRoute.fuelSavedLiters} L Fuel Saved
                  </div>
                </div>
              </div>

              {/* Waypoint Milestones Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sequential Cold-Chain Waypoints & Inspection Depots
                </h4>

                <div className="space-y-3">
                  {activeRoute.waypoints.map((wp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            wp.status === 'Passed'
                              ? 'bg-emerald-500 text-white'
                              : wp.status === 'Next'
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {wp.status === 'Passed' ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{wp.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">GPS: {wp.coordinates}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            wp.status === 'Passed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : wp.status === 'Next'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {wp.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{wp.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Alert & AI Recommendation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">AI Road Telemetry Advisory</div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {activeRoute.congestionAlert} Automatic route recalculation prevents idling at regional toll gates, preserving battery reserves for refrigeration compressor.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: TEMPERATURE-SENSITIVE SHIPMENTS MONITOR (COLD CHAIN)
         ======================================================== */}
      {activeSubTab === 'coldchain' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Van Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Cold-Chain Reefer Fleet
              </h3>

              {MOCK_COLD_CHAIN_MONITORING.map((van) => {
                const isSelected = van.shipmentId === selectedVanId;
                return (
                  <div
                    key={van.shipmentId}
                    onClick={() => setSelectedVanId(van.shipmentId)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-teal-600">{van.shipmentId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {van.powerStatus}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {van.vanNumber}
                    </h4>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="text-slate-500">Internal Temp:</span>
                      <span className="font-mono font-black text-emerald-600 text-sm">
                        {van.currentTempC}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Reefer Telemetry Display */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                      Live IoT Cold-Chain Probe
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">Shipment #{activeColdChain.shipmentId}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {activeColdChain.vanNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assigned Pilot: <strong>{activeColdChain.driverName}</strong> · Order Link: <strong>#{activeColdChain.orderId}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Thermal Integrity Verified</span>
                  </span>
                </div>
              </div>

              {/* Temperature Readout Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Cargo Temp</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {activeColdChain.currentTempC}°C
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{activeColdChain.targetTempRange}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ambient Outdoor</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {activeColdChain.ambientTempC}°C
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Odisha Daytime Sun</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Air Humidity</span>
                  <div className="text-2xl font-black text-teal-600 mt-1">
                    {activeColdChain.humidityPercent}% RH
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Anti-Condensation</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reefer Power</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">Solar</div>
                  <span className="text-[10px] text-slate-500 font-semibold">1.8 kW Rooftop Panels</span>
                </div>
              </div>

              {/* Hourly Reading Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Real-time Cold Chain Checkpoint Temperature Logs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {activeColdChain.readingsHistory.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs"
                    >
                      <span className="text-[10px] font-mono text-slate-400 block">{log.time}</span>
                      <span className="font-mono font-bold text-emerald-600 text-sm">{log.tempC}°C</span>
                      <span className="text-[10px] text-slate-500 block">{log.humidityPercent}% RH</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Alert Note */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                <span>
                  <strong>Zero-Carbon Cooling:</strong> {activeColdChain.alertMessage}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SMART COMBINED ORDER BUNDLING & POOLING
         ======================================================== */}
      {activeSubTab === 'bundling' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>AI Cluster Pooling & Multi-Drop Consolidation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combine nearby consumer orders within adjacent postal sectors into a single refrigerated trip, avoiding empty return miles and lowering delivery fees.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                2 Active Clustered Bundles Available
              </span>
            </div>

            {/* Bundles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_ORDER_BUNDLES.map((bundle) => (
                <div
                  key={bundle.bundleId}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-600">
                        #{bundle.bundleId}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {bundle.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {bundle.clusterZone}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Vehicle: <strong>{bundle.assignedVehicle}</strong>
                      </p>
                    </div>

                    {/* Consolidated Orders List */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Bundled Orders ({bundle.orders.length} Drops)
                      </span>
                      {bundle.orders.map((ord, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {ord.customerName} ({ord.orderId})
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {ord.address}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-600 font-bold shrink-0">
                            {ord.weightKg} kg
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Efficiency Gains Stats */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Efficiency</span>
                        <span className="text-sm font-black text-emerald-600">+{bundle.efficiencyBoostPercent}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Cost Saved</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{bundle.costSavingsInr}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">CO₂ Cut</span>
                        <span className="text-sm font-black text-teal-600">{bundle.carbonSavingsKg} kg</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAuthorizeBundle(bundle)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Consolidated Multi-Drop Dispatch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: AI ARRIVAL TIME (ETA) PREDICTOR
         ======================================================== */}
      {activeSubTab === 'eta' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>AI Predictive Arrival Time (ETA) Calculation Engine</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic machine learning model accounting for Eastern Ghats gradient, monsoonal rainfall, and urban ring-road delivery corridors.
                </p>
              </div>
            </div>

            {/* Quick Order Lookup */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. ORD-98210, ORD-76503)..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => {
                  showNotification(`Simulated ETA re-evaluated for ${orderQuery}: Confidence 98.4% on schedule.`);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                Recalculate Arrival Probability
              </button>
            </div>

            {/* Prediction Breakdown Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Target Order: #{orderQuery}
                  </span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    Expected Arrival: 02:30 PM (Today)
                  </h4>
                  <div className="text-xs text-emerald-200 mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>On Schedule · 98.4% Arrival Confidence Index</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-300">Transit Duration Left</div>
                  <div className="text-xl font-black text-amber-300">42 Minutes</div>
                  <div className="text-[10px] text-slate-300">18.2 km remaining</div>
                </div>
              </div>

              {/* Factors Evaluated Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Highway Traffic</span>
                  <div className="font-bold text-white">Flowing (NH-55 Fast)</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Weather Radar</span>
                  <div className="font-bold text-emerald-300">Clear Skies (Zero Delay)</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Cold Van Speed</span>
                  <div className="font-bold text-white">62 km/h Average</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Destination Zone</span>
                  <div className="font-bold text-amber-300">Saheed Nagar, BBSR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
