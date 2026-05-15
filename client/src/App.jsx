import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ReadPage from './pages/ReadPage';
import PosterPage from './pages/PosterPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-base">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/read" element={<ReadPage />} />
              <Route path="/poster" element={<PosterPage />} />
            </Routes>
          </main>
          <footer className="mt-16 py-12 text-center bg-[#002147] text-white">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
              <div className="flex justify-center mb-6">
                <img src="/logo.png" alt="Verse Canva" className="h-10 w-auto object-contain brightness-0 invert opacity-90" />
              </div>
              <p className="text-white/80 font-light mb-6">Read, Search & Share God's Word Beautifully</p>
              <div className="w-16 h-px bg-white/20 mb-6"></div>
              <p className="text-xs text-white/50">Verses from KJV, NIV, GUJ · AI Powered</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
