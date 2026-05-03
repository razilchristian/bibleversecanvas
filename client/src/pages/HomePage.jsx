import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Image, ChevronRight, RefreshCw } from 'lucide-react';
import { fetchVerseOfDay } from '../services/bibleService';
import { useApp } from '../context/AppContext';
import VerseCard from '../components/VerseCard';
import ExplainModal from '../components/ExplainModal';
import { cn } from '../utils/cn';

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Search by keyword, topic, or reference across all books',
    link: '/search',
    color: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Read the Bible',
    desc: 'Browse by book and chapter with audio playback',
    link: '/read',
    color: 'text-emerald-500',
  },
  {
    icon: Image,
    title: 'Verse Posters',
    desc: 'Create beautiful shareable verse images',
    link: '/poster',
    color: 'text-purple-500',
  },
];

export default function HomePage() {
  const { version } = useApp();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [explainVerse, setExplainVerse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (forceRefresh = false) => {
    forceRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const v = await fetchVerseOfDay(version);
      setVerse(v);
    } catch (e) {
      setError('Could not load Verse of the Day.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [version]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 text-xs font-medium accent px-3 py-1.5 rounded-full accent-light-bg mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-scripture-500 animate-pulse"></span>
          Daily Reading
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary leading-tight mb-4">
          Scripture
        </h1>
        <p className="text-secondary text-lg max-w-md mx-auto">
          Read, search, and explore the Bible with AI-powered insights.
        </p>
      </div>

      {/* Verse of the Day */}
      <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-primary">Verse of the Day</h2>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            New verse
          </button>
        </div>

        {loading && (
          <div className="card p-6 sm:p-8">
            <div className="skeleton h-4 w-24 rounded mb-6" />
            <div className="space-y-3 mb-6">
              <div className="skeleton h-6 rounded w-full" />
              <div className="skeleton h-6 rounded w-5/6" />
              <div className="skeleton h-6 rounded w-4/5" />
            </div>
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        )}

        {error && !loading && (
          <div className="card p-6 text-center text-secondary">
            <p>{error}</p>
            <button onClick={() => load()} className="mt-3 text-sm accent hover:underline">
              Try again
            </button>
          </div>
        )}

        {verse && !loading && (
          <VerseCard
            verse={verse}
            showBadge
            onExplain={() => setExplainVerse(verse)}
          />
        )}
      </section>

      {/* Features */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="font-semibold text-primary mb-4">Explore</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, link, color }) => (
            <Link
              key={link}
              to={link}
              className={cn(
                'card p-5 hover:shadow-md transition-all duration-200 group',
                'hover:border-scripture-200 dark:hover:border-scripture-800/50'
              )}
            >
              <div className={cn('mb-3', color)}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-primary mb-1 group-hover:accent transition-colors">
                {title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Explain Modal */}
      {explainVerse && (
        <ExplainModal
          verse={explainVerse}
          onClose={() => setExplainVerse(null)}
        />
      )}
    </div>
  );
}
