import React from 'react';
import { EmailLength } from '../types/email';
import { AlignLeft, AlignJustify, FileText } from 'lucide-react';

interface LengthSelectorProps {
  value: EmailLength;
  onChange: (length: EmailLength) => void;
}

const LENGTHS: { id: EmailLength; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }[] = [
  { id: 'Short', label: 'Short', icon: AlignLeft, detail: '1-2 paragraphs (~50-100 words)' },
  { id: 'Medium', label: 'Medium', icon: AlignJustify, detail: '2-3 paragraphs (~100-200 words)' },
  { id: 'Detailed', label: 'Detailed', icon: FileText, detail: 'Comprehensive (~200-350 words)' },
];

export const LengthSelector: React.FC<LengthSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Email Length
      </label>
      <div className="grid grid-cols-3 gap-2">
        {LENGTHS.map((item) => {
          const Icon = item.icon;
          const isSelected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-xl border text-xs transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                {item.detail}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
