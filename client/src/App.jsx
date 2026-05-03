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
          <footer className="border-t border-custom mt-16 py-8 text-center text-xs text-muted-custom bg-base">
            <p>Scripture — Built with care for the Word of God</p>
            <p className="mt-1">Verses from KJV, WEB, BBE · AI by Claude</p>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
