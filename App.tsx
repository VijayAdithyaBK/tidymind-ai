
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultsView from './components/ResultsView';
import OnboardingTour from './components/OnboardingTour';
import HistoryList from './components/HistoryList';
import { analyzeRoomImage, compareRoomImages } from './services/geminiService';
import { saveAnalysis, getSavedAnalyses, deleteAnalysis } from './utils/storageUtils';
import { AppState, AnalysisResult, UploadedImage, SavedAnalysis, ComparisonResult } from './types';
import { CheckCircle2, ArrowRight, Eraser, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [afterImage, setAfterImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // History State
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load history on mount
    setHistory(getSavedAnalyses());

    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  }, []);

  const processFile = useCallback(async (file: File) => {
    try {
      // Determine if we are analyzing fresh or comparing
      const isComparison = appState === AppState.UPLOADING_FOLLOWUP;
      
      setAppState(isComparison ? AppState.COMPARING : AppState.ANALYZING);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        if (isComparison && currentImage && analysisResult) {
            // Logic for comparison
            
            // Set afterImage immediately so it appears in the UI
            setAfterImage({
                file,
                previewUrl: URL.createObjectURL(file),
                base64
            });

            try {
                const comparison = await compareRoomImages(currentImage.base64, base64, analysisResult);
                
                if (!comparison.isSameRoom) {
                   setError("This looks like a different room! Please upload a photo of the same space to check your progress.");
                   setComparisonResult(null); // Do not show the report card, just the error banner
                } else {
                   setComparisonResult(comparison);
                   setError(null);
                   
                   // If high score, trigger confetti
                   if (comparison.score > 80) {
                      confetti({
                          particleCount: 200,
                          spread: 100,
                          origin: { y: 0.6 }
                      });
                   }
                }
                
                setAppState(AppState.RESULTS);
                
            } catch (cmpError) {
                console.error(cmpError);
                const message = cmpError instanceof Error ? cmpError.message : "Failed to compare images.";
                setError(message);
                setAppState(AppState.RESULTS); 
            }
        } else {
            // Logic for fresh analysis
            setCurrentImage({
              file,
              previewUrl: URL.createObjectURL(file),
              base64
            });
            // Clear previous comparison data
            setComparisonResult(null);
            setAfterImage(null);

            try {
              const result = await analyzeRoomImage(base64);
              setAnalysisResult(result);
              setAppState(AppState.RESULTS);
            } catch (apiError) {
              console.error(apiError);
              const message = apiError instanceof Error ? apiError.message : "Hmm, couldn't read the board. Check your connection and try again!";
              setError(message);
              setAppState(AppState.ERROR);
            }
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError("Failed to load file.");
      setAppState(AppState.ERROR);
    }
  }, [appState, currentImage, analysisResult]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setCurrentImage(null);
    setAfterImage(null);
    setAnalysisResult(null);
    setComparisonResult(null);
    setError(null);
    setHistory(getSavedAnalyses()); // Refresh history in case it changed
  }, []);

  // When error happens during initial upload
  const handleClearError = useCallback(() => {
     handleReset();
  }, [handleReset]);

  const handleSave = async () => {
    if (currentImage && analysisResult) {
      setIsSaving(true);
      try {
        await saveAnalysis(currentImage.base64, analysisResult);
        setHistory(getSavedAnalyses()); // Refresh list
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to save.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSelectHistoryItem = (item: SavedAnalysis) => {
    setCurrentImage({
      file: null,
      previewUrl: item.imageBase64,
      base64: item.imageBase64
    });
    setAnalysisResult(item.result);
    setComparisonResult(null); // Reset comparison when loading history
    setAfterImage(null);
    setAppState(AppState.RESULTS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    if (confirm("Erase this memory from the chalkboard?")) {
      const updated = deleteAnalysis(id);
      setHistory(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      <OnboardingTour isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <Header />

      <main className="flex-grow w-full px-4 py-8 sm:px-6 lg:px-8 relative">
        
        {/* Intro Hero - Only show when IDLE */}
        {appState === AppState.IDLE && (
          <div className="max-w-4xl mx-auto text-center mb-16 mt-12 animate-popIn">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-chalk-white relative inline-block">
              Clean Your Room!
              <span className="absolute -bottom-2 right-0 w-full h-2 bg-teal-400/60 rounded-full transform -rotate-1"></span>
            </h2>
            <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Snap a photo of the mess. <br/>
              Our AI writes a <span className="text-teal-400 font-bold">Step-by-Step Plan</span> on the board for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-xl text-gray-400 mb-12">
              <div className="flex items-center gap-2 animate-float" style={{animationDelay: '0s'}}>
                <CheckCircle2 size={24} className="text-teal-400" /> Instant Analysis
              </div>
              <div className="flex items-center gap-2 animate-float" style={{animationDelay: '1s'}}>
                <CheckCircle2 size={24} className="text-teal-400" /> 100% Private
              </div>
              <div className="flex items-center gap-2 animate-float" style={{animationDelay: '2s'}}>
                <CheckCircle2 size={24} className="text-teal-400" /> Super Easy
              </div>
            </div>
          </div>
        )}

        {/* State Management */}
        {appState === AppState.ERROR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-popIn">
            <div className="max-w-lg w-full p-8 bg-[#2a1b1b] border-4 border-dashed border-red-500 rounded-3xl text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <XCircle size={48} className="text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-red-200 mb-4">Uh oh!</h3>
              <p className="text-xl text-red-100 mb-8 font-sans">{error}</p>
              <button 
                onClick={handleClearError} 
                className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all font-bold text-lg"
              >
                 <Eraser size={20} />
                 Okay, Got It
              </button>
            </div>
          </div>
        )}

        {/* Upload Zone (Main or Follow-up) */}
        {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.UPLOADING_FOLLOWUP || appState === AppState.COMPARING) && (
           <div className={`transition-all duration-300 ${
               (appState === AppState.UPLOADING_FOLLOWUP || appState === AppState.COMPARING) 
               ? 'fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-4' 
               : 'animate-slideUp'
           }`} style={{animationDelay: '0.2s'}}>
             
             {/* Follow up Header */}
             {(appState === AppState.UPLOADING_FOLLOWUP || appState === AppState.COMPARING) && (
                 <div className="text-center mb-8 animate-slideUp">
                     <h3 className="text-4xl font-bold text-purple-300 mb-2">Show Us Your Progress!</h3>
                     <p className="text-gray-400 text-xl">Upload a photo of the same room after cleaning.</p>
                     <button 
                        onClick={() => {
                            setAppState(AppState.RESULTS);
                            setError(null);
                        }}
                        className="absolute top-8 right-8 text-gray-500 hover:text-white"
                     >
                         <XCircle size={32} />
                     </button>
                 </div>
             )}

             <UploadZone 
                onImageSelected={processFile} 
                isAnalyzing={appState === AppState.ANALYZING || appState === AppState.COMPARING} 
             />
             
             {(appState === AppState.ANALYZING || appState === AppState.COMPARING) && (
               <div className="text-center mt-8">
                 <p className="text-2xl text-teal-200 animate-pulse">
                     {appState === AppState.COMPARING ? "Grading your work..." : "Thinking..."}
                 </p>
               </div>
             )}
           </div>
        )}

        {/* History List */}
        {appState === AppState.IDLE && history.length > 0 && (
          <HistoryList 
            items={history} 
            onSelect={handleSelectHistoryItem} 
            onDelete={handleDeleteHistoryItem} 
          />
        )}

        {/* Results View */}
        {appState === AppState.RESULTS && currentImage && analysisResult && (
          <ResultsView 
            image={currentImage} 
            afterImage={afterImage}
            result={analysisResult} 
            comparisonResult={comparisonResult}
            error={error}
            onReset={handleReset} 
            onSave={handleSave}
            onFollowUpClick={() => setAppState(AppState.UPLOADING_FOLLOWUP)}
            isSaving={isSaving}
          />
        )}
      </main>

      <footer className="py-8 mt-auto border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-lg">
          <p>Made with ❤️ and 🖍️ by TidyMind AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
