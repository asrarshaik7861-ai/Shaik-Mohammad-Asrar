import React from 'react';
import { EmailLanguage } from '../types/email';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  value: EmailLanguage;
  onChange: (language: EmailLanguage) => void;
}

const LANGUAGES: { id: EmailLanguage; label: string; native: string; badge?: string }[] = [
  { id: 'English', label: 'English', native: 'English', badge: 'Default' },
  { id: 'Hindi', label: 'Hindi', native: 'हिन्दी', badge: 'Popular' },
  { id: 'Telugu', label: 'Telugu', native: 'తెలుగు', badge: 'Popular' },
  { id: 'Spanish', label: 'Spanish', native: 'Español' },
  { id: 'French', label: 'French', native: 'Français' },
  { id: 'German', label: 'German', native: 'Deutsch' },
  { id: 'Arabic', label: 'Arabic', native: 'العربية' },
  { id: 'Japanese', label: 'Japanese', native: '日本語' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Language
        </label>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Languages className="w-3 h-3 text-indigo-500" />
          Native tone preservation
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LANGUAGES.map((lang) => {
          const isSelected = value === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => onChange(lang.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="text-left">
                <span className="block font-medium">{lang.label}</span>
                <span className="text-[10px] text-slate-400 block">{lang.native}</span>
              </div>
              {lang.badge && (
                <span
                  className={`text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {lang.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
