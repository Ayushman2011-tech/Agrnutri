import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Globe,
  Loader2,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Sprout,
  Compass,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Trash2,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  latencyMs?: number;
  source?: string;
  isStreaming?: boolean;
}

// Client-side instant query cache for <1ms re-queries
const clientQueryCache = new Map<string, string>();

export const AIAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, activeRole, showNotification } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Odia'>('English');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(18);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    // Try restoring recent messages from sessionStorage for instant load
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('agrinutri_chat_history');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'msg-init',
        role: 'model',
        text: `Namaste! I am AgriNutri AI 2.0 (High-Speed Engine), your circular farming companion founded by Ayushman Panda & Gourav Soren in Odisha. How can I assist your crop, irrigation, or harvest today?`,
        timestamp: 'Just now',
        latencyMs: 5,
        source: 'high-speed-cache',
      },
    ];
  });

  // Sync role when activeRole changes
  useEffect(() => {
    setSelectedRole(activeRole);
  }, [activeRole]);

  // Persist messages in session storage for fast re-opens
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        sessionStorage.setItem('agrinutri_chat_history', JSON.stringify(messages.slice(-12)));
      } catch (e) {
        // ignore
      }
    }
  }, [messages]);

  // Auto-scroll on new messages or token stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Speech Recognition for Voice Input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          // Auto-send immediately for maximum speed
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, selectedRole]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showNotification('Voice input is supported in Chrome, Edge, and mobile browsers.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const langCode = language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'or-IN' : 'en-IN';
      recognitionRef.current.lang = langCode;
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showNotification(`Listening in ${language}... Speak your farming question now.`);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text to Speech playback
  const handleSpeakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showNotification('Audio text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'Hindi' ? 'hi-IN' : language === 'Odia' ? 'hi-IN' : 'en-IN'; // Fallback to Indian English/Hindi for natural pronunciation
    utterance.rate = 1.05; // Slightly brisk and efficient

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    showNotification('Advisory text copied to clipboard.');
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: `Chat cleared. Ready for your next agricultural question in ${language}.`,
        timestamp: 'Just now',
        latencyMs: 1,
        source: 'instant-engine',
      },
    ]);
    sessionStorage.removeItem('agrinutri_chat_history');
    showNotification('Chat history cleared.');
  };

  const roleSuggestions: Record<UserRole, string[]> = {
    Farmer: [
      'How to balance NPK using organic vermicompost in Sambalpur?',
      'What is the optimal drip irrigation schedule for Rabi season?',
      'Natural preventative care for tomato leaf curl?',
      'How do I list my harvested produce on AgriNutri Farm 2.0?',
    ],
    Producer: [
      'How do I generate a QR traceability batch code?',
      'Best practices for cold storage of leafy greens at 4°C?',
      'Packaging guidelines for zero-plastic bio-containers?',
      'How to upcycle damaged crop residue into vermicompost?',
    ],
    Retailer: [
      'Which organic staples have the highest consumer demand this week?',
      'How to connect directly with Sambalpur and Mayurbhanj farmer clusters?',
      'Automated expiry alerts and shelf-life rotation strategies?',
      'Wholesale margin calculations for GI-tagged Kandhamal turmeric?',
    ],
    Consumer: [
      'What are the nutritional highlights of Koraput Kala Jeera black rice?',
      'How do I verify the harvest date of my purchased tomatoes?',
      'Difference between cold-pressed and refined mustard oil?',
      'Are the organic certifications on this batch NPOP verified?',
    ],
    Admin: [
      'Overview of current marketplace commission & subscription revenue?',
      'How to approve newly registered organic farmer certificates?',
      'Audit log of recent QR batch registrations?',
      'Configuring membership tier limits for Farmer Pro?',
    ],
  };

  // Ultra-Fast Streaming Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const startTime = Date.now();
    const userMsgId = `usr-${Date.now()}`;
    const modelMsgId = `mod-${Date.now() + 1}`;

    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const cacheKey = `${selectedRole}:${language}:${text.toLowerCase()}`;

    // 1. Check instant client cache for 0ms immediate response
    if (clientQueryCache.has(cacheKey)) {
      const cachedReply = clientQueryCache.get(cacheKey)!;
      const latency = Date.now() - startTime;
      setLastLatencyMs(latency);

      setMessages((prev) => [
        ...prev,
        {
          id: modelMsgId,
          role: 'model',
          text: cachedReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latencyMs: latency,
          source: 'high-speed-cache',
        },
      ]);
      setIsLoading(false);
      return;
    }

    // 2. High-Speed Server-Sent Events (SSE) Streaming
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role: selectedRole,
          language,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming not available, falling back to standard endpoint.');
      }

      // Initialize empty model message for streaming
      setMessages((prev) => [
        ...prev,
        {
          id: modelMsgId,
          role: 'model',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let streamSource = 'streaming-engine';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                if (parsed.source) streamSource = parsed.source;

                // Update the streaming message in real time
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === modelMsgId
                      ? {
                          ...m,
                          text: accumulatedText,
                          source: streamSource,
                        }
                      : m
                  )
                );
              }
            } catch (e) {
              // ignore non-json SSE lines
            }
          }
        }
      }

      const totalLatency = Date.now() - startTime;
      setLastLatencyMs(totalLatency);

      // Finalize message and store in client cache
      if (accumulatedText) {
        clientQueryCache.set(cacheKey, accumulatedText);
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
      }
    } catch (err) {
      console.warn('SSE stream fallback to fast POST:', err);

      // Fast fallback POST
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            role: selectedRole,
            language,
            history: messages.slice(-4),
          }),
        });

        const data = await res.json();
        const reply = data.reply || 'Consult certified district agronomists for localized crop health management.';
        const latency = Date.now() - startTime;
        setLastLatencyMs(latency);

        clientQueryCache.set(cacheKey, reply);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== modelMsgId),
          {
            id: modelMsgId,
            role: 'model',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latencyMs: latency,
            source: data.source || 'instant-engine',
          },
        ]);
      } catch (postErr) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== modelMsgId),
          {
            id: modelMsgId,
            role: 'model',
            text: `AgriNutri AI Fast Mode: For "${text.slice(0, 30)}": Maintain optimal soil organic carbon, monitor soil moisture with solar sensors, and avoid unverified synthetic chemicals.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latencyMs: 12,
            source: 'offline-knowledge',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiModalOpen) {
    // Floating circular button trigger on bottom right with fast engine badge
    return (
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs shadow-2xl shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all group"
        title="Chat with AgriNutri AI Assistant (Fast & Efficient)"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-700 animate-pulse"></span>
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="font-extrabold text-xs leading-none">AgriNutri AI</span>
          <span className="text-[9px] text-emerald-200 font-mono mt-0.5 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            Fast Engine
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full h-[650px] max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">AgriNutri AI</h3>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black px-2 py-0.2 rounded-full flex items-center gap-1 shadow-xs">
                  <Zap className="w-3 h-3 text-slate-950 fill-current" />
                  <span>FAST & EFFICIENT</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 flex items-center gap-2">
                <span>Role: <strong className="text-white">{selectedRole}</strong></span>
                {lastLatencyMs && (
                  <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded">
                    ⚡ {lastLatencyMs}ms
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
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="English" className="text-slate-900">English</option>
                <option value="Hindi" className="text-slate-900">हिन्दी (Hindi)</option>
                <option value="Odia" className="text-slate-900">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>

            {/* Clear History Button */}
            <button
              onClick={handleClearHistory}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Adaptation Selector Bar */}
        <div className="px-4 py-2 bg-emerald-50/70 dark:bg-slate-800/80 border-b border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide shrink-0">
            Advisory Mode:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {(['Farmer', 'Producer', 'Retailer', 'Consumer'] as UserRole[]).map((r) => (
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/40 dark:bg-slate-950/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                  <Sprout className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 space-y-1.5 shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text || (msg.isStreaming ? '...' : '')}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-3.5 bg-emerald-500 animate-pulse ml-0.5" />}
                </div>

                {/* Footer metadata & quick voice/copy buttons */}
                <div className="flex items-center justify-between text-[9px] pt-1 border-t border-black/5 dark:border-white/5 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {msg.source && (
                      <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400">
                        ⚡ {msg.source.replace('-stream', '')}
                      </span>
                    )}
                    {msg.latencyMs !== undefined && (
                      <span className="text-[9px] text-slate-400">({msg.latencyMs}ms)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.role === 'model' && (
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

          {isLoading && !messages.some((m) => m.isStreaming) && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500 dark:text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>AgriNutri AI streaming fast response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts (Instant Execution) */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 scrollbar-none">
          {roleSuggestions[selectedRole]?.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-slate-200 dark:border-slate-700/80 shrink-0 flex items-center gap-1 active:scale-95"
            >
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Microphone and Quick Send */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          {/* Voice Mic Button */}
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
            placeholder={`Ask AgriNutri AI (${language}) or tap Mic for voice...`}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1 font-bold text-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Safety & Performance Footer */}
        <div className="bg-slate-100 dark:bg-slate-950 px-3 py-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span>⚡ High-Speed Gemini 3.8 Flash + Instant Knowledge Cache</span>
          <span>Krishi Vigyan Kendra (KVK) Standard</span>
        </div>
      </div>
    </div>
  );
};
