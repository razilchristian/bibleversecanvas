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
      console.error('Fetch error:', e);
      setError('Server waking up or unable to fetch verses.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [version]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Hero */}
      <div className="relative text-center mb-16 animate-fade-in flex flex-col items-center py-12 px-4 rounded-3xl overflow-hidden bg-gradient-to-b from-[#002147]/5 to-transparent border border-[#002147]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#002147]/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#002147] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full mb-8 shadow-sm border border-[#002147]/10 relative z-10">
          <span className="w-2 h-2 rounded-full bg-[#002147] animate-pulse"></span>
          Daily Reading
        </div>
        
        <div className="w-28 md:w-40 bg-white shadow-xl border border-[#002147]/10 p-3 rounded-2xl mb-8 relative z-10 flex items-center justify-center">
          <img src="/logo.png" alt="Verse Canva Logo" className="w-full h-auto object-contain" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-bold text-[#002147] dark:text-white leading-tight mb-4 tracking-tight drop-shadow-sm relative z-10">
          Verse Canva
        </h1>
        <p className="text-[#002147]/70 dark:text-white/70 text-lg sm:text-xl max-w-lg mx-auto font-sans font-light relative z-10">
          Read, Search & Share God's Word Beautifully
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
            <p className="text-xs text-secondary mt-4 animate-pulse">Connecting to server...</p>
          </div>
        )}

        {error && !loading && (
          <div className="card p-6 text-center text-secondary">
            <p className="mb-2 font-medium">{error}</p>
            <p className="text-xs text-muted-custom mb-4">Render free-tier servers spin down after inactivity and take up to 50 seconds to wake up.</p>
            <button onClick={() => load(true)} className="px-4 py-2 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-600 hover:bg-brand-200 transition-colors text-sm font-medium">
              Retry Connection
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
                'hover:border-brand-200 dark:hover:border-brand-800/50'
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
