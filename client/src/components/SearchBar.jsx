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
          'relative flex items-center card transition-all duration-200',
          focused && 'ring-2 ring-brand-500/30'
        )}>
          <Search
            size={18}
            className="absolute left-4 text-muted-custom shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full pl-11 pr-20 py-3.5 bg-transparent text-primary placeholder:text-muted-custom rounded-2xl focus:outline-none text-sm"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-900 dark:bg-brand-500 dark:hover:bg-brand-600 text-white text-xs font-medium transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
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
            className="text-xs px-3 py-1 rounded-full border border-custom bg-card text-secondary hover:text-primary hover:border-brand-300 transition-all"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
