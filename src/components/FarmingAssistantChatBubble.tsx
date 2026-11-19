import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Sprout,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Power,
  Activity,
  Loader2,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_ZONE_WATER_BUDGETS } from '../data/waterIrrigationData';
import { REGISTERED_LOCATIONS_WEATHER } from '../data/climateRiskData';
import { CROP_FORECAST_DATA } from '../data/cropForecastData';
import { ChatMarkdown } from './ChatMarkdown';

interface AssistantMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  source?: string;
  latencyMs?: number;
  isStreaming?: boolean;
  isError?: boolean;
  actionButton?: {
    label: string;
    actionType: 'toggle-pump';
  };
}

export const FarmingAssistantChatBubble: React.FC = () => {
  const {
    currentUser,
    products,
    telemetry,
    togglePump,
    showNotification,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Odia'>('English');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleSendRef = useRef<(q?: string) => void>(() => {});

  const farmerProducts = products.filter(
    (p) => p.sellerId === 'farmer-1' || p.sellerRole === 'Farmer' || p.sellerId === currentUser.id
  );

  const sambalpurWeather = REGISTERED_LOCATIONS_WEATHER['Sambalpur, Odisha'];
  const activeAlert = sambalpurWeather?.activeAlerts?.[0];

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-msg',
      role: 'model',
      text: `Namaste **${currentUser.name.split(' ')[0]} ji**! 🌾 I am your **Kisan Field Assistant** powered by **Gemini 4** for **${currentUser.farmName || 'Panda Krishi Bio-Farm'}**.\n\nI am connected to your live soil sensors, solar drip pump, irrigation budgets, Sambalpur weather radar, and crop inventory — and I can answer **any question** you ask in English, Hindi, or Odia.`,
      timestamp: 'Live Telemetry Connected',
      source: 'gemini-4-hydrogen',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  // Build rich live farm telemetry context passed to Gemini 4 on every turn
  const buildLiveFarmContext = useCallback(() => {
    const zonesSummary = Object.values(INITIAL_ZONE_WATER_BUDGETS)
      .map((z) => {
        const pct = Math.round((z.todayConsumedLiters / z.dailySustainableLimitLiters) * 100);
        return `${z.zoneName} (${z.cropName}): ${z.todayConsumedLiters}L / ${z.dailySustainableLimitLiters}L daily limit (${pct}% - ${z.status})`;
      })
      .join(' | ');

    const cropsSummary = farmerProducts
      .map((p) => `${p.title} (${p.stock} ${p.unit} left, Retail ₹${p.price}/${p.unit}, Wholesale ₹${p.wholesalePrice}, Batch ${p.batchId})`)
      .join(' | ');

    const forecastSummary = CROP_FORECAST_DATA.slice(0, 3)
      .map(
        (f) =>
          `${f.cropName}: Predicted ${f.upcomingSeason.predictedYieldQuintalPerAcre} q/acre (${f.upcomingSeason.yieldVariancePercent >= 0 ? '+' : ''}${f.upcomingSeason.yieldVariancePercent}% vs baseline, Confidence ${f.upcomingSeason.confidenceScorePercent}%), Expected Harvest: ${f.upcomingSeason.expectedHarvestMonth}`
      )
      .join(' | ');

    return [
      `Farm: ${currentUser.farmName || 'Panda Krishi Bio-Farm'} | Grower: ${currentUser.name} | Location: ${currentUser.location || 'Sambalpur, Odisha'} (12.5 Acres Bio-Certified)`,
      `Live Root-Zone Sensors: Soil Moisture ${telemetry.soilMoisture.toFixed(1)}% (Optimal 35-45%), Soil pH ${telemetry.soilPh}, Nitrogen ${telemetry.soilNitrogen}, Rainfall (24h) ${telemetry.rainfallLast24h}mm, Weather Temp ${sambalpurWeather?.currentTempC ?? 24}°C (Ground ${sambalpurWeather?.groundTempC ?? 18}°C), Humidity ${sambalpurWeather?.relativeHumidity ?? 64}%.`,
      `Solar Irrigation System: Pump Status = ${telemetry.irrigationPumpStatus} (${telemetry.pumpRuntimeTodayHours}h today), Solar Generation = ${telemetry.solarGenerationKw} kW, Battery = ${telemetry.solarBatteryCharge}%, Rainwater Tank = ${telemetry.rainwaterTankLevel}%.`,
      `Active Climate Risk Alert (${sambalpurWeather?.locationName || 'Sambalpur'}): ${activeAlert ? `${activeAlert.title} (${activeAlert.severity}, ${activeAlert.projectedMetrics.primaryValue}) — ${activeAlert.projectedMetrics.soilImpactSummary}` : 'No severe alerts'}.`,
      `Per-Zone Daily Water Budgets: ${zonesSummary}`,
      `Active Harvest Listings (${farmerProducts.length} lots): ${cropsSummary}`,
      `Yield Forecasts: ${forecastSummary}`,
    ].join('\n');
  }, [currentUser, telemetry, farmerProducts, sambalpurWeather, activeAlert]);

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      showNotification('Voice audio playback is not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_•]/g, ' '));
    utterance.lang = language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';
    utterance.rate = 1.02;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showNotification('Speech recognition is not available in your browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendRef.current(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleStopGenerating = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
  };

  const handleResetChat = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: `Fresh field session started. Live telemetry synced (**Soil ${telemetry.soilMoisture.toFixed(1)}% · pH ${telemetry.soilPh} · Pump ${telemetry.irrigationPumpStatus}**). Ask me any question!`,
        timestamp: 'Live Telemetry Connected',
        source: 'gemini-4-hydrogen',
      },
    ]);
  };

  const handleSendMessage = async (customQuery?: string) => {
    const query = (customQuery ?? inputText).trim();
    if (!query || isLoading) return;

    const startTime = Date.now();
    const userMsgId = `u-${Date.now()}`;
    const assistantMsgId = `a-${Date.now() + 1}`;
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const qLower = query.toLowerCase();
    const shouldAttachPumpAction =
      qLower.includes('pump') ||
      qLower.includes('motor') ||
      qLower.includes('drip') ||
      qLower.includes('irrigat') ||
      qLower.includes('soil moisture');

    const historyPayload = messages
      .filter((m) => !m.id.startsWith('init') && !m.isError && m.text.trim())
      .slice(-12)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: query, timestamp: timeLabel },
      {
        id: assistantMsgId,
        role: 'model',
        text: '',
        timestamp: 'Streaming…',
        source: 'gemini-4-hydrogen',
        isStreaming: true,
      },
    ]);
    setInputText('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const farmContext = buildLiveFarmContext();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          role: 'Farmer',
          language,
          history: historyPayload,
          farmContext,
        }),
      });

      if (!response.ok || !response.body) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let streamSource = 'gemini-4-hydrogen';
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith('data:')) continue;
          const dataStr = line.slice(5).trim();
          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              streamError = parsed.error;
              break;
            }
            const piece = parsed.chunk || parsed.text || '';
            if (piece) {
              accumulatedText += piece;
              if (parsed.source) streamSource = parsed.source;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, text: accumulatedText, source: streamSource }
                    : m
                )
              );
            }
          } catch {
            // ignore non-JSON lines
          }
        }
        if (streamError) break;
      }

      if (streamError && !accumulatedText) {
        throw new Error(streamError);
      }

      const latencyMs = Date.now() - startTime;
      if (!accumulatedText.trim()) {
        throw new Error('Empty stream received');
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text: accumulatedText,
                timestamp: timeLabel,
                latencyMs,
                source: streamSource,
                isStreaming: false,
                actionButton: shouldAttachPumpAction
                  ? {
                      label:
                        telemetry.irrigationPumpStatus === 'Active'
                          ? 'Turn Off Solar Pump'
                          : 'Turn On Solar Pump',
                      actionType: 'toggle-pump',
                    }
                  : undefined,
              }
            : m
        )
      );
    } catch (err: any) {
      if (err?.name === 'AbortError') return;

      // Fallback to non-streaming /api/chat
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            role: 'Farmer',
            language,
            history: historyPayload,
            farmContext,
          }),
        });
        const data = await fallbackRes.json();
        if (!fallbackRes.ok || data.error) {
          throw new Error(data.error || `Request failed (${fallbackRes.status})`);
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text: data.reply,
                  timestamp: timeLabel,
                  latencyMs: Date.now() - startTime,
                  source: data.source || 'gemini-4-hydrogen',
                  isStreaming: false,
                  actionButton: shouldAttachPumpAction
                    ? {
                        label:
                          telemetry.irrigationPumpStatus === 'Active'
                            ? 'Turn Off Solar Pump'
                            : 'Turn On Solar Pump',
                        actionType: 'toggle-pump',
                      }
                    : undefined,
                }
              : m
          )
        );
      } catch (finalErr: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text:
                    finalErr?.message ||
                    'Could not connect to Gemini AI right now. Please try again.',
                  timestamp: timeLabel,
                  isStreaming: false,
                  isError: true,
                  source: 'error',
                }
              : m
          )
        );
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  handleSendRef.current = handleSendMessage;

  const handleActionClick = (action: AssistantMessage['actionButton']) => {
    if (!action) return;
    if (action.actionType === 'toggle-pump') {
      togglePump();
    }
  };

  const quickPrompts = [
    { label: '💧 Soil Moisture & Pump', query: 'What is my current soil moisture and should I turn on the solar pump?' },
    { label: '🧪 NPK & Soil pH', query: 'Analyze my live soil pH, NPK fertility, and organic fertilizer plan' },
    { label: '❄️ Frost Alert Tonight', query: 'Explain tonight’s frost alert in Sambalpur and exact protection steps' },
    { label: '🌾 Active Crop Stock', query: 'Summarize my active harvest listings, prices, and stock levels' },
    { label: '🚰 Water Limit Check', query: 'Did any irrigation zone exceed its sustainable water limit today?' },
    { label: '🔄 Crop Rotation', query: 'What crop sequence should I plant after tomatoes to restore nitrogen?' },
  ];

  return (
    <>
      {/* Floating Chat Bubble Trigger */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
        {!isOpen && hasUnread && (
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-slate-900 text-white text-xs px-3.5 py-2 rounded-2xl rounded-br-sm shadow-xl border border-emerald-500/40 flex items-center gap-2 hover:bg-slate-800 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Ask Kisan AI anything about your farm!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-400/40 shadow-emerald-600/30'
          }`}
          aria-label="Toggle Kisan Field Assistant"
        >
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Sprout className="w-4 h-4 text-amber-300" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Kisan Field AI</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-[10px] font-mono text-emerald-100">
              Soil {telemetry.soilMoisture.toFixed(1)}% · pH {telemetry.soilPh}
            </div>
          </div>

          {isOpen ? (
            <X className="w-4 h-4 text-slate-300 ml-1" />
          ) : (
            <MessageSquare className="w-4 h-4 text-emerald-100 ml-1" />
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-40 right-4 sm:right-6 w-[95vw] sm:w-[460px] h-[600px] max-h-[78vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-4 border-b border-emerald-700/40 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">Kisan Field Assistant</h3>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      GEMINI 4
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-emerald-300" />
                    <span>
                      Soil {telemetry.soilMoisture.toFixed(1)}% · pH {telemetry.soilPh} · Pump{' '}
                      {telemetry.irrigationPumpStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'English' | 'Hindi' | 'Odia')}
                  className="bg-slate-950/50 border border-white/20 text-white text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="English" className="text-slate-900">EN</option>
                  <option value="Hindi" className="text-slate-900">हिन्दी</option>
                  <option value="Odia" className="text-slate-900">ଓଡ଼ିଆ</option>
                </select>
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 hidden sm:block"
                  title={isExpanded ? 'Compact View' : 'Expand View'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/60 dark:bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div
                    className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                      msg.isError ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    {msg.isError ? <AlertCircle className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.text ? (
                    <ChatMarkdown text={msg.text} isUser={msg.role === 'user'} />
                  ) : (
                    <div className="flex items-center gap-2 py-0.5 text-slate-500 dark:text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>Analyzing live farm telemetry with Gemini 4…</span>
                    </div>
                  )}

                  {msg.isStreaming && msg.text && (
                    <span className="inline-block w-1.5 h-3.5 bg-emerald-500 animate-pulse ml-0.5 align-middle" />
                  )}

                  {msg.actionButton && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
                      <button
                        onClick={() => handleActionClick(msg.actionButton)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{msg.actionButton.label}</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between text-[9px] pt-1 border-t ${
                      msg.role === 'user'
                        ? 'border-white/15 text-emerald-100'
                        : 'border-slate-100 dark:border-slate-700/70 text-slate-400'
                    }`}
                  >
                    <span className="font-mono">
                      {msg.source && msg.role === 'model' && !msg.isError ? `⚡ ${msg.source}` : ''}
                      {msg.latencyMs ? ` (${(msg.latencyMs / 1000).toFixed(1)}s)` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.role === 'model' && msg.text && !msg.isStreaming && (
                        <button
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className="hover:text-emerald-600 transition-colors"
                          title="Read Aloud"
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(chip.query)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask about your crops, soil, or anything in ${language}...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                title="Stop Generating"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors shadow-sm"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};
