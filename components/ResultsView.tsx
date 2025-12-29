
import React, { useState } from 'react';
import { AnalysisResult, UploadedImage, ComparisonResult } from '../types';
import { CheckCircle2, Package, Layout, Sparkles, ArrowRight, RefreshCw, Copy, Check, Info, Star, Save, Loader2, Camera, Trophy, AlertTriangle, Stamp, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  image: UploadedImage;
  afterImage?: UploadedImage | null;
  result: AnalysisResult;
  comparisonResult: ComparisonResult | null;
  error?: string | null;
  onReset: () => void;
  onSave: () => Promise<void>;
  onFollowUpClick: () => void;
  isSaving?: boolean;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className = "" }) => {
  return (
    <div className={`relative group/tooltip ${className}`}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-50 tracking-wide">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
      </div>
    </div>
  );
};

const CopyButton: React.FC<{ text: string; className?: string; tooltipText?: string }> = ({ text, className, tooltipText = "Copy to clipboard" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <Tooltip text={tooltipText}>
      <button 
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-lg font-bold border-2 rounded-lg transition-all active:scale-95 ${className}`}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </Tooltip>
  );
};

const StarsBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
    <div className="star-particle bg-purple-200 w-1 h-1 top-[10%] left-[10%]" style={{animationDelay: '0s'}}></div>
    <div className="star-particle bg-white w-1.5 h-1.5 top-[20%] left-[80%]" style={{animationDelay: '1s'}}></div>
    <div className="star-particle bg-purple-300 w-1 h-1 top-[70%] left-[15%]" style={{animationDelay: '2s'}}></div>
    <div className="star-particle bg-white w-1 h-1 top-[80%] left-[85%]" style={{animationDelay: '0.5s'}}></div>
    <div className="star-particle bg-purple-200 w-1.5 h-1.5 top-[40%] left-[50%]" style={{animationDelay: '1.5s'}}></div>
    <div className="star-particle bg-white w-1 h-1 top-[15%] left-[45%]" style={{animationDelay: '2.5s'}}></div>
    <div className="star-particle bg-purple-300 w-1 h-1 top-[60%] left-[90%]" style={{animationDelay: '3s'}}></div>
  </div>
);

const ComparisonReport: React.FC<{ result: ComparisonResult }> = ({ result }) => {
  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const grade = getGrade(result.score);
  const isPassing = result.score >= 50;
  
  const gradeColor = isPassing ? 'text-green-400 border-green-400 rotate-12' : 'text-red-400 border-red-400 -rotate-12';

  return (
    <div className="relative p-8 rounded-xl border-[3px] border-white/60 animate-popIn bg-[#2a2a2a] shadow-[10px_10px_0px_rgba(0,0,0,0.3)] bg-chalk-grid">
      {/* Tape Effect */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-white/10 backdrop-blur-sm border-l border-r border-white/20 transform -rotate-1"></div>

      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b-2 border-dashed border-white/20">
        <h3 className="text-4xl font-bold text-chalk-yellow uppercase tracking-widest flex items-center justify-center gap-3">
           <Stamp size={32} /> Inspector's Report
        </h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Grade Section */}
        <div className="flex flex-col items-center justify-center min-w-[200px] border-r-0 md:border-r-2 border-dashed border-white/10 pr-0 md:pr-8">
            <div className={`w-48 h-48 rounded-full border-8 border-double flex flex-col items-center justify-center ${gradeColor} opacity-90 transition-transform hover:scale-105`}>
               <span className="text-8xl font-bold leading-none">{grade}</span>
               <span className="text-xl font-bold uppercase tracking-widest mt-2">{isPassing ? 'PASSED' : 'REDO'}</span>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-300 text-2xl">Score: {result.score}/100</span>
            </div>
        </div>

        {/* Right: Details Section */}
        <div className="flex-grow space-y-8">
           <div className="bg-black/20 p-6 rounded-lg border border-white/10">
             <h4 className="text-2xl text-chalk-blue font-bold mb-2">Inspector's Feedback:</h4>
             <p className="text-2xl text-white/90 leading-relaxed italic">"{result.feedback}"</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {/* Completed Column */}
             <div>
               <h4 className="flex items-center gap-2 text-green-400 font-bold text-xl uppercase mb-3 border-b border-green-400/30 pb-2">
                 <CheckCircle2 size={24} /> Accomplished
               </h4>
               {result.completedTasks.length > 0 ? (
                 <ul className="space-y-4">
                   {result.completedTasks.map((task, i) => (
                     <li key={i} className="flex items-start gap-3 text-xl text-white/90">
                       <span className="text-green-500 mt-1">✓</span>
                       {task}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-400 italic text-lg">No major tasks completed yet.</p>
               )}
             </div>

             {/* Missed Column */}
             <div>
               <h4 className="flex items-center gap-2 text-red-400 font-bold text-xl uppercase mb-3 border-b border-red-400/30 pb-2">
                 <XCircle size={24} /> Missing Actions
               </h4>
                {result.missedTasks.length > 0 ? (
                 <ul className="space-y-4">
                   {result.missedTasks.map((task, i) => (
                     <li key={i} className="flex items-start gap-3 text-xl text-white/90">
                       <span className="text-red-500 mt-1">✗</span>
                       {task}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-400 italic text-lg">Nothing left! Great job.</p>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({ 
  image, 
  afterImage,
  result, 
  comparisonResult, 
  error,
  onReset, 
  onSave, 
  onFollowUpClick, 
  isSaving = false 
}) => {
  const [hasSaved, setHasSaved] = useState(false);
  const [activeImage, setActiveImage] = useState<'before' | 'after'>('before');

  // Automatically switch to after image if available and comparison was successful
  React.useEffect(() => {
    if (afterImage && comparisonResult) {
      setActiveImage('after');
    }
  }, [afterImage, comparisonResult]);

  const handleSaveClick = async () => {
    if (hasSaved || isSaving) return;
    await onSave();
    setHasSaved(true);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2dd4bf', '#facc15', '#f87171', '#c084fc', '#ffffff'],
      disableForReducedMotion: true
    });
  };
  
  const getDeclutteringText = () => {
    return `Decluttering Plan for ${result.roomType}:\n\n` + 
      result.declutteringSteps.map(s => `• ${s.title} [${s.priority}]: ${s.description}`).join('\n\n');
  };

  const getHacksText = () => {
    return `Organization Hacks:\n\n` + 
      result.organizationHacks.map(h => `• ${h.item}: ${h.suggestion}`).join('\n\n');
  };

  const getStorageText = () => {
    return `Storage Solutions:\n\n` + 
      result.storageSolutions.map(s => `• ${s.productType}: ${s.reason}`).join('\n');
  };

  const getAestheticText = () => {
    return `Aesthetic Touches:\n\n` + result.aestheticTips.map(t => `• ${t}`).join('\n');
  };

  const displayUrl = activeImage === 'before' ? image.previewUrl : afterImage?.previewUrl || image.previewUrl;

  // Fixed Chalkboard Theme Styles - Enhanced for Legibility
  const themeStyles = {
    plan: {
      container: 'bg-[#222] bg-chalk-lines border-white/70 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)]',
      title: 'text-chalk-blue',
      icon: 'text-teal-400',
      textMain: 'text-white/95 font-bold tracking-wide',
      textSub: 'text-white/90 font-medium leading-relaxed', 
      divider: 'border-white/10',
      copyBtn: 'text-teal-400 border-teal-400/30 hover:bg-teal-400/10',
      number: 'border-teal-400 text-teal-400 bg-[#222]/80',
      badge: (priority: string) => 
        priority === 'High' ? 'border-red-400 text-red-400 bg-red-400/10' :
        priority === 'Medium' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' :
        'border-gray-400 text-gray-400 bg-gray-400/10'
    },
    hacks: {
      container: 'bg-[#222] bg-chalk-grid border-white/70 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)]',
      title: 'text-chalk-yellow',
      icon: 'text-yellow-400',
      divider: 'border-white/10',
      copyBtn: 'text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10',
      card: 'bg-[#222]/90 border-white/10 hover:border-yellow-400/50',
      cardTitle: 'text-yellow-100 font-bold',
      cardIcon: 'text-yellow-400',
      cardText: 'text-white/90 font-medium leading-relaxed' 
    },
    storage: {
      container: 'bg-[#222] bg-chalk-dots border-white/70 hover:border-red-400/50 hover:shadow-[0_0_20px_rgba(248,113,113,0.1)]',
      title: 'text-chalk-pink',
      icon: 'text-red-400',
      divider: 'border-white/10',
      copyBtn: 'text-red-400 border-red-400/30 hover:bg-red-400/10',
      arrow: 'text-red-400',
      product: 'text-white/95 font-bold border-red-400/30',
      reason: 'text-white/90 font-medium leading-relaxed' 
    },
    aesthetic: {
      container: 'bg-gradient-to-br from-[#222] to-[#2a1b3d] border-white/70 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]',
      title: 'text-chalk-purple',
      icon: 'text-purple-400',
      divider: 'border-white/10',
      copyBtn: 'text-purple-400 border-purple-400/30 hover:bg-purple-400/10',
      tag: 'bg-purple-500/10 border-purple-400/30 text-purple-100 hover:bg-purple-500/20'
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image & Quick Stats (Sticky on Desktop) */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24 flex flex-col gap-6 animate-popIn">
            
            {/* Polaroid Style Image - Comfortable & Spacious */}
            <div className="bg-white p-4 pb-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] transform -rotate-1 hover:rotate-0 transition-all duration-500 ease-out relative shrink-0">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-red-400/90 transform rotate-1 shadow-sm z-10"></div> {/* Tape */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200 border-2 border-gray-100 flex items-center justify-center bg-black">
                <img 
                  src={displayUrl} 
                  alt="Analyzed Room" 
                  className="w-full h-full object-cover grayscale-[10%] contrast-110"
                />
                
                {/* Before/After Toggle in Polaroid */}
                {afterImage && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-gray-900/90 rounded-full p-1.5 backdrop-blur-md border border-white/20 shadow-lg">
                    <button 
                      onClick={() => setActiveImage('before')}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        activeImage === 'before' ? 'bg-white text-black shadow-sm' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Before
                    </button>
                    <button 
                      onClick={() => setActiveImage('after')}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        activeImage === 'after' ? 'bg-green-400 text-black shadow-sm' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      After
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                 <p className="text-3xl font-bold text-gray-800 tracking-wide font-handwriting leading-none">{result.roomType}</p>
                 <p className="text-lg text-gray-500 mt-2 font-medium">{activeImage === 'after' ? 'Progress Check' : result.mood}</p>
              </div>
            </div>

            {/* Action Buttons - Comfortable & Grid Layout */}
            <div className="flex flex-col gap-4 w-full">
              <Tooltip text="Save this analysis to your history board" className="w-full">
                <button 
                  onClick={handleSaveClick}
                  disabled={hasSaved || isSaving}
                  className={`w-full group flex items-center justify-center gap-3 py-3.5 border-2 rounded-xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${
                    hasSaved 
                      ? 'bg-green-500/20 border-green-500 text-green-400 cursor-default' 
                      : 'bg-teal-500 hover:bg-teal-400 text-gray-900 border-transparent shadow-teal-500/20'
                  }`}
                >
                  {isSaving ? <Loader2 size={24} className="animate-spin" /> : 
                   hasSaved ? <Check size={24} /> : 
                   <Save size={24} />}
                  {isSaving ? 'Saving...' : hasSaved ? 'Saved to Board!' : 'Save Results'}
                </button>
              </Tooltip>

              <div className="grid grid-cols-2 gap-4">
                <Tooltip text="Discard current results and analyze a new photo" className="w-full">
                    <button 
                    onClick={onReset}
                    className="w-full group flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 bg-white/5 border-2 border-dashed border-gray-500 text-gray-300 hover:text-white hover:border-white hover:bg-white/10 rounded-xl font-bold text-lg transition-all"
                    >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                    <span>New Room</span>
                    </button>
                </Tooltip>
                
                <button 
                    onClick={onFollowUpClick}
                    className="w-full group flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 bg-purple-500/10 border-2 border-dashed border-purple-400 text-purple-300 hover:text-purple-100 hover:bg-purple-500/30 hover:border-purple-300 rounded-xl font-bold text-lg transition-all"
                >
                    <Camera size={20} />
                    <span>Follow Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Suggestions */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Error Banner */}
          {error && (
            <div className="animate-popIn p-6 bg-red-500/10 border-2 border-dashed border-red-500/50 rounded-xl flex items-center gap-6 text-red-200">
               <AlertTriangle className="shrink-0 text-red-400" size={36} />
               <div>
                 <h4 className="font-bold text-2xl mb-1">Whoops!</h4>
                 <p className="text-xl">{error}</p>
               </div>
            </div>
          )}

          {/* Comparison Report Card */}
          {comparisonResult && (
             <section className="animate-slideUp" style={{animationDelay: '0s'}}>
               <ComparisonReport result={comparisonResult} />
             </section>
          )}

          {/* Section 1: Decluttering Plan */}
          <section className="animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className={`chalk-border animate-scribble p-10 relative group transition-all duration-300 ${themeStyles.plan.container}`}>
               <div className={`flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed ${themeStyles.plan.divider}`}>
                 <div className="flex items-center gap-4">
                    <CheckCircle2 size={40} className={`${themeStyles.plan.icon} animate-wiggle`} />
                    <h2 className={`text-5xl font-bold ${themeStyles.plan.title}`}>The Plan</h2>
                 </div>
                 <CopyButton 
                   text={getDeclutteringText()} 
                   tooltipText="Copy detailed decluttering plan"
                   className={themeStyles.plan.copyBtn} 
                 />
               </div>

               <div className="space-y-10 w-full">
                 {result.declutteringSteps.map((step, idx) => {
                   const isCompleted = comparisonResult?.completedTasks.includes(step.title);
                   return (
                   <div key={idx} className={`flex gap-5 transition-opacity duration-500 ${isCompleted ? 'opacity-50 hover:opacity-100' : ''}`}>
                     <span className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-2xl mt-1 backdrop-blur-sm ${
                        isCompleted ? 'bg-green-500 border-green-500 text-white' : themeStyles.plan.number
                     }`}>
                       {isCompleted ? <Check size={24} /> : idx + 1}
                     </span>
                     <div className="space-y-3">
                        <div className="flex items-center gap-4 flex-wrap">
                          <h4 className={`text-3xl ${themeStyles.plan.textMain} ${isCompleted ? 'line-through decoration-2 decoration-green-500' : ''}`}>{step.title}</h4>
                          <span className={`text-base px-3 py-1.5 rounded-full font-bold uppercase tracking-wider border backdrop-blur-sm ${themeStyles.plan.badge(step.priority)}`}>
                            {step.priority}
                          </span>
                        </div>
                        <p className={`text-xl ${themeStyles.plan.textSub}`}>{step.description}</p>
                     </div>
                   </div>
                 )})}
               </div>
            </div>
          </section>

          {/* Section 2: Organization Hacks */}
          <section className="animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className={`chalk-border p-10 relative group transition-all duration-300 ${themeStyles.hacks.container}`}>
              <div className={`flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed ${themeStyles.hacks.divider}`}>
                <div className="flex items-center gap-4">
                  <Layout size={40} className={`${themeStyles.hacks.icon} animate-wiggle`} />
                  <h2 className={`text-5xl font-bold ${themeStyles.hacks.title}`}>Quick Hacks</h2>
                </div>
                <CopyButton 
                  text={getHacksText()} 
                  tooltipText="Copy organization hacks list"
                  className={themeStyles.hacks.copyBtn} 
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {result.organizationHacks.map((hack, idx) => (
                  <div key={idx} className={`backdrop-blur-sm p-8 rounded-xl border transition-colors shadow-sm hover:shadow-md ${themeStyles.hacks.card}`}>
                    <h4 className={`text-2xl mb-4 flex items-center gap-3 ${themeStyles.hacks.cardTitle}`}>
                      <Star size={24} className={`${themeStyles.hacks.cardIcon} fill-current`} />
                      {hack.item}
                    </h4>
                    <p className={`text-xl ${themeStyles.hacks.cardText}`}>{hack.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Storage Solutions */}
          <section className="animate-slideUp" style={{animationDelay: '0.3s'}}>
             <div className={`chalk-border p-10 relative group transition-all duration-300 ${themeStyles.storage.container}`}>
              <div className={`flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed ${themeStyles.storage.divider}`}>
                <div className="flex items-center gap-4">
                  <Package size={40} className={`${themeStyles.storage.icon} animate-wiggle`} />
                  <h2 className={`text-5xl font-bold ${themeStyles.storage.title}`}>What to Get</h2>
                </div>
                <CopyButton 
                  text={getStorageText()} 
                  tooltipText="Copy shopping list suggestions"
                  className={themeStyles.storage.copyBtn} 
                />
              </div>

              <ul className="space-y-8">
                {result.storageSolutions.map((sol, idx) => (
                  <li key={idx} className="flex gap-5 items-start group/item">
                    <div className={`mt-1 min-w-[32px] transition-transform group-hover/item:translate-x-1 ${themeStyles.storage.arrow}`}>
                      <ArrowRight size={32} />
                    </div>
                    <div>
                      <span className={`block mb-3 text-2xl border-b border-dashed inline-block ${themeStyles.storage.product}`}>{sol.productType}</span>
                      <span className={`text-xl block ${themeStyles.storage.reason}`}>{sol.reason}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Aesthetic Touches */}
          <section className="animate-slideUp" style={{animationDelay: '0.4s'}}>
             <div className={`chalk-border p-10 relative group transition-all duration-300 overflow-hidden ${themeStyles.aesthetic.container}`}>
              <StarsBackground />
              
              <div className={`flex items-center justify-between mb-8 pb-4 border-b-2 border-dashed relative z-10 ${themeStyles.aesthetic.divider}`}>
                <div className="flex items-center gap-4">
                  <Sparkles size={40} className={`${themeStyles.aesthetic.icon} animate-wiggle`} />
                  <h2 className={`text-5xl font-bold ${themeStyles.aesthetic.title}`}>Final Polish</h2>
                </div>
                <CopyButton 
                  text={getAestheticText()} 
                  tooltipText="Copy aesthetic tips"
                  className={themeStyles.aesthetic.copyBtn} 
                />
              </div>

              <div className="flex flex-wrap gap-4 relative z-10">
                {result.aestheticTips.map((tip, idx) => (
                  <div key={idx} className={`px-6 py-4 rounded-full border text-xl leading-relaxed tracking-wide transition-all cursor-default ${themeStyles.aesthetic.tag}`}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ResultsView;
