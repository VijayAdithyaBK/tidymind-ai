import React, { useState } from 'react';
import { X, Camera, Sparkles, ClipboardList, ArrowRight } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome, Friend!",
    description: "I'm your new TidyMind AI. I live on this chalkboard and I love helping you clean up.",
    icon: <Sparkles size={40} className="text-teal-400" />,
  },
  {
    title: "Snap a Picture",
    description: "Take a photo of your messy room. Don't be shy, I've seen worse!",
    icon: <Camera size={40} className="text-teal-400" />,
  },
  {
    title: "Get the Chalk",
    description: "I'll write down a super simple plan on the board to help you organize everything.",
    icon: <ClipboardList size={40} className="text-teal-400" />,
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-popIn">
      <div className="chalk-border bg-[#222] max-w-md w-full p-8 relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-white/20 animate-float">
            {steps[currentStep].icon}
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-4 tracking-wide">
            {steps[currentStep].title}
          </h3>
          
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Dots Indicator */}
          <div className="flex gap-3 mb-8">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-3 rounded-full transition-all duration-300 border border-teal-400/50 ${
                  idx === currentStep ? 'bg-teal-400 w-10' : 'bg-transparent w-3'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="w-full flex gap-4">
             {currentStep < steps.length - 1 ? (
               <>
                <button 
                  onClick={handleSkip}
                  className="flex-1 py-3 text-gray-400 font-bold hover:text-white transition-colors text-xl"
                >
                  Skip
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-1 py-3 bg-teal-500 text-gray-900 rounded-xl font-bold text-xl hover:bg-teal-400 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={20} />
                </button>
               </>
             ) : (
               <button 
                  onClick={onClose}
                  className="w-full py-3 bg-teal-500 text-gray-900 rounded-xl font-bold text-xl hover:bg-teal-400 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                >
                  Let's Start!
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;