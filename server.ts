import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with required User-Agent header
const rawKey = process.env.GEMINI_API_KEY?.trim();
const isValidApiKey = Boolean(
  rawKey &&
  rawKey !== 'MY_GEMINI_API_KEY' &&
  rawKey !== 'undefined' &&
  rawKey.length > 10 &&
  !rawKey.startsWith('MY_')
);

const ai = isValidApiKey
  ? new GoogleGenAI({
      apiKey: rawKey!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const PRIMARY_MODEL = 'gemini-4-hydrogen';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// Universal + Agritech System Instruction so AgriNutri AI answers EVERY question accurately
const SYSTEM_PROMPT = `You are AgriNutri AI, the high-intelligence assistant built into AgriNutri Farm 2.0 (Smart Circular Farm-to-Consumer Ecosystem), founded in Odisha, India by Ayushman Panda (Sambalpur) and Gourav Soren (Mayurbhanj).

Core Capabilities & Directives:
1. Answer EACH AND EVERY question the user asks thoroughly, accurately, and directly — no matter the topic. You are a universal expert across:
   - Agriculture, agronomy, Odisha & Indian crops, soil chemistry (NPK, pH, organic carbon, EC), solar drip irrigation, pest/disease IPM, weather/climate risks, crop rotation, livestock, and government schemes (PM-KISAN, KALIA, PMFBY, Soil Health Card).
   - Food science, nutrition, calories/macros, recipes, cold-chain storage, food safety (FSSAI/NPOP), and QR farm-to-table traceability.
   - General knowledge, mathematics, science, coding/software, business, economics, finance, history, geography, writing, translations, and everyday life questions.
   Never refuse a benign general-knowledge question by claiming you only answer farming questions.
2. Live Context Grounding: Whenever [LIVE FARM & APP CONTEXT] is supplied in the prompt, use those exact live numbers (soil moisture %, soil pH, NPK levels, solar kW, pump status, irrigation water budgets, weather alerts, active crop inventory, user role) to give razor-sharp, personalized answers.
3. Role Awareness: Tailor tone and depth to the user's active role (Farmer, Producer, Retailer, Consumer, or Admin) when the question relates to the platform.
4. Multilingual Fluency: Respond in the user's preferred language (English, Hindi / हिन्दी, or Odia / ଓଡ଼ିଆ), or naturally match whichever language the user writes in.
5. Clear Formatting: Use clean, scannable Markdown with **bold highlights**, structured bullet points, numbered steps, or code/formulas when helpful. Keep answers direct, rich in substance, and easy to read.
6. Agricultural Safety: Never prescribe illegal or dangerous unapproved chemical pesticide cocktails or unsafe dosages; recommend consulting local Krishi Vigyan Kendras (KVK) for acute field infestations.`;

interface HistoryMessage {
  role?: string;
  text?: string;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Normalizes multi-turn chat history for Gemini API:
 * - Filters out empty messages
 * - Drops leading model greetings (Gemini requires conversation to start with 'user')
 * - Merges consecutive same-role turns so roles strictly alternate user/model
 */
function buildConversationContents(
  history: HistoryMessage[],
  currentUserPrompt: string
): GeminiContent[] {
  const sanitized: GeminiContent[] = [];

  if (Array.isArray(history)) {
    const recent = history.slice(-16);
    for (const item of recent) {
      const text = typeof item?.text === 'string' ? item.text.trim() : '';
      if (!text) continue;
      const role: 'user' | 'model' = item.role === 'user' ? 'user' : 'model';

      // Conversation must start with a user turn
      if (sanitized.length === 0 && role === 'model') {
        continue;
      }

      const prev = sanitized[sanitized.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text += `\n\n${text}`;
      } else {
        sanitized.push({ role, parts: [{ text }] });
      }
    }
  }

  // Append current user turn (merging if the last history item was also user)
  const last = sanitized[sanitized.length - 1];
  if (last && last.role === 'user') {
    last.parts[0].text += `\n\n${currentUserPrompt}`;
  } else {
    sanitized.push({ role: 'user', parts: [{ text: currentUserPrompt }] });
  }

  return sanitized;
}

function formatUserPrompt(
  message: string,
  role: string,
  language: string,
  farmContext?: string
): string {
  const sections: string[] = [
    `[User Role: ${role} | Preferred Language: ${language}]`,
  ];
  if (farmContext && typeof farmContext === 'string' && farmContext.trim()) {
    sections.push(`[LIVE FARM & APP CONTEXT]\n${farmContext.trim()}`);
  }
  sections.push(`[USER QUESTION]\n${message.trim()}`);
  return sections.join('\n\n');
}

function formatFriendlyApiError(err: any): { status: number; message: string } {
  const rawMsg = String(err?.message || err || 'Unknown AI service error');
  if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('403')) {
    return {
      status: 403,
      message: 'The Gemini API key appears invalid or lacks permission. Please verify your API key in Settings > Secrets.',
    };
  }
  if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
    return {
      status: 429,
      message: 'The AI service is temporarily rate-limited. Please wait a few seconds and try again, or check your API quota in Settings > Secrets.',
    };
  }
  return {
    status: 502,
    message: `Unable to reach the Gemini AI engine right now (${rawMsg.slice(0, 140)}). Please try again in a moment.`,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const tutorialCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 Hours TTL

// High-Intelligence Streaming Chat Endpoint (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  const {
    message,
    role = 'Farmer',
    language = 'English',
    history = [],
    farmContext = '',
  } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const userPrompt = formatUserPrompt(message, role, language, farmContext);
  const contents = buildConversationContents(history, userPrompt);

  const modelsToTry = [PRIMARY_MODEL, PRIMARY_MODEL, FALLBACK_MODEL];
  let hasStreamedAnyToken = false;
  let lastError: any = null;

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    const modelName = modelsToTry[attempt];
    if (attempt > 0) {
      await sleep(attempt * 450);
    }

    try {
      const streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      for await (const chunk of streamResponse) {
        if (res.writableEnded) break;
        const text = chunk.text || '';
        if (text) {
          hasStreamedAnyToken = true;
          res.write(
            `data: ${JSON.stringify({
              chunk: text,
              text,
              source: modelName,
            })}\n\n`
          );
        }
      }

      if (hasStreamedAnyToken) {
        if (!res.writableEnded) {
          res.write(`data: [DONE]\n\n`);
          res.end();
        }
        return;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[AgriNutri AI Stream] Attempt ${attempt + 1} (${modelName}) failed:`, err?.message || err);
      // If partial text was already sent to client, close cleanly instead of duplicating
      if (hasStreamedAnyToken) {
        if (!res.writableEnded) {
          res.write(`data: [DONE]\n\n`);
          res.end();
        }
        return;
      }
    }
  }

  // Last-resort non-streaming call before surfacing error
  try {
    const response = await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });
    const text = response.text?.trim();
    if (text && !res.writableEnded) {
      res.write(`data: ${JSON.stringify({ chunk: text, text, source: FALLBACK_MODEL })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }
  } catch (finalErr: any) {
    lastError = finalErr;
    console.error('[AgriNutri AI Stream] Final fallback failed:', finalErr?.message || finalErr);
  }

  const friendly = formatFriendlyApiError(lastError);
  if (!res.writableEnded) {
    res.write(`data: ${JSON.stringify({ error: friendly.message })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

// Standard Non-Streaming Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const {
    message,
    role = 'Farmer',
    language = 'English',
    history = [],
    farmContext = '',
  } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    });
  }

  const userPrompt = formatUserPrompt(message, role, language, farmContext);
  const contents = buildConversationContents(history, userPrompt);
  const startTime = Date.now();

  const modelsToTry = [PRIMARY_MODEL, PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: any = null;

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    const modelName = modelsToTry[attempt];
    if (attempt > 0) {
      await sleep(attempt * 450);
    }

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const replyText = response.text?.trim();
      if (replyText) {
        return res.json({
          reply: replyText,
          source: modelName,
          latencyMs: Date.now() - startTime,
        });
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[AgriNutri AI Chat] Attempt ${attempt + 1} (${modelName}) failed:`, err?.message || err);
    }
  }

  const friendly = formatFriendlyApiError(lastError);
  return res.status(friendly.status).json({ error: friendly.message });
});

// AI Video Tutorial Generator Endpoint
app.post('/api/generate-tutorial', async (req, res) => {
  try {
    const {
      topic = 'Precision Drone Bio-Spraying in Paddy',
      crop = 'Paddy / General Crops',
      category = 'drones',
    } = req.body || {};

    const tutorialKey = `${topic.trim().toLowerCase()}:${crop.trim().toLowerCase()}:${category}`;
    const cachedTutorial = tutorialCache.get(tutorialKey);

    if (cachedTutorial && Date.now() - cachedTutorial.timestamp < CACHE_TTL_MS) {
      return res.json({
        tutorial: { ...cachedTutorial.data, id: `tut-ai-${Date.now()}` },
        source: 'tutorial-speed-cache',
        latencyMs: 2,
      });
    }

    const id = `tut-ai-${Date.now()}`;

    if (ai) {
      try {
        const prompt = `You are AgriNutri AI agricultural academy video curriculum architect.
Create an interactive tutorial video structure for Indian farmers for topic: "${topic}", crop: "${crop}", category: "${category}".
Format your response as valid JSON matching this schema exactly:
{
  "id": "${id}",
  "title": "Engaging descriptive title in English",
  "titleHi": "Title in Hindi",
  "titleOr": "Title in Odia",
  "category": "${category}",
  "difficulty": "Beginner",
  "durationSeconds": 160,
  "instructor": "AgriNutri AI Master Agronomist",
  "thumbnailUrl": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80",
  "description": "2-3 sentences explaining what the farmer will learn and master.",
  "simulationType": "${category === 'drones' ? 'drone' : category === 'weather' ? 'weather' : category === 'sensors' ? 'sensor' : 'crop-report'}",
  "equipmentNeeded": ["Equipment 1", "Equipment 2", "Equipment 3"],
  "practicalChecklist": ["Action 1", "Action 2", "Action 3", "Action 4"],
  "chapters": [
    {
      "id": "c1",
      "title": "Chapter 1 title",
      "startSeconds": 0,
      "durationSeconds": 40,
      "narration": {
        "en": "Spoken script in English for this chapter (2-3 sentences)",
        "hi": "Spoken script in Hindi (2-3 sentences)",
        "or": "Spoken script in Odia (2-3 sentences)"
      },
      "highlightConcept": "Core concept summary",
      "telemetrySnapshot": {
        "altitudeMeters": 3.5,
        "speedKmh": 12.0,
        "soilMoisturePercent": 34.0,
        "batteryPercent": 95
      },
      "interactivePrompt": {
        "question": "Practical quiz question for the farmer?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Why this answer is best for crop yields"
      }
    },
    {
      "id": "c2",
      "title": "Chapter 2 title",
      "startSeconds": 40,
      "durationSeconds": 40,
      "narration": {
        "en": "Spoken script in English for chapter 2",
        "hi": "Spoken script in Hindi for chapter 2",
        "or": "Spoken script in Odia for chapter 2"
      },
      "highlightConcept": "Core concept summary",
      "telemetrySnapshot": {
        "altitudeMeters": 3.2,
        "speedKmh": 14.5,
        "soilMoisturePercent": 32.5,
        "batteryPercent": 84
      }
    },
    {
      "id": "c3",
      "title": "Chapter 3 title",
      "startSeconds": 80,
      "durationSeconds": 40,
      "narration": {
        "en": "Spoken script in English for chapter 3",
        "hi": "Spoken script in Hindi for chapter 3",
        "or": "Spoken script in Odia for chapter 3"
      },
      "highlightConcept": "Core concept summary",
      "telemetrySnapshot": {
        "altitudeMeters": 3.5,
        "speedKmh": 15.0,
        "soilMoisturePercent": 35.0,
        "batteryPercent": 72
      }
    },
    {
      "id": "c4",
      "title": "Chapter 4 Summary & Field Protocol",
      "startSeconds": 120,
      "durationSeconds": 40,
      "narration": {
        "en": "Spoken script in English for chapter 4",
        "hi": "Spoken script in Hindi for chapter 4",
        "or": "Spoken script in Odia for chapter 4"
      },
      "highlightConcept": "Summary takeaway",
      "telemetrySnapshot": {
        "batteryPercent": 60
      }
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text || '';
        const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed.isAiGenerated = true;
        tutorialCache.set(tutorialKey, { data: parsed, timestamp: Date.now() });
        return res.json({ tutorial: parsed, source: PRIMARY_MODEL });
      } catch (geminiErr: any) {
        console.warn('[AgriNutri AI Video Generator] Gemini generation error:', geminiErr?.message || geminiErr);
        const friendly = formatFriendlyApiError(geminiErr);
        return res.status(friendly.status).json({ error: friendly.message });
      }
    }

    return res.status(503).json({
      error: 'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    });
  } catch (error: any) {
    console.error('[AgriNutri AI Video Generator] Unexpected error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to generate tutorial video' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'AgriNutri Farm 2.0',
    model: PRIMARY_MODEL,
    geminiConfigured: !!ai,
    founders: ['Ayushman Panda (Sambalpur, Odisha)', 'Gourav Soren (Mayurbhanj, Odisha)'],
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriNutri Farm 2.0 server listening on port ${PORT} (${PRIMARY_MODEL})`);
  });
}

startServer();
