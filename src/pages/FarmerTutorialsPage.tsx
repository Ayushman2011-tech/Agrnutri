import React, { useState } from 'react';
import {
  Compass,
  CloudRain,
  Activity,
  FileText,
  Sparkles,
  Play,
  CheckCircle2,
  BookOpen,
  Filter,
  PlusCircle,
  Loader2,
  Layers,
  Award,
  Download,
  Printer,
  X,
  Zap,
  Globe,
  Tractor,
} from 'lucide-react';
import { INITIAL_TUTORIALS } from '../data/tutorialData';
import { FarmerTutorial, TutorialCategory } from '../types';
import { InteractiveVideoPlayer } from '../components/InteractiveVideoPlayer';
import { useApp } from '../context/AppContext';

export const FarmerTutorialsPage: React.FC = () => {
  const { showNotification } = useApp();

  const [tutorials, setTutorials] = useState<FarmerTutorial[]>(INITIAL_TUTORIALS);
  const [selectedTutorial, setSelectedTutorial] = useState<FarmerTutorial>(INITIAL_TUTORIALS[0]);
  const [activeCategory, setActiveCategory] = useState<TutorialCategory>('all');
  const [language, setLanguage] = useState<'en' | 'hi' | 'or'>('en');

  // AI Generator Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [customCrop, setCustomCrop] = useState('Paddy (Dhan)');
  const [customCategory, setCustomCategory] = useState<'drones' | 'weather' | 'sensors' | 'crop-reports'>('drones');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTutorials = tutorials.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All Tutorials', count: tutorials.length, icon: Layers },
    {
      id: 'drones',
      label: 'Agricultural Drones',
      count: tutorials.filter((t) => t.category === 'drones').length,
      icon: Compass,
    },
    {
      id: 'weather',
      label: 'Weather & Forecasts',
      count: tutorials.filter((t) => t.category === 'weather').length,
      icon: CloudRain,
    },
    {
      id: 'sensors',
      label: 'Soil & Field Sensors',
      count: tutorials.filter((t) => t.category === 'sensors').length,
      icon: Activity,
    },
    {
      id: 'crop-reports',
      label: 'Crop Reports & NPK Demand',
      count: tutorials.filter((t) => t.category === 'crop-reports').length,
      icon: FileText,
    },
  ];

  const handleGenerateAiVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          crop: customCrop,
          category: customCategory,
          language,
        }),
      });

      const data = await res.json();
      if (data.tutorial) {
        setTutorials([data.tutorial, ...tutorials]);
        setSelectedTutorial(data.tutorial);
        setIsAiModalOpen(false);
        setCustomTopic('');
        showNotification(
          `⚡ AI Tutorial Video "${data.tutorial.title}" generated in ${data.latencyMs ? `${data.latencyMs}ms` : 'high-speed mode'}!`
        );
      } else {
        showNotification('Failed to generate video. Please try again.');
      }
    } catch (err) {
      console.warn('AI video generation fallback active:', err);
      showNotification('Network error generating video.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPrebuiltPrompt = (topic: string, cat: 'drones' | 'weather' | 'sensors' | 'crop-reports', crop: string) => {
    setCustomTopic(topic);
    setCustomCategory(cat);
    setCustomCrop(crop);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Academy Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
            <Tractor className="w-3.5 h-3.5" />
            <span>Kisan Smart Academy · Practical Agronomy Video Series</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Farmer Interactive <span className="text-emerald-400">Video Tutorials</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Master the tools of modern precision farming: how to fly agricultural drones, read Doppler weather forecasts, install root-zone soil sensors, and translate crop fertility reports into clean organic yields.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300 pt-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tri-lingual Voice (English, Hindi, Odia)
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              Live Flight & Telemetry HUD Simulations
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              In-Video Practical Checkpoints
            </span>
          </div>
        </div>

        {/* Generate AI Tutorial Button */}
        <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom AI Video Tutorial</span>
          </button>
          <span className="text-[10px] text-slate-400 text-center">
            Ask any drone, weather, sensor, or fertilizer question
          </span>
        </div>
      </div>

      {/* Featured Active Video Player */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Now Playing: Interactive Masterclass
            </h2>
          </div>
          {selectedTutorial.isAiGenerated && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI Synthesized Curriculum
            </span>
          )}
        </div>

        {/* Player Component */}
        <InteractiveVideoPlayer
          tutorial={selectedTutorial}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Practical Field Protocol & Equipment Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field Execution Checklist (Step-by-Step Protocol)</span>
              </h3>
              <button
                onClick={() => window.print()}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Protocol</span>
              </button>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {selectedTutorial.practicalChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Recommended Farm Gear</span>
            </h3>

            <div className="space-y-2">
              {selectedTutorial.equipmentNeeded.map((eq, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300">
                <strong>Agronomist Tip:</strong> Complete all in-video quiz checkpoints to earn your Verified Smart Grower Certificate on AgriNutri Farm 2.0!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Explore Video Library
            </h2>
            <p className="text-xs text-slate-500">
              Browse all {tutorials.length} interactive modules or filter by technical category
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as TutorialCategory)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tut) => {
            const isSelected = selectedTutorial.id === tut.id;
            return (
              <div
                key={tut.id}
                onClick={() => {
                  setSelectedTutorial(tut);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={tut.thumbnailUrl}
                      alt={tut.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Play Icon Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-slate-950/80 text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {Math.floor(tut.durationSeconds / 60)}:00 Mins
                    </span>

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-sm">
                      {tut.category}
                    </span>

                    {tut.isAiGenerated && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                        AI Generated
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {language === 'hi' ? tut.titleHi : language === 'or' ? tut.titleOr : tut.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tut.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                  <span>{tut.chapters.length} Interactive Modules</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>Watch Tutorial</span>
                    <Play className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tutorial Video Generation Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>AgriNutri AI Video Studio</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Generate Custom Farming Video Tutorial
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Describe any farming challenge or choose a prompt below. AgriNutri AI will synthesize complete multi-chapter video scripts, live HUD parameters, and voice narration.
              </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Popular Farming Inquiries:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPrebuiltPrompt(
                      'How to use drone multispectral NDVI to locate stem borers in paddy',
                      'drones',
                      'Paddy (Dhan)'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 border border-slate-200 dark:border-slate-700 text-[11px]"
                >
                  Drone: Paddy Stem Borer Detection
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPrebuiltPrompt(
                      'Interpreting sudden barometric pressure drop before harvest',
                      'weather',
                      'Paddy & Pulses'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 border border-slate-200 dark:border-slate-700 text-[11px]"
                >
                  Weather: Barometric Rain Warning
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPrebuiltPrompt(
                      'Calibrating capacitive soil moisture sensor in black cotton soil',
                      'sensors',
                      'Cotton / Vegetables'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 border border-slate-200 dark:border-slate-700 text-[11px]"
                >
                  Sensors: Clay & Loam Calibration
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPrebuiltPrompt(
                      'Calculating vermicompost and neem cake to replace synthetic urea',
                      'crop-reports',
                      'Organic Heirloom Tomatoes'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 border border-slate-200 dark:border-slate-700 text-[11px]"
                >
                  Crop Report: Organic NPK Replacement
                </button>
              </div>
            </div>

            {/* Custom Form */}
            <form onSubmit={handleGenerateAiVideo} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Topic / Question for Tutorial Video:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to use drones for spraying neem oil on brinjal crops"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Crop Focus:
                  </label>
                  <select
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Paddy (Dhan)">Paddy (Dhan)</option>
                    <option value="Organic Vine Tomatoes">Organic Vine Tomatoes</option>
                    <option value="Finger Millet (Mandia / Ragi)">Finger Millet (Mandia)</option>
                    <option value="Kandhamal Turmeric">Kandhamal Turmeric</option>
                    <option value="Mustard / Oilseeds">Mustard / Oilseeds</option>
                    <option value="Vegetables & Leafy Greens">Vegetables & Leafy Greens</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Simulation Type:
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="drones">Drone Flight & Spray HUD</option>
                    <option value="weather">Doppler Weather & Radar HUD</option>
                    <option value="sensors">Soil Stratification & Sensor HUD</option>
                    <option value="crop-reports">Crop Health & NPK Calculator</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating || !customTopic.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Video Script, HUD Telemetry & Audio Narration...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Interactive Video Tutorial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
