import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-sm border-b-2 border-dashed border-white/10 pb-2 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-transparent border-2 border-teal-400 p-2 rounded-lg text-teal-400 group-hover:bg-teal-400 group-hover:text-[#1a1a1a] transition-all duration-300 transform group-hover:rotate-12">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide group-hover:text-teal-400 transition-colors">TidyMind AI</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-xl text-gray-400">
          <a href="#" className="hover:text-white hover:underline decoration-wavy decoration-teal-400 underline-offset-4 transition-all hover:scale-105">How it Works</a>
          <a href="#" className="hover:text-white hover:underline decoration-wavy decoration-teal-400 underline-offset-4 transition-all hover:scale-105">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;