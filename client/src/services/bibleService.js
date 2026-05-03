// bible-api.com supports: kjv, web, bbe, darby, oeb-us, webbe, clementine, almeida, rccv
// For Gujarati, we use a curated dataset since no free API supports it fully

const BASE_URL = 'https://bible-api.com';

export const VERSION_MAP = {
  KJV: { id: 'kjv', name: 'King James Version', short: 'KJV', lang: 'en' },
  WEB: { id: 'web', name: 'World English Bible', short: 'WEB', lang: 'en' },
  BBE: { id: 'bbe', name: 'Bible in Basic English', short: 'BBE', lang: 'en' },
  GUJ: { id: 'guj', name: 'ગુજરાતી બાઇબલ', short: 'GUJ', lang: 'gu' },
};

// Gujarati verse dataset (curated popular verses)
const GUJARATI_VERSES = {
  'John 3:16': {
    reference: 'યોહાન 3:16',
    text: 'કારણ કે ઈશ્વરે જગત પર એટલી પ્રીતિ કરી, કે તેમણે પોતાનો એકનો એક દીકરો આપ્યો, એ માટે કે જે કોઈ તેના પર વિશ્વાસ કરે, તે નાશ ન પામે, પણ અનંતજીવન પ્રાપ્ત કરે.',
    en_reference: 'John 3:16',
  },
  'Jeremiah 29:11': {
    reference: 'યર્મિયા 29:11',
    text: 'કારણ કે હું તમારા માટે જે વિચારો ધરાવું છું તે જાણું છું, પ્રભુ ઘોષણા કરે છે, ભલાઈ માટેના વિચારો, દુષ્ટતા માટે નહીં, તમને ભવિષ્ય અને આશા આપવા.',
    en_reference: 'Jeremiah 29:11',
  },
  'Philippians 4:13': {
    reference: 'ફિલિપ્પીઓ 4:13',
    text: 'ખ્રિસ્ત દ્વારા જે મને સામર્થ્ય આપે છે, તેના વડે હું સઘળું કરી શકું છું.',
    en_reference: 'Philippians 4:13',
  },
  'Proverbs 3:5': {
    reference: 'નીતિવચનો 3:5',
    text: 'તારા હૃદયથી સંપૂર્ણ ભરોસો ઈશ્વર પર રાખ, અને તારી પોતાની સમજ પર આધાર ન રાખ.',
    en_reference: 'Proverbs 3:5',
  },
  'Isaiah 41:10': {
    reference: 'યશાયા 41:10',
    text: 'ભય ન પામ, કારણ હું તારી સાથે છું; ગભરા નહીં, કારણ હું તારો ઈશ્વર છું; હું તને સામર્થ્ય આપીશ, હા, હું તને સહાય કરીશ; હા, મારા ન્યાયી જમણા હાથ વડે હું તને ઉઠાવ ધરીશ.',
    en_reference: 'Isaiah 41:10',
  },
  'Psalm 23:1': {
    reference: 'ગીતશાસ્ત્ર 23:1',
    text: 'ઈશ્વર મારા પાળક છે; મને કોઈ ઘટ નહીં પડે.',
    en_reference: 'Psalm 23:1',
  },
  'Romans 8:28': {
    reference: 'રોમનો 8:28',
    text: 'અને આપણે જાણીએ છીએ, કે જેઓ ઈશ્વરને પ્રેમ કરે છે, એટલે જેઓ ઈશ્વરના ઉદ્દેશ અનુસાર બોલાવેલ છે, તેઓ સઘળી બાબતોમાં ભલું થાય માટે ઈશ્વર ભેળા મળી કામ કરે છે.',
    en_reference: 'Romans 8:28',
  },
  'Matthew 11:28': {
    reference: 'માત્થી 11:28',
    text: 'ઓ સઘળા થાકેલા અને ભારે ભારવાળા, મારી પાસે આવો, અને હું તમને વિસામો આપીશ.',
    en_reference: 'Matthew 11:28',
  },
  '1 Corinthians 13:4': {
    reference: '1 કોરીંથ 13:4',
    text: 'પ્રેમ સહનશીલ છે, પ્રેમ ઉપકારી છે; પ્રેમ ઇર્ષ્યા કરતો નથી; પ્રેમ ઘમંડ ધરાવતો નથી, ફૂલ્યો ફૂલ્યો ફરતો નથી.',
    en_reference: '1 Corinthians 13:4',
  },
  'Hebrews 11:1': {
    reference: 'હિબ્રૂ 11:1',
    text: 'હવે વિશ્વાસ એ ભાવિ આશા રાખવામાં આવેલ વસ્તુઓ માટે ખાતરી છે, અને ન જોઈ શકાતી બાબતોના પ્રમાણ.',
    en_reference: 'Hebrews 11:1',
  },
};

export async function fetchVerse(reference, version = 'KJV') {
  if (version === 'GUJ') {
    const gujVerse = GUJARATI_VERSES[reference];
    if (gujVerse) {
      return {
        reference: gujVerse.reference,
        text: gujVerse.text,
        translation: 'GUJ',
        isGujarati: true,
        en_reference: gujVerse.en_reference,
      };
    }
    // Fallback: fetch English and return with note
    const eng = await fetchVerse(reference, 'KJV');
    return { ...eng, gujaratiNote: 'Gujarati translation not available for this verse.' };
  }

  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const url = `${BASE_URL}/${encodeURIComponent(reference)}?translation=${versionId}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Verse not found. Try a reference like "John 3:16" or "Psalm 23:1"');
    throw new Error('Failed to fetch verse. Please try again.');
  }
  
  const data = await res.json();
  return {
    reference: data.reference,
    text: data.text.trim().replace(/\n/g, ' '),
    translation: versionId.toUpperCase(),
    verses: data.verses,
    book_id: data.verses?.[0]?.book_id,
    chapter: data.verses?.[0]?.chapter,
  };
}

export async function searchVerses(keyword, version = 'KJV') {
  if (version === 'GUJ') {
    // Search in Gujarati dataset
    const results = Object.entries(GUJARATI_VERSES)
      .filter(([, v]) => v.text.includes(keyword) || v.reference.includes(keyword))
      .map(([enRef, v]) => ({
        reference: v.reference,
        text: v.text,
        translation: 'GUJ',
        isGujarati: true,
        en_reference: enRef,
      }));
    return results;
  }

  // Use bible-api.com search - it doesn't have a search endpoint
  // We use a curated keyword→reference map for fast results
  const KEYWORD_MAP = {
    love: ['1 Corinthians 13:4-7', 'John 3:16', 'Romans 5:8', '1 John 4:8', 'John 15:13'],
    faith: ['Hebrews 11:1', 'Romans 10:17', 'Galatians 2:20', 'James 2:17', 'Ephesians 2:8'],
    hope: ['Romans 15:13', 'Jeremiah 29:11', 'Romans 5:4', 'Psalm 31:24', 'Lamentations 3:25'],
    peace: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3', 'Romans 15:13', 'Colossians 3:15'],
    strength: ['Philippians 4:13', 'Isaiah 41:10', 'Psalm 46:1', '2 Corinthians 12:9', 'Isaiah 40:31'],
    fear: ['Isaiah 41:10', 'Psalm 23:4', '2 Timothy 1:7', 'Psalm 27:1', '1 John 4:18'],
    grace: ['Ephesians 2:8', 'Romans 6:23', '2 Corinthians 12:9', 'Hebrews 4:16', 'Titus 2:11'],
    joy: ['Philippians 4:4', 'Psalm 16:11', 'Romans 15:13', 'James 1:2', 'Nehemiah 8:10'],
    wisdom: ['Proverbs 3:5', 'James 1:5', 'Proverbs 9:10', 'Ecclesiastes 12:13', 'Psalm 111:10'],
    prayer: ['Philippians 4:6', 'Matthew 7:7', '1 Thessalonians 5:17', 'Matthew 6:9-13', 'James 5:16'],
    salvation: ['Romans 6:23', 'John 3:16', 'Acts 4:12', 'Ephesians 2:8-9', 'Romans 10:9'],
    comfort: ['Psalm 23:4', '2 Corinthians 1:3', 'Matthew 11:28', 'Psalm 34:18', 'Revelation 21:4'],
    anxiety: ['Philippians 4:6-7', 'Matthew 6:25-27', '1 Peter 5:7', 'Psalm 55:22', 'Isaiah 41:10'],
    trust: ['Proverbs 3:5-6', 'Psalm 37:5', 'Isaiah 26:4', 'Psalm 9:10', 'Nahum 1:7'],
    forgiveness: ['Matthew 6:14-15', 'Ephesians 4:32', '1 John 1:9', 'Psalm 103:12', 'Colossians 3:13'],
    purpose: ['Jeremiah 29:11', 'Romans 8:28', 'Ephesians 2:10', 'Proverbs 19:21', 'Psalm 138:8'],
    courage: ['Joshua 1:9', 'Isaiah 41:10', 'Deuteronomy 31:6', 'Psalm 27:14', '2 Timothy 1:7'],
    light: ['John 8:12', 'Psalm 119:105', 'Isaiah 60:1', 'Matthew 5:14', '1 John 1:5'],
    truth: ['John 8:32', 'John 14:6', 'Psalm 119:160', 'John 17:17', 'Ephesians 4:15'],
    life: ['John 10:10', 'John 14:6', 'Romans 6:23', 'Galatians 2:20', 'Psalm 16:11'],
  };

  const lowerKeyword = keyword.toLowerCase();
  
  // Check keyword map first
  let refs = [];
  for (const [key, verses] of Object.entries(KEYWORD_MAP)) {
    if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
      refs = verses;
      break;
    }
  }

  // If looks like a reference (has number), try direct fetch
  if (refs.length === 0 || /\d/.test(keyword)) {
    try {
      const direct = await fetchVerse(keyword, version);
      return [direct];
    } catch {
      if (refs.length === 0) throw new Error(`No results found for "${keyword}". Try keywords like "love", "faith", "peace" or a reference like "John 3:16"`);
    }
  }

  const versionId = VERSION_MAP[version]?.id || 'kjv';
  const results = await Promise.allSettled(
    refs.slice(0, 6).map(ref =>
      fetch(`${BASE_URL}/${encodeURIComponent(ref)}?translation=${versionId}`)
        .then(r => r.json())
        .then(d => ({
          reference: d.reference,
          text: d.text.trim().replace(/\n/g, ' '),
          translation: versionId.toUpperCase(),
          keyword,
        }))
    )
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

const VERSE_OF_DAY_POOL = [
  'John 3:16', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13',
  'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 41:10', 'Matthew 11:28',
  'Romans 8:38', 'John 14:6', 'Ephesians 2:8', 'Psalm 46:1',
  '2 Timothy 1:7', 'Romans 12:2', 'Galatians 5:22', 'Joshua 1:9',
  '1 Corinthians 13:4', 'Hebrews 11:1', 'Philippians 4:6', 'John 10:10',
];

export async function fetchVerseOfDay(version = 'KJV') {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const ref = VERSE_OF_DAY_POOL[dayOfYear % VERSE_OF_DAY_POOL.length];
  return fetchVerse(ref, version);
}
