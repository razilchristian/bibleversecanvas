import express from 'express';
import { translateToGujarati, findReferencesByKeyword, explainVerseText } from '../services/geminiService.js';
import { fetchVerseData } from '../services/bibleApiService.js';
import { getGujaratiChapter, getGujaratiVerse } from '../services/gujaratiBibleService.js';
import axios from 'axios';

const router = express.Router();

router.get('/verse', async (req, res) => {
  const { ref, version = 'kjv' } = req.query;
  if (!ref) return res.status(400).json({ error: 'Reference required' });

  try {
    if (version.toLowerCase() === 'guj') {
      const match = ref.match(/(.+?)\s+(\d+):(\d+)/);
      if (match) {
        const [, book, chap, v] = match;
        const verse = await getGujaratiVerse(book.trim(), parseInt(chap), parseInt(v));
        return res.json({ ...verse, isGujarati: true });
      } else {
        return res.status(400).json({ error: 'Invalid reference format for Gujarati. Use "Book Chapter:Verse"' });
      }
    }

    const { data } = await axios.get(`https://bible-api.com/${encodeURIComponent(ref)}?translation=${version}`);
    res.json({
      reference: data.reference,
      text: data.text.trim().replace(/\n/g, ' '),
      translation: version.toUpperCase(),
      verses: data.verses || [],
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to fetch verse' });
  }
});

router.get('/chapter', async (req, res) => {
  const { book, chapter, version = 'kjv' } = req.query;
  if (!book || !chapter) return res.status(400).json({ error: 'Book and chapter required' });

  try {
    if (version.toLowerCase() === 'guj') {
      const chapterData = await getGujaratiChapter(book, parseInt(chapter));
      return res.json({ ...chapterData, isGujarati: true });
    }

    const { data } = await axios.get(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${version}`);
    res.json({
      reference: data.reference,
      translation: version.toUpperCase(),
      verses: data.verses || [],
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to fetch chapter' });
  }
});

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
    const isReference = /\d/.test(q);
    
    if (version.toLowerCase() === 'guj') {
       if (isReference) {
         // Attempt to parse Gujarati search reference (e.g. John 3:16)
         const match = q.match(/([a-zA-Z]+|\u0A80-\u0AFF+)\s*(\d+):(\d+)/);
         if (match) {
             const [, book, chap, v] = match;
             const verse = await getGujaratiVerse(book.trim(), parseInt(chap), parseInt(v));
             return res.json([{ ...verse, isGujarati: true }]);
         }
       }
       // For keyword search in Gujarati, it's harder without a full DB.
       // We will still ask Gemini to find references!
    }

    let references = [];
    if (isReference) {
      references = [q];
    } else {
      references = await findReferencesByKeyword(q);
    }

    if (version.toLowerCase() === 'guj') {
       // Fetch the found references in Gujarati!
       const results = [];
       for (const ref of references) {
           const match = ref.match(/(.+?)\s+(\d+):(\d+)/);
           if (match) {
               try {
                 const [, book, chap, v] = match;
                 const verse = await getGujaratiVerse(book.trim(), parseInt(chap), parseInt(v));
                 results.push({ ...verse, isGujarati: true });
               } catch (err) {}
           }
       }
       return res.json(results);
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
