import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

const BOOKS_ORDER = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export const getGujaratiChapter = async (bookName, chapterNum) => {
  const bookIndex = BOOKS_ORDER.findIndex(b => b.toLowerCase() === bookName.toLowerCase());
  if (bookIndex === -1) throw new Error('Book not found');
  
  const bookId = (bookIndex + 1).toString().padStart(2, '0');
  const cacheKey = `guj_${bookId}_${chapterNum}`;
  
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  try {
    const url = `https://www.wordproject.org/bibles/guj/${bookId}/${chapterNum}.htm`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    const $ = cheerio.load(response.data);
    const verses = [];
    
    $('.textBody p').each((_, el) => {
      // WordProject verses usually look like <span class="verse" id="1">1 </span> text
      $(el).find('.verse').each((_, verseSpan) => {
        const verseNum = $(verseSpan).text().trim();
        let text = $(verseSpan)[0].nextSibling ? $(verseSpan)[0].nextSibling.nodeValue : '';
        
        // Also grab subsequent text nodes and inline elements until the next .verse span
        let nextEl = $(verseSpan)[0].nextSibling;
        while (nextEl && (!nextEl.attribs || nextEl.attribs.class !== 'verse')) {
          if (nextEl !== $(verseSpan)[0].nextSibling) {
            text += $(nextEl).text ? $(nextEl).text() : (nextEl.nodeValue || '');
          }
          nextEl = nextEl.nextSibling;
        }
        
        if (text && text.trim()) {
          verses.push({
            verse: parseInt(verseNum, 10) || verses.length + 1,
            text: text.trim().replace(/\s+/g, ' ')
          });
        }
      });
    });

    if (verses.length === 0) {
        // Fallback parsing strategy if .verse doesn't capture everything correctly
        const fullText = $('.textBody').text();
        const parts = fullText.split(/(\d+)\s/g);
        let currentVerse = 0;
        let currentText = '';
        for (let i = 1; i < parts.length; i += 2) {
            const num = parseInt(parts[i], 10);
            if (num > 0 && num < 200) {
                if (currentVerse > 0) {
                    verses.push({ verse: currentVerse, text: currentText.trim().replace(/\s+/g, ' ') });
                }
                currentVerse = num;
                currentText = parts[i+1] || '';
            } else {
                currentText += parts[i] + ' ' + (parts[i+1] || '');
            }
        }
        if (currentVerse > 0) {
            verses.push({ verse: currentVerse, text: currentText.trim().replace(/\s+/g, ' ') });
        }
    }
    
    if (verses.length === 0) throw new Error('Failed to parse verses');
    
    const result = {
      reference: `${bookName} ${chapterNum}`,
      translation: 'GUJ',
      verses: verses
    };
    
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('WordProject Fetch Error:', error.message);
    throw new Error('Failed to fetch Gujarati chapter');
  }
};

export const getGujaratiVerse = async (bookName, chapterNum, verseNum) => {
  const chapter = await getGujaratiChapter(bookName, chapterNum);
  const verseData = chapter.verses.find(v => v.verse == verseNum);
  
  if (!verseData) throw new Error('Verse not found');
  
  return {
    reference: `${bookName} ${chapterNum}:${verseNum}`,
    text: verseData.text,
    translation: 'GUJ'
  };
};
