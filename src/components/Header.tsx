import React from 'react';
import { Wand2, Image as ImageIcon, Type } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="border-b border-white/10 px-8 py-6 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10 flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F27D26] to-[#FF4444] flex items-center justify-center">
          <Wand2 size={24} className="text-black" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight text-white">PromptForge</h1>
          <div className="text-[10px] uppercase tracking-widest text-[#F27D26] font-mono">
            Creative Generation
          </div>
        </div>
      </Link>
      
      <nav className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
        <Link 
          to="/" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            location.pathname === '/' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Type size={16} />
          Text to Prompt
        </Link>
        <Link 
          to="/image-to-prompt" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            location.pathname === '/image-to-prompt' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon size={16} />
          Image to Prompt
        </Link>
      </nav>
    </header>
  );
}
