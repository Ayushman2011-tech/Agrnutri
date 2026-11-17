import React, { useState } from 'react';
import {
  TrendingUp,
  Sprout,
  Calendar,
  CloudSun,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  DollarSign,
  Layers,
  MapPin,
  RefreshCw,
  Printer,
  ChevronRight,
  Sun,
  Wind,
} from 'lucide-react';
import { CROP_FORECAST_DATA, CropForecastModel } from '../data/cropForecastData';
import { useApp } from '../context/AppContext';

export const CropYieldForecastWidget: React.FC = () => {
  const { telemetry, showNotification } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>('crop-tomato');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'soil' | 'weather' | 'insights' | 'simulator'>('soil');

  // Scenario Simulator interactive sliders
  const [compostBoostLevel, setCompostBoostLevel] = useState<number>(1.5); // extra tons/acre
  const [dripAutomationActive, setDripAutomationActive] = useState<boolean>(true);
  const [mulchCoverActive, setMulchCoverActive] = useState<boolean>(true);

  const selectedCrop: CropForecastModel =
    CROP_FORECAST_DATA.find((c) => c.cropId === selectedCropId) || CROP_FORECAST_DATA[0];

  // Dynamic simulation adjustments based on slider levers
  const simulationYieldBonus =
    (compostBoostLevel * 3.2) +
    (dripAutomationActive ? 4.8 : 0) +
    (mulchCoverActive ? 3.5 : 0);

  const simulatedYield = +(selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre + simulationYieldBonus).toFixed(1);
  const simulatedYieldPercentGain = +(
    ((simulatedYield - selectedCrop.upcomingSeason.baselineYieldQuintalPerAcre) /
      selectedCrop.upcomingSeason.baselineYieldQuintalPerAcre) *
    100
  ).toFixed(1);

  const basePricePerQuintal =
    selectedCrop.upcomingSeason.projectedRevenuePerAcreInr /
    selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre;

  const simulatedRevenue = Math.round(simulatedYield * basePricePerQuintal);
  const simulatedExtraIncome = Math.round(
    (simulatedYield - selectedCrop.upcomingSeason.baselineYieldQuintalPerAcre) * basePricePerQuintal
  );

  const handlePrintAdvisory = () => {
    showNotification(
      `Generating printable AI Crop Yield & Agronomic Advisory for ${selectedCrop.cropName} (KVK Odisha Standard)...`
    );
    window.print();
  };

  const handleConsultAgronomist = () => {
    showNotification(
      `Agronomic consultation request submitted to Krishi Vigyan Kendra (KVK) for ${selectedCrop.farmPlot}. Advisory dispatch queued via SMS.`
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Crop Yield Forecasting Engine · Season 2026-2027</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Predictive Harvest Yield & Agronomic Advisory</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Synthesizing 3-year historical soil nutrient assays (N-P-K, Organic Carbon, pH) with 30-year IMD weather
              cycles, Doppler rainfall probability, and real-time sensor telemetry ({telemetry.soilMoisture.toFixed(1)}% soil moisture).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintAdvisory}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
              title="Print Agronomic Forecast Advisory"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>Export Advisory</span>
            </button>
            <button
              onClick={handleConsultAgronomist}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Connect KVK Agronomist</span>
            </button>
          </div>
        </div>

        {/* Crop Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
          {CROP_FORECAST_DATA.map((crop) => {
            const isSelected = crop.cropId === selectedCropId;
            return (
              <button
                key={crop.cropId}
                onClick={() => setSelectedCropId(crop.cropId)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-lg scale-102 ring-2 ring-emerald-400'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-white/20 text-emerald-300'
                  }`}
                >
                  {crop.cropName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-extrabold">{crop.cropName.split(' ')[0]} {crop.cropName.split(' ')[1]}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-300'}`}>
                    {crop.odishaName}
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

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Selected Crop Meta & Primary KPI Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Forecast Metric Hero (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 p-6 rounded-3xl border border-emerald-200/80 dark:border-slate-700 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>{selectedCrop.upcomingSeason.seasonName}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-2xs">
                  {selectedCrop.upcomingSeason.confidenceScorePercent}% CONFIDENCE
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {selectedCrop.cropName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedCrop.farmPlot} · {selectedCrop.district}
              </p>

              {/* Big Forecast Number */}
              <div className="mt-5 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500">
                  Forecasted Harvest Yield
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                    {selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre}
                  </span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Quintals / Acre
                  </span>
                  <span className="inline-flex items-center text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 px-2 py-0.5 rounded-md ml-auto">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{selectedCrop.upcomingSeason.yieldVariancePercent}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between">
                  <span>
                    Range: <strong>{selectedCrop.upcomingSeason.predictedRangeQuintal.min} - {selectedCrop.upcomingSeason.predictedRangeQuintal.max} Q/Acre</strong>
                  </span>
                  <span>
                    Baseline: {selectedCrop.upcomingSeason.baselineYieldQuintalPerAcre} Q
                  </span>
                </div>
              </div>

              {/* Financial Gain Forecast */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Projected Revenue
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                    ₹{selectedCrop.upcomingSeason.projectedRevenuePerAcreInr.toLocaleString('en-IN')}/Acre
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                    Potential Extra Gain
                  </span>
                  <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                    +₹{selectedCrop.upcomingSeason.potentialRevenueGainInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sowing & Harvest Windows */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Optimal Sowing Window</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedCrop.upcomingSeason.targetSowingWindow}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Expected Harvest Window</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedCrop.upcomingSeason.expectedHarvestMonth}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Historical 3-Year Trend Comparison Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>3-Year Historical Yield Growth vs AI Forecast</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Comparing validated past harvest actuals with upcoming season predictive trajectory
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" /> Actual
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="w-3 h-3 rounded bg-emerald-500" /> AI Forecast
                  </span>
                </div>
              </div>

              {/* Bar Comparison Visualizer */}
              <div className="space-y-4 my-4">
                {selectedCrop.historicalYields.map((record) => {
                  const maxYield = selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre * 1.15;
                  const percentWidth = Math.round((record.yieldQuintalPerAcre / maxYield) * 100);

                  return (
                    <div key={record.year} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>{record.year} Season</span>
                          <span className="text-[10px] font-normal text-slate-400">({record.season})</span>
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-400 text-[11px]">Rain: {record.rainfallMm} mm</span>
                          <span className="font-bold text-slate-900 dark:text-white">{record.yieldQuintalPerAcre} Q/Acre</span>
                        </div>
                      </div>
                      <div className="h-3.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex items-center">
                        <div
                          className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-700"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Upcoming Predicted Bar */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Upcoming Season 2026-27 (AI Predicted)</span>
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        +{selectedCrop.upcomingSeason.yieldVariancePercent}% Boost
                      </span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre} Q/Acre
                      </span>
                    </div>
                  </div>
                  <div className="h-4 bg-emerald-100 dark:bg-emerald-950/40 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm animate-pulse"
                      style={{
                        width: `${Math.round(
                          (selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre /
                            (selectedCrop.upcomingSeason.predictedYieldQuintalPerAcre * 1.15)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Tri-Index Meters */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/70 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Soil Health Index</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {selectedCrop.upcomingSeason.soilSuitabilityIndex}/100
                </span>
                <span className="text-[10px] text-slate-500 block">Rich in Vermicast</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Weather Favorability</span>
                <span className="text-base font-black text-teal-600 dark:text-teal-400">
                  {selectedCrop.upcomingSeason.weatherFavorabilityIndex}/100
                </span>
                <span className="text-[10px] text-slate-500 block">Mild Winter Nights</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Climate Resilience</span>
                <span className="text-base font-black text-amber-500">
                  {selectedCrop.upcomingSeason.climateResilienceIndex}/100
                </span>
                <span className="text-[10px] text-slate-500 block">Low Flood Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Correlation Detail Tabs */}
        <div className="space-y-4">
          {/* Sub-Tabs Nav */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <button
              onClick={() => setActiveAnalysisTab('soil')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAnalysisTab === 'soil'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Historical Soil Health & Nutrients</span>
            </button>

            <button
              onClick={() => setActiveAnalysisTab('weather')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAnalysisTab === 'weather'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>Weather Trends & IMD Outlook</span>
            </button>

            <button
              onClick={() => setActiveAnalysisTab('insights')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAnalysisTab === 'insights'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agronomic Insights & Interventions</span>
            </button>

            <button
              onClick={() => setActiveAnalysisTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto ${
                activeAnalysisTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Yield Simulator</span>
            </button>
          </div>

          {/* TAB 1: SOIL HEALTH */}
          {activeAnalysisTab === 'soil' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Soil Baseline Specification:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-300">{selectedCrop.soilTypeDescription}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400">Target pH:</span>
                  <span className="font-bold text-emerald-600">{selectedCrop.optimalSoilPh}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCrop.upcomingSeason.soilFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{factor.factor}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                          {factor.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Biological Yield Impact: <strong className="text-emerald-600 dark:text-emerald-400">{factor.impactOnYield}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        {factor.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WEATHER TRENDS */}
          {activeAnalysisTab === 'weather' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Agro-Climatic Zone:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-300">{selectedCrop.district} · Growing cycle {selectedCrop.growingPeriodDays} days</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400">Crop Water Demand:</span>
                  <span className="font-bold text-teal-600">{selectedCrop.waterNeedCategory} Water Requirement</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCrop.upcomingSeason.weatherFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{factor.factor}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            factor.outlook === 'Favorable'
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                              : factor.outlook === 'Advisory Alert'
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {factor.outlook}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atmospheric Impact: <strong className="text-slate-700 dark:text-slate-200">{factor.impactOnYield}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        {factor.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INSIGHTS & INTERVENTIONS */}
          {activeAnalysisTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Predictive Insights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCrop.upcomingSeason.predictiveInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      insight.type === 'positive'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
                        : insight.type === 'warning'
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-950 dark:text-amber-200'
                        : 'bg-teal-50/60 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/40 text-teal-950 dark:text-teal-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {insight.type === 'positive' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {insight.type === 'action' && <Sparkles className="w-4 h-4 text-teal-600" />}
                        <h5 className="font-extrabold text-xs leading-snug">{insight.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Stage-by-Stage Interventions */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Agronomic Intervention Calendar to Realize Max Forecast</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedCrop.upcomingSeason.recommendedInterventions.map((interv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] block">
                          Stage: {interv.stage}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          {interv.action}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg shrink-0">
                        {interv.expectedBoost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE YIELD SIMULATOR */}
          {activeAnalysisTab === 'simulator' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 dark:border-amber-400/20 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-400 mb-1">
                    <Sliders className="w-4 h-4" />
                    <span>Real-Time What-If Agronomic Simulation</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Simulate Agricultural Interventions on {selectedCrop.cropName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Adjust organic soil amendments, solar drip cycle automation, and bio-mulching to view instant yield and revenue adjustments.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 shadow-md text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Simulated Harvest Yield</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {simulatedYield} Q/Acre
                  </div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    +{simulatedYieldPercentGain}% vs Baseline · +₹{simulatedExtraIncome.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* 1. Vermicompost / Organic Matter */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Vermicompost Application</span>
                    <span className="font-black text-emerald-600">+{compostBoostLevel} Tons/Acre</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={compostBoostLevel}
                    onChange={(e) => setCompostBoostLevel(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Baseline (0 t)</span>
                    <span>Standard (+2 t)</span>
                    <span>High Organic (+4 t)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enhances soil cation exchange capacity (CEC) and feeds native soil micro-flora.
                  </p>
                </div>

                {/* 2. Solar Drip Irrigation Automation */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Solar Drip Moisture Automation</span>
                    <span className={`font-black ${dripAutomationActive ? 'text-teal-600' : 'text-slate-400'}`}>
                      {dripAutomationActive ? 'Active (+4.8 Q)' : 'Manual Off'}
                    </span>
                  </div>
                  <button
                    onClick={() => setDripAutomationActive(!dripAutomationActive)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      dripAutomationActive
                        ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {dripAutomationActive ? '✓ Solar Drip Auto-Cycling Enabled' : 'Enable Solar Drip Auto-Cycling'}
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Triggers irrigation pulses precisely when root-zone moisture drops below 32%.
                  </p>
                </div>

                {/* 3. Biomass Mulch Cover */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Organic Biomass Mulch</span>
                    <span className={`font-black ${mulchCoverActive ? 'text-amber-500' : 'text-slate-400'}`}>
                      {mulchCoverActive ? 'Applied (+3.5 Q)' : 'Bare Soil'}
                    </span>
                  </div>
                  <button
                    onClick={() => setMulchCoverActive(!mulchCoverActive)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      mulchCoverActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-extrabold'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {mulchCoverActive ? '✓ Forest Leaf Mulch Deployed' : 'Deploy Biomass Mulch'}
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Buffers soil root temperature against sudden night dips and reduces evaporation by 40%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
