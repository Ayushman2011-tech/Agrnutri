import React, { useState } from 'react';
import {
  Sun,
  CloudRain,
  Droplets,
  Wind,
  Compass,
  Sprout,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Tractor,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartFarmingPage: React.FC<{ setCurrentTab?: (tab: string) => void }> = ({
  setCurrentTab,
}) => {
  const { telemetry, setIsAiModalOpen, showNotification } = useApp();

  const [fieldLogs, setFieldLogs] = useState([
    {
      id: '1',
      date: '2026-10-09',
      activity: 'Drip Fertigation with Vermiwash',
      plot: 'Plot A (Heirloom Tomatoes)',
      notes: 'Applied 200L organic tea. Soil moisture rose to 38.4%.',
    },
    {
      id: '2',
      date: '2026-10-07',
      activity: 'Trichoderma Bio-Fungicide Spray',
      plot: 'Plot B (Finger Millet)',
      notes: 'Preventative root drenching before monsoon drizzle.',
    },
  ]);

  const [newActivity, setNewActivity] = useState('');
  const [newPlot, setNewPlot] = useState('Plot A (Heirloom Tomatoes)');
  const [newNotes, setNewNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    const log = {
      id: `${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      activity: newActivity,
      plot: newPlot,
      notes: newNotes || 'Routine observation recorded.',
    };
    setFieldLogs([log, ...fieldLogs]);
    setNewActivity('');
    setNewNotes('');
    showNotification('Farm field activity logged to digital farm diary!');
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-600/50">
            <Tractor className="w-3.5 h-3.5" />
            <span>Smart Agronomy & Meteorological Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Cultivation, Weather & Irrigation Hub
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Data-backed crop schedules tailored for Western & Coastal Odisha. Integrate daily micro-climate
            forecasts with precision drip irrigation schedules and organic soil amendments.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('tutorials')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Video Academy</span>
            </button>
          )}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md transition-all hover:bg-emerald-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ask AI Crop Doctor</span>
          </button>
        </div>
      </div>

      {/* Weather Forecast & Agro-Meteorology Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Sambalpur District Live Weather & Agro Forecast
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">GPS: 21.467° N, 83.978° E</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Temperature</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">29.4°C</div>
              <span className="text-[10px] text-slate-500">Day High: 32°C</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Humidity</span>
              <div className="text-xl font-extrabold text-teal-600 mt-1">68%</div>
              <span className="text-[10px] text-slate-500">Dew Point: 22°C</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Precipitation</span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">14.2 mm</div>
              <span className="text-[10px] text-slate-500">Scattered Showers</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Wind Velocity</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">11 km/h</div>
              <span className="text-[10px] text-slate-500">East-South-East</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AgriNutri AI Irrigation Advisory</span>
            </div>
            <p className="leading-relaxed">
              Recent 14.2mm precipitation has stabilized topsoil moisture at {telemetry.soilMoisture.toFixed(1)}%.
              Postpone primary flood or drip cycles until tomorrow morning to conserve 3,200 Liters of water.
            </p>
          </div>
        </div>

        {/* Seasonal Calendar Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Odisha Seasonal Crop Calendar
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Rabi Season (Oct - Mar)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">CURRENT</span>
              </div>
              <p className="text-slate-500 mt-1">
                Ideal for: Mustard, Green Gram (Moong), Black Cumin Rice, Sunflower & Winter Vegetables.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white">
                Kharif Season (Jun - Oct)
              </div>
              <p className="text-slate-500 mt-1">
                Monsoon crops: Indigenous Paddy, Mandia (Ragi Millet), Pigeon Pea (Arhar), Turmeric.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white">
                Zaid Season (Mar - Jun)
              </div>
              <p className="text-slate-500 mt-1">
                Summer crops: Watermelon, Bottle Gourd, Okra, Cowpea & Summer Fodder.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Field Diary (Activity Logger) */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Digital Field Activity Logger
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log farm activities, bio-fertilizer applications, and irrigation events to generate verifiable
            batch histories for consumer QR passports.
          </p>
        </div>

        <form onSubmit={handleAddLog} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Activity (e.g. Drip fertigation with Jeevamrut)"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Plot / Crop (e.g. Plot A Vine Tomatoes)"
            value={newPlot}
            onChange={(e) => setNewPlot(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Log Activity to Diary
          </button>
        </form>

        <div className="space-y-2">
          {fieldLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{log.activity}</div>
                <div className="text-[11px] text-slate-500">{log.plot} · {log.notes}</div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
