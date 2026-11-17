import React, { useState } from 'react';
import {
  Factory,
  Package,
  QrCode,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Truck,
  Plus,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProducerDashboard: React.FC = () => {
  const { currentUser, inspectBatch, registerBatch, showNotification } = useApp();

  const [batches, setBatches] = useState([
    {
      id: 'BATCH-TUR-01',
      produce: 'Kandhamal GI Turmeric',
      sourceFarmer: 'Kandhamal Tribal Federation',
      procuredQty: '1,200 kg',
      outputQty: '1,120 kg (Packaged)',
      wasteRecovered: '80 kg (Composted)',
      qcStatus: 'Approved (Curcumin 5.24%)',
      packaging: 'Recyclable Jute Pouches',
      qrLinked: 'AGRI-OD-2026-TUR',
    },
    {
      id: 'BATCH-HON-04',
      produce: 'Similipal Wild Raw Honey',
      sourceFarmer: 'Mayurbhanj Bio-Gatherers SHG',
      procuredQty: '450 kg',
      outputQty: '442 kg (Bottled)',
      wasteRecovered: '8 kg (Wax Upcycled)',
      qcStatus: 'Approved (Diastase > 14)',
      packaging: 'Zero-Plastic Amber Glass',
      qrLinked: 'AGRI-OD-2026-HON',
    },
  ]);

  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false);
  const [newProduce, setNewProduce] = useState('Odisha Ragi Flour');
  const [newSource, setNewSource] = useState('Koraput Farmers Collective');
  const [newQty, setNewQty] = useState(500);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `BATCH-${Math.floor(100 + Math.random() * 900)}`;
    const qrCode = `AGRI-OD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRow = {
      id: batchId,
      produce: newProduce,
      sourceFarmer: newSource,
      procuredQty: `${newQty} kg`,
      outputQty: `${Math.round(newQty * 0.94)} kg (Milled)`,
      wasteRecovered: `${Math.round(newQty * 0.06)} kg (Bio-Enzyme)`,
      qcStatus: 'Passed (Grade A+ Organic)',
      packaging: '100% Biodegradable Pulp',
      qrLinked: qrCode,
    };

    setBatches([newRow, ...batches]);
    setIsNewBatchOpen(false);
    showNotification(`Processing batch ${batchId} recorded with QR traceability!`);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600/40 border border-teal-400/40 flex items-center justify-center text-white shrink-0">
            <Factory className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                Processor & Milling Control
              </span>
              <span className="text-[10px] bg-teal-400 text-teal-950 font-extrabold px-1.5 py-0.2 rounded">
                FSSAI 12026999000182
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentUser.businessName || 'Mayurbhanj Natural Bio-Ventures'}
            </h1>
            <p className="text-xs text-teal-200">
              Facility: Baripada Eco-Processing Center, Mayurbhanj, Odisha (Cold Extraction & Solar Milling)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewBatchOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Processing Batch</span>
        </button>
      </div>

      {/* Process KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Produce Milled</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">4,820 kg</div>
          <span className="text-[10px] text-teal-600 font-semibold">100% Sourced from Odisha</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Residue Upcycled</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            280 kg
          </div>
          <span className="text-[10px] text-slate-500">Zero Landfill Policy</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Solar Energy Powered</span>
          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">94%</div>
          <span className="text-[10px] text-slate-500">Clean milling energy</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Wholesale Orders Filled</span>
          <div className="text-xl sm:text-2xl font-black text-teal-600 mt-1">38 Invoices</div>
          <span className="text-[10px] text-slate-500">To verified retailers</span>
        </div>
      </div>

      {/* Processing Batches Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Raw Material Batches & QC Provenance
          </h3>
          <span className="text-xs text-slate-500">{batches.length} active batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Batch Code</th>
                <th className="pb-3">Agricultural Produce</th>
                <th className="pb-3">Farmer / Origin</th>
                <th className="pb-3">Input Qty</th>
                <th className="pb-3">Finished Goods</th>
                <th className="pb-3">Waste Diverted</th>
                <th className="pb-3">Lab QC Status</th>
                <th className="pb-3">Traceability QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {batches.map((b) => (
                <tr key={b.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">{b.id}</td>
                  <td className="py-3 font-semibold">{b.produce}</td>
                  <td className="py-3">{b.sourceFarmer}</td>
                  <td className="py-3">{b.procuredQty}</td>
                  <td className="py-3 font-semibold text-emerald-600">{b.outputQty}</td>
                  <td className="py-3 text-teal-600">{b.wasteRecovered}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {b.qcStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => inspectBatch(b.qrLinked)}
                      className="font-mono text-xs font-bold text-emerald-600 hover:underline"
                    >
                      #{b.qrLinked} →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Batch */}
      {isNewBatchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Initiate Processing & Milling Batch
              </h3>
              <button onClick={() => setIsNewBatchOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Produce / Crop</label>
                <input
                  type="text"
                  required
                  value={newProduce}
                  onChange={(e) => setNewProduce(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Procured From Farmer / Group</label>
                <input
                  type="text"
                  required
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Raw Material Weight (kg)</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBatchOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                >
                  Create & Bind Traceability QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
