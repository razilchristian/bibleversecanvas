import { useState, useRef, useEffect } from 'react';
import { Download, Palette, Type, Sun, Moon, Loader2, Upload, AlignLeft, AlignCenter, AlignRight, LayoutPanelTop, Layout, LayoutTemplate } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '../utils/cn';
import { translateToGujarati } from '../services/aiService';
import { fetchVerse } from '../services/bibleService';

const POSTER_BACKGROUNDS = [
  { id: 'dawn', cls: 'pg-dawn', name: 'Dawn' },
  { id: 'ocean', cls: 'pg-ocean', name: 'Ocean' },
  { id: 'forest', cls: 'pg-forest', name: 'Forest' },
  { id: 'rose', cls: 'pg-rose', name: 'Rose' },
  { id: 'night', cls: 'pg-night', name: 'Night' },
  { id: 'gold', cls: 'pg-gold', name: 'Gold' },
  { id: 'slate', cls: 'pg-slate', name: 'Slate' },
  { id: 'sage', cls: 'pg-sage', name: 'Sage' },
  { id: 'nature', cls: 'bg-cover bg-center', style: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800', name: 'Nature' },
  { id: 'sky', cls: 'bg-cover bg-center', style: 'https://images.unsplash.com/photo-1513002749550-c59d220b8e42?auto=format&fit=crop&q=80&w=800', name: 'Sky' },
  { id: 'mountains', cls: 'bg-cover bg-center', style: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', name: 'Mountains' },
  { id: 'stars', cls: 'bg-cover bg-center', style: 'https://images.unsplash.com/photo-1511884641892-0f6695b1dc47?auto=format&fit=crop&q=80&w=800', name: 'Stars' },
];

const FONTS = [
  { id: 'cormorant', cls: 'font-serif', name: 'Cormorant' },
  { id: 'playfair', cls: 'font-display', name: 'Playfair' },
  { id: 'dm-sans', cls: 'font-sans', name: 'DM Sans' },
];

const ORIENTATIONS = [
  { id: 'portrait', cls: 'aspect-[4/5] max-w-md', name: 'Portrait', icon: LayoutPanelTop },
  { id: 'square', cls: 'aspect-square max-w-lg', name: 'Square', icon: Layout },
  { id: 'landscape', cls: 'aspect-[4/3] max-w-2xl', name: 'Landscape', icon: LayoutTemplate },
];

export default function PosterGenerator({ verse }) {
  const [bg, setBg] = useState(POSTER_BACKGROUNDS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [font, setFont] = useState(FONTS[0]);
  const [textColor, setTextColor] = useState('light');
  const [textAlign, setTextAlign] = useState('center');
  const [fontSize, setFontSize] = useState(24);
  const [blurOverlay, setBlurOverlay] = useState(40);
  const [orientation, setOrientation] = useState(ORIENTATIONS[0]);
  const [downloading, setDownloading] = useState(false);
  
  // Translation states
  const [englishText, setEnglishText] = useState(verse.isGujarati ? '' : verse.text);
  const [gujaratiText, setGujaratiText] = useState(verse.isGujarati ? verse.text : '');
  const [translating, setTranslating] = useState(false);
  
  const posterRef = useRef(null);
  const fileInputRef = useRef(null);

  const textCls = textColor === 'light' ? 'text-white' : 'text-slate-900';

  useEffect(() => {
    if (!verse) return;

    const getTranslations = async () => {
      setTranslating(true);
      try {
        if (verse.isGujarati || verse.translation === 'GUJ') {
          setGujaratiText(verse.text);
          // Fetch English fallback
          try {
            const enRes = await fetchVerse(verse.reference, 'KJV');
            setEnglishText(enRes.text);
          } catch (e) {
            setEnglishText('English translation unavailable.');
          }
        } else {
          setEnglishText(verse.text);
          // Fetch real Gujarati Bible verse
          try {
            const gujRes = await fetchVerse(verse.reference, 'GUJ');
            setGujaratiText(gujRes.text);
          } catch (e) {
            // Fallback to Gemini
            console.log('Real Gujarati verse not found, falling back to AI...', e);
            const translation = await translateToGujarati(verse.text);
            setGujaratiText(translation);
          }
        }
      } finally {
        setTranslating(false);
      }
    };
    
    getTranslations();
  }, [verse]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    if (translating) return; // Prevent download while translating
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
      setBg({ id: 'custom', cls: 'bg-cover bg-center', style: imageUrl, name: 'Custom' });
    }
  };

  const alignCls = textAlign === 'center' ? 'items-center text-center' : textAlign === 'left' ? 'items-start text-left' : 'items-end text-right';
  
  // Smart text scaling based on length
  const totalLength = (englishText?.length || 0) + (gujaratiText?.length || 0);
  const lengthScaleFactor = totalLength > 250 ? 0.75 : totalLength > 150 ? 0.85 : 1;
  const finalFontSize = Math.floor(fontSize * lengthScaleFactor);
  const finalGujaratiSize = Math.max(Math.floor(finalFontSize * 0.85), 14);

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Poster Preview */}
      <div className="lg:col-span-7 flex justify-center items-center overflow-hidden py-4">
        <div
          ref={posterRef}
          className={cn(
            'relative w-full rounded-2xl overflow-hidden flex flex-col justify-center p-8 sm:p-12 shadow-2xl transition-all duration-300',
            bg.cls,
            orientation.cls
          )}
          style={bg.style ? { backgroundImage: `url(${bg.style})` } : {}}
        >
          {/* Overlay */}
          {(bg.style || customImage) && (
            <div className="absolute inset-0 bg-black transition-opacity" style={{ opacity: blurOverlay / 100 }} />
          )}
          
          <div className={cn("relative z-10 w-full flex flex-col h-full justify-center", alignCls)}>
            {/* Decorative */}
            <div className={cn('text-4xl mb-4 sm:mb-6 opacity-80', textCls)}>✦</div>

            {/* Bilingual Content Wrapper */}
            <div className={cn(
              "flex flex-col w-full",
              orientation.id === 'landscape' ? "gap-6 sm:gap-10" : "gap-4 sm:gap-6",
              alignCls
            )}>
              {/* English Verse Text (Primary) */}
              {englishText && (
                <p 
                  className={cn('leading-relaxed drop-shadow-md', font.cls, textCls)}
                  style={{ fontSize: `${finalFontSize}px` }}
                >
                  "{englishText}"
                </p>
              )}

              {/* Loading State */}
              {translating && (
                <div className={cn('flex items-center gap-2 text-sm opacity-80', textCls)}>
                  <Loader2 size={14} className="animate-spin" />
                  Loading bilingual text...
                </div>
              )}
              
              {!translating && gujaratiText && (
                <div className={cn('flex flex-col', alignCls, textCls)}>
                  {orientation.id !== 'landscape' && englishText && (
                    <div className={cn("h-[1px] bg-current opacity-30 mb-4 sm:mb-6", textAlign === 'center' ? 'w-12' : 'w-12')}></div>
                  )}
                  <p 
                    className="font-gujarati leading-relaxed drop-shadow-sm opacity-95"
                    style={{ fontSize: `${finalGujaratiSize}px` }}
                  >
                    {gujaratiText}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col items-center">
              {/* Reference */}
              <p className={cn('font-medium tracking-wide opacity-90', textCls, font.cls)} style={{ fontSize: `${Math.max(finalFontSize - 6, 14)}px` }}>
                — {verse.reference}
              </p>

              {/* Translation badge */}
              <div className={cn(
                'inline-block mt-3 text-xs px-3 py-1 rounded-full border opacity-70 font-sans uppercase tracking-widest',
                textColor === 'light' ? 'border-white/30 text-white' : 'border-black/20 text-slate-700'
              )}>
                {verse.translation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="lg:col-span-5 space-y-8 bg-card/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-custom shadow-sm max-h-[85vh] overflow-y-auto custom-scrollbar">
        
        {/* Background Section */}
        <div>
          <h3 className="text-sm font-semibold text-secondary mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Palette size={16} className="text-scripture-500" />
            Background
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {POSTER_BACKGROUNDS.map(b => (
              <button
                key={b.id}
                onClick={() => { setBg(b); setCustomImage(null); }}
                title={b.name}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105',
                  b.cls,
                  bg.id === b.id ? 'border-scripture-500 scale-105 shadow-md' : 'border-transparent'
                )}
                style={b.style ? { backgroundImage: `url(${b.style})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              />
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-custom bg-base hover:bg-parchment-50 dark:hover:bg-ink-800 transition-colors text-sm font-medium text-primary"
            >
              <Upload size={16} />
              Upload Custom Image
            </button>
          </div>
          
          {(bg.style || customImage) && (
            <div className="mt-4">
              <label className="text-xs text-secondary mb-2 flex justify-between">
                <span>Overlay Darkness</span>
                <span>{blurOverlay}%</span>
              </label>
              <input 
                type="range" min="0" max="90" value={blurOverlay} onChange={(e) => setBlurOverlay(e.target.value)}
                className="w-full accent-scripture-500"
              />
            </div>
          )}
        </div>

        {/* Layout & Typography Section */}
        <div className="pt-6 border-t border-custom">
          <h3 className="text-sm font-semibold text-secondary mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Layout size={16} className="text-scripture-500" />
            Layout & Font
          </h3>

          <div className="flex gap-2 mb-4">
            {ORIENTATIONS.map(o => {
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  onClick={() => setOrientation(o)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all text-xs font-medium',
                    orientation.id === o.id
                      ? 'border-scripture-500 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400 shadow-sm'
                      : 'border-custom bg-base text-secondary hover:text-primary hover:border-scripture-300'
                  )}
                >
                  <Icon size={18} />
                  {o.name}
                </button>
              );
            })}
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f)}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-xl text-sm border transition-all',
                    f.cls,
                    font.id === f.id
                      ? 'border-scripture-500 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400 shadow-sm'
                      : 'border-custom bg-base text-secondary hover:text-primary'
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-secondary mb-2 flex justify-between">
                  <span>Font Size</span>
                  <span>{fontSize}px</span>
                </label>
                <input 
                  type="range" min="16" max="44" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-scripture-500"
                />
              </div>
              
              <div className="flex bg-base rounded-lg border border-custom p-1 shadow-sm">
                <button onClick={() => setTextAlign('left')} className={cn("p-1.5 rounded-md transition-colors", textAlign === 'left' ? 'bg-scripture-100 dark:bg-scripture-900/50 text-scripture-700' : 'text-secondary')}><AlignLeft size={16}/></button>
                <button onClick={() => setTextAlign('center')} className={cn("p-1.5 rounded-md transition-colors", textAlign === 'center' ? 'bg-scripture-100 dark:bg-scripture-900/50 text-scripture-700' : 'text-secondary')}><AlignCenter size={16}/></button>
                <button onClick={() => setTextAlign('right')} className={cn("p-1.5 rounded-md transition-colors", textAlign === 'right' ? 'bg-scripture-100 dark:bg-scripture-900/50 text-scripture-700' : 'text-secondary')}><AlignRight size={16}/></button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {['light', 'dark'].map(c => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all font-medium',
                    textColor === c
                      ? 'border-scripture-500 bg-scripture-50 dark:bg-scripture-900/30 text-scripture-700 dark:text-scripture-400 shadow-sm'
                      : 'border-custom bg-base text-secondary hover:text-primary'
                  )}
                >
                  {c === 'light' ? <Sun size={15} /> : <Moon size={15} />}
                  {c === 'light' ? 'Light Text' : 'Dark Text'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-6 border-t border-custom">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-semibold text-base bg-scripture-600 hover:bg-scripture-700 dark:bg-scripture-500 dark:hover:bg-scripture-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60"
          >
            <Download size={18} />
            {downloading ? 'Generating High-Res Image…' : 'Download Poster (PNG)'}
          </button>
          <p className="text-xs text-muted-custom text-center mt-3">
            High resolution (3x) — perfect for sharing on social media
          </p>
        </div>
      </div>
    </div>
  );
}
