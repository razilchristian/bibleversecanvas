const BASE_URL = 'https://bible-api.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SERVER_URL = `${API_URL}/api`;

export const VERSION_MAP = {
  KJV: { id: 'kjv', name: 'King James Version', short: 'KJV', lang: 'en' },
  WEB: { id: 'web', name: 'World English Bible', short: 'WEB', lang: 'en' },
  BBE: { id: 'bbe', name: 'Bible in Basic English', short: 'BBE', lang: 'en' },
  GUJ: { id: 'guj', name: 'ગુજરાતી બાઇબલ', short: 'GUJ', lang: 'gu' },
};

export async function fetchVerse(reference, version = 'KJV') {
  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${SERVER_URL}/verse?ref=${encodeURIComponent(reference)}&version=${versionId}`;
  
  console.log('[DEBUG] Fetching Verse:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('[DEBUG] Fetch Verse Failed:', res.status, res.statusText);
      if (res.status === 404) throw new Error('Verse not found. Try a reference like "John 3:16"');
      throw new Error('Failed to fetch verse.');
    }
    
    const data = await res.json();
    console.log('[DEBUG] Verse Data Response:', Object.keys(data));
    return {
      reference: data.reference,
      text: data.text?.trim().replace(/\n/g, ' ') || '',
      translation: versionId.toUpperCase(),
      verses: data.verses || [],
      isGujarati: data.isGujarati || false,
    };
  } catch (error) {
    console.error('[DEBUG] Fetch Verse Error Caught:', error.message);
    throw error;
  }
}

export async function fetchChapter(book, chapter, version = 'KJV') {
  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${SERVER_URL}/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&version=${versionId}`;
  
  console.log('[DEBUG] Fetching Chapter:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('[DEBUG] Fetch Chapter Failed:', res.status, res.statusText);
      throw new Error('Failed to fetch chapter.');
    }
    
    const data = await res.json();
    return {
      reference: data.reference,
      translation: versionId.toUpperCase(),
      verses: data.verses || [],
      isGujarati: data.isGujarati || false,
    };
  } catch (error) {
    console.error('[DEBUG] Fetch Chapter Error:', error.message);
    throw error;
  }
}

export async function searchVerses(query, version = 'KJV') {
  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${SERVER_URL}/search?q=${encodeURIComponent(query)}&version=${versionId}`;
  
  console.log('[DEBUG] Searching Verses:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('[DEBUG] Search Failed:', res.status, res.statusText);
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Search failed');
    }
    
    const data = await res.json();
    console.log(`[DEBUG] Search returned ${data.length} results.`);
    return data;
  } catch (error) {
    console.error('[DEBUG] Search Error:', error.message);
    throw error;
  }
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
