const BASE_URL = 'https://bible-api.com';
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const VERSION_MAP = {
  KJV: { id: 'kjv', name: 'King James Version', short: 'KJV', lang: 'en' },
  WEB: { id: 'web', name: 'World English Bible', short: 'WEB', lang: 'en' },
  BBE: { id: 'bbe', name: 'Bible in Basic English', short: 'BBE', lang: 'en' },
  GUJ: { id: 'guj', name: 'ગુજરાતી બાઇબલ', short: 'GUJ', lang: 'gu' },
};

export async function fetchVerse(reference, version = 'KJV') {
  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${BASE_URL}/${encodeURIComponent(reference)}?translation=${versionId}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Verse not found. Try a reference like "John 3:16"');
    throw new Error('Failed to fetch verse.');
  }
  
  const data = await res.json();
  return {
    reference: data.reference,
    text: data.text.trim().replace(/\n/g, ' '),
    translation: versionId.toUpperCase(),
  };
}

export async function searchVerses(query, version = 'KJV') {
  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${SERVER_URL}/search?q=${encodeURIComponent(query)}&version=${versionId}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Search failed');
  }
  
  return await res.json();
}

export async function translateToGujarati(text) {
  const url = `${SERVER_URL}/translate`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Translation failed');
  }
  
  const data = await res.json();
  return data.translation;
}

const VERSE_OF_DAY_POOL = [
  'John 3:16', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13',
  'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 41:10', 'Matthew 11:28',
];

export async function fetchVerseOfDay(version = 'KJV') {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const ref = VERSE_OF_DAY_POOL[dayOfYear % VERSE_OF_DAY_POOL.length];
  return fetchVerse(ref, version);
}
