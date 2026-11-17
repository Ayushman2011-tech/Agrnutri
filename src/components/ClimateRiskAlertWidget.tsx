import React, { useState, useEffect, useMemo } from 'react';
import {
  CloudSnow,
  CloudRain,
  Sun,
  AlertTriangle,
  Bell,
  BellRing,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Volume2,
  VolumeX,
  PhoneCall,
  Share2,
  Radar,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  Compass,
  Sliders,
  Send,
  Zap,
} from 'lucide-react';
import {
  REGISTERED_LOCATIONS_WEATHER,
  ClimateHazardAlert,
  ClimateRiskType,
  FarmLocationWeatherProfile,
} from '../data/climateRiskData';
import { useApp } from '../context/AppContext';

export const ClimateRiskAlertWidget: React.FC = () => {
  const { currentUser, showNotification, telemetry, togglePump } = useApp();

  // Location selector (defaults to current user location or Sambalpur)
  const defaultLocation = REGISTERED_LOCATIONS_WEATHER[currentUser.location]
    ? currentUser.location
    : 'Sambalpur, Odisha';

  const [selectedLocationKey, setSelectedLocationKey] = useState<string>(defaultLocation);
  const [selectedHazardFilter, setSelectedHazardFilter] = useState<'all' | ClimateRiskType>('all');
  const [activeAlertId, setActiveAlertId] = useState<string>('ALT-FROST-01');

  // Push notification preferences state
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isSmsGatewayActive, setIsSmsGatewayActive] = useState<boolean>(true);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  // Completed mitigation tasks state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'ALT-FROST-01-1': false,
    'ALT-FROST-01-2': false,
    'ALT-FROST-01-3': false,
    'ALT-RAIN-02-2': true,
  });

  const weatherProfile: FarmLocationWeatherProfile =
    REGISTERED_LOCATIONS_WEATHER[selectedLocationKey] || REGISTERED_LOCATIONS_WEATHER['Sambalpur, Odisha'];

  // Filtered active alerts
  const filteredAlerts = useMemo(() => {
    if (selectedHazardFilter === 'all') return weatherProfile.activeAlerts;
    return weatherProfile.activeAlerts.filter((a) => a.type === selectedHazardFilter);
  }, [weatherProfile, selectedHazardFilter]);

  // Selected Active Alert
  const currentAlert: ClimateHazardAlert = useMemo(() => {
    return (
      filteredAlerts.find((a) => a.id === activeAlertId) ||
      filteredAlerts[0] ||
      weatherProfile.activeAlerts[0]
    );
  }, [filteredAlerts, activeAlertId, weatherProfile]);

  // Check Web Notification permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  // Request native browser push notifications
  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          setIsPushEnabled(true);
          triggerPushNotification(
            '🔔 Climate Risk Alerts Activated',
            `Push notifications enabled for ${weatherProfile.locationName}. You will receive immediate warnings for upcoming frost, heavy rain, and drought.`
          );
        } else {
          showNotification('Push notifications permission was not granted by your browser. In-app alerts remain active.');
        }
      } catch (err) {
        showNotification('Push notification setup complete. In-app alert banners active.');
      }
    } else {
      showNotification('Web Push alerts active. High-priority toast and sound chime enabled.');
    }
  };

  // Trigger push notification (Real Web Notification + In-App Toast + Audio Beep)
  const triggerPushNotification = (title: string, body: string, iconUrl?: string) => {
    // 1. Play subtle audio alert if enabled
    if (isSoundEnabled && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
        // audio context blocked by gesture policy
      }
    }

    // 2. Real Native Web Push Notification (if permitted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (e) {
        // notification suppressed in some iframe contexts
      }
    }

    // 3. In-App Floating Toast Notification
    showNotification(`${title}: ${body}`);
  };

  // Simulation handler for the 3 key requested hazards
  const handleSimulateHazard = (type: ClimateRiskType) => {
    setSelectedHazardFilter(type);
    const targetAlert = weatherProfile.activeAlerts.find((a) => a.type === type) || weatherProfile.activeAlerts[0];
    if (targetAlert) {
      setActiveAlertId(targetAlert.id);
      triggerPushNotification(
        `⚠️ AUTOMATED CLIMATE ALERT [${targetAlert.severity.toUpperCase()}]: ${targetAlert.title}`,
        `${targetAlert.targetLocation} (${targetAlert.district}): ${targetAlert.projectedMetrics.primaryValue}. Peak risk: ${targetAlert.peakExpectedTime}.`
      );
    }
  };

  const toggleStepCompleted = (key: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleBroadcastFpo = () => {
    showNotification(
      `Dispatched instant WhatsApp and SMS weather alert to 48 registered farmers in the Sambalpur Bio-Cluster.`
    );
  };

  const handleCallAgronomist = () => {
    showNotification(
      `Connecting to KVK Agro-Meteorology Emergency Helpline (Toll-Free 1800-180-1551)...`
    );
  };

  // Severity style helper
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical Emergency':
        return 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400 animate-pulse';
      case 'Severe Warning':
        return 'bg-amber-500 text-slate-950 font-black shadow-md';
      case 'Advisory':
        return 'bg-teal-600 text-white font-bold';
      default:
        return 'bg-slate-700 text-white font-bold';
    }
  };

  const getHazardIcon = (type: ClimateRiskType) => {
    switch (type) {
      case 'frost':
        return <CloudSnow className="w-5 h-5 text-sky-400" />;
      case 'heavy_rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'drought':
        return <Sun className="w-5 h-5 text-amber-400" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  // Count mitigation completed
  const totalMitigationSteps = currentAlert?.emergencyMitigationPlan?.length || 0;
  const completedCount = currentAlert?.emergencyMitigationPlan?.filter(
    (s, idx) => completedSteps[`${currentAlert.id}-${s.step}`] || s.completed
  ).length || 0;
  const mitigationPercent = totalMitigationSteps > 0 ? Math.round((completedCount / totalMitigationSteps) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Automated Climate Risk Alert System · IMD Radar Linked</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Hyper-Local Frost, Heavy Rain & Drought Warnings</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time atmospheric telemetry and Doppler radar cell tracking for your registered farm location at{' '}
              <strong className="text-white underline">{weatherProfile.locationName}</strong> ({weatherProfile.district}). Triggers automated push alerts and SMS broadcasts before critical crop thresholds are breached.
            </p>
          </div>

          {/* Quick Push Notification Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!hasPermission ? (
              <button
                onClick={requestPushPermission}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg transition-all flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Enable Push Notifications</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Push Alerts Active</span>
              </div>
            )}

            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              title={isSoundEnabled ? 'Audio Alert Chime Enabled' : 'Audio Alert Chime Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Location Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {Object.keys(REGISTERED_LOCATIONS_WEATHER).map((locKey) => {
              const loc = REGISTERED_LOCATIONS_WEATHER[locKey];
              const isSelected = selectedLocationKey === locKey;

              return (
                <button
                  key={locKey}
                  onClick={() => {
                    setSelectedLocationKey(locKey);
                    setActiveAlertId(loc.activeAlerts[0]?.id || 'ALT-FROST-01');
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-white text-slate-950 shadow-md ring-2 ring-emerald-400'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{loc.district}</span>
                  {loc.activeAlerts.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Simulation Action Triggers */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Test Push Alert:</span>
            <button
              onClick={() => handleSimulateHazard('frost')}
              className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <CloudSnow className="w-3 h-3 text-sky-400" />
              <span>Frost Test</span>
            </button>
            <button
              onClick={() => handleSimulateHazard('heavy_rain')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <CloudRain className="w-3 h-3 text-blue-400" />
              <span>Heavy Rain Test</span>
            </button>
            <button
              onClick={() => handleSimulateHazard('drought')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Drought Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Live Farm Meteorological Micro-Sensors Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ground Surface Temp</span>
            <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5 flex items-baseline gap-1">
              <span>{weatherProfile.groundTempC}°C</span>
              <span className="text-[9px] font-bold text-rose-500">Frost Risk</span>
            </div>
            <span className="text-[10px] text-slate-500">Ambient: {weatherProfile.currentTempC}°C</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Soil Moisture (Telemetry)</span>
            <div className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5">
              {telemetry.soilMoisture.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-500">Pump: {telemetry.irrigationPumpStatus}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Relative Humidity</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {weatherProfile.relativeHumidity}%
            </div>
            <span className="text-[10px] text-slate-500">Dewpoint: 11.2°C</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rainfall (24h)</span>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {weatherProfile.rainfallLast24hMm} mm
            </div>
            <span className="text-[10px] text-slate-500">Doppler Cell: +58mm</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Wind Velocity</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {weatherProfile.windSpeedKmh} km/h
            </div>
            <span className="text-[10px] text-slate-500">Direction: NE Cold Breeze</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Farm Elevation</span>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {weatherProfile.elevationMeters}m MSL
            </div>
            <span className="text-[10px] text-slate-500">{weatherProfile.coordinates}</span>
          </div>
        </div>

        {/* Hazard Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedHazardFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedHazardFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>All Warnings ({weatherProfile.activeAlerts.length})</span>
          </button>
          <button
            onClick={() => setSelectedHazardFilter('frost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedHazardFilter === 'frost'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
            }`}
          >
            <CloudSnow className="w-3.5 h-3.5" />
            <span>Frost / Cold Wave</span>
          </button>
          <button
            onClick={() => setSelectedHazardFilter('heavy_rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedHazardFilter === 'heavy_rain'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Heavy Rain Downpour</span>
          </button>
          <button
            onClick={() => setSelectedHazardFilter('drought')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedHazardFilter === 'drought'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Drought / Dry Spell</span>
          </button>
        </div>

        {/* Active Alert Hero Presentation Card */}
        {currentAlert ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Emergency Hazard Assessment & Doppler Details */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    {getHazardIcon(currentAlert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${getSeverityStyle(currentAlert.severity)}`}>
                        {currentAlert.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {currentAlert.probabilityPercent}% Probability
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {currentAlert.title}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Peak Risk Window</span>
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                    {currentAlert.peakExpectedTime}
                  </span>
                </div>
              </div>

              {/* Projected Metric Trigger Box */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-rose-900 dark:text-rose-300 uppercase tracking-wide">
                    Meteorological Trigger Condition:
                  </span>
                  <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                    Radar: {currentAlert.nearestRadarStation}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-400">
                  {currentAlert.projectedMetrics.primaryValue}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Threshold Breached:</strong> {currentAlert.projectedMetrics.thresholdTriggered}.{' '}
                  {currentAlert.projectedMetrics.soilImpactSummary}
                </p>

                {/* Crops at risk badges */}
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500">Crops at Immediate Risk:</span>
                  {currentAlert.projectedMetrics.cropsAtRisk.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Doppler Radar Sweep & 72h Timeline Simulation */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Radar className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Live Doppler Weather Radar Stream ({currentAlert.district})</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Updated: 2 mins ago</span>
                </div>

                {/* Simulated Radar Bar Animation */}
                <div className="relative h-14 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center px-4 justify-between">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-amber-500/20 to-rose-500/30 animate-pulse pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 flex items-center justify-center font-bold text-xs">
                      {currentAlert.probabilityPercent}%
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Atmospheric Hazard Cell: Inbound</div>
                      <div className="text-[10px] text-slate-400">Reflectivity: 48 dBZ · Velocity 18 km/h SW</div>
                    </div>
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[10px] text-emerald-400 font-bold block">Farm Coords</span>
                    <span className="text-xs font-mono text-slate-300">{currentAlert.coordinates}</span>
                  </div>
                </div>

                {/* 72h Forecast Risk Curve */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Now (+0h)</span>
                    <span>Tonight (+12h Peak)</span>
                    <span>Tomorrow (+24h)</span>
                    <span>Day 3 (+48h)</span>
                    <span>Day 4 (+72h Recovered)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[15%]" title="Normal baseline" />
                    <div className="h-full bg-amber-500 w-[20%]" title="Escalating danger" />
                    <div className="h-full bg-rose-600 w-[35%] animate-pulse" title="Peak Hazard window" />
                    <div className="h-full bg-amber-500 w-[15%]" title="Subsiding risk" />
                    <div className="h-full bg-emerald-500 w-[15%]" title="Safe conditions" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Emergency Mitigation Checklist & Immediate Actions */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 rounded-3xl p-6 border border-emerald-200/80 dark:border-slate-700 shadow-md space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 dark:text-emerald-400">
                    Emergency Agronomic Protocol
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Protection Index: <strong className="text-emerald-600">{mitigationPercent}%</strong>
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Mitigation Action Checklist for {currentAlert.type.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Execute these immediate farm safeguards to neutralize crop damage before the risk window peaks.
                </p>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${mitigationPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {currentAlert.emergencyMitigationPlan.map((planItem, idx) => {
                  const itemKey = `${currentAlert.id}-${planItem.step}`;
                  const isDone = completedSteps[itemKey] || false;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStepCompleted(itemKey)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isDone
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                              planItem.urgency === 'Immediate (0-2h)'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {planItem.urgency}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Step {planItem.step}</span>
                        </div>
                        <p
                          className={`text-xs leading-snug ${
                            isDone
                              ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                              : 'text-slate-800 dark:text-slate-200 font-medium'
                          }`}
                        >
                          {planItem.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Official KVK SMS Broadcast Snapshot */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kisan SMS Gateway Dispatch</span>
                  </span>
                  <span className="text-[9px] text-emerald-600 font-black">SENT VIA NIC-GOV</span>
                </div>
                <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  {currentAlert.kvkSmsAdvisory}
                </p>
              </div>

              {/* Direct Agronomic Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCallAgronomist}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KVK Helpline</span>
                </button>
                <button
                  onClick={handleBroadcastFpo}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Broadcast FPO</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-800 dark:text-white">
              No Severe Climate Risks Detected for {weatherProfile.district}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All micro-climate thresholds are currently within safe optimal growing bounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
