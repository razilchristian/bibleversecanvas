import express from 'express';
import { translateToGujarati, findReferencesByKeyword, explainVerseText } from '../services/geminiService.js';
import { fetchVerseData } from '../services/bibleApiService.js';

const router = express.Router();

// POST /api/translate
router.post('/translate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const translation = await translateToGujarati(text);
    res.json({ translation });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/search
router.get('/search', async (req, res) => {
  const { q, version = 'kjv' } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    // Check if it's a direct reference (e.g., John 3:16)
    const isReference = /\d/.test(q);
    
    let references = [];
    if (isReference) {
      references = [q];
    } else {
      // Keyword search using Gemini
      references = await findReferencesByKeyword(q);
    }

    const results = await Promise.all(
      references.map(ref => fetchVerseData(ref, version))
    );

    res.json(results.filter(Boolean));
  } catch (e) {
    console.error('Search Route Error:', e);
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST /api/explain
router.post('/explain', async (req, res) => {
  const { text, reference, lang } = req.body;
  if (!text || !reference) return res.status(400).json({ error: 'Text and reference required' });

  try {
    const explanation = await explainVerseText(text, reference, lang);
    res.json({ explanation });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
