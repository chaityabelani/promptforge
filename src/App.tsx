import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TextPromptGenerator from './pages/TextPromptGenerator';
import ImagePromptGenerator from './pages/ImagePromptGenerator';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#F27D26] selection:text-black">
        <Header />
        <Routes>
          <Route path="/" element={<TextPromptGenerator />} />
          <Route path="/image-to-prompt" element={<ImagePromptGenerator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
