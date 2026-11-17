import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Compass,
  Sliders,
  Printer,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Flame,
  Activity,
  Maximize2,
  FileText,
  Thermometer,
} from 'lucide-react';
import {
  CROP_ZONES_HEATMAP_DATA,
  NUTRIENT_METRICS_INFO,
  CropZoneData,
  SoilQuadrantData,
  SoilNutrientMetricKey,
} from '../data/soilHeatMapData';
import { useApp } from '../context/AppContext';

export const SoilHealthHeatMapWidget: React.FC = () => {
  const { telemetry, togglePump, showNotification } = useApp();

  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-sambalpur-tomatoes');
  const [activeMetricKey, setActiveMetricKey] = useState<SoilNutrientMetricKey>('nitrogen');
  const [selectedQuadrantId, setSelectedQuadrantId] = useState<string>('SEC-A11');
  const [filterDepth, setFilterDepth] = useState<'all' | '15' | '30'>('all');

  // Selected Zone
  const currentZone: CropZoneData = useMemo(() => {
    return (
      CROP_ZONES_HEATMAP_DATA.find((z) => z.zoneId === selectedZoneId) ||
      CROP_ZONES_HEATMAP_DATA[0]
    );
  }, [selectedZoneId]);

  // Selected Metric metadata
  const currentMetricInfo = NUTRIENT_METRICS_INFO[activeMetricKey];

  // Selected Quadrant data
  const currentQuadrant: SoilQuadrantData = useMemo(() => {
    return (
      currentZone.quadrants.find((q) => q.id === selectedQuadrantId) ||
      currentZone.quadrants[0]
    );
  }, [currentZone, selectedQuadrantId]);

  // Color mapping logic based on nutrient benchmark
  const getTileColorClass = (val: number, metric: SoilNutrientMetricKey) => {
    const info = NUTRIENT_METRICS_INFO[metric];

    if (metric === 'pH') {
      if (val >= 6.4 && val <= 7.0) return 'bg-emerald-600 text-white';
      if (val >= 6.1 && val <= 7.3) return 'bg-teal-600 text-white';
      if (val < 6.0) return 'bg-amber-600 text-white'; // acidic
      return 'bg-indigo-600 text-white'; // alkaline
    }

    if (metric === 'ecSalinity') {
      if (val <= 0.6) return 'bg-emerald-600 text-white';
      if (val <= 0.8) return 'bg-teal-600 text-white';
      if (val <= 1.0) return 'bg-amber-500 text-white';
      return 'bg-rose-600 text-white';
    }

    // Standard high is good (N, P, K, OC, Health, Moisture)
    const ratio = (val - info.minVal) / (info.maxVal - info.minVal);

    if (val < info.optimalMin * 0.85) {
      return 'bg-rose-600 text-white shadow-xs'; // severe deficit
    }
    if (val < info.optimalMin) {
      return 'bg-amber-500 text-slate-950 font-bold'; // mild deficit
    }
    if (val >= info.optimalMin && val <= info.optimalMax) {
      return 'bg-emerald-600 text-white'; // optimal target range
    }
    // High / Superb
    return 'bg-emerald-500 text-slate-950 font-extrabold';
  };

  const getStatusBadge = (val: number, metric: SoilNutrientMetricKey) => {
    const info = NUTRIENT_METRICS_INFO[metric];
    if (metric === 'pH') {
      if (val < 6.0) return { label: 'Acidic Buffer Alert', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      if (val > 7.3) return { label: 'Alkaline Shift', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' };
      return { label: 'Optimal pH Balance', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    }
    if (val < info.optimalMin) {
      return { label: 'Deficit Hotspot', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
    }
    if (val > info.optimalMax * 1.15) {
      return { label: 'Surplus Reserve', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' };
    }
    return { label: 'Prime Optimal Tier', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
  };

  // Actions
  const handleGenerateRemediation = () => {
    showNotification(
      `Generating precision bio-remediation recipe for ${currentZone.zoneName}. Automated organic prescription queued for local FPO distribution.`
    );
  };

  const handleExportSoilCard = () => {
    showNotification(
      `Exporting official Odisha Soil Health Card (Krishi Vigyan Kendra format) for ${currentZone.localPlotName}...`
    );
    window.print();
  };

  const handlePulseDripForQuadrant = () => {
    togglePump();
    showNotification(
      `Solar Drip Pulse triggered for ${currentQuadrant.label}. Targeting root-zone capillary recharge.`
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top Header & Zone Selector */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Precision Soil Health Heat-Map Matrix</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Interactive Micro-Quadrant Nutrient Heat-Map</span>
            </h2>

            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Spatial multi-depth soil sensor mapping across crop zones. Toggle between macro-nutrients (N-P-K),
              Organic Carbon, pH reaction, and moisture telemetry to pinpoint fertility deficits before planting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportSoilCard}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
              title="Print Odisha Soil Health Card"
            >
              <Printer className="w-3.5 h-3.5 text-teal-300" />
              <span>Export Soil Card</span>
            </button>
            <button
              onClick={handleGenerateRemediation}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prescribe Bio-Remediation</span>
            </button>
          </div>
        </div>

        {/* 1. Crop Zone Selection Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
          {CROP_ZONES_HEATMAP_DATA.map((zone) => {
            const isSelected = zone.zoneId === selectedZoneId;
            return (
              <button
                key={zone.zoneId}
                onClick={() => {
                  setSelectedZoneId(zone.zoneId);
                  setSelectedQuadrantId(zone.quadrants[0].id);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-lg ring-2 ring-emerald-400 scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-white/20 text-emerald-300'
                  }`}
                >
                  {zone.zoneName.split(':')[0].replace('Zone ', '')}
                </div>
                <div className="text-left">
                  <div className="font-extrabold">{zone.cropCultivated.split('(')[0]}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-300'}`}>
                    {zone.localPlotName} · {zone.totalAcres} Acres
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Heat-Map Workspace */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* 2. Nutrient Level & Metric Selector Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Select Active Soil Metric / Nutrient Layer
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentMetricInfo.description}
              </p>
            </div>

            {/* Depth Filter Pill */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
              <span className="text-slate-400 px-2">Probe Depth:</span>
              <button
                onClick={() => setFilterDepth('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterDepth === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                All Depths
              </button>
              <button
                onClick={() => setFilterDepth('15')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterDepth === '15'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                15cm (Topsoil Feeder)
              </button>
              <button
                onClick={() => setFilterDepth('30')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterDepth === '30'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                30cm (Deep Reservoir)
              </button>
            </div>
          </div>

          {/* Metric Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
            {(Object.keys(NUTRIENT_METRICS_INFO) as SoilNutrientMetricKey[]).map((key) => {
              const info = NUTRIENT_METRICS_INFO[key];
              const isSelected = activeMetricKey === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveMetricKey(key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40 scale-102'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {info.symbol}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {info.unit}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-bold text-xs truncate leading-snug">{info.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Target: {info.target} {info.unit}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Heat-Map Grid + Detailed Quadrant Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Field Quadrant Heat-Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Field Grid: {currentZone.localPlotName} (4x4 Micro-Quadrants)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Click any tile to inspect micro-sensors & biological remedy
              </span>
            </div>

            {/* The 4x4 Grid Matrix */}
            <div className="grid grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-800/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
              {currentZone.quadrants.map((quad) => {
                const metricVal = quad.metrics[activeMetricKey];
                const isSelected = quad.id === selectedQuadrantId;
                const isDimmed = filterDepth !== 'all' && quad.probeDepthCm.toString() !== filterDepth;
                const tileColor = getTileColorClass(metricVal, activeMetricKey);

                return (
                  <button
                    key={quad.id}
                    onClick={() => setSelectedQuadrantId(quad.id)}
                    className={`relative aspect-square sm:aspect-[4/3] rounded-2xl p-2.5 sm:p-3 transition-all flex flex-col justify-between text-left group overflow-hidden ${tileColor} ${
                      isSelected
                        ? 'ring-4 ring-amber-400 dark:ring-amber-300 scale-103 shadow-xl z-10'
                        : 'hover:scale-102 hover:shadow-md'
                    } ${isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                  >
                    {/* Top Row: Quadrant ID and depth */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase opacity-90">
                        {quad.id.replace('SEC-', '')}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/20 backdrop-blur-xs">
                        {quad.probeDepthCm}cm
                      </span>
                    </div>

                    {/* Middle: Big Metric Value */}
                    <div className="my-auto text-center">
                      <div className="text-base sm:text-xl font-black tracking-tight leading-none drop-shadow-xs">
                        {metricVal}
                      </div>
                      <div className="text-[9px] opacity-80 mt-0.5">{currentMetricInfo.unit}</div>
                    </div>

                    {/* Bottom: Alert Dot or Label */}
                    <div className="flex items-center justify-between w-full text-[9px] opacity-85">
                      <span className="truncate max-w-[70px]">{quad.label.split(':')[0]}</span>
                      {quad.alertNote && (
                        <span className="w-2 h-2 rounded-full bg-amber-300 ring-2 ring-amber-500 animate-pulse shrink-0" title={quad.alertNote} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Heat-Map Scale Legend */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Heat-Map Calibration Scale: {currentMetricInfo.label}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Target: {currentMetricInfo.target} {currentMetricInfo.unit}
                </span>
              </div>

              {/* Gradient Bar */}
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 shadow-inner" />

              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                <span>Severe Deficit (&lt;{currentMetricInfo.optimalMin * 0.85})</span>
                <span>Mild Deficit ({currentMetricInfo.optimalMin})</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Optimal Target ({currentMetricInfo.optimalMin} - {currentMetricInfo.optimalMax} {currentMetricInfo.unit})
                </span>
                <span>Surplus (&gt;{currentMetricInfo.optimalMax})</span>
              </div>
            </div>
          </div>

          {/* Right: Micro-Quadrant Telemetry Inspector Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 rounded-3xl p-6 border border-emerald-200/80 dark:border-slate-700 shadow-md space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  QUADRANT #{currentQuadrant.id}
                </span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${getStatusBadge(currentQuadrant.metrics[activeMetricKey], activeMetricKey).color}`}>
                  {getStatusBadge(currentQuadrant.metrics[activeMetricKey], activeMetricKey).label}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentQuadrant.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>GPS: {currentQuadrant.coordinates} · Depth: {currentQuadrant.probeDepthCm}cm</span>
              </p>
            </div>

            {/* Focused Metric Highlight Banner */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                  {currentMetricInfo.label} Status
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {currentQuadrant.metrics[activeMetricKey]}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentMetricInfo.unit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Benchmark Target</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentMetricInfo.target} {currentMetricInfo.unit}
                </span>
              </div>
            </div>

            {/* Alert banner if present */}
            {currentQuadrant.alertNote && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Micro-Climatic / Soil Observation</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {currentQuadrant.alertNote}
                </p>
              </div>
            )}

            {/* Full 8-Metric Mini Dashboard for this Quadrant */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Multi-Sensor Telemetry Matrix for {currentQuadrant.id}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Nitrogen (N)</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {currentQuadrant.metrics.nitrogen} <span className="text-[8px] font-normal">kg/ha</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Phosphorus (P)</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {currentQuadrant.metrics.phosphorus} <span className="text-[8px] font-normal">kg/ha</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Potassium (K)</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {currentQuadrant.metrics.potassium} <span className="text-[8px] font-normal">kg/ha</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Organic Carbon</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {currentQuadrant.metrics.organicCarbon}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Soil pH</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {currentQuadrant.metrics.pH}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Moisture</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">
                    {currentQuadrant.metrics.moisture}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">EC Salinity</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {currentQuadrant.metrics.ecSalinity} <span className="text-[8px] font-normal">dS/m</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold block">Health Index</span>
                  <span className="font-extrabold text-amber-500">
                    {currentQuadrant.metrics.compositeHealth}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Targeted Organic Agronomic Remedy */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prescribed Organic Action for {currentQuadrant.id}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentQuadrant.recommendedAction}
              </p>
              <div className="pt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                Treatment History: <em>{currentQuadrant.organicTreatmentHistory}</em>
              </div>
            </div>

            {/* Micro-Control: Drip pulse for this quadrant */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePulseDripForQuadrant}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Pulse Drip for Sector {currentQuadrant.id.replace('SEC-', '')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Zone Summary KPI Strip & Field Operations */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Zone Health Composite</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {currentZone.zoneSummary.averageHealthScore}/100
            </div>
            <span className="text-[10px] text-slate-500">A+ Bio-Certified Field</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Optimal Field Coverage</span>
            <div className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {currentZone.zoneSummary.optimalCoveragePercent}%
            </div>
            <span className="text-[10px] text-slate-500">{currentZone.sensorNodeCount} Active IoT nodes</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Nutrient Deficit Alerts</span>
            <div className="text-xl font-black text-amber-500 mt-1">
              {currentZone.zoneSummary.activeAlertsCount} Sectors
            </div>
            <span className="text-[10px] text-slate-500 truncate block">
              {currentZone.zoneSummary.dominantDeficiency}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Next Soil Audit Schedule</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {currentZone.zoneSummary.nextSoilAudit}
            </div>
            <span className="text-[10px] text-slate-500">NABL Laboratory Accredited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
