const BASE_URL = 'https://bible-api.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SERVER_URL = `${API_URL}/api`;

export const VERSION_MAP = {
  KJV: { id: 'kjv', name: 'King James Version', short: 'KJV', lang: 'en' },
  NIV: { id: 'web', name: 'New International Version', short: 'NIV', lang: 'en' },
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
  { ref: 'John 3:16', fallback: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { ref: 'Jeremiah 29:11', fallback: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.' },
  { ref: 'Romans 8:28', fallback: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { ref: 'Philippians 4:13', fallback: 'I can do all things through Christ which strengtheneth me.' },
  { ref: 'Psalm 23:1', fallback: 'The Lord is my shepherd; I shall not want.' },
  { ref: 'Proverbs 3:5', fallback: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.' },
  { ref: 'Isaiah 41:10', fallback: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.' },
  { ref: 'Matthew 11:28', fallback: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
];

export async function fetchVerseOfDay(version = 'KJV') {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const verseObj = VERSE_OF_DAY_POOL[dayOfYear % VERSE_OF_DAY_POOL.length];
  
  try {
    return await fetchVerse(verseObj.ref, version);
  } catch (error) {
    console.error('[DEBUG] Verse of Day fetch failed, using fallback.', error);
    return {
      reference: verseObj.ref,
      text: verseObj.fallback,
      translation: version,
      verses: [],
      isGujarati: false
    };
  }
}
