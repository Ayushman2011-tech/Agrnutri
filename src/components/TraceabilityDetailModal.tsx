import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Droplets,
  Leaf,
  Sun,
  FileText,
  Printer,
  QrCode,
  Share2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TraceabilityDetailModal: React.FC = () => {
  const { activeBatch, setActiveBatch, showNotification } = useApp();

  if (!activeBatch) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `https://agrinutrifarm.org/trace/${activeBatch.batchId}`
      );
      showNotification('Traceability verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Farm-to-Fork Traceability Passport
                </span>
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Batch #{activeBatch.batchId}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Share verification link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Print batch passport"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveBatch(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Top Hero Summary Banner */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  AgriNutri Farm 2.0 Ledger Verification
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold">{activeBatch.productName}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    {activeBatch.farmLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                    Harvested: {activeBatch.harvestDate}
                  </span>
                </div>
              </div>

              {/* QR Code graphic */}
              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center justify-center text-slate-900 text-center">
                <div className="w-24 h-24 bg-slate-950 p-1.5 rounded-lg flex items-center justify-center">
                  {/* Generated QR Matrix Simulation */}
                  <div className="w-full h-full bg-white p-1 rounded grid grid-cols-5 gap-0.5">
                    <div className="bg-black col-span-2 row-span-2 rounded-[1px]"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black col-span-2 row-span-2 rounded-[1px]"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black col-span-2 row-span-2 rounded-[1px]"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black col-span-2 row-span-2 rounded-[1px]"></div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold mt-1 text-slate-600">
                  {activeBatch.batchId}
                </span>
              </div>
            </div>
          </div>

          {/* Key Verification Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quality Grade</span>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activeBatch.qualityGrade}
              </div>
              <span className="text-[11px] text-slate-500">Optical Hand-Sorted</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pesticide Residue</span>
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                0.00 ppm
              </div>
              <span className="text-[11px] text-slate-500">Zero Chemical Residue</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Water Conservation</span>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
                {activeBatch.sustainability.waterSavedLiters.toLocaleString()} L
              </div>
              <span className="text-[11px] text-slate-500">Solar Drip Irrigation</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Carbon Offset</span>
              <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                {activeBatch.sustainability.carbonOffsetKg} kg CO₂
              </div>
              <span className="text-[11px] text-slate-500">Circular Composting</span>
            </div>
          </div>

          {/* Farm Origin & Soil Profile */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Farm & Cultivator Provenance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Lead Farmer / Cohort:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeBatch.farmerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Soil Condition:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeBatch.soilCondition}</p>
              </div>
              <div>
                <span className="text-slate-400">Sowing Date:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeBatch.sowingDate}</p>
              </div>
              <div>
                <span className="text-slate-400">Packaging Type:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeBatch.sustainability.packagingType} ({activeBatch.sustainability.renewableEnergyPercent}% Solar Energy)
                </p>
              </div>
            </div>
          </div>

          {/* Verified Journey Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Supply Chain Journey & Hand-Off Timeline</span>
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Audited & Timestamped
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeBatch.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shrink-0 z-10 mt-1 shadow-sm"></div>
                  <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {event.step}. {event.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Actor: {event.actor}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Hash: {event.verificationHash}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutritional Breakdown Table */}
          {activeBatch.nutritionalInfo && (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Nutritional Integrity (Per 100g)
                </h4>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">FSSAI / NPOP Compliant</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 text-[10px]">Calories</span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeBatch.nutritionalInfo.calories} kcal</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 text-[10px]">Plant Protein</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{activeBatch.nutritionalInfo.protein} g</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 text-[10px]">Dietary Fiber</span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeBatch.nutritionalInfo.dietaryFiber} g</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 text-[10px]">Carbohydrates</span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeBatch.nutritionalInfo.carbohydrates} g</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={() => setActiveBatch(null)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
