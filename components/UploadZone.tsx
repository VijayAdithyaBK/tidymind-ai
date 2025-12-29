import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, Camera, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
}

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    setErrorMessage(null);

    // 1. Check File Type
    // Allow images only
    const isImage = file.type.startsWith('image/');

    if (!isImage) {
      setErrorMessage("Unsupported file type. Please use JPG or PNG.");
      return false;
    }

    // 2. Check File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${(file.size / (1024*1024)).toFixed(1)}MB). Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }

    return true;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isAnalyzing) {
        setIsDragging(true);
        if (errorMessage) setErrorMessage(null);
    }
  }, [isAnalyzing, errorMessage]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isAnalyzing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onImageSelected(file);
      }
    }
  }, [onImageSelected, isAnalyzing, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onImageSelected(file);
      }
    }
    // Reset value to allow re-selection
    e.target.value = '';
  }, [onImageSelected, validateFile]);

  const handleClick = (e: React.MouseEvent) => {
      // Trigger gallery upload when clicking container, but rely on stopPropagation for buttons
      document.getElementById('file-upload')?.click();
  }

  return (
    <div 
      className={`relative group w-full max-w-3xl mx-auto min-h-[350px] flex flex-col items-center justify-center 
        border-[3px] border-dashed rounded-[2rem] transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-teal-400 bg-white/5 scale-105 shadow-[0_0_30px_rgba(45,212,191,0.3)]' 
          : errorMessage 
            ? 'border-red-400/50 bg-red-500/5' 
            : 'border-white/30 hover:border-teal-400/70 hover:bg-white/5 hover:scale-[1.01]'
        }
        ${isAnalyzing ? 'pointer-events-none opacity-80' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileInput} 
      />
      
      {/* Camera Input - capture="environment" forces the rear camera on mobile */}
      <input 
        type="file" 
        id="camera-upload" 
        className="hidden" 
        accept="image/*"
        capture="environment"
        onChange={handleFileInput} 
      />

      {/* Error Message Toast inside Dropzone */}
      {errorMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md animate-popIn">
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg backdrop-blur-md">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <span className="font-bold text-sm sm:text-base">{errorMessage}</span>
            </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center p-10 z-10 w-full">
        
        {/* Animated Icon Circle */}
        <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500
          ${isDragging 
            ? 'bg-teal-400 text-gray-900 border-transparent rotate-12 scale-110' 
            : errorMessage 
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-transparent text-white/70 border-white/30 group-hover:border-teal-400 group-hover:text-teal-400'
          }
        `}>
          {isAnalyzing ? (
            <Loader2 className="animate-spin" size={40} />
          ) : errorMessage ? (
            <AlertCircle size={40} />
          ) : (
            <div className="relative">
              <Upload className="group-hover:animate-bounce" size={40} />
            </div>
          )}
        </div>
        
        <h3 className={`text-3xl font-bold mb-3 tracking-wide transition-colors ${
            errorMessage ? 'text-red-300' : 'text-white group-hover:text-teal-300'
        }`}>
          {isAnalyzing ? 'Analyzing your space...' : errorMessage ? 'Oops! Try again' : 'Add a Photo'}
        </h3>
        
        <p className="text-xl text-gray-400 max-w-md mb-8">
          {isAnalyzing 
            ? 'Our AI is watching and taking notes.' 
            : 'Drag & drop or upload a photo (Max 20MB).'}
        </p>

        {!isAnalyzing && (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            {/* Standard Upload Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-upload')?.click();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-gray-900 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all min-w-[160px]"
            >
              <ImageIcon size={24} />
              Gallery
            </button>

            {/* Camera Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('camera-upload')?.click();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 text-xl font-bold rounded-xl shadow-[4px_4px_0px_0px_rgba(45,212,191,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(45,212,191,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all min-w-[160px]"
            >
              <Camera size={24} />
              Camera
            </button>
          </div>
        )}
      </div>

      {/* Chalk Dust Effects */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-700"></div>
    </div>
  );
};

export default UploadZone;