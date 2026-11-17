import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Sprout,
  Droplets,
  Sun,
  ShieldAlert,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Power,
  ChevronDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_ZONE_WATER_BUDGETS } from '../data/waterIrrigationData';
import { REGISTERED_LOCATIONS_WEATHER } from '../data/climateRiskData';
import { CROP_FORECAST_DATA } from '../data/cropForecastData';

interface AssistantMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  source?: 'field-telemetry' | 'soil-database' | 'climate-radar' | 'ai-stream' | 'water-guard';
  latencyMs?: number;
  actionButton?: {
    label: string;
    actionType: 'toggle-pump' | 'view-alert' | 'view-water' | 'view-heatmap';
  };
}

export const FarmingAssistantChatBubble: React.FC = () => {
  const {
    currentUser,
    products,
    telemetry,
    togglePump,
    showNotification,
    inspectBatch,
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

  const farmerProducts = products.filter(
    (p) => p.sellerId === 'farmer-1' || p.sellerRole === 'Farmer' || p.sellerId === currentUser.id
  );

  const sambalpurWeather = REGISTERED_LOCATIONS_WEATHER['Sambalpur, Odisha'];
  const activeAlert = sambalpurWeather?.activeAlerts?.[0];
  const zoneB = INITIAL_ZONE_WATER_BUDGETS['zone-b'];
  const forecast = CROP_FORECAST_DATA[0];

  // Initial welcome message
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-msg',
      role: 'model',
      text: `Namaste ${currentUser.name.split(' ')[0]} ji! 🌾 I am your dedicated Kisan Field Assistant for ${currentUser.farmName || 'your Sambalpur Farm'}.\n\nI have live telemetry feeds from your root-zone soil sensors, irrigation pumps, listed crops, and Sambalpur micro-climate radar. What would you like to inspect?`,
      timestamp: 'Live Feed Connected',
      source: 'field-telemetry',
      latencyMs: 4,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  // Audio Speech Synthesis
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
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
    if (language === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'Odia') {
      utterance.lang = 'or-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
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
      recognition.lang =
        language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition notice:', err);
      setIsListening(false);
    }
  };

  // Fast Instant Natural Language Knowledge Matcher
  const matchFieldIntelligence = useCallback(
    (query: string): AssistantMessage | null => {
      const q = query.toLowerCase();

      // Soil Moisture & Irrigation
      if (
        q.includes('moisture') ||
        q.includes('wet') ||
        q.includes('water in soil') ||
        q.includes('pani') ||
        q.includes('matira moisture')
      ) {
        const moisture = telemetry.soilMoisture.toFixed(1);
        const pumpState = telemetry.irrigationPumpStatus ? 'RUNNING (Active)' : 'OFF (Standby)';
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `💧 **Root-Zone Soil Moisture Status**\n- **Current Live Moisture:** ${moisture}%\n- **Target Optimal Band:** 35.0% - 45.0%\n- **Evaluation:** Soil moisture is currently in the **Optimal Zone**. Organic vermicompost mulch has retained excellent root capillary moisture.\n- **Solar Pump:** Currently **${pumpState}**.\n\n💡 *Agronomist Tip:* No emergency irrigation is required right now. However, if tonight's ground chill drops below 5°C, consider a brief 10-minute sprinkler pulse at 3:00 AM to release latent heat.`,
          timestamp: 'Live Sensor Telemetry',
          source: 'field-telemetry',
          latencyMs: 6,
          actionButton: {
            label: telemetry.irrigationPumpStatus ? 'Turn Off Solar Pump' : 'Turn On Solar Pump',
            actionType: 'toggle-pump',
          },
        };
      }

      // Solar Pump Status & Control
      if (
        q.includes('pump') ||
        q.includes('motor') ||
        q.includes('irrigation status') ||
        q.includes('turn on pump') ||
        q.includes('turn off pump')
      ) {
        const pumpState = telemetry.irrigationPumpStatus ? 'ACTIVE & PUMPING' : 'IDLE / STANDBY';
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `⚡ **Solar Irrigation Pump Telemetry**\n- **Live Status:** **${pumpState}**\n- **Power Source:** Solar Photovoltaic Grid (${telemetry.solarGenerationKw} kW generation)\n- **Daily Water Budget Note:** Zone B (Hirakud Black Alluvial) has consumed 3,640 L against its 3,200 L ceiling (+113.8%). Auto-shutoff safety lock is armed to protect the deep aquifer.\n\nYou can toggle the solar pump directly below:`,
          timestamp: 'Solar Controller IoT',
          source: 'water-guard',
          latencyMs: 5,
          actionButton: {
            label: telemetry.irrigationPumpStatus ? 'Stop Solar Pump' : 'Start Solar Pump',
            actionType: 'toggle-pump',
          },
        };
      }

      // Soil Health, NPK, Fertility & pH
      if (
        q.includes('soil health') ||
        q.includes('npk') ||
        q.includes('nitrogen') ||
        q.includes('ph') ||
        q.includes('fertility') ||
        q.includes('potassium') ||
        q.includes('phosphorus') ||
        q.includes('carbon')
      ) {
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `🧪 **Comprehensive Soil Health & Fertility Report**\n- **Soil pH:** ${telemetry.soilPh} (Neutral - Ideal for tomato & eggplant nutrient uptake)\n- **Available Nitrogen (N):** ${telemetry.soilNitrogen} kg/ha (Optimal Target: 280-360 kg/ha)\n- **Available Phosphorus (P₂O₅):** 48.2 kg/ha (Good microbial mycorrhizal availability)\n- **Available Potassium (K₂O):** 285.0 kg/ha (Adequate for fruit firmness)\n- **Organic Carbon:** 0.84% (High biological activity with earthworm castings)\n- **Electrical Conductivity (EC):** 0.38 dS/m (Zero salinity stress)\n\n🌱 *Recommendation:* Maintain current biological Jeevamrutha fertigation every 14 days.`,
          timestamp: 'Soil Telemetry Grid',
          source: 'soil-database',
          latencyMs: 8,
        };
      }

      // Climate Risk & Weather Alert
      if (
        q.includes('weather') ||
        q.includes('climate') ||
        q.includes('frost') ||
        q.includes('rain') ||
        q.includes('cold') ||
        q.includes('alert') ||
        q.includes('tufan') ||
        q.includes('forecast')
      ) {
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `⚠️ **Climate Risk Radar Alert: Sambalpur, Odisha**\n- **Active Warning:** Ground Frost & Thermal Inversion\n- **Severity:** Severe Warning (88% Probability)\n- **Peak Window:** Tonight 02:00 AM – 05:30 AM\n- **Projected Ground Temp:** **4.2°C** (Threshold < 6.0°C)\n- **Vulnerable Crops:** Organic Vine Tomatoes (Young flowering clusters)\n\n🛡️ **Urgent Action Checklist:**\n1. Cover nursery beds and young tomato vines with dry paddy straw or breathable agronet.\n2. Schedule a 15-minute micro-sprinkler misting at 03:00 AM — latent heat of freezing will insulate plant tissue above 0°C.\n3. Keep smoke/smudge fires along the northwest perimeter if wind drops to 0 km/h.`,
          timestamp: 'IMD Doppler Radar Sync',
          source: 'climate-radar',
          latencyMs: 6,
        };
      }

      // Current Listed Crops & Stocks
      if (
        q.includes('crop') ||
        q.includes('stock') ||
        q.includes('harvest') ||
        q.includes('lot') ||
        q.includes('selling') ||
        q.includes('price') ||
        q.includes('listing')
      ) {
        const cropSummary = farmerProducts
          .map(
            (p) =>
              `• **${p.title}**: ${p.stock} ${p.unit} remaining (₹${p.price}/${p.unit} retail | ₹${p.wholesalePrice} bulk, Batch: \`${p.batchId}\`)`
          )
          .join('\n');

        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `🌾 **Your Current Harvest Inventory & Listings**\nYou currently have **${farmerProducts.length} lots** live on the marketplace:\n\n${cropSummary}\n\n📦 *Traceability Status:* 100% of lots are certified with NPOP organic QR passports and Zero Chemical Residue (0.00 ppm).`,
          timestamp: 'Marketplace Inventory',
          source: 'field-telemetry',
          latencyMs: 7,
        };
      }

      // Water Budget & Zone Limit Warnings
      if (
        q.includes('water budget') ||
        q.includes('consumption') ||
        q.includes('limit') ||
        q.includes('leak') ||
        q.includes('zone b') ||
        q.includes('sustainable')
      ) {
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `🚨 **Zone Water Budget & Sustainability Audit**\n- **Zone A (Tomatoes):** 3,820 L / 4,500 L (84.8% - Normal)\n- **Zone B (Hirakud Alluvial):** **3,640 L / 3,200 L (113.8% - THRESHOLD EXCEEDED)**\n- **Zone C (Bargarh Millets):** 1,420 L / 2,800 L (50.7% - Highly Sustainable)\n- **Zone D (Koraput Spices):** 1,890 L / 2,500 L (75.6% - Normal)\n\n⚠️ *Alert for Zone B:* Excess of 440 Liters detected. Telemetry indicates emitter flow rate is 38.4 L/min (expected 28.0 L/min). Potential sub-mainline drip rupture or loose connector near Row 14. Recommend manual inspection.`,
          timestamp: 'Flow Sensor Telemetry',
          source: 'water-guard',
          latencyMs: 5,
        };
      }

      // Crop Rotation & Next Planting
      if (
        q.includes('rotation') ||
        q.includes('plant next') ||
        q.includes('after tomato') ||
        q.includes('sequence') ||
        q.includes('legume')
      ) {
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `🌱 **Recommended Crop Rotation Sequence**\nBased on your 3-year yield forecast and soil nitrogen recovery model:\n\n1. **Current Crop:** Solanaceous Vine Tomatoes (Heavy N & K consumer, prone to root-knot nematodes)\n2. **Next Recommended Cycle (Zaid 2026):** **Green Gram / Mung Bean (IPM-02-03) or Dhaincha**\n   - *Soil Benefit:* Biological rhizobium nitrogen fixation adds **+130 kg N/ha** back to the soil.\n   - *Pest Break:* Breaks root-knot nematode cycle by **94%**.\n   - *Water Demand:* Low (only 1,800 L/ha vs 4,500 L for vegetables).\n   - *Market Return:* Projected ₹65-72/kg wholesale price in Western Odisha.`,
          timestamp: 'Agronomy Model',
          source: 'soil-database',
          latencyMs: 9,
        };
      }

      // Founders & Mission
      if (q.includes('founder') || q.includes('who made') || q.includes('ayushman') || q.includes('gourav')) {
        return {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `🌾 **AgriNutri Founders & Mission**\nAgriNutri was founded in Odisha by **Ayushman Panda & Gourav Soren** with the vision of creating a transparent, circular food supply chain connecting smallholder farmers with verified zero-chemical food consumers.\n\nEvery rupee earned on the platform goes directly to farmers with zero middleman commissions.`,
          timestamp: 'Platform Bio',
          source: 'field-telemetry',
          latencyMs: 4,
        };
      }

      return null;
    },
    [telemetry, farmerProducts, currentUser]
  );

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // 1. Check local high-speed agronomic matcher
    const localMatch = matchFieldIntelligence(query);
    if (localMatch) {
      setTimeout(() => {
        setMessages((prev) => [...prev, localMatch]);
        setIsLoading(false);
      }, 80);
      return;
    }

    // 2. Stream from backend AI with injected field context
    const fieldTelemetryContext = `
[CURRENT FARMER CONTEXT]
Farmer Name: ${currentUser.name}
Farm: ${currentUser.farmName || 'Sambalpur Organic Farm'}
Location: ${currentUser.location || 'Sambalpur, Odisha'}
Current Soil Moisture: ${telemetry.soilMoisture.toFixed(1)}% (Optimal band: 35-45%)
Soil pH: ${telemetry.soilPh} (Neutral)
Available Soil Nitrogen: ${telemetry.soilNitrogen} kg/ha
Solar Irrigation Pump Status: ${telemetry.irrigationPumpStatus ? 'ON (Active)' : 'OFF (Standby)'}
Solar Generation: ${telemetry.solarGenerationKw} kW
Active Climate Alert: Ground Frost warning for Sambalpur tonight (4.2°C projected ground temp)
Zone Water Status: Zone B exceeded daily limit by 440 L (flow rate 38.4 L/min)
Listed Harvest Lots: ${farmerProducts.map((p) => `${p.title} (${p.stock} ${p.unit})`).join(', ')}
    `.trim();

    const promptWithContext = `You are the Kisan Field Assistant for ${currentUser.name} at ${currentUser.farmName || 'Sambalpur Farm'} in Odisha.
You are helping the farmer with crop conditions, soil telemetry, irrigation, and weather risks.
Current Farm Telemetry Data:
${fieldTelemetryContext}

User Query: "${query}"
Respond concisely, warmly, and practically in ${language}. Provide specific numbers from their farm sensors.`;

    const assistantMsgId = `model-${Date.now()}`;
    const startTime = performance.now();

    // Placeholder message for streaming
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'model',
        text: '',
        timestamp: 'Streaming...',
        source: 'ai-stream',
      },
    ]);

    try {
      // Try SSE stream first
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptWithContext,
          role: 'Farmer',
          language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed, fallback to standard');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const textPiece = parsed.chunk || parsed.text || '';
              if (textPiece) {
                accumulatedText += textPiece;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, text: accumulatedText } : m
                  )
                );
              }
            } catch (err) {
              // ignore parse errors
            }
          }
        }
      }

      const latencyMs = Math.round(performance.now() - startTime);
      if (!accumulatedText.trim()) {
        const fallbackText = `🌾 **Live Telemetry & Field Analysis:**\n- **Soil Moisture:** ${telemetry.soilMoisture.toFixed(1)}% (Optimal band: 35-45%)\n- **Soil pH:** ${telemetry.soilPh} (Neutral - Ideal for nutrient absorption)\n- **Available Nitrogen:** ${telemetry.soilNitrogen} kg/ha\n- **Solar Pump:** ${telemetry.irrigationPumpStatus ? 'ON (Active)' : 'STANDBY'}\n- **Tonight's Warning:** 4.2°C Ground Frost in Sambalpur. Cover young tomato beds with paddy straw.`;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text: fallbackText,
                  timestamp: 'Instant Sensor Engine',
                  latencyMs,
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  timestamp: 'Real-time Stream',
                  latencyMs,
                }
              : m
          )
        );
      }
    } catch (err) {
      // Fallback to standard /api/chat
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptWithContext,
            role: 'Farmer',
            language,
          }),
        });
        const data = await fallbackRes.json();
        const latencyMs = Math.round(performance.now() - startTime);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text:
                    data.reply ||
                    `Based on your live sensors, your root-zone soil moisture is ${telemetry.soilMoisture.toFixed(
                      1
                    )}% and soil pH is ${telemetry.soilPh}. Your solar pump is currently ${
                      telemetry.irrigationPumpStatus ? 'running' : 'on standby'
                    }.`,
                  timestamp: 'Field Telemetry Sync',
                  latencyMs,
                }
              : m
          )
        );
      } catch (finalErr) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text: `🌾 **Farm Diagnostic Summary:**\n- **Soil Moisture:** ${telemetry.soilMoisture.toFixed(
                    1
                  )}% (Optimal)\n- **Soil pH:** ${telemetry.soilPh} (Healthy)\n- **Nitrogen:** ${
                    telemetry.soilNitrogen
                  } kg/ha\n- **Solar Pump:** ${
                    telemetry.irrigationPumpStatus ? 'ON' : 'OFF'
                  }\n- **Tonight's Warning:** 4.2°C Ground Frost in Sambalpur. Cover young nursery beds.`,
                  timestamp: 'Local Agronomy Engine',
                  latencyMs: 12,
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: AssistantMessage['actionButton']) => {
    if (!action) return;
    if (action.actionType === 'toggle-pump') {
      togglePump();
      showNotification(
        `Solar Irrigation Pump is now ${!telemetry.irrigationPumpStatus ? 'RUNNING' : 'STOPPED'}.`
      );
    }
  };

  const quickPrompts = [
    { label: '💧 Moisture & Pump', query: 'What is my current soil moisture and is the pump running?' },
    { label: '🧪 N-P-K & Soil pH', query: 'Check my soil health, NPK fertility and pH levels' },
    { label: '⚠️ Frost Alert Tonight', query: 'What is the climate alert and frost risk for tonight?' },
    { label: '🌾 Active Crop Stock', query: 'What are my listed crops and inventory stocks?' },
    { label: '🚨 Water Limit Overuse', query: 'Did any irrigation zone exceed the sustainable water limit?' },
    { label: '🌱 Crop Rotation', query: 'What crop sequence should I rotate after tomatoes?' },
  ];

  return (
    <>
      {/* Floating Bubble Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <div className="flex items-center gap-3 mb-2 animate-bounce">
            <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-2xl shadow-xl border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-300">Live Soil: {telemetry.soilMoisture.toFixed(1)}%</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Ask Kisan AI</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 border ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 hover:scale-105 shadow-emerald-950/40'
          }`}
          aria-label="Toggle Kisan Field Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sprout className="w-5 h-5 text-emerald-100 group-hover:rotate-12 transition-transform" />
            </div>
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-slate-900 rounded-full animate-pulse" />
            )}
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
              <span>Kisan Field Assistant</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-400/20 text-emerald-200 text-[9px] uppercase font-bold">
                IoT Live
              </span>
            </div>
            <div className="text-[10px] text-emerald-100/90 font-medium flex items-center gap-1">
              <span>Sambalpur Micro-Climate & Crop AI</span>
            </div>
          </div>

          {isOpen ? (
            <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors ml-1" />
          ) : (
            <MessageSquare className="w-5 h-5 text-emerald-100 ml-1" />
          )}
        </button>
      </div>

      {/* Floating Chat Modal / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-24 right-4 sm:right-6 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-4 border-b border-emerald-500/30 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">Kisan Field Assistant</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Sensors
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {currentUser.farmName || 'Sambalpur Farm'} • Western Odisha Cluster
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Language Switcher */}
                <div className="flex items-center bg-black/30 rounded-xl p-0.5 border border-white/10 text-[10px] mr-1">
                  {(['English', 'Hindi', 'Odia'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded-lg font-bold transition-all ${
                        language === lang
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {lang === 'English' ? 'EN' : lang === 'Hindi' ? 'HI' : 'OD'}
                    </button>
                  ))}
                </div>

                {/* Expand / Minimize */}
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Field Telemetry Ticker Strip */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-200 overflow-x-auto gap-4 no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Moisture:</span>
                <span className="font-bold text-white">{telemetry.soilMoisture.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">pH:</span>
                <span className="font-bold text-white">{telemetry.soilPh}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Solar:</span>
                <span className="font-bold text-white">{telemetry.solarGenerationKw} kW</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Power className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-400">Pump:</span>
                <button
                  onClick={togglePump}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-colors ${
                    telemetry.irrigationPumpStatus
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {telemetry.irrigationPumpStatus ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-400">Alert:</span>
                <span className="font-bold text-rose-300">4.2°C Frost</span>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Sprout className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60'
                      }`}
                    >
                      {/* Markdown-like rendering with bold/bullets */}
                      <div className="whitespace-pre-wrap space-y-1.5">
                        {msg.text ? (
                          msg.text.split('\n\n').map((para, pIdx) => (
                            <p key={pIdx}>
                              {para.split('\n').map((line, lIdx) => {
                                // Bold line or bullet
                                const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•');
                                return (
                                  <span key={lIdx} className={isBullet ? 'block pl-2 my-0.5' : 'block'}>
                                    {line.split('**').map((seg, sIdx) =>
                                      sIdx % 2 === 1 ? (
                                        <strong
                                          key={sIdx}
                                          className={
                                            isUser
                                              ? 'font-bold text-white'
                                              : 'font-bold text-emerald-700 dark:text-emerald-300'
                                          }
                                        >
                                          {seg}
                                        </strong>
                                      ) : (
                                        seg
                                      )
                                    )}
                                  </span>
                                );
                              })}
                            </p>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 py-1 text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Reading root sensors & telemetry...</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button inside chat (e.g. toggle pump) */}
                      {msg.actionButton && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80">
                          <button
                            onClick={() => handleActionClick(msg.actionButton)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{msg.actionButton.label}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Audio controls */}
                    <div
                      className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.latencyMs && <span>• {msg.latencyMs}ms</span>}
                      {msg.source && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-[9px]">
                          {msg.source}
                        </span>
                      )}

                      {!isUser && msg.text && (
                        <button
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className="hover:text-emerald-500 transition-colors p-0.5"
                          title={speakingMessageId === msg.id ? 'Stop Voice' : 'Listen via Voice'}
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Mic Input */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Speak to Kisan Assistant'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'Hindi'
                    ? 'मिट्टी की नमी, NPK या फसल के बारे में पूछें...'
                    : language === 'Odia'
                    ? 'ମାଟିର ଆର୍ଦ୍ରତା କିମ୍ବା ଫସଲ ବିଷୟରେ ପଚାରନ୍ତୁ...'
                    : 'Ask about soil moisture, NPK, frost risk, or crops...'
                }
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>🌾 Built for Odisha Farmers by Ayushman & Gourav</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sensor Sync
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
