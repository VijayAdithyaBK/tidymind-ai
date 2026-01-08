import React from 'react';
import { AnalysisResult } from '../types';
import { Trash2 } from 'lucide-react';

interface HistoryItem {
    id: string;
    imageBase64: string;
    result: AnalysisResult;
    timestamp: number;
}

interface HistoryListProps {
    items: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onDelete }) => {
    if (items.length === 0) return null;

    return (
        <div className="mt-20 border-t-2 border-gray-100 pt-12">
            <h2 className="text-2xl font-black mb-8 text-black flex items-center gap-2">
                PAST MISSIONS
                <span className="text-sm font-medium bg-black text-white px-2 py-0.5 rounded-full">{items.length}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="sketch-border bg-white cursor-pointer overflow-hidden transition-all hover:sketch-shadow-hover sketch-shadow-sm group"
                        onClick={() => onSelect(item)}
                    >
                        <div className="relative aspect-square w-full overflow-hidden bg-black border-b-2 border-black">
                            <img
                                src={item.imageBase64}
                                alt={item.result.roomType}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xs sm:text-sm font-black text-black truncate uppercase tracking-tight">
                                    {item.result.roomType}
                                </h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                                    title="Delete"
                                >
                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold">
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
