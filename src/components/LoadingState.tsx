import React, { useEffect, useState } from 'react';
import { Sparkles, Bot, PenTool, CheckCircle } from 'lucide-react';

interface LoadingStateProps {
  customMessage?: string;
}

const STEPS = [
  'Analyzing context & recipient intent...',
  'Structuring subject line and paragraphs...',
  'Polishing tone and ensuring natural flow...',
  'Finalizing email draft with Gemini AI...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ customMessage }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-14 px-6 flex flex-col items-center justify-center text-center">
      {/* Animated glowing icon container */}
      <div className="relative mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
          <Bot className="w-9 h-9 animate-bounce duration-1000" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
        {customMessage || 'AI is writing your email...'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5">
        Using Google Gemini 3.8 Flash to synthesize your key points into a professional email.
      </p>

      {/* Progress step dots */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStep
                  ? 'w-7 bg-indigo-600 dark:bg-indigo-400'
                  : idx < currentStep
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2">
          <PenTool className="w-3.5 h-3.5 animate-spin" />
          <span>{STEPS[currentStep]}</span>
        </div>
      </div>
    </div>
  );
};
