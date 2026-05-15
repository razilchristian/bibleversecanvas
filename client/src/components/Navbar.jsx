import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, BookOpen, Search, Home, Image, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VERSION_MAP } from '../services/bibleService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export default function Navbar() {
  const { darkMode, setDarkMode, version, setVersion } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/read', label: 'Read', icon: BookOpen },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/poster', label: 'Poster', icon: Image },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-custom bg-base/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0 relative z-10">
          <img src="/logo.png" alt="Verse Canva" className="w-8 h-8 object-contain" />
          <span className="font-display font-semibold text-lg text-primary tracking-tight">Verse Canva</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                location.pathname === to
                  ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400'
                  : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Version Selector */}
          <select
            value={version}
            onChange={e => setVersion(e.target.value)}
            className="hidden sm:block text-xs font-medium px-3 py-1.5 rounded-lg border border-custom bg-card text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition shadow-sm hover:border-brand-300"
            aria-label="Bible version"
          >
            {Object.entries(VERSION_MAP).map(([key, v]) => (
              <option key={key} value={key}>{v.short} — {v.name}</option>
            ))}
          </select>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="w-9 h-9 rounded-lg border border-custom bg-card flex items-center justify-center text-secondary hover:text-primary transition-all hover:border-brand-300 shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(m => !m)}
            className="md:hidden w-9 h-9 rounded-lg border border-custom bg-card flex items-center justify-center text-secondary shadow-sm"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-custom bg-base/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    location.pathname === to
                      ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400'
                      : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-custom mt-2">
                <select
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-custom bg-card text-primary focus:outline-none"
                >
                  {Object.entries(VERSION_MAP).map(([key, v]) => (
                    <option key={key} value={key}>{v.short} — {v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
