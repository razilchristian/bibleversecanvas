import { useState, useRef } from 'react';
import { Download, Palette, Type, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '../utils/cn';

const POSTER_BACKGROUNDS = [
  { id: 'dawn', cls: 'pg-dawn', name: 'Dawn' },
  { id: 'ocean', cls: 'pg-ocean', name: 'Ocean' },
  { id: 'forest', cls: 'pg-forest', name: 'Forest' },
  { id: 'rose', cls: 'pg-rose', name: 'Rose' },
  { id: 'night', cls: 'pg-night', name: 'Night' },
  { id: 'gold', cls: 'pg-gold', name: 'Gold' },
  { id: 'slate', cls: 'pg-slate', name: 'Slate' },
  { id: 'sage', cls: 'pg-sage', name: 'Sage' },
  {
    id: 'nature',
    cls: 'bg-cover bg-center',
    style: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800',
    name: 'Nature',
  },
  {
    id: 'sky',
    cls: 'bg-cover bg-center',
    style: 'https://images.unsplash.com/photo-1513002749550-c59d220b8e42?auto=format&fit=crop&q=80&w=800',
    name: 'Sky',
  },
  {
    id: 'mountains',
    cls: 'bg-cover bg-center',
    style: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    name: 'Mountains',
  },
  {
    id: 'stars',
    cls: 'bg-cover bg-center',
    style: 'https://images.unsplash.com/photo-1511884641892-0f6695b1dc47?auto=format&fit=crop&q=80&w=800',
    name: 'Stars',
  },
];

const FONTS = [
  { id: 'cormorant', cls: 'font-serif', name: 'Cormorant' },
  { id: 'playfair', cls: 'font-display', name: 'Playfair' },
  { id: 'dm-sans', cls: 'font-sans', name: 'DM Sans' },
];

export default function PosterGenerator({ verse }) {
  const [bg, setBg] = useState(POSTER_BACKGROUNDS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [textColor, setTextColor] = useState('light');
  const [downloading, setDownloading] = useState(false);
  const posterRef = useRef(null);

  const textCls = textColor === 'light' ? 'text-white' : 'text-slate-900';

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `scripture-${verse.reference.replace(/[\s:]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Poster Preview */}
      <div className="lg:col-span-3">
        <div
          ref={posterRef}
          className={cn(
            'relative w-full aspect-[3/4] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12',
            bg.cls
          )}
          style={bg.style ? { backgroundImage: `url(${bg.style})` } : {}}
        >
          {bg.style && (
            <div className="absolute inset-0 bg-black/40" />
          )}
          <div className="relative z-10 text-center max-w-sm">
            {/* Decorative */}
            <div className={cn('text-4xl mb-6 opacity-80', textCls)}>✦</div>

            {/* Verse Text */}
            <p className={cn(
              'text-xl sm:text-2xl leading-relaxed mb-6',
              font.cls,
              textCls,
              verse.isGujarati && 'font-gujarati text-lg'
            )}>
              "{verse.text}"
            </p>

            {/* Reference */}
            <p className={cn('text-base font-medium tracking-wide opacity-90', textCls)}>
              — {verse.reference}
            </p>

            {/* Translation badge */}
            <div className={cn(
              'inline-block mt-4 text-xs px-3 py-1 rounded-full border opacity-70',
              textColor === 'light'
                ? 'border-white/30 text-white'
                : 'border-black/20 text-slate-700'
            )}>
              {verse.translation}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2 uppercase tracking-wide">
            <Palette size={14} />
            Background
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {POSTER_BACKGROUNDS.map(b => (
              <button
                key={b.id}
                onClick={() => setBg(b)}
                title={b.name}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  b.cls,
                  bg.id === b.id ? 'border-scripture-500 scale-105 shadow-md' : 'border-transparent hover:scale-105'
                )}
                style={b.style ? {
                  backgroundImage: `url(${b.style})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {}}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2 uppercase tracking-wide">
            <Type size={14} />
            Font Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {FONTS.map(f => (
              <button
                key={f.id}
                onClick={() => setFont(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm border transition-all',
                  f.cls,
                  font.id === f.id
                    ? 'border-scripture-500 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400'
                    : 'border-custom bg-card text-secondary hover:text-primary'
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2 uppercase tracking-wide">
            Text Color
          </h3>
          <div className="flex gap-2">
            {['light', 'dark'].map(c => (
              <button
                key={c}
                onClick={() => setTextColor(c)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all',
                  textColor === c
                    ? 'border-scripture-500 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400'
                    : 'border-custom bg-card text-secondary hover:text-primary'
                )}
              >
                {c === 'light' ? <Sun size={13} /> : <Moon size={13} />}
                {c === 'light' ? 'White' : 'Dark'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-scripture-700 hover:bg-scripture-900 dark:bg-scripture-500 dark:hover:bg-scripture-600 text-white transition-all shadow-sm disabled:opacity-60"
        >
          <Download size={15} />
          {downloading ? 'Generating…' : 'Download Poster (PNG)'}
        </button>

        <p className="text-xs text-muted-custom text-center">
          High resolution 3x PNG — perfect for sharing
        </p>
      </div>
    </div>
  );
}
