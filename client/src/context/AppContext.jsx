import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('scripture-dark');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [version, setVersion] = useState(() =>
    localStorage.getItem('scripture-version') || 'KJV'
  );

  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentVerseRef: null,
    utterance: null,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('scripture-dark', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('scripture-version', version);
  }, [version]);

  const stopAudio = () => {
    speechSynthesis.cancel();
    setAudioState({ isPlaying: false, currentVerseRef: null, utterance: null });
  };

  const playVerse = (text, ref, lang = 'en') => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'gu' ? 'gu-IN' : 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    utterance.onend = () => {
      setAudioState({ isPlaying: false, currentVerseRef: null, utterance: null });
    };

    utterance.onerror = () => {
      setAudioState({ isPlaying: false, currentVerseRef: null, utterance: null });
    };

    speechSynthesis.speak(utterance);
    setAudioState({ isPlaying: true, currentVerseRef: ref, utterance });
  };

  const toggleAudio = (text, ref, lang) => {
    if (audioState.isPlaying && audioState.currentVerseRef === ref) {
      stopAudio();
    } else {
      playVerse(text, ref, lang);
    }
  };

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      version, setVersion,
      audioState, toggleAudio, stopAudio,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
