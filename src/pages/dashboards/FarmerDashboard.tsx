import React, { useState } from 'react';
import {
  Tractor,
  Plus,
  QrCode,
  DollarSign,
  TrendingUp,
  Droplets,
  Sun,
  ShieldCheck,
  FileText,
  Sparkles,
  MapPin,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, BatchTraceability } from '../../types';
import { CropYieldForecastWidget } from '../../components/CropYieldForecastWidget';
import { SoilHealthHeatMapWidget } from '../../components/SoilHealthHeatMapWidget';
import { CropRotationPlannerWidget } from '../../components/CropRotationPlannerWidget';
import { ClimateRiskAlertWidget } from '../../components/ClimateRiskAlertWidget';
import { WaterIrrigationTrackerWidget } from '../../components/WaterIrrigationTrackerWidget';
import { FarmingAssistantChatBubble } from '../../components/FarmingAssistantChatBubble';

export const FarmerDashboard: React.FC<{ setCurrentTab?: (tab: string) => void }> = ({
  setCurrentTab,
}) => {
  const {
    currentUser,
    products,
    addProduct,
    registerBatch,
    telemetry,
    togglePump,
    setIsAiModalOpen,
    showNotification,
    inspectBatch,
  } = useApp();

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // New Harvest Listing Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Fresh Vegetables');
  const [price, setPrice] = useState(40);
  const [wholesalePrice, setWholesalePrice] = useState(26);
  const [minWholesaleQty, setMinWholesaleQty] = useState(50);
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState(250);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80'
  );

  // New QR Batch generation state
  const [batchCrop, setBatchCrop] = useState('Organic Desi Brinjals (Baigana)');
  const [batchPlot, setBatchPlot] = useState('Sambalpur Plot C');
  const [batchGrade, setBatchGrade] = useState<'A+' | 'A' | 'Organic Premium'>('A+');

  const farmerProducts = products.filter(
    (p) => p.sellerId === 'farmer-1' || p.sellerRole === 'Farmer'
  );

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBatchId = `AGRI-OD-2026-${Math.floor(100 + Math.random() * 900)}`;

    addProduct({
      title,
      category,
      description: description || 'Naturally cultivated in Sambalpur with organic vermicompost.',
      price,
      wholesalePrice,
      minWholesaleQty,
      unit,
      stock,
      imageUrl,
      sellerId: currentUser.id,
      sellerName: currentUser.farmName || currentUser.name,
      sellerRole: 'Farmer',
      sellerLocation: currentUser.location || 'Sambalpur, Odisha',
      isOrganic: true,
      batchId: newBatchId,
      harvestDate: new Date().toISOString().split('T')[0],
      bestBefore: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      nutritionalInfo: {
        calories: 25,
        protein: 1.2,
        carbohydrates: 4.8,
        fat: 0.2,
        dietaryFiber: 2.1,
        highlights: ['Fresh Morning Harvest', 'Zero Chemical Residue', 'High Fiber'],
      },
    });

    setIsListingModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AGRI-OD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBatch: BatchTraceability = {
      batchId: newId,
      productId: `prod-gen-${Date.now()}`,
      productName: batchCrop,
      farmerName: currentUser.name,
      farmLocation: `${batchPlot}, Sambalpur, Odisha`,
      soilCondition: 'Black-Alluvial Loam (pH 6.8)',
      sowingDate: '2026-08-01',
      harvestDate: new Date().toISOString().split('T')[0],
      producerFacility: 'Sambalpur Solar Cold Storage & Grading Hub',
      qualityGrade: batchGrade,
      moistureContent: '91.4%',
      pesticideResidueTest: '0.00 ppm (Zero Chemical Residue)',
      nutritionalInfo: {
        calories: 30,
        protein: 1.5,
        carbohydrates: 5.2,
        fat: 0.1,
        dietaryFiber: 2.4,
        highlights: ['Verified deseeded', 'Zero chemical fertilizers'],
      },
      sustainability: {
        waterSavedLiters: 3500,
        carbonOffsetKg: 120,
        organicCertified: true,
        renewableEnergyPercent: 88,
        packagingType: '100% Biodegradable',
      },
      timeline: [
        {
          step: '1',
          stage: 'Farming',
          title: 'Sowing & Organic Field Preparation',
          location: 'Sambalpur, Odisha',
          date: '2026-08-01',
          actor: currentUser.name,
          description: 'Desi seed variety prepared with cow dung vermicompost.',
          verificationHash: `0x${Math.random().toString(16).substring(2, 10)}`,
          status: 'Completed',
        },
        {
          step: '2',
          stage: 'Harvesting',
          title: 'Dawn Hand Harvest',
          location: 'Sambalpur, Odisha',
          date: new Date().toISOString().split('T')[0],
          actor: 'Farm Harvest Team',
          description: 'Graded Grade A+ with zero mechanical bruising.',
          verificationHash: `0x${Math.random().toString(16).substring(2, 10)}`,
          status: 'Completed',
        },
      ],
    };

    registerBatch(newBatch);
    setIsQrModalOpen(false);
    inspectBatch(newId);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/40 border border-emerald-400/40 flex items-center justify-center text-white shrink-0">
            <Tractor className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Farmer Operating Dashboard
              </span>
              <span className="text-[10px] bg-emerald-400 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded">
                VERIFIED GROWER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentUser.farmName || 'Panda Krishi Bio-Farm'}
            </h1>
            <p className="text-xs text-emerald-200">
              Cultivator: {currentUser.name} · {currentUser.location || 'Sambalpur, Odisha'} (12.5 Acres Bio-Certified)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsListingModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>List Harvest for Sale</span>
          </button>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-300" />
            <span>Generate Batch QR</span>
          </button>
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('tutorials')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Video Academy</span>
            </button>
          )}
        </div>
      </div>

      {/* Kisan Smart Video Academy Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl border border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Video Tutorials & AI Simulator</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Kisan Smart Academy: Drone, Weather, Sensor & Crop Report Masterclasses
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Watch hands-on video tutorials on flying agricultural drones, reading Doppler weather radar, installing root-depth soil sensors, and deciphering soil moisture & NPK fertilizer demand with interactive AI-powered simulators.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab && setCurrentTab('tutorials')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Video Academy</span>
        </button>
      </div>

      {/* Financial & Harvest KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Farm Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">₹84,250</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% vs last cycle</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Crop Listings</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {farmerProducts.length} Lots
          </div>
          <span className="text-[10px] text-slate-500">Total 1,850 kg available</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Soil Moisture (Telemetry)</span>
          <div className="text-xl sm:text-2xl font-black text-teal-600 mt-1">
            {telemetry.soilMoisture.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Solar Drip: {telemetry.irrigationPumpStatus}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">QR Batches Audited</span>
          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">14 Batches</div>
          <span className="text-[10px] text-slate-500">100% Traceability Pass</span>
        </div>
      </div>

      {/* Automated Climate Risk Alert Module (Frost, Rain, Drought) */}
      <ClimateRiskAlertWidget />

      {/* Water Irrigation Tracking & Sustainable Threshold Guard */}
      <WaterIrrigationTrackerWidget />

      {/* Predictive Crop Yield Forecast Widget */}
      <CropYieldForecastWidget />

      {/* Interactive Soil Health Heat-Map Matrix */}
      <SoilHealthHeatMapWidget />

      {/* Regenerative Crop Rotation Planning Tool */}
      <CropRotationPlannerWidget />

      {/* Listed Crops Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your Harvest Lots on Marketplace
          </h3>
          <span className="text-xs text-slate-500">{farmerProducts.length} items live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Crop / Lot</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Retail Price</th>
                <th className="pb-3">Wholesale (Bulk)</th>
                <th className="pb-3">Stock Left</th>
                <th className="pb-3">Batch Code</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {farmerProducts.map((p) => (
                <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <img src={p.imageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{p.title}</span>
                  </td>
                  <td className="py-3">{p.category}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">₹{p.price}/{p.unit}</td>
                  <td className="py-3 text-amber-600 font-semibold">₹{p.wholesalePrice} (MOQ: {p.minWholesaleQty})</td>
                  <td className="py-3">{p.stock} {p.unit}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600">{p.batchId}</td>
                  <td className="py-3">
                    <button
                      onClick={() => inspectBatch(p.batchId)}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      QR Passport →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: List New Harvest */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                List New Harvest for Sale
              </h3>
              <button onClick={() => setIsListingModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Crop Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sambalpur Desi Purple Brinjal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                    <option value="Farm Fresh Fruits">Farm Fresh Fruits</option>
                    <option value="Indigenous Grains & Millets">Indigenous Grains & Millets</option>
                    <option value="Organic Pulses">Organic Pulses</option>
                    <option value="Cold-Pressed Oils & Spices">Cold-Pressed Oils & Spices</option>
                    <option value="Farm Seeds & Bio-Inputs">Farm Seeds & Bio-Inputs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Wholesale (₹)</label>
                  <input
                    type="number"
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Available Qty</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cultivation notes, zero synthetic inputs, harvested at dawn..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsListingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Publish Harvest Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Batch QR */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Generate Traceability Batch QR
              </h3>
              <button onClick={() => setIsQrModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Harvest Crop / Lot</label>
                <input
                  type="text"
                  required
                  value={batchCrop}
                  onChange={(e) => setBatchCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Plot Location</label>
                <input
                  type="text"
                  value={batchPlot}
                  onChange={(e) => setBatchPlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Quality Grading</label>
                <select
                  value={batchGrade}
                  onChange={(e) => setBatchGrade(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="A+">Grade A+ (Premium Hand-Picked)</option>
                  <option value="Organic Premium">Organic Premium Certified</option>
                  <option value="A">Grade A (Standard Market)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Register Batch & Open QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Farming Assistant Chat Bubble */}
      <FarmingAssistantChatBubble />
    </div>
  );
};
