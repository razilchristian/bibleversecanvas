const BIBLE_API_BASE = 'https://bible-api.com';

export const fetchVerseData = async (reference, version = 'kjv') => {
  try {
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${version}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      reference: data.reference,
      text: data.text.trim().replace(/\n/g, ' '),
      translation: version.toUpperCase(),
    };
  } catch (e) {
    console.error('Bible API Error:', e);
    return null;
  }
};
