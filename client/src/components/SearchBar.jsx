import { useState } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { cn } from '../utils/cn';

const QUICK_TOPICS = [
  'Love', 'Faith', 'Hope', 'Peace', 'Strength',
  'Courage', 'Grace', 'Wisdom', 'Joy', 'Prayer',
];

export default function SearchBar({ onSearch, onChange, loading, placeholder = 'Search verses, keywords, or references…' }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);
  };

  const handleClear = () => {
    setQuery('');
    if (onChange) onChange('');
  };

  const handleTopic = (topic) => {
    setQuery(topic);
    if (onChange) onChange(topic);
    onSearch(topic);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          'relative flex items-center bg-white dark:bg-black/40 border transition-all duration-300 rounded-2xl p-1.5 shadow-[0_2px_15px_rgb(0,0,0,0.03)]',
          focused ? 'border-[#002147]/30 ring-4 ring-[#002147]/10' : 'border-[#002147]/10 hover:border-[#002147]/20'
        )}>
          <div className="pl-4 pr-2 text-[#002147]/40 dark:text-white/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full pl-1 pr-20 py-3.5 bg-transparent text-primary placeholder:text-muted-custom rounded-2xl focus:outline-none text-sm font-medium"
            aria-label="Search Bible"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-muted-custom hover:text-primary transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002147] text-white text-sm font-semibold transition-all duration-300 disabled:opacity-50 shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {loading ? 'Searching' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Quick topics */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {QUICK_TOPICS.map(topic => (
          <button
            key={topic}
            onClick={() => handleTopic(topic)}
            className="text-xs font-medium px-4 py-1.5 rounded-full border border-[#002147]/10 bg-white dark:bg-black/20 text-[#002147]/70 dark:text-white/70 hover:text-[#002147] dark:hover:text-white hover:border-[#002147]/30 transition-all shadow-sm hover:shadow"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
