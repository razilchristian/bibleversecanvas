import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Play, Pause, Sparkles, LayoutGrid } from 'lucide-react';
import { fetchChapter } from '../services/bibleService';
import { useApp } from '../context/AppContext';
import ExplainModal from '../components/ExplainModal';
import { cn } from '../utils/cn';
import { BIBLE_BOOKS } from '../data/bibleData';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadPage() {
  const { version, audioState, toggleAudio } = useApp();
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS.find(b => b.name === 'John'));
  const [chapter, setChapter] = useState(3);
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [explainVerse, setExplainVerse] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchChapter(selectedBook.name, chapter, version);
      setPassage(data);
    } catch (e) {
      setError(e.message || 'Failed to load chapter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [selectedBook, chapter, version]);

  const prevChapter = () => {
    if (chapter > 1) {
      setChapter(c => c - 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
      if (idx > 0) {
        setSelectedBook(BIBLE_BOOKS[idx - 1]);
        setChapter(BIBLE_BOOKS[idx - 1].chapters);
      }
    }
  };

  const nextChapter = () => {
    if (chapter < selectedBook.chapters) {
      setChapter(c => c + 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook.name);
      if (idx < BIBLE_BOOKS.length - 1) {
        setSelectedBook(BIBLE_BOOKS[idx + 1]);
        setChapter(1);
      }
    }
  };

  const isGujarati = version === 'GUJ';
  const lang = isGujarati ? 'gu' : 'en';

  // Play the whole chapter text
  const playChapter = () => {
    if (!passage) return;
    const text = passage.verses
      ? passage.verses.map(v => v.text).join(' ')
      : passage.text;
    toggleAudio(text, `${selectedBook.name} ${chapter}`, lang);
  };

  const isChapterPlaying = audioState.isPlaying && audioState.currentVerseRef === `${selectedBook.name} ${chapter}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-primary mb-1">Read</h1>
        <p className="text-secondary text-sm">Browse the Bible by book and chapter</p>
      </div>


      {/* Book Selector Toggle */}
      <div className="mb-6 animate-fade-in">
        <button
          onClick={() => setShowBookSelector(!showBookSelector)}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-custom rounded-xl shadow-sm text-primary hover:border-brand-400 transition-colors"
        >
          <LayoutGrid size={18} className="text-brand-500" />
          <span className="font-medium">Browse All 66 Books</span>
        </button>
      </div>

      <AnimatePresence>
        {showBookSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="card p-6 border border-custom shadow-sm bg-base/50 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-muted-custom uppercase tracking-wider mb-4 border-b border-custom pb-2">Old Testament</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(book => (
                      <button
                        key={book.name}
                        onClick={() => { setSelectedBook(book); setChapter(1); setShowBookSelector(false); }}
                        className={cn(
                          'text-xs px-2 py-1.5 rounded-md border text-left font-medium transition-all hover:border-brand-300',
                          selectedBook.name === book.name
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                            : 'border-transparent text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                        )}
                      >
                        {book.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-custom uppercase tracking-wider mb-4 border-b border-custom pb-2">New Testament</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(book => (
                      <button
                        key={book.name}
                        onClick={() => { setSelectedBook(book); setChapter(1); setShowBookSelector(false); }}
                        className={cn(
                          'text-xs px-2 py-1.5 rounded-md border text-left font-medium transition-all hover:border-brand-300',
                          selectedBook.name === book.name
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                            : 'border-transparent text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                        )}
                      >
                        {book.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="card px-4 py-3 mb-6 flex items-center justify-between animate-fade-in">
        <button
          onClick={prevChapter}
          className="flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors p-1"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <div className="flex items-center gap-3">
          <BookOpen size={16} className="text-muted-custom" />
          <span className="font-semibold text-primary text-sm">
            {selectedBook.name} {chapter}
          </span>
          <span className="text-xs text-muted-custom">/ {selectedBook.maxChapter}</span>
        </div>

        <button
          onClick={nextChapter}
          className="flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors p-1"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Chapter input */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-secondary">Jump to chapter:</span>
        <input
          type="number"
          min={1}
          max={selectedBook.maxChapter}
          value={chapter}
          onChange={e => {
            const v = parseInt(e.target.value);
            if (!isNaN(v) && v >= 1 && v <= selectedBook.maxChapter) setChapter(v);
          }}
          className="w-16 text-sm text-center px-2 py-1.5 border border-custom rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />

        <button
          onClick={playChapter}
          disabled={!passage}
          className={cn(
            'ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
            isChapterPlaying
              ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
              : 'border-custom bg-card text-secondary hover:text-primary'
          )}
        >
          {isChapterPlaying ? <Pause size={13} /> : <Play size={13} />}
          {isChapterPlaying ? 'Pause' : 'Listen to chapter'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-6 space-y-4 animate-fade-in">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-4 w-6 rounded" />
              <div className={cn('skeleton h-4 rounded flex-1', i % 3 === 0 && 'w-4/5')} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 text-center text-secondary">
          <p className="text-sm">{error}</p>
          <button onClick={load} className="mt-2 text-sm accent hover:underline">Retry</button>
        </div>
      )}

      {/* Passage */}
      {passage && !loading && (
        <div className="card p-6 sm:p-8 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-primary mb-6 pb-4 border-b border-custom">
            {selectedBook.name} {chapter}
            <span className="ml-2 text-sm font-sans font-normal text-muted-custom">({version})</span>
          </h2>

          {passage.verses ? (
            <div className="space-y-4">
              {passage.verses.map((v) => {
                const verseRef = `${selectedBook.name} ${chapter}:${v.verse}`;
                const isPlayingVerse = audioState.isPlaying && audioState.currentVerseRef === verseRef;
                return (
                  <div
                    key={v.verse}
                    className={cn(
                      'group flex gap-3 items-start py-2 rounded-lg px-2 transition-all',
                      isPlayingVerse && 'verse-playing',
                      'hover:bg-parchment-50 dark:hover:bg-ink-800/40'
                    )}
                  >
                    <span className="text-xs font-bold text-muted-custom mt-1 w-5 shrink-0 text-right">
                      {v.verse}
                    </span>
                    <p className={cn(
                      'text-primary leading-relaxed flex-1',
                      isGujarati ? 'font-gujarati text-base' : 'font-serif text-[17px]'
                    )}>
                      {v.text.trim()}
                    </p>
                    {/* Verse actions on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => toggleAudio(v.text, verseRef, lang)}
                        className={cn(
                          'p-1.5 rounded-md transition-colors',
                          isPlayingVerse
                            ? 'text-brand-500'
                            : 'text-muted-custom hover:text-primary'
                        )}
                        title="Listen to verse"
                      >
                        {isPlayingVerse ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                      <button
                        onClick={() => setExplainVerse({
                          reference: verseRef,
                          text: v.text.trim(),
                          translation: version,
                          isGujarati,
                        })}
                        className="p-1.5 rounded-md text-muted-custom hover:text-primary transition-colors"
                        title="Explain with AI"
                      >
                        <Sparkles size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={cn(
              'text-primary leading-relaxed font-serif text-lg',
              isGujarati && 'font-gujarati'
            )}>
              {passage.text}
            </p>
          )}
        </div>
      )}

      {explainVerse && (
        <ExplainModal
          verse={explainVerse}
          onClose={() => setExplainVerse(null)}
        />
      )}
    </div>
  );
}
