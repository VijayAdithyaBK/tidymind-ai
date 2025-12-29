import React from 'react';
import { SavedAnalysis } from '../types';
import { Clock, Trash2, ArrowRight } from 'lucide-react';

interface HistoryListProps {
  items: SavedAnalysis[];
  onSelect: (item: SavedAnalysis) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 animate-slideUp">
      <div className="flex items-center gap-4 mb-8">
        <Clock className="text-teal-400" size={32} />
        <h2 className="text-4xl font-bold text-white tracking-wide">Past Cleanups</h2>
        <div className="h-1 bg-white/10 flex-grow rounded-full ml-4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <div 
            key={item.id}
            className="group relative bg-white p-3 pb-8 shadow-[0_5px_15px_rgba(0,0,0,0.3)] transform transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            style={{ 
              transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`,
            }}
          >
            {/* Tape Element */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/20 backdrop-blur-sm border border-white/30 transform rotate-1"></div>

            <div 
              onClick={() => onSelect(item)}
              className="relative aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer border border-gray-200"
            >
              <img 
                src={item.imageBase64} 
                alt={item.result.roomType} 
                className="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  View <ArrowRight size={16} />
                </div>
              </div>
            </div>

            <div className="mt-4 px-2">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-gray-800 font-handwriting leading-none">
                  {item.result.roomType}
                </h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-500 font-sans">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;