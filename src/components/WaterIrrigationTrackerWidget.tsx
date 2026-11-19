import React, { useState, useMemo } from 'react';
import {
  Droplets,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sliders,
  Play,
  Square,
  Plus,
  Printer,
  TrendingDown,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Zap,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  INITIAL_ZONE_WATER_BUDGETS,
  INITIAL_IRRIGATION_LOGS,
  ZoneWaterBudget,
  IrrigationSessionLog,
} from '../data/waterIrrigationData';
import { useApp } from '../context/AppContext';

export const WaterIrrigationTrackerWidget: React.FC = () => {
  const { telemetry, togglePump, showNotification } = useApp();

  const [zoneBudgets, setZoneBudgets] = useState<Record<string, ZoneWaterBudget>>(INITIAL_ZONE_WATER_BUDGETS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-b'); // default to zone-b to immediately showcase the threshold alert
  const [logs, setLogs] = useState<IrrigationSessionLog[]>(INITIAL_IRRIGATION_LOGS);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New log form state
  const [newDuration, setNewDuration] = useState<number>(45);
  const [newMethod, setNewMethod] = useState<IrrigationSessionLog['method']>('Solar Drip Emitter');
  const [newSource, setNewSource] = useState<IrrigationSessionLog['waterSource']>('Solar Deep Borewell');
  const [newNotes, setNewNotes] = useState('');

  const currentZone: ZoneWaterBudget = useMemo(() => {
    return zoneBudgets[selectedZoneId] || zoneBudgets['zone-a'];
  }, [zoneBudgets, selectedZoneId]);

  // Consumption percentage against sustainable ceiling
  const usagePercentage = Math.round(
    (currentZone.todayConsumedLiters / currentZone.dailySustainableLimitLiters) * 100
  );

  const isOverThreshold = usagePercentage > 100;
  const isApproachingThreshold = usagePercentage >= 85 && usagePercentage <= 100;

  // Toggle Auto-Shutoff setting
  const handleToggleAutoShutoff = () => {
    const updated = {
      ...currentZone,
      autoShutoffEnabled: !currentZone.autoShutoffEnabled,
    };
    setZoneBudgets((prev) => ({
      ...prev,
      [selectedZoneId]: updated,
    }));
    showNotification(
      `Smart Auto-Shutoff ${updated.autoShutoffEnabled ? 'ENABLED' : 'DISABLED'} for ${currentZone.zoneName}.`
    );
  };

  // Simulate an irrigation water consumption spike (for testing / demoing threshold alerts)
  const handleSimulateSpike = () => {
    const addedLiters = 650;
    const newTotal = currentZone.todayConsumedLiters + addedLiters;
    const isExceeded = newTotal > currentZone.dailySustainableLimitLiters;

    const updated: ZoneWaterBudget = {
      ...currentZone,
      todayConsumedLiters: newTotal,
      status: isExceeded ? 'Threshold Exceeded' : newTotal >= currentZone.dailySustainableLimitLiters * 0.85 ? 'Approaching Threshold' : 'Normal',
      alertMessage: isExceeded
        ? `CRITICAL WATER USAGE ALERT: Daily consumption (${newTotal.toLocaleString('en-IN')} L) has exceeded the ${currentZone.dailySustainableLimitLiters.toLocaleString('en-IN')} L sustainable threshold by ${(newTotal - currentZone.dailySustainableLimitLiters).toLocaleString('en-IN')} Liters (${Math.round((newTotal / currentZone.dailySustainableLimitLiters) * 100)}%).`
        : undefined,
      recommendedAction: isExceeded
        ? 'Pause active solar pump immediately. Check lateral lines for pipe leaks or engage emergency deficit pulse.'
        : currentZone.recommendedAction,
    };

    setZoneBudgets((prev) => ({
      ...prev,
      [selectedZoneId]: updated,
    }));

    // Trigger toast notification
    if (isExceeded) {
      showNotification(
        `🚨 SUSTAINABLE THRESHOLD EXCEEDED in ${currentZone.zoneName}! Consumed: ${newTotal} L / ${currentZone.dailySustainableLimitLiters} L limit.`
      );
    } else {
      showNotification(`Added ${addedLiters} L to ${currentZone.zoneName}. Total today: ${newTotal} L.`);
    }
  };

  // Reset zone consumption counter
  const handleResetCounter = () => {
    const updated: ZoneWaterBudget = {
      ...currentZone,
      todayConsumedLiters: 1800,
      status: 'Normal',
      alertMessage: undefined,
      recommendedAction: 'Counter reset. Water usage tracking re-synchronized with flow meter.',
    };
    setZoneBudgets((prev) => ({
      ...prev,
      [selectedZoneId]: updated,
    }));
    showNotification(`Daily water counter for ${currentZone.zoneName} reset to nominal 1,800 L.`);
  };

  // Submit manual log entry
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedLiters = Math.round(newDuration * currentZone.flowRateLitersPerMin);

    const newLog: IrrigationSessionLog = {
      id: `IRR-LOG-${Date.now().toString().slice(-4)}`,
      zoneId: currentZone.zoneId,
      zoneName: `${currentZone.zoneName.split(':')[0]}: ${currentZone.cropName}`,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: newDuration,
      waterUsedLiters: calculatedLiters,
      method: newMethod,
      waterSource: newSource,
      operator: 'Ayushman Panda (Lead Cultivator)',
      soilMoistureBeforePercent: telemetry.soilMoisture,
      soilMoistureAfterPercent: Math.min(65, telemetry.soilMoisture + 6.5),
      notes: newNotes || 'Manual session recorded via smart flow sensor meter.',
    };

    setLogs([newLog, ...logs]);

    // Update zone consumption
    const updatedToday = currentZone.todayConsumedLiters + calculatedLiters;
    const isExceeded = updatedToday > currentZone.dailySustainableLimitLiters;

    setZoneBudgets((prev) => ({
      ...prev,
      [selectedZoneId]: {
        ...currentZone,
        todayConsumedLiters: updatedToday,
        status: isExceeded ? 'Threshold Exceeded' : updatedToday >= currentZone.dailySustainableLimitLiters * 0.85 ? 'Approaching Threshold' : 'Normal',
        alertMessage: isExceeded
          ? `CRITICAL WATER USAGE ALERT: Daily consumption (${updatedToday.toLocaleString('en-IN')} L) has exceeded the ${currentZone.dailySustainableLimitLiters.toLocaleString('en-IN')} L sustainable limit by ${(updatedToday - currentZone.dailySustainableLimitLiters).toLocaleString('en-IN')} Liters.`
          : undefined,
      },
    }));

    setIsLogModalOpen(false);
    setNewNotes('');

    showNotification(
      `Logged ${calculatedLiters.toLocaleString('en-IN')} Liters for ${currentZone.cropName}. Total today: ${updatedToday.toLocaleString('en-IN')} L.`
    );
  };

  const handleExportWaterAudit = () => {
    showNotification(`Exporting official Water Stewardship & Irrigation Audit Report (NPOP Organic Compliance)...`);
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Droplets className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Water Stewardship &amp; Irrigation Module</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Per-Zone Water Consumption &amp; Sustainable Threshold Guard</span>
            </h2>

            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Real-time volumetric water tracking across registered crop plots. Enforces agronomical limits based on reference evapotranspiration (ET₀) and triggers immediate alerts before groundwater reserves are over-drafted.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportWaterAudit}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-teal-300" />
              <span>Export Water Audit</span>
            </button>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Irrigation Session</span>
            </button>
          </div>
        </div>

        {/* 1. Zone Selection Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
          {Object.keys(zoneBudgets).map((zId) => {
            const z = zoneBudgets[zId];
            const isSelected = selectedZoneId === zId;
            const pct = Math.round((z.todayConsumedLiters / z.dailySustainableLimitLiters) * 100);
            const isAlert = pct > 100;

            return (
              <button
                key={zId}
                onClick={() => setSelectedZoneId(zId)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-lg ring-2 ring-teal-400 scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    isAlert
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-white/20 text-teal-300'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <span>{z.cropName.split(' ')[0]} {z.cropName.split(' ')[1]}</span>
                    {isAlert && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-600 text-white font-black animate-pulse">
                        OVER LIMIT
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-300'}`}>
                    {z.todayConsumedLiters.toLocaleString('en-IN')} / {z.dailySustainableLimitLiters.toLocaleString('en-IN')} L ({pct}%)
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-teal-600 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* 2. Threshold Alert Banner (Appears when exceeded or approaching) */}
        {isOverThreshold && (
          <div className="p-5 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-950 dark:text-rose-200 shadow-md space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Sustainable Threshold Exceeded Warning
                  </div>
                  <h4 className="text-base font-black text-rose-700 dark:text-rose-300">
                    {currentZone.zoneName}: Daily Usage Ceiling Breached (+{usagePercentage - 100}%)
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePump}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Emergency Pump Stop</span>
                </button>
                <button
                  onClick={handleResetCounter}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Reset Baseline
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentZone.alertMessage ||
                `Today's water withdrawal (${currentZone.todayConsumedLiters.toLocaleString('en-IN')} L) exceeds the maximum agronomic sustainable threshold of ${currentZone.dailySustainableLimitLiters.toLocaleString('en-IN')} Liters. Prolonged over-irrigation triggers root hypoxia, nitrogen leaching, and unnecessary solar battery draw.`}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-white/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/40">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Recommended Action: {currentZone.recommendedAction}</span>
            </div>
          </div>
        )}

        {isApproachingThreshold && !isOverThreshold && (
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-extrabold text-xs text-amber-800 dark:text-amber-400">
                Approaching Sustainable Irrigation Threshold ({usagePercentage}% of daily limit)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {currentZone.todayConsumedLiters.toLocaleString('en-IN')} L consumed out of{' '}
                {currentZone.dailySustainableLimitLiters.toLocaleString('en-IN')} L daily budget. Only{' '}
                {(currentZone.dailySustainableLimitLiters - currentZone.todayConsumedLiters).toLocaleString('en-IN')} L remains before threshold lockdown.
              </p>
            </div>
          </div>
        )}

        {/* 3. Primary Metrics & Real-Time Consumption Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Volumetric Gauge & Threshold Progress (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Volumetric Water Budget for {currentZone.cropName}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isOverThreshold
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : isApproachingThreshold
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {currentZone.status}
                </span>
              </div>

              {/* Big Number */}
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    isOverThreshold
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {currentZone.todayConsumedLiters.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  / {currentZone.dailySustainableLimitLiters.toLocaleString('en-IN')} Liters Daily Ceiling
                </span>
                <span
                  className={`ml-auto text-xs font-black px-2 py-0.5 rounded-md ${
                    isOverThreshold
                      ? 'bg-rose-600 text-white'
                      : isApproachingThreshold
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                  }`}
                >
                  {usagePercentage}%
                </span>
              </div>

              {/* Visual Multi-Segment Progress Bar */}
              <div className="space-y-1.5 mt-5">
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOverThreshold
                        ? 'bg-rose-600'
                        : isApproachingThreshold
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                  {/* Threshold benchmark line at 85% */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
                    style={{ left: '85%' }}
                    title="85% Warning Benchmark"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>0 L (Dry)</span>
                  <span>Safe Tier (&lt;80%)</span>
                  <span className="text-amber-500">85% Warning</span>
                  <span className="text-rose-500">100% Sustainable Limit ({currentZone.dailySustainableLimitLiters} L)</span>
                </div>
              </div>
            </div>

            {/* Micro Flow Details */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Emitter Flow Rate</span>
                <span className="text-base font-black text-teal-600 dark:text-teal-400">
                  {currentZone.flowRateLitersPerMin} L/min
                </span>
                <span className="text-[10px] text-slate-500 block">Calibrated Pressure</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Water / Kg Harvest</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {currentZone.litersPerKgHarvestProjected} L/kg
                </span>
                <span className="text-[10px] text-slate-500 block">Target: &lt;35 L/kg</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Groundwater Saved</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  {currentZone.groundwaterSavedPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block">vs Flood Irrigation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Connected Pump Control & Auto-Shutoff Lock (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 rounded-3xl p-6 border border-teal-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-extrabold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Solar Drip Pump Gateway</span>
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    telemetry.irrigationPumpStatus === 'Active'
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {telemetry.irrigationPumpStatus.toUpperCase()}
                </span>
              </div>

              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Connected Solar Borewell & Drip Manifold
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Solar power generation: <strong>{telemetry.solarGenerationKw} kW</strong>. Direct telemetry link to topsoil moisture sensors ({telemetry.soilMoisture.toFixed(1)}%).
              </p>

              {/* Pump Toggle Button */}
              <button
                onClick={togglePump}
                className={`mt-4 w-full py-3 rounded-2xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 ${
                  telemetry.irrigationPumpStatus === 'Active'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {telemetry.irrigationPumpStatus === 'Active' ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Active Solar Pump Line</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Solar Drip Pump Line</span>
                  </>
                )}
              </button>
            </div>

            {/* Auto-Shutoff Toggle & Test Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 text-xs">
              {/* Smart Auto-Shutoff Lock */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Auto-Shutoff at 100% Limit
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Automatically trips pump relay when daily budget is reached.
                  </p>
                </div>
                <button
                  onClick={handleToggleAutoShutoff}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    currentZone.autoShutoffEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      currentZone.autoShutoffEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Quick simulation buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateSpike}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                  title="Simulate a water consumption spike to test the sustainable threshold warning"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulate Spike (+650 L)</span>
                </button>
                <button
                  onClick={handleResetCounter}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Historical Irrigation Sessions Log Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Irrigation Session Audit Logs</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audited volumetric telemetry recorded per zone for NPOP organic sustainability compliance
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">{logs.length} sessions logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Session Date / Time</th>
                  <th className="pb-3">Crop Zone</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Water Used</th>
                  <th className="pb-3">Method & Source</th>
                  <th className="pb-3">Moisture Shift</th>
                  <th className="pb-3">Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {logs.map((log) => (
                  <tr key={log.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <div>{log.date}</div>
                      <div className="text-[10px] text-slate-400">{log.startTime}</div>
                    </td>
                    <td className="py-3 font-bold text-teal-700 dark:text-teal-400">{log.zoneName}</td>
                    <td className="py-3">{log.durationMinutes} mins</td>
                    <td className="py-3 font-black text-slate-900 dark:text-white">
                      {log.waterUsedLiters.toLocaleString('en-IN')} L
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{log.method}</div>
                      <div className="text-[10px] text-slate-400">{log.waterSource}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-400">{log.soilMoistureBeforePercent}%</span> →{' '}
                      <strong className="text-emerald-600">{log.soilMoistureAfterPercent}%</strong>
                    </td>
                    <td className="py-3 text-[11px] text-slate-500 max-w-[200px] truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Log New Irrigation Session */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Log Irrigation Session for {currentZone.cropName}
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Crop Zone</label>
                <input
                  type="text"
                  disabled
                  value={`${currentZone.zoneName} (${currentZone.cropName})`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Calculated: ~{Math.round(newDuration * currentZone.flowRateLitersPerMin)} Liters
                  </span>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Application Method
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Solar Drip Emitter">Solar Drip Emitter</option>
                    <option value="Micro-Sprinkler">Micro-Sprinkler</option>
                    <option value="Sub-Surface Drip">Sub-Surface Drip</option>
                    <option value="Gravity Furrow">Gravity Furrow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Water Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Solar Deep Borewell">Solar Deep Borewell</option>
                  <option value="Rainwater Retention Pond">Rainwater Retention Pond</option>
                  <option value="Natural Mountain Spring">Natural Mountain Spring</option>
                  <option value="Hirakud Canal Lift">Hirakud Canal Lift</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Field Notes / Biostimulant additions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Added 15L fermented Jeevamrutha through venturi injector."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md transition-colors"
                >
                  Record Irrigation Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
