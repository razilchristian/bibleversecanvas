import { getGujaratiChapter, getGujaratiVerse } from './services/gujaratiBibleService.js';

async function test() {
  try {
    const chapter = await getGujaratiChapter('John', 3);
    console.log(`Successfully fetched John 3. Found ${chapter.verses.length} verses.`);
    console.log('Verse 16:', chapter.verses.find(v => v.verse === 16)?.text);
    
    const verse = await getGujaratiVerse('Romans', 8, 28);
    console.log('Romans 8:28 ->', verse.text);
  } catch (e) {
    console.error(e);
  }
}

test();
