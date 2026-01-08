import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenOnboarding: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenOnboarding }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black sketch-shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white blob-shape flex items-center justify-center">
            <Sparkles size={20} className="fill-current" />
          </div>
          <h1 className="text-xl font-black text-black tracking-tight uppercase">TidyMind AI</h1>
        </div>
        <nav className="flex gap-4 text-sm font-bold text-gray-900">
          <button
            onClick={(e) => { e.preventDefault(); onOpenOnboarding(); }}
            className="flex items-center gap-2 hover:text-black hover:underline transition-all px-3 py-2 sm:px-4"
            title="How it Works"
          >
            <HelpCircle size={20} className="fill-current text-gray-200" />
            <span className="hidden sm:inline">How it Works</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;