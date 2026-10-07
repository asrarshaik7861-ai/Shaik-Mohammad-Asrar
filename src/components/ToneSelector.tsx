import React from 'react';
import { EmailTone } from '../types/email';
import {
  Briefcase,
  Award,
  Smile,
  HeartHandshake,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';

interface ToneSelectorProps {
  value: EmailTone;
  onChange: (tone: EmailTone) => void;
}

const TONES: { id: EmailTone; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: 'Professional', label: 'Professional', icon: Briefcase, desc: 'Balanced, standard workplace tone' },
  { id: 'Formal', label: 'Formal', icon: Award, desc: 'High-level executive, ceremonial, respectful' },
  { id: 'Friendly', label: 'Friendly', icon: Smile, desc: 'Warm, personable, collaborative' },
  { id: 'Polite', label: 'Polite', icon: HeartHandshake, desc: 'Courteous, considerate, deferential' },
  { id: 'Confident', label: 'Confident', icon: Zap, desc: 'Assertive, authoritative, decisive' },
  { id: 'Persuasive', label: 'Persuasive', icon: Target, desc: 'Compelling, pitch-oriented, motivating' },
  { id: 'Apologetic', label: 'Apologetic', icon: Sparkles, desc: 'Sincere, humble, solution-oriented' },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Tone of Voice
      </label>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => {
          const Icon = t.icon;
          const isSelected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={t.desc}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500'
                }`}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
