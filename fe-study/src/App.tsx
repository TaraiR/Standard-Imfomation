import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChapterPage from './pages/ChapterPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
        </Routes>
      </div>
      <footer className="site-footer">
        <p>基本情報技術者試験 学習サイト — 無料で学べる教材</p>
      </footer>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
