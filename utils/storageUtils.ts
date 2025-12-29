import { AnalysisResult, SavedAnalysis } from '../types';

const STORAGE_KEY = 'tidymind_history_v1';

// Compress image to ensure it fits in localStorage (aiming for <100KB thumbnail/preview quality)
const compressImage = (base64Str: string, maxWidth = 600, quality = 0.6): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

export const saveAnalysis = async (imageBase64: string, result: AnalysisResult): Promise<void> => {
  try {
    const compressedImage = await compressImage(imageBase64);
    
    const newEntry: SavedAnalysis = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageBase64: compressedImage,
      result
    };

    const existing = getSavedAnalyses();
    // Keep max 10 items to prevent quota issues
    const updated = [newEntry, ...existing].slice(0, 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save analysis:', error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error("Storage full! Delete some old items to save new ones.");
    }
  }
};

export const getSavedAnalyses = (): SavedAnalysis[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const deleteAnalysis = (id: string): SavedAnalysis[] => {
  const existing = getSavedAnalyses();
  const updated = existing.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
