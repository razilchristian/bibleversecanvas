import { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { explainVerse } from '../services/aiService';
import { cn } from '../utils/cn';

export default function ExplainModal({ verse, onClose }) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGujarati = verse?.isGujarati || verse?.translation === 'GUJ';

  const load = async () => {
    if (!verse) return;
    setLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await explainVerse(verse.text, verse.reference, isGujarati ? 'gu' : 'en');
      setExplanation(result);
    } catch (e) {
      setError('Could not load explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [verse?.reference]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 modal-backdrop bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up sm:animate-fade-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-custom shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-scripture-500" />
            <h2 className="font-semibold text-primary">AI Explanation</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-custom hover:text-primary hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Verse Reference */}
        <div className="px-6 py-3 border-b border-custom bg-parchment-50 dark:bg-ink-800/40 shrink-0">
          <p className="text-sm font-medium text-scripture-600 dark:text-scripture-400">{verse?.reference}</p>
          <p className={cn(
            'text-sm text-secondary mt-0.5 line-clamp-2 font-serif italic',
            isGujarati && 'font-gujarati not-italic text-xs'
          )}>
            "{verse?.text}"
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-[120px]">
          {loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-custom">
                <Sparkles size={14} className="animate-pulse text-scripture-500" />
                <span>Generating explanation…</span>
              </div>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-4 rounded"
                  style={{ width: `${85 - i * 12}%` }}
                />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-3 text-red-500 dark:text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {explanation && !loading && (
            <p className="text-primary leading-relaxed text-[15px] font-serif animate-fade-in">
              {explanation}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-custom flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-custom">Powered by Claude AI</span>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
