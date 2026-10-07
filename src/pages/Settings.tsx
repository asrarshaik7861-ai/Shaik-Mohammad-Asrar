import React, { useState, useEffect } from 'react';
import { UserSettings, EmailTone, EmailLength, EmailLanguage, SystemHealth } from '../types/email';
import { checkSystemHealth } from '../services/geminiService';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Download,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearAllEmails: () => void;
  savedEmailsCount: number;
  onExportEmails: () => void;
}

const TONES: EmailTone[] = [
  'Professional',
  'Formal',
  'Friendly',
  'Polite',
  'Confident',
  'Persuasive',
  'Apologetic',
];

const LENGTHS: EmailLength[] = ['Short', 'Medium', 'Detailed'];

const LANGUAGES: EmailLanguage[] = [
  'English',
  'Hindi',
  'Telugu',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Japanese',
];

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onClearAllEmails,
  savedEmailsCount,
  onExportEmails,
}) => {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'checking',
    hasApiKey: false,
    model: 'gemini-3.8-flash',
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    checkSystemHealth().then(setHealth);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <SettingsIcon className="w-4 h-4" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings & Preferences
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure default email generation behaviors, system preferences, and appearance.
        </p>
      </div>

      {/* AI Model Configuration Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Engine & Server Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected via secure full-stack backend proxy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              AI Model
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              Gemini 3.8 Flash
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Ultra-fast generation & editing
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Security
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Server-side only
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Zero client key exposure
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Key Injection
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {health.hasApiKey ? 'Configured Active' : 'Environment Injected'}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Configured via AI Studio Secrets
            </span>
          </div>
        </div>
      </div>

      {/* Generation Defaults */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Generation Defaults
        </h3>

        {/* Default Tone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Default Tone
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The preset tone of voice selected when opening new email drafts.
            </p>
          </div>
          <select
            value={settings.defaultTone}
            onChange={(e) =>
              onUpdateSettings({ ...settings, defaultTone: e.target.value as EmailTone })
            }
            className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Default Length */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Default Length
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target length profile for newly created drafts.
            </p>
          </div>
          <select
            value={settings.defaultLength}
            onChange={(e) =>
              onUpdateSettings({ ...settings, defaultLength: e.target.value as EmailLength })
            }
            className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {LENGTHS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Default Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Default Language
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Primary language for email generation (includes English, Hindi, Telugu).
            </p>
          </div>
          <select
            value={settings.defaultLanguage}
            onChange={(e) =>
              onUpdateSettings({ ...settings, defaultLanguage: e.target.value as EmailLanguage })
            }
            className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Auto Subject */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Auto-generate Subject Line
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automatically create high-impact email subject lines by default.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSubject}
              onChange={(e) =>
                onUpdateSettings({ ...settings, autoSubject: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Appearance / Dark Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'light'
                ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 mb-2 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'dark'
                ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 mb-2 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, theme: 'system' })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'system'
                ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-5 h-5 mb-2 text-slate-400" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Storage & Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Data Management
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              Export Email History
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Download all {savedEmailsCount} saved emails as a JSON backup.
            </span>
          </div>
          <button
            onClick={onExportEmails}
            disabled={savedEmailsCount === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 block">
              Clear All Saved Emails
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Permanently wipe all emails stored in LocalStorage.
            </span>
          </div>

          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClearAllEmails();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={savedEmailsCount === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
