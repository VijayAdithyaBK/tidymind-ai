import React, { useState } from 'react';
import { X, Camera, Sparkles, ClipboardList, ArrowRight } from 'lucide-react';

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        title: "Snap It",
        description: "Take a messy photo. Don't worry, we won't judge.",
        icon: <Camera size={32} className="text-white sm:w-10 sm:h-10" />,
    },
    {
        title: "AI Analysis",
        description: "Our AI breaks down the mess into a clear mission plan.",
        icon: <Sparkles size={32} className="text-white sm:w-10 sm:h-10" />,
    },
    {
        title: "Conquer",
        description: "Follow the steps, earn an A+ score, and reclaiming your space.",
        icon: <ClipboardList size={32} className="text-white sm:w-10 sm:h-10" />,
    }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/90 backdrop-blur-xl animate-fadeIn">
            {/* Story Path Line (Background) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block z-0"></div>

            <div className="sketch-border bg-white w-full max-w-lg p-6 sm:p-8 sketch-shadow relative z-10 m-4 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center pt-4">
                    {/* Animated Icon Blob */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black blob-shape flex items-center justify-center mb-6 sm:mb-8 shadow-xl transition-all duration-500 transform hover:scale-110">
                        {steps[currentStep].icon}
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black uppercase text-black mb-3 sm:mb-4 tracking-tight">
                        {steps[currentStep].title}
                    </h3>

                    <p className="text-base sm:text-lg text-gray-600 font-medium mb-8 sm:mb-10 max-w-xs mx-auto leading-relaxed">
                        {steps[currentStep].description}
                    </p>

                    {/* Custom Progress Dots */}
                    <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10">
                        {steps.map((_, i) => (
                            <div key={i} className={`h-2 sm:h-3 rounded-full transition-all duration-300 border-2 border-black ${i === currentStep ? 'w-6 sm:w-8 bg-black' : 'w-2 sm:w-3 bg-white'
                                }`}></div>
                        ))}
                    </div>

                    <div className="flex gap-3 sm:gap-4 w-full">
                        {currentStep < steps.length - 1 && (
                            <button onClick={onClose} className="btn-secondary flex-1 text-sm sm:text-base">Skip</button>
                        )}
                        <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm sm:text-base">
                            {currentStep === steps.length - 1 ? "Let's Go!" : "Next"} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
