import { useState } from 'react';
import { Play, Pause, Copy, Share2, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export default function VerseCard({ verse, onExplain, showBadge = false, keyword = '' }) {
  const { audioState, toggleAudio } = useApp();
  const [copied, setCopied] = useState(false);

  if (!verse) return null;

  const isPlaying = audioState.isPlaying && audioState.currentVerseRef === verse.reference;
  const isGujarati = verse.isGujarati || verse.translation === 'GUJ';

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference} (${verse.translation})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `"${verse.text}" — ${verse.reference}`;
    if (navigator.share) {
      navigator.share({ title: 'Scripture Verse', text });
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const handleAudio = () => {
    toggleAudio(verse.text, verse.reference, isGujarati ? 'gu' : 'en');
  };

  // Highlight keyword in text
  const renderText = () => {
    if (!keyword || !keyword.trim()) return verse.text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = verse.text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="verse-highlight font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={cn(
      'card p-6 sm:p-8 group relative overflow-hidden transition-all duration-300',
      isPlaying && 'ring-2 ring-scripture-500/30'
    )}>
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-scripture-600 dark:text-scripture-400">
          <span className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-0.5 bg-scripture-500 rounded-full animate-pulse-soft"
                style={{
                  height: `${8 + i * 3}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </span>
          Playing
        </div>
      )}

      {/* Badge */}
      {showBadge && (
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-scripture-600 dark:text-scripture-400 accent-light-bg px-2.5 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-scripture-500"></span>
          Verse of the Day
        </div>
      )}

      {/* Translation Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-custom border border-custom px-2 py-0.5 rounded">
          {verse.translation}
        </span>
      </div>

      {/* Verse Text */}
      <blockquote className={cn(
        'relative mb-6',
        isPlaying && 'verse-playing'
      )}>
        <span className="absolute -top-2 -left-1 text-5xl text-parchment-300 dark:text-ink-800 font-serif leading-none select-none" aria-hidden>
          &ldquo;
        </span>
        <p className={cn(
          'text-xl sm:text-2xl font-serif leading-relaxed text-primary pl-4',
          isGujarati && 'font-gujarati text-lg sm:text-xl'
        )}>
          {renderText()}
        </p>
      </blockquote>

      {/* Reference */}
      <p className="font-medium text-secondary text-base mb-6">
        — {verse.reference}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleAudio}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border',
            isPlaying
              ? 'border-scripture-400 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400'
              : 'border-custom bg-card text-secondary hover:text-primary hover:border-scripture-300'
          )}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Listen'}
        </button>

        {onExplain && (
          <button
            onClick={onExplain}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-custom bg-card text-secondary hover:text-primary hover:border-scripture-300 transition-all"
          >
            <Sparkles size={14} />
            Explain
          </button>
        )}

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-custom bg-card text-secondary hover:text-primary hover:border-scripture-300 transition-all"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-custom bg-card text-secondary hover:text-primary hover:border-scripture-300 transition-all"
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  );
}
