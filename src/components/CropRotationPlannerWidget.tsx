import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  Sprout,
  TrendingUp,
  Droplets,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Printer,
  ChevronRight,
  RefreshCw,
  Plus,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import {
  PRESET_ROTATION_PLANS,
  ROTATION_CROP_CATALOG,
  CropRotationPlan,
  RotationCropOption,
  RotationSequenceStep,
} from '../data/cropRotationData';
import { useApp } from '../context/AppContext';

export const CropRotationPlannerWidget: React.FC = () => {
  const { showNotification } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-tomato-regenerative');
  
  // Custom rotation step state: allows farmers to customize crops in the selected plan
  const [activePlan, setActivePlan] = useState<CropRotationPlan>(PRESET_ROTATION_PLANS[0]);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  // When selected plan changes, sync
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = PRESET_ROTATION_PLANS.find((p) => p.planId === planId) || PRESET_ROTATION_PLANS[0];
    setActivePlan(plan);
    setEditingStepIndex(null);
  };

  // Replace crop in sequence step
  const handleSwapCrop = (stepIndex: number, newCrop: RotationCropOption) => {
    const updatedSteps = [...activePlan.steps];
    const prevStep = updatedSteps[stepIndex];

    updatedSteps[stepIndex] = {
      ...prevStep,
      crop: newCrop,
      roleInSequence:
        newCrop.category === 'Nitrogen Fixer (Legume)'
          ? 'Biological Nitrogen Enrichment & Biomass'
          : newCrop.category === 'Bio-Fumigant & Pest Break'
          ? 'Soil Sanitization & Nematode Interruption'
          : newCrop.category === 'Soil Restorative & Cereal'
          ? 'Deep Root Decompaction & Mineral Mobilization'
          : 'High-Value Cash Harvest',
      soilImpactSummary: `${
        newCrop.nitrogenImpactKgHa >= 0
          ? `Fixes +${newCrop.nitrogenImpactKgHa} kg N/ha`
          : `Consumes ${Math.abs(newCrop.nitrogenImpactKgHa)} kg N/ha`
      }; adds ${newCrop.organicBiomassTonsHa} t/ha biomass.`,
    };

    // Recalculate dynamic net balance
    const netN = updatedSteps.reduce((acc, s) => acc + s.crop.nitrogenImpactKgHa, 0);
    const totalRev = updatedSteps.reduce((acc, s) => acc + s.crop.marketValueInrPerAcre, 0);

    setActivePlan({
      ...activePlan,
      steps: updatedSteps,
      netNitrogenBalanceKgHa: netN,
      cumulativeProjectedRevenueInr: totalRev,
    });

    setEditingStepIndex(null);
    showNotification(`Updated rotation sequence: Season ${stepIndex + 1} set to ${newCrop.name}.`);
  };

  const handleSaveSchedule = () => {
    showNotification(
      `Crop Rotation Sequence "${activePlan.title}" saved to your Farm Operational Calendar. Sowing reminders scheduled.`
    );
  };

  const handlePrintBlueprint = () => {
    showNotification(`Generating printable Crop Rotation & Soil Health Blueprint...`);
    window.print();
  };

  // Category Color Badges
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Nitrogen Fixer (Legume)':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-500/20';
      case 'Bio-Fumigant & Pest Break':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-500/20';
      case 'Soil Restorative & Cereal':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-500/20';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>Regenerative Crop Rotation Engine · Driven by Yield Forecasts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Optimal Multi-Season Crop Rotation Planner</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Designed to preserve soil organic carbon, biologically restore Nitrogen reserves (+{activePlan.netNitrogenBalanceKgHa} kg/ha),
              break fungal/nematode pest cycles, and sustain the <strong>+{activePlan.forecastYieldBoostOnAnchorCrop}% yield forecast boost</strong> on upcoming cash crops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handlePrintBlueprint}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>Print Rotation Plan</span>
            </button>
            <button
              onClick={handleSaveSchedule}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Sequence to Farm Calendar</span>
            </button>
          </div>
        </div>

        {/* Strategy Presets Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
          {PRESET_ROTATION_PLANS.map((plan) => {
            const isSelected = plan.planId === selectedPlanId;
            return (
              <button
                key={plan.planId}
                onClick={() => handleSelectPlan(plan.planId)}
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
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold">{plan.anchorCropName.split(' ')[0]} {plan.anchorCropName.split(' ')[1]} Rotation</div>
                  <div className={`text-[10px] ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-300'}`}>
                    Goal: {plan.focusGoal} · {plan.targetPlot.split('(')[0]}
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

      {/* Main Workspace */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Yield Forecast Correlation Header Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 border border-emerald-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Direct Correlation with Previous Yield Forecast:
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-600 text-white">
                +{activePlan.forecastYieldBoostOnAnchorCrop}% YIELD SUSTAINED
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Following this sequence prevents the <strong className="text-rose-600 dark:text-rose-400">-22% yield degradation</strong> that occurs under continuous monoculture, unlocking the full <strong>{activePlan.anchorCropName}</strong> forecast potential.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Net Nitrogen Balance</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                +{activePlan.netNitrogenBalanceKgHa} kg N/ha
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Cumulative Revenue</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ₹{activePlan.cumulativeProjectedRevenueInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Multi-Season Sequential Timeline Visualizer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Multi-Season Sequence ({activePlan.steps.length} Phases · {activePlan.durationYears} Years)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click "Customize Crop" on any step to test alternative green manures or pulse relays
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Pest Interruption: {activePlan.pestCycleInterruptionPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activePlan.steps.map((step, idx) => {
              const isHeavyFeeder = step.crop.category === 'Heavy Feeder';
              const isNitrogenFixer = step.crop.category === 'Nitrogen Fixer (Legume)';

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative group ${
                    isHeavyFeeder
                      ? 'bg-gradient-to-b from-indigo-50/60 to-white dark:from-slate-800 dark:to-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-sm'
                      : isNitrogenFixer
                      ? 'bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-800 dark:to-slate-900 border-emerald-200 dark:border-emerald-900/50 shadow-sm'
                      : 'bg-gradient-to-b from-amber-50/60 to-white dark:from-slate-800 dark:to-slate-900 border-amber-200 dark:border-amber-900/50 shadow-sm'
                  }`}
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      Phase {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {step.crop.durationDays} Days
                    </span>
                  </div>

                  {/* Title & Odisha Name */}
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadgeClass(
                        step.crop.category
                      )}`}
                    >
                      {step.crop.category}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {step.crop.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                      {step.crop.odishaName}
                    </span>
                    <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-1">
                      {step.roleInSequence}
                    </p>
                  </div>

                  {/* Seasonal Window */}
                  <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Target Window</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {step.timing}
                    </div>
                  </div>

                  {/* Quantitative Nutrient & Agronomic Impact */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Nitrogen Impact:</span>
                      <span
                        className={`font-black ${
                          step.crop.nitrogenImpactKgHa >= 0 ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {step.crop.nitrogenImpactKgHa >= 0
                          ? `+${step.crop.nitrogenImpactKgHa} kg/ha`
                          : `${step.crop.nitrogenImpactKgHa} kg/ha`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Organic Biomass:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {step.crop.organicBiomassTonsHa} t/ha
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Est. Revenue:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {step.crop.marketValueInrPerAcre > 0
                          ? `₹${step.crop.marketValueInrPerAcre.toLocaleString('en-IN')}`
                          : 'Green Manure Input'}
                      </span>
                    </div>
                  </div>

                  {/* Agronomic Tip */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{step.crop.companionOrNextTip}"
                  </div>

                  {/* Swap / Customize Button */}
                  <button
                    onClick={() => setEditingStepIndex(editingStepIndex === idx ? null : idx)}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{editingStepIndex === idx ? 'Close Options' : 'Customize Crop'}</span>
                  </button>

                  {/* Inline Swap Picker Popover */}
                  {editingStepIndex === idx && (
                    <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-2 text-xs animate-in fade-in duration-150">
                      <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                        Select Replacement Crop:
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {ROTATION_CROP_CATALOG.filter((c) => c.id !== step.crop.id).map((alt) => (
                          <button
                            key={alt.id}
                            onClick={() => handleSwapCrop(idx, alt)}
                            className="w-full text-left p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                                {alt.name}
                              </div>
                              <div className="text-[10px] text-slate-400">{alt.category} · {alt.durationDays}d</div>
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                alt.nitrogenImpactKgHa >= 0 ? 'text-emerald-600' : 'text-slate-500'
                              }`}
                            >
                              {alt.nitrogenImpactKgHa >= 0 ? `+${alt.nitrogenImpactKgHa} N` : `${alt.nitrogenImpactKgHa} N`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Cumulative Soil Health & Economic Impact Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Soil Health Trajectory</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {activePlan.projectedSoilHealthIndex.afterCycle}/100
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                +{activePlan.projectedSoilHealthIndex.netGain} Pts
              </span>
            </div>
            <span className="text-[10px] text-slate-500">From baseline {activePlan.projectedSoilHealthIndex.starting}</span>
          </div>

          <div className="p-4 rounded-3xl bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Organic Carbon (OC) Gain</span>
            <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
              +{activePlan.organicCarbonGainPercent}%
            </div>
            <span className="text-[10px] text-slate-500">Decompaction & Living Roots</span>
          </div>

          <div className="p-4 rounded-3xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pest Cycle Interruption</span>
            <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
              {activePlan.pestCycleInterruptionPercent}%
            </div>
            <span className="text-[10px] text-slate-500">Zero Synthetic Pesticide Need</span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Groundwater Conserved</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {(activePlan.waterSavedVsMonocultureLiters / 1000).toFixed(0)}k Liters
            </div>
            <span className="text-[10px] text-slate-500">Solar Drip & Relay Synergy</span>
          </div>
        </div>

        {/* 3. Monoculture Depletion vs Regenerative Rotation Comparison Matrix */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Comparative Agronomic Matrix: Continuous Monoculture vs Recommended Rotation</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-500">Empirical Odisha KVK Trial Data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5">Agronomic Factor</th>
                  <th className="pb-2.5 text-rose-600 dark:text-rose-400">Continuous Monoculture (Mono-Cropping)</th>
                  <th className="pb-2.5 text-emerald-600 dark:text-emerald-400">Recommended Regenerative Sequence</th>
                  <th className="pb-2.5">Net Farmer Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                <tr>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">Soil Nitrogen Reserves</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">Depleted (-140 kg N/ha annually)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Surplus (+{activePlan.netNitrogenBalanceKgHa} kg N/ha restored)</td>
                  <td className="py-2.5 text-slate-500">Eliminates ₹6,200/acre in synthetic fertilizers</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">Root-Knot Nematodes & Wilt</td>
                  <td className="py-2.5 text-rose-600 font-semibold">High epidemic buildup (up to 40% crop loss)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">{activePlan.pestCycleInterruptionPercent}% pathogen eradication</td>
                  <td className="py-2.5 text-slate-500">100% Zero-Residue Bio-Certification</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">Yield Trend over 3 Years</td>
                  <td className="py-2.5 text-rose-600 font-semibold">-22% progressive yield drop (soil fatigue)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">+{activePlan.forecastYieldBoostOnAnchorCrop}% yield boost unlocked</td>
                  <td className="py-2.5 text-slate-500">Realizes peak yield forecast models</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">Annual Water Consumption</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">100% constant irrigation demand</td>
                  <td className="py-2.5 text-teal-600 font-bold">38% lower (pulses & millets rainfed)</td>
                  <td className="py-2.5 text-slate-500">{(activePlan.waterSavedVsMonocultureLiters / 1000).toFixed(0)}k Liters groundwater conserved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Krishi Vigyan Kendra (KVK) Advisory Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>KVK Odisha Agronomic Advisory Note</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
            {activePlan.kvkAdvisoryNote}
          </p>
        </div>
      </div>
    </div>
  );
};
