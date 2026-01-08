import React, { useState } from 'react';
import { AnalysisResult, UploadedImage, ComparisonResult } from '../types';
import { CheckCircle2, Package, Layout, Sparkles, ArrowRight, RefreshCw, Copy, Check, Star, Save, Loader2, Camera, AlertTriangle, XCircle, Trophy, PenTool } from 'lucide-react';
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

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative group/tooltip">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {text}
        </div>
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { console.error(err); }
    };
    return (
        <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-transparent hover:border-black">
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({
    image, afterImage, result, comparisonResult, error,
    onReset, onSave, onFollowUpClick, isSaving = false
}) => {
    const [hasSaved, setHasSaved] = useState(false);
    const [activeImage, setActiveImage] = useState<'before' | 'after'>('before');

    React.useEffect(() => {
        if (afterImage && comparisonResult) setActiveImage('after');
    }, [afterImage, comparisonResult]);

    const handleSaveClick = async () => {
        if (hasSaved || isSaving) return;
        await onSave();
        setHasSaved(true);
        confetti({ particleCount: 150, spread: 70, colors: ['#000', '#444'], disableForReducedMotion: true });
    };

    const displayUrl = activeImage === 'before' ? image.previewUrl : afterImage?.previewUrl || image.previewUrl;

    return (
        <div className="w-full max-w-7xl mx-auto pb-20 animate-fadeIn overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: VISUAL + SCORE (Sticky on Desktop) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="lg:sticky lg:top-24 flex flex-col gap-6">

                        {/* Visual Card */}
                        <div className="sketch-border bg-white p-3 sketch-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-black rounded-bl-full z-10 transition-transform group-hover:scale-110 origin-top-right"></div>
                            <div className="absolute top-3 right-4 text-white z-20 font-black text-xs uppercase tracking-widest">
                                {result.roomType}
                            </div>

                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-black bg-gray-100">
                                <img src={displayUrl} alt="Room" className="w-full h-full object-cover" />

                                {/* Switcher */}
                                {afterImage && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-white border-2 border-black rounded-full p-1 sketch-shadow-sm">
                                        <button onClick={() => setActiveImage('before')} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${activeImage === 'before' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}>Before</button>
                                        <button onClick={() => setActiveImage('after')} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${activeImage === 'after' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}>After</button>
                                    </div>
                                )}
                            </div>

                            {/* Score / Status Card - Integrated */}
                            {comparisonResult && (
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex flex-col items-center justify-center bg-black text-white rounded-2xl sketch-shadow-sm transform -rotate-2">
                                            <span className="text-3xl sm:text-4xl font-black">{comparisonResult.score >= 90 ? 'A+' : comparisonResult.score >= 80 ? 'A' : comparisonResult.score >= 70 ? 'B' : 'C'}</span>
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">{comparisonResult.score}/100</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-base sm:text-lg leading-tight mb-1">Inspector's Report</h4>
                                            <p className="text-xs sm:text-sm font-medium text-gray-600 leading-snug line-clamp-2">"{comparisonResult.feedback}"</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="bg-gray-50 rounded-xl p-2 border-2 border-transparent hover:border-black transition-all">
                                            <h5 className="font-bold text-[10px] sm:text-xs uppercase mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Done</h5>
                                            <span className="text-lg sm:text-xl font-black">{comparisonResult.completedTasks.length}</span>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-2 border-2 border-transparent hover:border-black transition-all">
                                            <h5 className="font-bold text-[10px] sm:text-xs uppercase mb-1 flex items-center gap-1"><XCircle size={12} /> Todo</h5>
                                            <span className="text-lg sm:text-xl font-black">{comparisonResult.missedTasks.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!comparisonResult && (
                                <div className="mt-4 text-center">
                                    <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight">{result.mood}</h3>
                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Current Vibe</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSaveClick}
                                disabled={hasSaved || isSaving}
                                className={`btn-primary w-full flex items-center justify-center gap-2 text-base sm:text-lg ${hasSaved ? 'opacity-50 cursor-default' : ''}`}
                            >
                                {hasSaved ? 'SAVED!' : 'SAVE RESULT'}
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={onReset} className="btn-secondary w-full text-xs sm:text-sm">New Scan</button>
                                <button onClick={onFollowUpClick} className="btn-secondary w-full text-xs sm:text-sm">Follow Up</button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: CONTENT & STORY */}
                <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">

                    {/* Section 1: The Plan - "Story Card" */}
                    <div className="sketch-border bg-white p-5 sm:p-8 sketch-shadow">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black text-white blob-shape flex items-center justify-center">
                                    <CheckCircle2 size={20} className="sm:w-7 sm:h-7 ml-1" />
                                </div>
                                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">The Mission</h2>
                            </div>
                            <CopyButton text="Plan" />
                        </div>

                        <div className="relative border-l-4 border-black ml-4 sm:ml-6 space-y-8 sm:space-y-12 py-2 sm:py-4">
                            {result.declutteringSteps.map((step, i) => (
                                <div key={i} className="relative pl-6 sm:pl-10">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white border-4 border-black rounded-full z-10 transition-transform hover:scale-125"></div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <h3 className="text-lg sm:text-xl font-black leading-tight">{step.title}</h3>
                                            <span className={`px-2 py-1 rounded-lg border-2 border-black text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${step.priority === 'High' ? 'bg-black text-white' : 'bg-white'
                                                }`}>{step.priority}</span>
                                        </div>
                                        <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Hacks & Storage - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Hacks */}
                        <div className="sketch-border bg-white p-5 sm:p-6 sketch-shadow-sm hover:sketch-shadow-hover transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <Layout size={20} className="fill-current sm:w-6 sm:h-6" />
                                <h3 className="text-lg sm:text-xl font-black uppercase">Cheat Codes</h3>
                            </div>
                            <div className="space-y-4">
                                {result.organizationHacks.slice(0, 3).map((hack, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3 border-2 border-transparent hover:border-black transition-colors">
                                        <strong className="block font-bold text-sm mb-1">★ {hack.item}</strong>
                                        <p className="text-xs text-gray-600 font-medium">{hack.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Storage */}
                        <div className="sketch-border bg-white p-5 sm:p-6 sketch-shadow-sm hover:sketch-shadow-hover transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <Package size={20} className="fill-current sm:w-6 sm:h-6" />
                                <h3 className="text-lg sm:text-xl font-black uppercase">Loot / Gear</h3>
                            </div>
                            <ul className="space-y-3">
                                {result.storageSolutions.map((sol, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm font-medium">
                                        <div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1.5"></div>
                                        <span><strong className="text-black">{sol.productType}:</strong> {sol.reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Section 3: Aesthetic - Horizontal Scroll / Cloud */}
                    <div className="sketch-border bg-black text-white p-6 sm:p-8 sketch-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles size={20} className="animate-spin-slow sm:w-6 sm:h-6" />
                            <h3 className="text-lg sm:text-xl font-black uppercase">Final Polish</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {result.aestheticTips.map((tip, i) => (
                                <span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border-2 border-white font-bold text-xs sm:text-sm hover:bg-white hover:text-black transition-colors cursor-default">
                                    {tip}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResultsView;
