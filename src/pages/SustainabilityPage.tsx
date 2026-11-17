import React, { useState } from 'react';
import {
  Droplets,
  Sun,
  Sprout,
  Activity,
  Wind,
  BatteryCharging,
  Recycle,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  FileText,
  Printer,
  Download,
  Share2,
  Zap,
  Globe,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Leaf,
  Scale,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VERIFIED_FOOD_INTELLIGENCE, FoodIntelligenceProfile } from '../data/foodIntelligenceData';

export const SustainabilityPage: React.FC = () => {
  const { telemetry, togglePump, simulateRain, logCompostWaste, showNotification } = useApp();
  const [wasteAmount, setWasteAmount] = useState(150);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('AGRI-OD-2026-TOM');
  const [activeReportTab, setActiveReportTab] = useState<'audit' | 'practices' | 'passport'>('audit');

  const activeBatchProfile: FoodIntelligenceProfile =
    VERIFIED_FOOD_INTELLIGENCE[selectedBatchId] || VERIFIED_FOOD_INTELLIGENCE['AGRI-OD-2026-TOM'];

  const handleAudit = () => {
    showNotification(
      'AI Circular Sustainability Audit: Water efficiency at 94.2%, Solar offset at 88%, Zero Chemical Residue verified.'
    );
  };

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>Green Agriculture & Circular Eco-Score Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Environmental Accountability Across the Food Supply Chain
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Real-time environmental telemetry across Sambalpur, Kandhamal, and Koraput bio-clusters. Track water consumption per kilogram, estimate energy use and transport carbon emissions, upcycle agricultural waste, and generate cryptographic Sustainability Passports.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={handleAudit}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Run AI Circular Audit</span>
          </button>
        </div>
      </div>

      {/* 2. Innovation Rationale Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Globe className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white block font-bold">
              Innovation Rationale: Environmental Accountability in Food
            </strong>
            <span className="text-slate-600 dark:text-slate-300 text-[11px]">
              Moving beyond vague "eco-friendly" claims to hard, auditable metrics: measuring exact water footprints, transport emissions per kilometer, circular waste recovery, and scoring every batch from 0-100.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Real-time Telemetry Metrics Grid (Water, Energy, Waste, Carbon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Water Consumption & Drip Telemetry */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Water Consumption</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {telemetry.soilMoisture.toFixed(1)}%
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              42,800 L Conserved via Solar Drip
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, telemetry.soilMoisture)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>54% savings vs flood</span>
            <span>Target: 35-45%</span>
          </div>
        </div>

        {/* Metric 2: Solar Microgrid & Energy Use */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Energy & Solar Use</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {telemetry.solarGenerationKw} kW
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Microgrid Storage: {telemetry.solarBatteryCharge}%
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, telemetry.solarBatteryCharge)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Grid energy avoided</span>
            <span>92% solar self-powered</span>
          </div>
        </div>

        {/* Metric 3: Agricultural Waste Diverted */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Agricultural Waste</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600">
              <Recycle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {telemetry.compostWasteDivertedKg.toLocaleString()} kg
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Circular Compost & Bio-Char
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-4/5" />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Zero stubble burning</span>
            <span>100% upcycled</span>
          </div>
        </div>

        {/* Metric 4: Transport Carbon & Emissions Avoided */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Transport Emissions</span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {telemetry.co2OffsetTons} Tons
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
              Net Carbon Offset Verified
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full w-5/6" />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Solar reefer fleets</span>
            <span>Carbon-Negative Status</span>
          </div>
        </div>
      </div>

      {/* 4. Batch Sustainability Report & Eco-Score Passport Generator */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Feature 12: Environmental Score Engine
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Generate Batch Sustainability Report & Eco-Score Passport</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any harvested crop to inspect verified water consumption, energy savings, transport emissions, and download the official environmental audit passport.
            </p>
          </div>

          {/* Batch Selector Dropdown */}
          <div className="w-full sm:w-auto">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Select Harvest Batch:
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {Object.values(VERIFIED_FOOD_INTELLIGENCE).map((b) => (
                <option key={b.batchId} value={b.batchId}>
                  #{b.batchId} - {b.productName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Batch Passport Presentation Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700">
                  PASSPORT #{activeBatchProfile.sustainabilityReport.auditHash}
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.2 rounded">
                  {activeBatchProfile.sustainabilityReport.carbonStatus}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {activeBatchProfile.productName}
              </h4>
              <p className="text-xs text-slate-300">
                Origin: <strong>{activeBatchProfile.farmLocation}</strong> · Grower: <strong>{activeBatchProfile.farmerName}</strong>
              </p>
            </div>

            {/* Big Eco Score Badge */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Overall Eco-Score</span>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {activeBatchProfile.sustainabilityReport.ecoScore}
                  <span className="text-base font-normal text-slate-300">/100</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                {activeBatchProfile.sustainabilityReport.ecoGrade}
              </div>
            </div>
          </div>

          {/* 4 Pillars of Environmental Accountability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>Water Consumption</span>
              </span>
              <div className="text-xl font-bold text-white">
                {activeBatchProfile.sustainabilityReport.waterFootprintLitersPerKg} L / kg
              </div>
              <p className="text-[11px] text-slate-300">
                +{activeBatchProfile.sustainabilityReport.dripSavingsPercent}% water conserved vs flood baseline
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" />
                <span>Energy & Solar Used</span>
              </span>
              <div className="text-xl font-bold text-white">
                {activeBatchProfile.sustainabilityReport.energySavedKwh} kWh
              </div>
              <p className="text-[11px] text-slate-300">
                Generated via farm micro-solar & bio-methanation
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                <span>Transport Carbon</span>
              </span>
              <div className="text-xl font-bold text-white">
                {activeBatchProfile.sustainabilityReport.transportEmissionKgCo2} kg CO₂
              </div>
              <p className="text-[11px] text-slate-300">
                Clustered multi-drop routing offsets empty trips
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1">
                <Recycle className="w-3.5 h-3.5" />
                <span>Residue Upcycling</span>
              </span>
              <div className="text-xl font-bold text-white">
                {activeBatchProfile.sustainabilityReport.agriculturalWasteDivertedKg} kg
              </div>
              <p className="text-[11px] text-slate-300">
                Transformed into rich microbial vermicompost
              </p>
            </div>
          </div>

          {/* Sustainable Farming Practices Implemented */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-300">
              Verified Sustainable Farming Practices Applied
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeBatchProfile.sustainabilityReport.regenerativePractices.map((practice, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Print / Download Report Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Audit Signature: {activeBatchProfile.sustainabilityReport.auditHash}
            </span>

            <button
              onClick={handlePrintPassport}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print Official Sustainability Passport</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Interactive Field Simulator Controls */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Live Field IoT Subsystems Simulator
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
              REAL-TIME RELAYS
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Interact with Connected IoT Subsystems
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trigger simulated rainfall sensors, toggle solar drip pump relays, or log a batch of agricultural
            crop residue to observe real-time circular feedback across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: Toggle Solar Pump */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Solar Drip Pump</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  telemetry.irrigationPumpStatus === 'Active'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {telemetry.irrigationPumpStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Drip irrigation valve connected to Panda Krishi Bio-Farm solar grid.
            </p>
            <button
              onClick={togglePump}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                telemetry.irrigationPumpStatus === 'Active'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {telemetry.irrigationPumpStatus === 'Active' ? 'Deactivate Pump' : 'Activate Solar Drip'}
            </button>
          </div>

          {/* Action 2: Trigger Rainfall */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Rain Sensor Event</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 rounded font-bold">
                {telemetry.rainfallLast24h} mm
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Simulate 25mm monsoon shower: refills rainwater tank and auto-pauses drip pump.
            </p>
            <button
              onClick={simulateRain}
              className="w-full py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all"
            >
              Simulate 25mm Rain Shower
            </button>
          </div>

          {/* Action 3: Log Compost */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Log Crop Residue</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                Circular
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Upcycle damaged stalks, husk, and crop greens into organic vermicompost.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={wasteAmount}
                onChange={(e) => setWasteAmount(Number(e.target.value))}
                className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
              <button
                onClick={() => logCompostWaste(wasteAmount)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
              >
                Log {wasteAmount}kg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
