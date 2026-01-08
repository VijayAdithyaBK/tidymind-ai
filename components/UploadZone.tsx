import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, Camera, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
    onImageSelected: (file: File) => void;
    isAnalyzing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isAnalyzing }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) onImageSelected(e.target.files[0]);
    };

    return (
        <div
            className={`relative sketch-border bg-white w-full max-w-2xl mx-auto min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center 
        transition-all duration-300 cursor-pointer p-6 sm:p-10
        ${isDragging ? 'bg-gray-50 scale-[1.02] sketch-shadow-hover' : 'sketch-shadow hover:sketch-shadow-hover'}
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.[0]) onImageSelected(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileInput} />
            <input type="file" id="camera-upload" className="hidden" accept="image/*" capture="environment" onChange={handleFileInput} />

            {errorMessage && (
                <div className="absolute top-4 w-[90%] bg-black text-white py-2 px-4 rounded-lg font-bold text-center z-20 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col items-center text-center z-10 w-full group">
                <div className={`w-20 h-20 sm:w-28 sm:h-28 mb-6 sm:mb-8 blob-shape flex items-center justify-center transition-all duration-500
          ${isDragging ? 'bg-black text-white scale-110 rotate-12' : 'bg-black text-white group-hover:rotate-6'}
        `}>
                    {isAnalyzing ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} className="fill-current sm:w-10 sm:h-10" />}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 uppercase tracking-tight">
                    {isAnalyzing ? 'Analyzing...' : 'Drop Zone'}
                </h3>

                <p className="text-base sm:text-lg text-gray-500 font-medium mb-6 sm:mb-10 max-w-xs">
                    {isAnalyzing ? 'Decoding the chaos...' : 'Drag & drop your messy room here.'}
                </p>

                {!isAnalyzing && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 z-20 w-full sm:w-auto">
                        <button onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                            <ImageIcon size={18} /> Gallery
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); document.getElementById('camera-upload')?.click(); }} className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Camera size={18} /> Camera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadZone;
