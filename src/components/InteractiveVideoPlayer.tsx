import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
  Wind,
  Droplets,
  Layers,
  ChevronRight,
  Gauge,
  Sliders,
  Award,
  Zap,
} from 'lucide-react';
import { FarmerTutorial, TutorialChapter } from '../types';

interface InteractiveVideoPlayerProps {
  tutorial: FarmerTutorial;
  language: 'en' | 'hi' | 'or';
  onLanguageChange: (lang: 'en' | 'hi' | 'or') => void;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  tutorial,
  language,
  onLanguageChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeQuizChapter, setActiveQuizChapter] = useState<TutorialChapter | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'video' | 'practice'>('video');

  // Simulation interactive states
  const [droneSprayActive, setDroneSprayActive] = useState(true);
  const [droneNdviMode, setDroneNdviMode] = useState(false);
  const [interactiveAltitude, setInteractiveAltitude] = useState(3.5);
  const [simulatedMoistureInput, setSimulatedMoistureInput] = useState(33);

  const containerRef = useRef<HTMLDivElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalDuration = tutorial.durationSeconds || 160;

  // Sync active chapter with current playback second
  useEffect(() => {
    const chapIndex = tutorial.chapters.findIndex(
      (c) => currentSecond >= c.startSeconds && currentSecond < c.startSeconds + c.durationSeconds
    );
    if (chapIndex !== -1 && chapIndex !== activeChapterIndex) {
      setActiveChapterIndex(chapIndex);
      // Trigger voice narration when chapter changes during playback
      if (isPlaying && !isMuted) {
        speakNarration(tutorial.chapters[chapIndex].narration[language]);
      }
    }
  }, [currentSecond, tutorial.chapters, language, isPlaying, isMuted]);

  // Main playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSecond((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration, playbackSpeed]);

  // Speech narration helper
  const speakNarration = (text: string) => {
    if (!('speechSynthesis' in window) || isMuted) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'or') {
        utterance.lang = 'or-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const currentChapter = tutorial.chapters[activeChapterIndex] || tutorial.chapters[0];
      if (!isMuted) {
        speakNarration(currentChapter.narration[language]);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (newSecond: number) => {
    setCurrentSecond(newSecond);
    const chapIndex = tutorial.chapters.findIndex(
      (c) => newSecond >= c.startSeconds && newSecond < c.startSeconds + c.durationSeconds
    );
    if (chapIndex !== -1) {
      setActiveChapterIndex(chapIndex);
      if (isPlaying && !isMuted) {
        speakNarration(tutorial.chapters[chapIndex].narration[language]);
      }
    }
  };

  const handleChapterClick = (index: number) => {
    const chapter = tutorial.chapters[index];
    setActiveChapterIndex(index);
    handleSeek(chapter.startSeconds);
    if (chapter.interactivePrompt) {
      setActiveQuizChapter(chapter);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentChapter = tutorial.chapters[activeChapterIndex] || tutorial.chapters[0];

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/40 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative w-full'
      }`}
    >
      {/* Top Video Header / Language Selector */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {language === 'hi' ? tutorial.titleHi : language === 'or' ? tutorial.titleOr : tutorial.title}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              Instructor: {tutorial.instructor} · {tutorial.difficulty} Level
            </span>
          </div>
        </div>

        {/* View Mode & Language Pills */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode('video')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'video' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Video
            </button>
            <button
              onClick={() => setViewMode('practice')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'practice' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Practice Simulator</span>
            </button>
          </div>

          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => {
                onLanguageChange('en');
                if (isPlaying) speakNarration(currentChapter.narration.en);
              }}
              className={`px-2 py-1 rounded-md transition-colors ${
                language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                onLanguageChange('hi');
                if (isPlaying) speakNarration(currentChapter.narration.hi);
              }}
              className={`px-2 py-1 rounded-md transition-colors ${
                language === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => {
                onLanguageChange('or');
                if (isPlaying) speakNarration(currentChapter.narration.or);
              }}
              className={`px-2 py-1 rounded-md transition-colors ${
                language === 'or' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        </div>
      </div>

      {/* Main Screen: Video Simulator HUD */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none group">
        {viewMode === 'video' ? (
          <>
            {/* TYPE 1: DRONE SIMULATION HUD */}
            {tutorial.simulationType === 'drone' && (
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
                {/* Background Farm Landscape with dynamic NDVI toggle */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                    droneNdviMode
                      ? 'filter contrast-150 saturate-200 hue-rotate-60 brightness-95'
                      : 'brightness-90'
                  }`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80')`,
                  }}
                >
                  <div className="absolute inset-0 bg-emerald-950/20 pointer-events-none" />
                </div>

                {/* Drone Pitch & Roll Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-64 h-64 border border-emerald-400/30 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border border-dashed border-emerald-400/40 rounded-full animate-spin [animation-duration:40s]" />
                    {/* Drone flight crosshair */}
                    <div className="w-10 h-0.5 bg-emerald-400" />
                    <div className="h-10 w-0.5 bg-emerald-400 absolute" />
                    <div className="absolute w-4 h-4 border-2 border-emerald-300 rounded-sm" />
                    {/* Simulated Waypoint Trail */}
                    <div className="absolute -top-12 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-400/40 text-emerald-300">
                      Waypoint #4 / 18 · Serpentine Swath
                    </div>
                  </div>
                </div>

                {/* Spray Mist Particle Effect Overlay */}
                {droneSprayActive && isPlaying && (
                  <div className="absolute inset-x-0 bottom-12 h-36 bg-gradient-to-t from-teal-400/20 via-cyan-400/10 to-transparent pointer-events-none animate-pulse flex items-center justify-center">
                    <div className="text-[11px] font-bold text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-400/40 shadow-lg">
                      Liquid Bio-Spray Flow: 2.1 L/min · Centrifugal Nozzles Active
                    </div>
                  </div>
                )}

                {/* Drone Telemetry HUD Bar (Top) */}
                <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Compass className="w-4 h-4 animate-spin [animation-duration:12s]" />
                      <span>ALT: {interactiveAltitude.toFixed(1)}m</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="text-cyan-400 font-bold">
                      SPD: 14.5 km/h
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="text-amber-400 font-bold">
                      RTK GPS: 18 Sats (Locked)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDroneNdviMode(!droneNdviMode)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
                        droneNdviMode
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-950/80 text-emerald-300 border-emerald-500/30 hover:bg-slate-900'
                      }`}
                    >
                      {droneNdviMode ? 'NDVI Active (Vigor)' : 'Switch to NDVI Infrared'}
                    </button>
                    <button
                      onClick={() => setDroneSprayActive(!droneSprayActive)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
                        droneSprayActive
                          ? 'bg-teal-500 text-slate-950 border-teal-400'
                          : 'bg-slate-950/80 text-slate-400 border-slate-700'
                      }`}
                    >
                      {droneSprayActive ? 'Spray: ON' : 'Spray: OFF'}
                    </button>
                  </div>
                </div>

                {/* Drone Battery & Coverage Gauges (Bottom Left) */}
                <div className="relative z-10 flex items-end justify-between">
                  <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Drone Battery:</span>
                      <strong className="text-emerald-400 font-mono">84% (21.4V)</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Bio-Tank Volume:</span>
                      <strong className="text-teal-300 font-mono">7.4 L / 10 L</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Field Covered:</span>
                      <strong className="text-amber-300 font-mono">2.8 Acres (64%)</strong>
                    </div>
                  </div>

                  {/* Concept Callout Pill */}
                  <div className="bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 px-4 py-2 rounded-2xl text-xs max-w-sm backdrop-blur-md shadow-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{currentChapter.highlightConcept}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 2: WEATHER SIMULATION RADAR HUD */}
            {tutorial.simulationType === 'weather' && (
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-slate-900">
                {/* Simulated Doppler Radar Sweep Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-2 border-emerald-500/30 overflow-hidden bg-slate-950/90">
                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-75" />
                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-50" />
                    <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-25" />
                    {/* Rotating radar line */}
                    <div className="absolute inset-0 origin-center bg-gradient-to-tr from-transparent via-emerald-500/10 to-emerald-400/30 rounded-full animate-spin [animation-duration:4s]" />
                    {/* Simulated rain clouds */}
                    <div className="absolute top-16 left-20 w-32 h-24 rounded-full bg-cyan-500/30 blur-xl animate-pulse" />
                    <div className="absolute bottom-20 right-24 w-28 h-20 rounded-full bg-amber-500/30 blur-xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30" />
                    </div>
                  </div>
                </div>

                {/* Weather Top Metrics */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-cyan-500/30 flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Droplets className="w-4 h-4" />
                      <span>Rain Probability: 25% (Low Risk)</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Wind className="w-4 h-4" />
                      <span>Wind: 7.2 km/h ENE</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    GOLDEN SPRAY WINDOW: OPTIMAL
                  </span>
                </div>

                {/* Weather Bottom Explanations */}
                <div className="relative z-10 flex items-end justify-between">
                  <div className="bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/30 text-xs space-y-1.5">
                    <div className="text-slate-400">Doppler Sweep: Sambalpur / Western Odisha Radar</div>
                    <div className="text-white font-bold">Relative Humidity: 68% · ET₀: 4.8 mm/day</div>
                    <div className="text-emerald-400 text-[11px]">Next 6 Hours: Zero convective rain cells within 20km</div>
                  </div>

                  <div className="bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 px-4 py-2 rounded-2xl text-xs max-w-sm backdrop-blur-md shadow-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>{currentChapter.highlightConcept}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 3: SENSOR SIMULATION HUD */}
            {tutorial.simulationType === 'sensor' && (
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-slate-900 via-stone-900 to-amber-950">
                {/* Soil Stratification Diagram with Probes */}
                <div className="absolute inset-0 flex flex-col pointer-events-none opacity-90">
                  <div className="h-1/4 border-b border-dashed border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between px-6 text-[11px] text-emerald-400 font-bold">
                    <span>SURFACE CANOPY (0 cm)</span>
                    <span>Air Temperature: 28.5°C</span>
                  </div>
                  <div className="h-1/3 border-b border-dashed border-amber-600/30 bg-amber-950/30 flex items-center justify-between px-6 text-[11px] text-amber-300 font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>ACTIVE ROOT ZONE (15 cm Probe Depth)</span>
                    </div>
                    <span>Moisture: 33.4% · EC: 1.8 dS/m</span>
                  </div>
                  <div className="flex-1 bg-stone-950/60 flex items-center justify-between px-6 text-[11px] text-slate-400 font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>SUB-SOIL BUFFER HORIZON (30 cm Probe Depth)</span>
                    </div>
                    <span>Moisture: 38.2% · Deep Retention</span>
                  </div>
                </div>

                {/* Sensor Telemetry Hub */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-3 text-xs">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">LoRa Wireless Node #04</span>
                    <span className="text-emerald-400 font-bold">Signal: -72 dBm (Excellent)</span>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl font-bold">
                    CALIBRATION: FDR DIELECTRIC 80.2
                  </span>
                </div>

                {/* Sensor Bottom Info */}
                <div className="relative z-10 flex items-end justify-between">
                  <div className="bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 text-xs space-y-1">
                    <div className="text-amber-400 font-bold">Optimal Range: 28% – 36% for Sandy Loam</div>
                    <div className="text-slate-300 text-[11px]">Status: Root zone moisture well above 18% wilting point</div>
                  </div>

                  <div className="bg-amber-950/90 text-amber-200 border border-amber-500/50 px-4 py-2 rounded-2xl text-xs max-w-sm backdrop-blur-md shadow-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{currentChapter.highlightConcept}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 4: CROP REPORT / NPK HUD */}
            {tutorial.simulationType === 'crop-report' && (
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {/* Digital Diagnostic Report Sheet */}
                  <div className="w-full max-w-lg bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Layers className="w-4 h-4" />
                        <span>SOIL FERTILITY & MOISTURE REPORT #AGRI-2026</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        VERIFIED BY LAB
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Available Nitrogen (N)</span>
                        <span className="text-base font-bold text-rose-400">185 kg/ha</span>
                        <span className="text-[9px] text-rose-300 block">Deficit: -35 kg</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Available Phosphorus (P)</span>
                        <span className="text-base font-bold text-emerald-400">32 kg/ha</span>
                        <span className="text-[9px] text-emerald-300 block">Optimal</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Potassium (K)</span>
                        <span className="text-base font-bold text-emerald-400">240 kg/ha</span>
                        <span className="text-[9px] text-emerald-300 block">High Reserve</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>AI Organic Prescription</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Apply 1,200 kg aged vermicompost + 80 kg neem seed cake to replenish Nitrogen without synthetic urea.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Callout */}
                <div className="relative z-10 flex items-end justify-between">
                  <div className="bg-slate-950/85 px-3 py-2 rounded-xl text-xs text-slate-400 font-mono">
                    Target Yield: 24 Quintals/Acre
                  </div>
                  <div className="bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 px-4 py-2 rounded-2xl text-xs max-w-sm backdrop-blur-md shadow-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{currentChapter.highlightConcept}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* PRACTICE SIMULATOR SANDBOX MODE */
          <div className="absolute inset-0 bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 max-w-xl mx-auto w-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Hands-On Interactive Field Practice</span>
                </div>
                <button
                  onClick={() => setViewMode('video')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Return to Video
                </button>
              </div>

              {tutorial.simulationType === 'drone' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Adjust Drone Flight Altitude over Crop Canopy: ({interactiveAltitude.toFixed(1)} meters)
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.5"
                      value={interactiveAltitude}
                      onChange={(e) => setInteractiveAltitude(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>1m (Too Low)</span>
                      <span className="text-emerald-400 font-bold">3.5m (Recommended)</span>
                      <span>10m (High Drift)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-emerald-400">Live Agronomic Analysis:</span>
                    {interactiveAltitude < 2.5 ? (
                      <p className="text-rose-400">
                        Warning: Flying below 2.5m causes rotor turbulence to flatten tender crops and risks blade impact!
                      </p>
                    ) : interactiveAltitude > 5.0 ? (
                      <p className="text-amber-400">
                        Warning: Altitude exceeds 5m. Over 35% of fine droplets will drift away with the wind!
                      </p>
                    ) : (
                      <p className="text-emerald-300">
                        Ideal Altitude! Rotor downwash perfectly opens the leaf canopy and deposits bio-droplets onto lower stem roots.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Simulate Soil Moisture Input: ({simulatedMoistureInput}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="55"
                      value={simulatedMoistureInput}
                      onChange={(e) => setSimulatedMoistureInput(parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span className="text-rose-400">10% (Wilting)</span>
                      <span className="text-emerald-400 font-bold">32% (Optimal)</span>
                      <span className="text-cyan-400">55% (Saturated)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-teal-300">Live Irrigation Controller Decision:</span>
                    {simulatedMoistureInput < 20 ? (
                      <p className="text-rose-400 font-bold">
                        ALERT: CRITICAL DEFICIT! Triggering automated solar drip pump for 90 minutes.
                      </p>
                    ) : simulatedMoistureInput > 42 ? (
                      <p className="text-cyan-300 font-bold">
                        HIGH SATURATION: Drip pump held idle. Soil aeration active.
                      </p>
                    ) : (
                      <p className="text-emerald-300 font-bold">
                        BALANCED SOIL CONDITIONS: Moisture is within field capacity. No irrigation needed today.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setViewMode('video')}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-md"
              >
                Continue Watching Video Tutorial
              </button>
            </div>
          </div>
        )}

        {/* Center Big Play Button (shown when paused) */}
        {!isPlaying && viewMode === 'video' && (
          <button
            onClick={handlePlayPause}
            className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl ring-8 ring-emerald-500/20 transition-transform transform hover:scale-110"
            aria-label="Play Tutorial"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
          </button>
        )}
      </div>

      {/* Subtitles & Spoken Transcript Banner */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
          CC
        </div>
        <div className="flex-1 text-xs text-slate-200 leading-relaxed font-sans">
          <strong className="text-emerald-400 mr-2">[{currentChapter.title}]:</strong>
          {currentChapter.narration[language]}
        </div>
      </div>

      {/* Video Progress Bar & Player Controls */}
      <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-900 space-y-2">
        {/* Timeline Slider with Chapter Markers */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={totalDuration}
            value={currentSecond}
            onChange={(e) => handleSeek(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart Tutorial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                } else if (!nextMute && isPlaying) {
                  speakNarration(currentChapter.narration[language]);
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Time Stamp */}
            <span className="font-mono text-slate-400 text-xs">
              {formatTime(currentSecond)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback speed selector */}
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 font-mono">
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    playbackSpeed === speed ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Carousel / Selector */}
      <div className="bg-slate-900/60 p-4 border-t border-slate-800 space-y-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
          Tutorial Chapters & In-Video Checkpoints ({tutorial.chapters.length} Modules):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {tutorial.chapters.map((chap, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={chap.id}
                onClick={() => handleChapterClick(idx)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-950/60 text-white ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>Part {idx + 1}</span>
                  <span>{formatTime(chap.startSeconds)}</span>
                </div>
                <div className="text-xs font-bold line-clamp-2">{chap.title}</div>
                {chap.interactivePrompt && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-amber-400 mt-2 font-bold">
                    <HelpCircle className="w-3 h-3" />
                    <span>Includes Practical Quiz</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Checkpoint Quiz Modal (if active) */}
      {activeQuizChapter && activeQuizChapter.interactivePrompt && (
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-emerald-900/60">
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span>Knowledge Checkpoint: {activeQuizChapter.title}</span>
              </div>
              <button
                onClick={() => setActiveQuizChapter(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>

            <p className="text-sm font-semibold text-white">
              {activeQuizChapter.interactivePrompt.question}
            </p>

            <div className="space-y-2">
              {activeQuizChapter.interactivePrompt.options.map((opt, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                const isCorrect = optIdx === activeQuizChapter.interactivePrompt?.correctIndex;
                let btnStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-950 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-amber-400 bg-amber-950/40 text-amber-200';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedQuizOption(optIdx);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              {!quizSubmitted ? (
                <button
                  disabled={selectedQuizOption === null}
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white shadow-md"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400">
                    {selectedQuizOption === activeQuizChapter.interactivePrompt.correctIndex
                      ? 'Correct!'
                      : 'Agronomic Insight:'}
                  </span>
                  <p className="text-xs text-slate-300">
                    {activeQuizChapter.interactivePrompt.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
