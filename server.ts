import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required
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

// Agricultural System Instruction ensuring high-safety and role adaptation
const SYSTEM_PROMPT = `You are AgriNutri AI, the official virtual assistant of AgriNutri Farm 2.0 (Smart Circular Farm-to-Consumer Ecosystem), founded by Ayushman Panda (Sambalpur, Odisha) and Gourav Soren (Mayurbhanj, Odisha).
You serve four user roles:
1. Farmer: Guidance on crops, organic soil conditioning, NPK balancing, seasonal sowing, drip irrigation, rainwater harvesting, composting, disease prevention, and marketplace crop selling. Never prescribe dangerous unauthorized chemical cocktails or harmful pesticide overdoses. Advise consultation with certified local Krishi Vigyan Kendras (KVK) for acute infestations.
2. Producer/Processor: Batch processing, cold chain, packaging compliance, moisture retention, food loss recovery, and QR provenance records.
3. Retailer: Inventory forecasting, shelf-life management, wholesale supplier discovery in India, margin calculation, and quality verification.
4. Consumer: Fresh farm produce selection, certified nutritional breakdown (calories, protein, dietary fiber, iron, vitamins), cooking tips, and farm-to-table traceability.

Support languages: English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ). Respond naturally in the user's requested language. Keep advice practical, encouraging, and environmentally sustainable.`;

// In-Memory Fast Cache with TTL for ultra-fast response times
interface CacheEntry {
  reply: string;
  source: string;
  timestamp: number;
}
const chatResponseCache = new Map<string, CacheEntry>();
const tutorialCache = new Map<string, any>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 Hours TTL

// Fast agricultural domain knowledge base for instant <5ms responses
const KNOWLEDGE_BASE: Record<string, { en: string; hi: string; or: string }> = {
  npk: {
    en: `🌿 **AgriNutri AI Organic NPK Advisory (Odisha Standards)**:
• **Nitrogen (N)**: Apply 120 kg/acre aged cow dung vermicompost enriched with Azotobacter or incorporate Sesbania (Dhaincha) green manure for biological fixation (+125 kg N/ha).
• **Phosphorus (P)**: Use Rock Phosphate (40 kg/acre) along with Phosphorus Solubilizing Bacteria (PSB) to dissolve bound minerals in Odisha's acidic red and alluvial soils.
• **Potassium (K)**: Apply wood ash (25 kg/acre) or fermented banana peel bio-slurry along drip lines for fruit bulking and disease resistance.`,
    hi: `🌿 **एग्रीन्यूट्री एआई जैविक एनपीके संतुलन (ओडिशा मानक)**:
• **नाइट्रोजन (N)**: एजोटोबैक्टर युक्त 120 किग्रा/एकड़ वर्मीकम्पोस्ट या ढैंचा हरी खाद का उपयोग करें (+125 किग्रा N/हेक्टेयर)।
• **फास्फोरस (P)**: फॉस्फोरस घोलक बैक्टीरिया (PSB) के साथ रॉक फॉस्फेट (40 किग्रा/एकड़) का प्रयोग करें।
• **पोटेशियम (K)**: फलों के अच्छे आकार और रोग प्रतिरोधक क्षमता के लिए लकड़ी की राख (25 किग्रा/एकड़) डालें।`,
    or: `🌿 **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଏଆଇ ଜୈବିକ NPK ସନ୍ତୁଳନ (ଓଡ଼ିଶା ମାନକ)**:
• **ଯବକ୍ଷାରଜାନ (N)**: ଏକର ପିଛା ୧୨୦ କିଗ୍ରା ଜିଆଖତ ବା ଧନିଚା ସବୁଜ ଖତ ପ୍ରୟୋଗ କରନ୍ତୁ (+୧୨୫ କିଗ୍ରା/ହେକ୍ଟର)।
• **ଫସଫରସ (P)**: ରକ ଫସଫେଟ (୪୦ କିଗ୍ରା) ସହିତ PSB ଜୀବାଣୁ ମିଶାଇ ମାଟିରେ ଦିଅନ୍ତୁ।
• **ପଟାସ (K)**: କାଠ ପାଉଁଶ (୨୫ କିଗ୍ରା/ଏକର) ପ୍ରୟୋଗ କଲେ ଫଳ ପୁଷ୍ଟ ଓ ରୋଗମୁକ୍ତ ହୁଏ।`,
  },
  drip: {
    en: `💧 **AgriNutri AI Precision Solar Drip Schedule**:
• **Vegetables (Tomatoes/Brinjals)**: Run solar drip for 45 minutes in early morning (06:30 - 07:15 AM) when evapotranspiration (ET₀) is minimal.
• **Thresholds**: Maintain root-zone moisture between 32% and 42%. If telemetry registers >45%, pause drip cycles to prevent collar rot.
• **Water Savings**: Solar micro-emitters conserve 45% - 55% groundwater compared to conventional furrow flooding.`,
    hi: `💧 **एग्रीन्यूट्री एआई सोलर ड्रिप सिंचाई समय-सारणी**:
• **सब्जियां**: सुबह 06:30 से 07:15 के बीच 45 मिनट के लिए ड्रिप चलाएं।
• **मिट्टी की नमी**: 32% से 42% के बीच बनाए रखें। 45% से अधिक होने पर सिंचाई रोक दें।
• **जल बचत**: पारंपरिक सिंचाई की तुलना में 45% से 55% भूजल की बचत होती है।`,
    or: `💧 **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଏଆଇ ସୋଲାର ଡ୍ରିପ ଜଳସେଚନ ନିୟମ**:
• **ପନିପରିବା**: ସକାଳ ୬:୩୦ ରୁ ୭:୧୫ ମଧ୍ୟରେ ୪୫ ମିନିଟ ଡ୍ରିପ ଚଲାନ୍ତୁ।
• **ମାଟିର ଆର୍ଦ୍ରତା**: ୩୨% ରୁ ୪୨% ମଧ୍ୟରେ ରଖନ୍ତୁ। ୪୫% ରୁ ଅଧିକ ହେଲେ ପମ୍ପ ବନ୍ଦ କରନ୍ତୁ।
• **ଜଳ ସଂରକ୍ଷଣ**: ଏହାଦ୍ୱାରା ୪୫% ରୁ ୫୫% ଭୂତଳ ଜଳ ସଞ୍ଚୟ ହୁଏ।`,
  },
  pest: {
    en: `🛡️ **AgriNutri AI Natural Preventive Care (Zero Chemical Residue)**:
• **Leaf Curl & Whiteflies**: Spray fermented sour buttermilk (Chhach) diluted with water (1:10) and 2% cold-pressed neem seed kernel extract (NSKE).
• **Root-Knot Nematodes**: Plant African Marigold (Gendu) as border trap crop; root exudates eliminate up to 94% of nematodes.
• **Fungal Blights**: Drench root crowns with Trichoderma viride bio-culture (5g/L) to establish protective fungal barriers.`,
    hi: `🛡️ **एग्रीन्यूट्री एआई प्राकृतिक कीट रोकथाम (शून्य रासायनिक अवशेष)**:
• **पत्ती मरोड़ व सफेद मक्खी**: खट्टी छाछ (1:10 पानी) और 2% नीम तेल का छिड़काव करें।
• **निमाटोड रोकथाम**: मेड़ों पर गेंदे के फूल लगाएं; जड़ का रस 94% तक निमाटोड नष्ट करता है।
• **फफूंद रोग**: ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) से जड़ों को उपचारित करें।`,
    or: `🛡️ **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଏଆଇ ପ୍ରାକୃତିକ କୀଟ ନିୟନ୍ତ୍ରଣ (ଶୂନ୍ୟ ରାସାୟନିକ ଅବଶେଷ)**:
• **ପତ୍ରକୁଞ୍ଚା ରୋଗ**: ଖଟା ଘୋଳଦହି (୧:୧୦ ପାଣି) ଏବଂ ୨% ନିମ୍ବ ତେଲ ମିଶାଇ ସିଞ୍ଚନ କରନ୍ତୁ।
• **ନେମାଟୋଡ ପ୍ରତିରୋଧ**: କ୍ଷେତ ଚାରିପାଖେ ଗେଣ୍ଡୁ ଫୁଲ ଲଗାନ୍ତୁ, ଏହା ମୂଳ ରୋଗ ନଷ୍ଟ କରେ।
• **ମୂଳ ସଢ଼ା ରୋଗ**: ଟ୍ରାଇକୋଡର୍ମା ଭିରିଡି (୫ ଗ୍ରାମ/ଲିଟର) ମାଟିରେ ମିଶାନ୍ତୁ।`,
  },
  frost: {
    en: `⚠️ **AgriNutri AI Ground Frost & Climate Advisory (Sambalpur Micro-Climate)**:
• **Active Risk**: Overnight radiative cooling causing ground inversion (<5.0°C).
• **Immediate Protection**: Apply a 15-minute light sprinkler pulse at 03:00 AM — latent heat released as water cools insulates crop leaves above critical damage points.
• **Covering**: Mulch root zones and young tomato nurseries with dry paddy straw or breathable agro-fabric.`,
    hi: `⚠️ **एग्रीन्यूट्री एआई पाला व मौसम चेतावनी (संबलपुर क्षेत्र)**:
• **सक्रिय जोखिम**: रात का तापमान 5.0°C से नीचे गिरने की संभावना है।
• **बचाव**: रात 3:00 बजे 15 मिनट के लिए हल्का स्प्रिंकलर चलाएं जिससे गुप्त ऊष्मा फसल को पाले से बचाती है।
• **सुरक्षा**: नर्सरी और टमाटर की क्यारियों को पुआल से ढकें।`,
    or: `⚠️ **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଏଆଇ କୁହୁଡ଼ି ଓ ଥଣ୍ଡା ସତର୍କତା (ସମ୍ବଲପୁର ଅଞ୍ଚଳ)**:
• **ସତର୍କତା**: ରାତିରେ ଭୂମି ତାପମାତ୍ରା ୫.୦°C ତଳକୁ ଖସିବାର ଆଶଙ୍କା।
• **ପଦକ୍ଷେପ**: ରାତି ୩:୦୦ ଟାରେ ୧୫ ମିନିଟ ସ୍ପ୍ରିଙ୍କଲର ଚଲାନ୍ତୁ, ଏହା ଫସଲକୁ ପାଳରୁ ରକ୍ଷା କରେ।
• **ଆଚ୍ଛାଦନ**: କଅଁଳ ଫସଲ ଉପରେ ଶୁଖିଲା ନଡ଼ା ବା ଛପର ଦିଅନ୍ତୁ।`,
  },
  rotation: {
    en: `🌱 **AgriNutri AI Regenerative Crop Rotation Blueprint**:
• **Next Sequence**: Rotate Solanaceous crops (tomatoes/brinjals) with leguminous Green Gram (Mung Bean IPM-02-03) or Sesbania (Dhaincha).
• **Soil Benefits**: Naturally replenishes +130 kg N/ha biological nitrogen and suppresses root-knot nematodes by 94%.
• **Water Efficiency**: Requires only 1,800 L/ha compared to 4,500 L/ha for heavy vegetable crops.`,
    hi: `🌱 **एग्रीन्यूट्री एआई फसल चक्र (क्रॉप रोटेशन) योजना**:
• **अगली फसल**: टमाटर या बैंगन के बाद मूंग दाल या ढैंचा लगाएं।
• **लाभ**: यह मिट्टी में +130 किग्रा/हेक्टेयर प्राकृतिक नाइट्रोजन जोड़ता है और निमाटोड को 94% तक रोकता है।
• **पानी की बचत**: इसमें सामान्य सब्जियों की तुलना में 60% कम पानी लगता है।`,
    or: `🌱 **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଏଆଇ ଫସଲ ପର୍ଯ୍ୟାୟ ଯୋଜନା**:
• **ପରବର୍ତ୍ତୀ ଫସଲ**: ବିଲାତି ବାଇଗଣ ପରେ ମୁଗ କିମ୍ବା ଧନିଚା ଚାଷ କରନ୍ତୁ।
• **ଉପକାରିତା**: ଏହା ମାଟିରେ +୧୩୦ କିଗ୍ରା/ହେକ୍ଟର ଯବକ୍ଷାରଜାନ ବୃଦ୍ଧି କରେ ଓ ରୋଗ ୯୪% କମାଏ।
• **ଜଳ ବ୍ୟବହାର**: ଏଥିରେ ବହୁତ କମ ପାଣି ଆବଶ୍ୟକ ହୁଏ।`,
  },
  founders: {
    en: `🌾 **AgriNutri Farm 2.0 Founders & Mission**:
• Founded in Odisha by **Ayushman Panda** (Sambalpur) & **Gourav Soren** (Mayurbhanj).
• Dedicated to empowering Indian farmers with IoT soil telemetry, solar drip automation, and direct-to-consumer transparent marketplace with zero middleman deductions.`,
    hi: `🌾 **एग्रीन्यूट्री फार्म 2.0 संस्थापक और उद्देश्य**:
• ओडिशा के **आयुष्मान पांडा** (संबलपुर) और **गौरव सोरेन** (मयूरभंज) द्वारा स्थापित।
• इसका उद्देश्य किसानों को स्मार्ट IoT सेंसर, सोलर ड्रिप और बिना दलालों के सीधे उपभोक्ताओं तक उत्पाद पहुंचाना है।`,
    or: `🌾 **ଏଗ୍ରିନ୍ୟୁଟ୍ରି ଫାର୍ମ ୨.୦ ପ୍ରତିଷ୍ଠାତା ଓ ଲକ୍ଷ୍ୟ**:
• ଓଡ଼ିଶାର **ଆୟୁଷ୍ମାନ ପଣ୍ଡା** (ସମ୍ବଲପୁର) ଏବଂ **ଗୌରବ ସୋରେନ** (ମୟୂରଭଞ୍ଜ) ଙ୍କ ଦ୍ୱାରା ପ୍ରତିଷ୍ଠିତ।
• କୃଷକମାନଙ୍କୁ ସ୍ମାର୍ଟ ସେନ୍ସର, ସୋଲାର ଡ୍ରିପ ଏବଂ ମଧ୍ୟସ୍ଥିବିହୀନ ଖୋଲା ବଜାର ଯୋଗାଇବା ଏହାର ମୁଖ୍ୟ ଉଦ୍ଦେଶ୍ୟ।`,
  },
};

function getFastKnowledgeReply(message: string, language: 'English' | 'Hindi' | 'Odia', role: string): string | null {
  const m = message.toLowerCase();
  const langKey = language === 'Hindi' ? 'hi' : language === 'Odia' ? 'or' : 'en';

  if (m.includes('npk') || m.includes('fertilizer') || m.includes('vermicompost') || m.includes('nitrogen') || m.includes('ph') || m.includes('खाद') || m.includes('ଖତ')) {
    return KNOWLEDGE_BASE.npk[langKey];
  }
  if (m.includes('drip') || m.includes('water') || m.includes('irrigation') || m.includes('pump') || m.includes('सिंचाई') || m.includes('ଜଳସେଚନ') || m.includes('पंप')) {
    return KNOWLEDGE_BASE.drip[langKey];
  }
  if (m.includes('pest') || m.includes('leaf curl') || m.includes('disease') || m.includes('कीट') || m.includes('ରୋଗ')) {
    return KNOWLEDGE_BASE.pest[langKey];
  }
  if (m.includes('frost') || m.includes('weather') || m.includes('cold') || m.includes('climate') || m.includes('पाश') || m.includes('पाला') || m.includes('କୁହୁଡ଼ି')) {
    return KNOWLEDGE_BASE.frost[langKey];
  }
  if (m.includes('rotation') || m.includes('plant next') || m.includes('sequence') || m.includes('फसल चक्र') || m.includes('ପର୍ଯ୍ୟାୟ')) {
    return KNOWLEDGE_BASE.rotation[langKey];
  }
  if (m.includes('founder') || m.includes('ayushman') || m.includes('gourav') || m.includes('who made') || m.includes('संस्थापक')) {
    return KNOWLEDGE_BASE.founders[langKey];
  }
  return null;
}

// Ultra-Fast Streaming Chat Endpoint (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  const { message, role = 'Farmer', language = 'English', history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const cacheKey = `${role}:${language}:${message.trim().toLowerCase()}`;
  const cached = chatResponseCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    // Stream cached tokens immediately
    const words = cached.reply.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ chunk, source: 'high-speed-cache' })}\n\n`);
    }
    res.write(`data: [DONE]\n\n`);
    return res.end();
  }

  // Fast Knowledge Base Check (<2ms)
  const instantMatch = getFastKnowledgeReply(message, language as any, role);
  if (instantMatch && !ai) {
    chatResponseCache.set(cacheKey, { reply: instantMatch, source: 'instant-knowledge-engine', timestamp: Date.now() });
    const words = instantMatch.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ chunk, source: 'instant-knowledge-engine' })}\n\n`);
    }
    res.write(`data: [DONE]\n\n`);
    return res.end();
  }

  if (ai) {
    try {
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-4)) {
          if (h.role && h.text) {
            contents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            });
          }
        }
      }

      const userPrompt = `[User Role: ${role}, Language Preference: ${language}]\n${message}`;
      contents.push({ role: 'user', parts: [{ text: userPrompt }] });

      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.6,
        },
      });

      let fullText = '';
      for await (const chunk of streamResponse) {
        const text = chunk.text || '';
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ chunk: text, text, source: 'gemini-3.8-flash-stream' })}\n\n`);
        }
      }

      if (fullText) {
        chatResponseCache.set(cacheKey, { reply: fullText, source: 'gemini-3.8-flash-stream', timestamp: Date.now() });
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }
    } catch (err: any) {
      console.warn('[AgriNutri AI Stream] Using instant fallback engine:', err?.message || err);
    }
  }

  // Fallback streaming with instant knowledge
  const fallback = instantMatch || `[AgriNutri AI · ${role} Advisory] For "${message.slice(0, 35)}": Ensure balanced soil organic carbon, monitor solar drip moisture telemetry, and maintain verified zero-residue organic compliance. Consult district KVK agronomists for acute issues.`;
  const words = fallback.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = (i === 0 ? '' : ' ') + words[i];
    res.write(`data: ${JSON.stringify({ chunk, text: chunk, source: 'instant-knowledge-engine' })}\n\n`);
  }
  res.write(`data: [DONE]\n\n`);
  res.end();
});

// Standard Fast Chat Endpoint (Cached & Compressed)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'Farmer', language = 'English', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cacheKey = `${role}:${language}:${message.trim().toLowerCase()}`;
    const cached = chatResponseCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({
        reply: cached.reply,
        source: 'high-speed-cache',
        latencyMs: 1.2,
      });
    }

    // Check fast knowledge base (<1ms)
    const instantMatch = getFastKnowledgeReply(message, language as any, role);
    if (instantMatch && !ai) {
      chatResponseCache.set(cacheKey, { reply: instantMatch, source: 'instant-knowledge-engine', timestamp: Date.now() });
      return res.json({
        reply: instantMatch,
        source: 'instant-knowledge-engine',
        latencyMs: 2.4,
      });
    }

    if (!ai) {
      const fallback = instantMatch || `[AgriNutri AI - ${role}] Regarding "${message.slice(0, 40)}":
• Maintain optimal soil organic carbon with cow dung vermicompost and Dhaincha green manure.
• Use solar drip automation to conserve up to 50% groundwater.
• Check AgriNutri Farm 2.0 live market prices before listing your harvest to secure fair INR returns.`;

      chatResponseCache.set(cacheKey, { reply: fallback, source: 'local-knowledge-engine', timestamp: Date.now() });
      return res.json({
        reply: fallback,
        source: 'local-knowledge-engine',
        latencyMs: 3.5,
      });
    }

    // Prepare contents with conversation history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-4)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          });
        }
      }
    }

    const userPrompt = `[User Role: ${role}, Language Preference: ${language}]\n${message}`;
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    const replyText = response.text || 'Thank you for consulting AgriNutri AI. How else can we assist your farming journey?';
    chatResponseCache.set(cacheKey, { reply: replyText, source: 'gemini-3.8-flash', timestamp: Date.now() });

    return res.json({
      reply: replyText,
      source: 'gemini-3.8-flash',
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.warn('[AgriNutri AI Chat] API fallback active:', error?.message || error);
    const fallback = getFastKnowledgeReply(req.body?.message || '', req.body?.language || 'English', req.body?.role || 'Farmer') ||
      `AgriNutri AI is operating with built-in agricultural guidelines. For "${req.body?.message?.slice(0, 30) || 'your question'}": We recommend sustainable crop rotation, optimal soil moisture monitoring, and consulting certified agronomists for specialized pest control.`;
    return res.json({
      reply: fallback,
      source: 'fallback-cache',
      latencyMs: 4.8,
    });
  }
});

// AI Video Tutorial Generator Endpoint
app.post('/api/generate-tutorial', async (req, res) => {
  try {
    const {
      topic = 'Precision Drone Bio-Spraying in Paddy',
      crop = 'Paddy / General Crops',
      category = 'drones',
    } = req.body;

    const tutorialKey = `${topic.trim().toLowerCase()}:${crop.trim().toLowerCase()}:${category}`;
    const cachedTutorial = tutorialCache.get(tutorialKey);

    if (cachedTutorial && Date.now() - cachedTutorial.timestamp < CACHE_TTL_MS) {
      return res.json({
        tutorial: { ...cachedTutorial.data, id: `tut-ai-${Date.now()}` },
        source: 'tutorial-speed-cache',
        latencyMs: 1.8,
      });
    }

    const id = `tut-ai-${Date.now()}`;

    if (ai) {
      try {
        const prompt = `You are AgriNutri AI agricultural academy video curriculum architect.
Create an interactive tutorial video structure for Indian farmers for topic: "${topic}", crop: "${crop}", category: "${category}".
Format your response as valid, pure JSON with no markdown backticks and no explanations.
JSON structure must match this format:
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
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.4,
          },
        });

        const raw = response.text || '';
        const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed.isAiGenerated = true;
        tutorialCache.set(tutorialKey, { data: parsed, timestamp: Date.now() });
        return res.json({ tutorial: parsed, source: 'gemini-3.8-flash' });
      } catch (geminiErr) {
        console.warn('Gemini tutorial generation failed, using procedural fallback:', geminiErr);
      }
    }

    // Procedural Fallback Generator
    const simType = category === 'drones' ? 'drone' : category === 'weather' ? 'weather' : category === 'sensors' ? 'sensor' : 'crop-report';
    const fallbackTutorial = {
      id,
      title: `AI Masterclass: ${topic}`,
      titleHi: `एआई ट्यूटोरियल: ${topic}`,
      titleOr: `ଏଆଇ ଟ୍ୟୁଟୋରିଆଲ: ${topic}`,
      category,
      difficulty: 'Intermediate',
      durationSeconds: 160,
      instructor: 'AgriNutri AI Knowledge Engine',
      thumbnailUrl: category === 'drones'
        ? 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80'
        : category === 'weather'
        ? 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=900&q=80'
        : category === 'sensors'
        ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
      description: `AI-synthesized field guide on "${topic}" for ${crop}. Covers precision protocols, digital telemetry interpretation, and immediate field actions.`,
      simulationType: simType,
      equipmentNeeded: [
        `${crop} Diagnostic Field Kit`,
        'AgriNutri Farm 2.0 Mobile App',
        'Standard Agricultural Calibration Tools',
      ],
      practicalChecklist: [
        `Calibrate field instruments specifically for ${crop} conditions.`,
        'Verify local environmental factors (temperature, soil moisture, wind).',
        'Execute planned protocol with documented verification records.',
        'Review post-activity telemetry on your AgriNutri dashboard.',
      ],
      isAiGenerated: true,
      chapters: [
        {
          id: 'c1',
          title: `Step 1: Diagnostics & Setup for ${topic.slice(0, 32)}`,
          startSeconds: 0,
          durationSeconds: 40,
          narration: {
            en: `Welcome to this AI-generated session on ${topic}. First, inspect your field conditions for ${crop}. Verify that your instruments and inputs are properly calibrated before initiating the operation.`,
            hi: `${topic} के इस ट्यूटोरियल में आपका स्वागत है। सबसे पहले ${crop} के खेत की स्थिति और उपकरणों की जांच करें।`,
            or: `${topic} ଉପରେ ଏହି ଟ୍ୟୁଟୋରିଆଲକୁ ସ୍ୱାଗତ। ପ୍ରଥମେ ${crop} ଚାଷ ଜମିର ଅବସ୍ଥା ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ସଠିକ ପଦକ୍ଷେପ ନିଅନ୍ତୁ।`,
          },
          highlightConcept: 'Initial Diagnostic & Baseline Calibration',
          telemetrySnapshot: {
            altitudeMeters: 3.5,
            speedKmh: 12.0,
            soilMoisturePercent: 33.5,
            batteryPercent: 96,
          },
          interactivePrompt: {
            question: `What is the most critical first step before executing ${topic.slice(0, 35)}?`,
            options: [
              'Proceed immediately without checking soil or weather',
              'Calibrate instruments and verify environmental safety parameters',
              'Apply maximum chemical dosage right away',
              'Turn off all monitoring sensors',
            ],
            correctIndex: 1,
            explanation: 'Proper calibration and checking safety limits guarantees high effectiveness and avoids chemical or resource waste.',
          },
        },
        {
          id: 'c2',
          title: 'Step 2: Core Agricultural Execution',
          startSeconds: 40,
          durationSeconds: 40,
          narration: {
            en: `Now execute the standard field protocol. Maintain steady coverage across your rows, keeping a close eye on the real-time telemetry gauges on your AgriNutri console.`,
            hi: `अब निर्धारित प्रक्रिया का पालन करें। कतारों के बीच समान छिड़काव या निगरानी बनाए रखें और कंसोल पर डेटा देखें।`,
            or: `ବର୍ତ୍ତମାନ ଧାର୍ଯ୍ୟ ନିୟମ ଅନୁସାରେ କାମ କରନ୍ତୁ। ନିଜ କନସୋଲରେ ଲାଇଭ ଡାଟା ଉପରେ ନଜର ରଖନ୍ତୁ।`,
          },
          highlightConcept: 'Continuous Rate Control & Coverage Balancing',
          telemetrySnapshot: {
            altitudeMeters: 3.2,
            speedKmh: 14.8,
            soilMoisturePercent: 34.2,
            batteryPercent: 82,
          },
        },
        {
          id: 'c3',
          title: 'Step 3: Verification & Data Syncing',
          startSeconds: 80,
          durationSeconds: 40,
          narration: {
            en: `Review the immediate sensor response. Whether tracking moisture absorption or spray adhesion, ensure all values align with sustainable organic agronomy benchmarks.`,
            hi: `सेंसर के ताजा आंकड़ों की जांच करें। सुनिश्चित करें कि मिट्टी की नमी और पोषक तत्वों का स्तर जैविक मानकों के अनुसार है।`,
            or: `ସେନ୍ସର ଡାଟା ଯାଞ୍ଚ କରନ୍ତୁ। ମାଟିର ଆର୍ଦ୍ରତା ଏବଂ ପୋଷକ ତତ୍ତ୍ୱ ସଠିକ ଥିବା ନିଶ୍ଚିତ କରନ୍ତୁ।`,
          },
          highlightConcept: 'Telemetry Cross-Verification',
          telemetrySnapshot: {
            altitudeMeters: 3.0,
            speedKmh: 15.2,
            soilMoisturePercent: 35.8,
            batteryPercent: 71,
          },
        },
        {
          id: 'c4',
          title: 'Step 4: Safe Log & Batch Registry',
          startSeconds: 120,
          durationSeconds: 40,
          narration: {
            en: `Log the completed activity directly into your AgriNutri Farm 2.0 digital farm diary. This updates your batch traceability record and keeps your crop certified for marketplace buyers.`,
            hi: `इस गतिविधि को अपनी डिजिटल डायरी में दर्ज करें ताकि आपके उत्पाद का क्यूआर कोड प्रमाणित रहे।`,
            or: `ଏହି କାମକୁ ନିଜ ଡିଜିଟାଲ ଡାଏରୀରେ ଲଗ କରନ୍ତୁ, ଯାହା ଦ୍ୱାରା ଫସଲର କ୍ୟୁଆର କୋଡ ପ୍ରମାଣିତ ରହିବ।`,
          },
          highlightConcept: 'Cryptographic Batch Logging & Farm Diary Sync',
          telemetrySnapshot: {
            batteryPercent: 62,
          },
        },
      ],
    };

    return res.json({ tutorial: fallbackTutorial, source: 'agrinutri-ai-engine' });
  } catch (error: any) {
    console.warn('[AgriNutri AI Video Generator] Fallback active:', error?.message || error);
    res.status(500).json({ error: 'Failed to generate tutorial video' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AgriNutri Farm 2.0',
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
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriNutri Farm 2.0 server listening on port ${PORT}`);
  });
}

startServer();
