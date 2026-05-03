import { useState, useEffect } from 'react';
import { Image, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchVerseOfDay, fetchVerse } from '../services/bibleService';
import { useApp } from '../context/AppContext';
import PosterGenerator from '../components/PosterGenerator';
import SearchBar from '../components/SearchBar';

export default function PosterPage() {
  const { version } = useApp();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDefault = async () => {
    setLoading(true);
    setError('');
    try {
      const v = await fetchVerseOfDay(version);
      setVerse(v);
    } catch (e) {
      setError('Could not load verse.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDefault(); }, [version]);

  const handleSearch = async (q) => {
    setLoading(true);
    setError('');
    try {
      const v = await fetchVerse(q, version);
      setVerse(v);
    } catch (e) {
      setError(e.message || 'Verse not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Image size={20} className="text-scripture-500" />
          <h1 className="text-3xl font-display font-bold text-primary">Verse Poster</h1>
        </div>
        <p className="text-secondary">
          Create beautiful, shareable verse images to download or post on social media.
        </p>
      </div>

      {/* Search for a specific verse */}
      <div className="mb-8 animate-fade-in">
        <p className="text-sm text-secondary mb-3">Choose a verse for your poster:</p>
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          placeholder="Enter a reference like 'John 3:16'…"
        />
      </div>

      {error && (
        <div className="card p-4 mb-6 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {loading && (
        <div className="card p-8 animate-pulse">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="skeleton aspect-[3/4] rounded-2xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-4 w-24 rounded mb-2" />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="skeleton h-10 w-10 rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {verse && !loading && (
        <div className="animate-fade-in">
          <PosterGenerator verse={verse} />
        </div>
      )}
    </div>
  );
}
