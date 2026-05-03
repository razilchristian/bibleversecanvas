import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ].filter(Boolean),
}));
app.use(express.json());

const BIBLE_API = 'https://bible-api.com';

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Scripture API running ✦' });
});

// Search / fetch verse
app.get('/api/verse', async (req, res) => {
  const { q, version = 'kjv' } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const r = await fetch(`${BIBLE_API}/${encodeURIComponent(q)}?translation=${version}`);
    if (!r.ok) {
      return res.status(r.status).json({ error: r.status === 404 ? 'Verse not found' : 'API error' });
    }
    const d = await r.json();
    res.json({
      reference: d.reference,
      text: d.text.trim(),
      translation: version.toUpperCase(),
      verses: d.verses,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch verse' });
  }
});

// Verse of the Day (deterministic by day)
const VOTD_POOL = [
  'John 3:16', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13',
  'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 41:10', 'Matthew 11:28',
  'Romans 8:38', 'John 14:6', 'Ephesians 2:8', 'Psalm 46:1',
  '2 Timothy 1:7', 'Romans 12:2', 'Galatians 5:22', 'Joshua 1:9',
  '1 Corinthians 13:4', 'Hebrews 11:1', 'Philippians 4:6', 'John 10:10',
];

app.get('/api/verse/daily', async (req, res) => {
  const { version = 'kjv' } = req.query;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
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

app.listen(PORT, () => console.log(`Scripture server on :${PORT}`));
