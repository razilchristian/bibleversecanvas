import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
  ].filter(Boolean),
}));
app.use(express.json());

const BIBLE_API = 'https://bible-api.com';

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Scripture API with Gemini running ✦' });
});

// Translate verse to Gujarati
app.post('/api/translate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const prompt = `Translate the following Bible verse into Gujarati. Keep it natural and accurate: \n\n"${text}"`;
    const result = await model.generateContent(prompt);
    const translation = result.response.text().trim();
    
    res.json({ translation });
  } catch (e) {
    console.error('Translation error:', e);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Smart Search / fetch verse
app.get('/api/search', async (req, res) => {
  const { q, version = 'kjv' } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    // Check if it's a direct reference (e.g., John 3:16)
    const isReference = /\d/.test(q);
    
    if (isReference) {
      const r = await fetch(`${BIBLE_API}/${encodeURIComponent(q)}?translation=${version}`);
      if (!r.ok) {
        return res.status(404).json({ error: 'Verse not found' });
      }
      const d = await r.json();
      return res.json([{
        reference: d.reference,
        text: d.text.trim().replace(/\n/g, ' '),
        translation: version.toUpperCase(),
      }]);
    }

    // Keyword search using Gemini to find references
    const prompt = `Act as a Bible search engine. Find exactly 5 most relevant Bible verse references for the keyword: "${q}". 
    Return ONLY the references in a JSON array format like this: ["John 3:16", "Romans 8:28"]. 
    No other text.`;
    
    const result = await model.generateContent(prompt);
    let references = [];
    try {
      const text = result.response.text();
      // Clean the text in case Gemini adds markdown
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      references = JSON.parse(cleaned);
    } catch (err) {
      console.error('Failed to parse Gemini references:', err);
      // Fallback references if AI fails
      references = ['John 3:16', 'Psalm 23:1'];
    }

    // Fetch the verses for these references
    const results = await Promise.all(
      references.slice(0, 5).map(async (ref) => {
        try {
          const r = await fetch(`${BIBLE_API}/${encodeURIComponent(ref)}?translation=${version}`);
          if (!r.ok) return null;
          const d = await r.json();
          return {
            reference: d.reference,
            text: d.text.trim().replace(/\n/g, ' '),
            translation: version.toUpperCase(),
          };
        } catch {
          return null;
        }
      })
    );

    res.json(results.filter(Boolean));
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Legacy endpoint support
app.get('/api/verse', async (req, res) => {
  const { q, version = 'kjv' } = req.query;
  try {
    const r = await fetch(`${BIBLE_API}/${encodeURIComponent(q)}?translation=${version}`);
    const d = await r.json();
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/verse/daily', async (req, res) => {
  const { version = 'kjv' } = req.query;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const VOTD_POOL = ['John 3:16', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13', 'Psalm 23:1'];
  const ref = VOTD_POOL[dayOfYear % VOTD_POOL.length];

  try {
    const r = await fetch(`${BIBLE_API}/${encodeURIComponent(ref)}?translation=${version}`);
    const d = await r.json();
    res.json({
      reference: d.reference,
      text: d.text.trim(),
      translation: version.toUpperCase(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(PORT, () => console.log(`Scripture server with Gemini on :${PORT}`));
