import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  Globe,
  Loader2,
  Sprout,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Trash2,
  Zap,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ChatMarkdown } from './ChatMarkdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  latencyMs?: number;
  source?: string;
  isStreaming?: boolean;
  isError?: boolean;
}

const WELCOME_TEXT =
  'Namaste! I am **AgriNutri AI** powered by **Gemini 4**. Ask me **anything** — from crop science, Odisha soil NPK, solar irrigation, market prices, nutrition & recipes, to math, science, coding, business, or everyday questions in English, Hindi, or Odia.';

export const AIAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    activeRole,
    showNotification,
    currentUser,
    telemetry,
    products,
    orders,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Odia'>('English');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleSendRef = useRef<(text?: string) => void>(() => {});

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('agrinutri_chat_history_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore storage errors
      }
    }
    return [
      {
        id: 'msg-init',
        role: 'model',
        text: WELCOME_TEXT,
        timestamp: 'Ready',
        source: 'gemini-4-hydrogen',
      },
    ];
  });

  useEffect(() => {
    setSelectedRole(activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        const cleanToSave = messages
          .filter((m) => !m.isStreaming && !m.isError)
          .slice(-16);
        sessionStorage.setItem('agrinutri_chat_history_v2', JSON.stringify(cleanToSave));
      } catch {
        // ignore storage errors
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Build live platform + farm context snapshot so Gemini 4 knows live state
  const buildLiveAppContext = useCallback(() => {
    const sampleProducts = products
      .slice(0, 6)
      .map((p) => `${p.title} (₹${p.price}/${p.unit}, Wholesale ₹${p.wholesalePrice}, Stock: ${p.stock} ${p.unit}, Origin: ${p.sellerLocation}, Batch: ${p.batchId})`)
      .join('; ');

    return [
      `Active User: ${currentUser.name} (${currentUser.farmName || 'AgriNutri Member'}) in ${currentUser.location || 'Odisha'}`,
      `Active Workspace Role: ${selectedRole}`,
      `Live Farm IoT Telemetry: Soil Moisture ${telemetry.soilMoisture.toFixed(1)}%, Soil pH ${telemetry.soilPh}, Nitrogen ${telemetry.soilNitrogen}, Rainfall (24h) ${telemetry.rainfallLast24h}mm, Solar Generation ${telemetry.solarGenerationKw} kW (Battery ${telemetry.solarBatteryCharge}%), Solar Drip Pump: ${telemetry.irrigationPumpStatus} (${telemetry.pumpRuntimeTodayHours}h today), Rainwater Tank: ${telemetry.rainwaterTankLevel}%, Compost Diverted: ${telemetry.compostWasteDivertedKg} kg, CO2 Offset: ${telemetry.co2OffsetTons}T.`,
      `Marketplace Catalog: ${products.length} total organic lots. Highlights: ${sampleProducts}.`,
      `Orders Tracked: ${orders.length} active/past orders.`,
    ].join('\n');
  }, [currentUser, selectedRole, telemetry, products, orders]);

  // Speech Recognition (uses ref so it never suffers stale closures)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      setIsListening(false);
      if (transcript) {
        setInputMessage(transcript);
        handleSendRef.current(transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showNotification('Voice input is supported in Chrome, Edge, and mobile browsers.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang =
        language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showNotification(`Listening in ${language}... Speak your question now.`);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showNotification('Audio text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';
    utterance.rate = 1.03;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    showNotification('Answer copied to clipboard.');
  };

  const handleStopGenerating = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  };

  const handleClearHistory = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: `Conversation cleared. Ask me **any question** in ${language} — farming, live sensors, nutrition, science, math, coding, or general knowledge!`,
        timestamp: 'Just now',
        source: 'gemini-4-hydrogen',
      },
    ]);
    sessionStorage.removeItem('agrinutri_chat_history_v2');
    showNotification('Chat history cleared.');
  };

  const roleSuggestions: Record<UserRole, string[]> = {
    Farmer: [
      'How to balance NPK organically for Sambalpur soil?',
      'Analyze my live soil moisture and pump status right now',
      'What Odisha government schemes can a 12-acre farmer apply for?',
      'Best organic remedy for tomato leaf curl & whiteflies?',
    ],
    Producer: [
      'How do I maintain 4°C cold-chain for leafy greens?',
      'Zero-plastic biodegradable packaging options for spices?',
      'How to calculate dehydration yield for Kandhamal turmeric?',
      'How to upcycle crop residue into high-value vermicompost?',
    ],
    Retailer: [
      'Which Odisha GI products have the best retail margins?',
      'How to minimize spoilage in fresh organic vegetables?',
      'Calculate profit margin if I buy at ₹26/kg and sell at ₹45/kg',
      'How to verify NPOP organic certificates on supplier batches?',
    ],
    Consumer: [
      'Nutritional benefits of Koraput Kala Jeera black rice?',
      'Give me a healthy high-protein Odisha millet breakfast recipe',
      'Difference between cold-pressed and refined mustard oil?',
      'How does QR batch traceability verify 0.00 ppm residue?',
    ],
    Admin: [
      'Summarize our active catalog and live farm telemetry',
      'Best KPIs to monitor for a circular agritech marketplace?',
      'How to design a fair commission model for smallholder farmers?',
      'Checklist for auditing new organic farm certifications',
    ],
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isLoading) return;

    const startTime = Date.now();
    const userMsgId = `usr-${Date.now()}`;
    const modelMsgId = `mod-${Date.now() + 1}`;
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const historyPayload = messages
      .filter((m) => m.id !== 'msg-init' && !m.isError && m.text.trim())
      .slice(-14)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text, timestamp: timeLabel },
      {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: timeLabel,
        isStreaming: true,
        source: 'gemini-4-hydrogen',
      },
    ]);
    setInputMessage('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const farmContext = buildLiveAppContext();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          role: selectedRole,
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
        const { value, done } = await reader.read();
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
                  m.id === modelMsgId
                    ? { ...m, text: accumulatedText, source: streamSource }
                    : m
                )
              );
            }
          } catch {
            // ignore incomplete/non-JSON comment lines
          }
        }
        if (streamError) break;
      }

      if (streamError && !accumulatedText) {
        throw new Error(streamError);
      }

      const totalLatency = Date.now() - startTime;
      setLastLatencyMs(totalLatency);

      if (!accumulatedText.trim()) {
        throw new Error('Empty response received from stream');
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === modelMsgId
            ? {
                ...m,
                text: accumulatedText,
                isStreaming: false,
                latencyMs: totalLatency,
                source: streamSource,
              }
            : m
        )
      );
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return;
      }

      // Automatic fallback to non-streaming /api/chat endpoint
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            role: selectedRole,
            language,
            history: historyPayload,
            farmContext,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }
        const latency = Date.now() - startTime;
        setLastLatencyMs(latency);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsgId
              ? {
                  ...m,
                  text: data.reply,
                  isStreaming: false,
                  latencyMs: latency,
                  source: data.source || 'gemini-4-hydrogen',
                }
              : m
          )
        );
      } catch (postErr: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsgId
              ? {
                  ...m,
                  text:
                    postErr?.message ||
                    'Could not connect to Gemini AI right now. Please try sending your question again.',
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

  if (!isAiModalOpen) {
    return (
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs shadow-2xl shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all group"
        title="Ask AgriNutri AI Anything (Powered by Gemini 4)"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-700 animate-pulse" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="font-extrabold text-xs leading-none">AgriNutri AI</span>
          <span className="text-[9px] text-emerald-200 font-mono mt-0.5 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            Gemini 4 · Ask Anything
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full h-[680px] max-h-[92vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">AgriNutri AI</h3>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Zap className="w-3 h-3 text-slate-950 fill-current" />
                  <span>GEMINI 4</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 flex items-center gap-2">
                <span>
                  Mode: <strong className="text-white">{selectedRole}</strong> · Universal Q&amp;A
                </span>
                {lastLatencyMs !== null && (
                  <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    {(lastLatencyMs / 1000).toFixed(1)}s
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative flex items-center gap-1 bg-emerald-950/60 border border-emerald-700/60 px-2 py-1 rounded-lg text-[11px]">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'English' | 'Hindi' | 'Odia')}
                className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="English" className="text-slate-900">English</option>
                <option value="Hindi" className="text-slate-900">हिन्दी (Hindi)</option>
                <option value="Odia" className="text-slate-900">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>

            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Adaptation Selector Bar */}
        <div className="px-4 py-2 bg-emerald-50/70 dark:bg-slate-800/80 border-b border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs overflow-x-auto gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide shrink-0">
            Advisory Role:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {(['Farmer', 'Producer', 'Retailer', 'Consumer', 'Admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedRole === r
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              {msg.role === 'model' && (
                <div
                  className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5 ${
                    msg.isError ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                >
                  {msg.isError ? <AlertCircle className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 rounded-tl-none border border-rose-200 dark:border-rose-800'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {msg.text ? (
                  <ChatMarkdown text={msg.text} isUser={msg.role === 'user'} />
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-0.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>Thinking with Gemini 4...</span>
                  </div>
                )}

                {msg.isStreaming && msg.text && (
                  <span className="inline-block w-1.5 h-3.5 bg-emerald-500 animate-pulse ml-0.5 align-middle" />
                )}

                {/* Footer metadata & voice/copy controls */}
                <div
                  className={`flex items-center justify-between text-[9px] pt-1.5 border-t ${
                    msg.role === 'user'
                      ? 'border-white/15 text-emerald-100'
                      : 'border-slate-100 dark:border-slate-700/70 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {msg.source && msg.role === 'model' && !msg.isError && (
                      <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400">
                        ⚡ {msg.source}
                      </span>
                    )}
                    {msg.latencyMs !== undefined && (
                      <span className="text-[9px] text-slate-400">
                        ({(msg.latencyMs / 1000).toFixed(1)}s)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.role === 'model' && msg.text && !msg.isStreaming && (
                      <>
                        <button
                          onClick={() => handleSpeakText(msg.text, msg.id)}
                          className="hover:text-emerald-600 transition-colors"
                          title={isSpeaking === msg.id ? 'Stop Speaking' : 'Listen via Voice'}
                        >
                          {isSpeaking === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyText(msg.text)}
                          className="hover:text-emerald-600 transition-colors"
                          title="Copy Answer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 scrollbar-none">
          {roleSuggestions[selectedRole]?.map((sug, i) => (
            <button
              key={i}
              disabled={isLoading}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-slate-200 dark:border-slate-700/80 shrink-0 flex items-center gap-1 disabled:opacity-50"
            >
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title={isListening ? 'Listening... Tap to stop' : `Voice Input in ${language}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask literally anything in ${language} — crops, sensors, science, math, recipes...`}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={handleStopGenerating}
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm flex items-center gap-1 font-bold text-xs"
              title="Stop Generating"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1 font-bold text-xs"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span>⚡ Powered by Gemini 4 Hydrogen · Live Farm Telemetry &amp; Universal Q&amp;A</span>
          <span>English · हिन्दी · ଓଡ଼ିଆ</span>
        </div>
      </div>
    </div>
  );
};
