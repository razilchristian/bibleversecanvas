import { useState } from 'react';
import { Play, Pause, Copy, Share2, Sparkles, Check, Languages, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { translateToGujarati } from '../services/aiService';

export default function VerseCard({ verse, onExplain, showBadge = false, keyword = '' }) {
  const { audioState, toggleAudio } = useApp();
  const [copied, setCopied] = useState(false);
  const [gujaratiText, setGujaratiText] = useState(null);
  const [translating, setTranslating] = useState(false);

  if (!verse) return null;

  const isPlaying = audioState.isPlaying && audioState.currentVerseRef === verse.reference;
  const isGujarati = verse.isGujarati || verse.translation === 'GUJ';

  const handleCopy = () => {
    const textToCopy = gujaratiText 
      ? `"${verse.text}"\nGujarati: "${gujaratiText}"\n— ${verse.reference} (${verse.translation})`
      : `"${verse.text}" — ${verse.reference} (${verse.translation})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `"${verse.text}" ${gujaratiText ? `\n\nGujarati: "${gujaratiText}"` : ''} \n\n— ${verse.reference}`;
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

  const handleTranslate = async () => {
    if (gujaratiText) {
      setGujaratiText(null);
      return;
    }
    setTranslating(true);
    try {
      const result = await translateToGujarati(verse.text);
      setGujaratiText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  // Highlight keyword in text
  const renderText = (text) => {
    if (!keyword || !keyword.trim()) return text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
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
      'bg-white dark:bg-[#002147]/5 p-6 sm:p-10 group relative overflow-hidden transition-all duration-300 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#002147]/10 hover:shadow-[0_15px_40px_rgb(0,33,71,0.08)] hover:border-[#002147]/20',
      isPlaying && 'ring-2 ring-[#002147]/30'
    )}>
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
          <span className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-0.5 bg-brand-500 rounded-full animate-pulse-soft"
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
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 accent-light-bg px-2.5 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
          Verse of the Day
        </div>
      )}

      {/* Translation Badge */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-bold tracking-widest text-[#002147] dark:text-white/70 border border-[#002147]/20 dark:border-white/20 px-3 py-1 rounded-full uppercase shadow-sm bg-[#002147]/5 dark:bg-white/5">
          {verse.translation}
        </span>
      </div>

      {/* Verse Text */}
      <blockquote className={cn(
        'relative mb-8 mt-2',
        isPlaying && 'verse-playing'
      )}>
        <span className="absolute -top-6 -left-3 text-7xl text-[#002147]/10 dark:text-white/10 font-display leading-none select-none" aria-hidden>
          &ldquo;
        </span>
        <p className={cn(
          'text-2xl sm:text-3xl font-display leading-relaxed text-[#002147] dark:text-white relative z-10',
          isGujarati && 'font-gujarati text-xl sm:text-2xl'
        )}>
          {renderText(verse.text)}
        </p>
      </blockquote>

      {/* Gujarati Translation (Dynamic) */}
      {gujaratiText && (
        <div className="mb-6 p-4 rounded-xl bg-brand-50/50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 text-brand-600 dark:text-brand-400">
            <Languages size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Gujarati Translation</span>
          </div>
          <p className="font-gujarati text-lg text-primary leading-relaxed">
            {gujaratiText}
          </p>
        </div>
      )}

      {/* Reference */}
      <p className="font-sans font-medium text-[#002147]/70 dark:text-white/70 text-lg mb-8 flex items-center gap-2">
        <span className="w-6 h-px bg-[#002147]/30 dark:bg-white/30"></span> {verse.reference}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleAudio}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5',
            isPlaying
              ? 'bg-[#002147] text-white shadow-[0_4px_14px_rgba(0,33,71,0.25)]'
              : 'bg-white dark:bg-black/20 text-[#002147] dark:text-white border border-[#002147]/20 hover:border-[#002147]/40'
          )}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Listen'}
        </button>

        {!isGujarati && (
          <button
            onClick={handleTranslate}
            disabled={translating}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5',
              gujaratiText 
                ? 'bg-[#002147] text-white shadow-[0_4px_14px_rgba(0,33,71,0.25)]'
                : 'bg-white dark:bg-black/20 text-[#002147] dark:text-white border border-[#002147]/20 hover:border-[#002147]/40'
            )}
          >
            {translating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
            {gujaratiText ? 'Hide Gujarati' : 'Translate to Gujarati'}
          </button>
        )}

        {onExplain && (
          <button
            onClick={onExplain}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-[#002147]/20 bg-white dark:bg-black/20 text-[#002147] dark:text-white hover:border-[#002147]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Sparkles size={16} />
            Explain
          </button>
        )}

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-[#002147]/20 bg-white dark:bg-black/20 text-[#002147] dark:text-white hover:border-[#002147]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-[#002147]/20 bg-white dark:bg-black/20 text-[#002147] dark:text-white hover:border-[#002147]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}
