import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { searchVerses } from '../services/bibleService';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import VerseCard from '../components/VerseCard';
import ExplainModal from '../components/ExplainModal';

export default function SearchPage() {
  const { version } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [explainVerse, setExplainVerse] = useState(null);

  const debouncedQuery = useDebounce(query, 500); // Using 500ms for Gemini-backed search to avoid over-fetching

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim().length > 2) {
      performSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  const performSearch = async (q) => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await searchVerses(q, version);
      setResults(res);
    } catch (e) {
      setError(e.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (q) => {
    setQuery(q);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Search</h1>
        <p className="text-secondary">
          Search by keyword (love, faith, peace) or reference (John 3:16)
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          onSearch={performSearch}
          onChange={handleQueryChange}
          loading={loading}
          placeholder="Search by keyword or reference…"
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-fade-in">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-20 rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="skeleton h-5 rounded" />
                <div className="skeleton h-5 rounded w-5/6" />
              </div>
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card p-5 flex items-start gap-3 text-red-500">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-custom">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query || debouncedQuery}"
          </p>
          {results.map((verse, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <VerseCard
                verse={verse}
                keyword={query || debouncedQuery}
                onExplain={() => setExplainVerse(verse)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {searched && !loading && results.length === 0 && !error && (
        <div className="text-center py-16 text-secondary animate-fade-in">
          <p className="text-4xl mb-4">📖</p>
          <p className="font-medium mb-1">No results found</p>
          <p className="text-sm text-muted-custom">Try a different keyword or reference</p>
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16 text-secondary animate-fade-in">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-medium mb-1">Search the Scriptures</p>
          <p className="text-sm text-muted-custom">
            Try "love", "faith", "Psalm 23:1", or "Philippians 4:13"
          </p>
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
