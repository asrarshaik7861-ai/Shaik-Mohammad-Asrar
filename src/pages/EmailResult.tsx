import React, { useState } from 'react';
import {
  EmailRecord,
  EmailGenerationRequest,
  AIImprovementAction,
  EmailLanguage,
} from '../types/email';
import { EmailEditor } from '../components/EmailEditor';
import { LoadingState } from '../components/LoadingState';
import {
  Copy,
  Edit2,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  Languages,
  Award,
  Smile,
  Minimize2,
  Maximize2,
  Wand2,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';

interface EmailResultProps {
  currentEmail: EmailRecord;
  originalRequest?: EmailGenerationRequest;
  onUpdateEmail: (updates: Partial<EmailRecord>) => void;
  onSaveEmail: (email: EmailRecord) => void;
  onRegenerate: () => void;
  onAIImprove: (action: AIImprovementAction, targetLanguage?: EmailLanguage) => Promise<void>;
  onBackToCreate: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
  isImproving: boolean;
  improvingAction: string | null;
  onCopySuccess: () => void;
}

const AI_ACTIONS: {
  action: AIImprovementAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    action: 'formal',
    label: 'Make Formal',
    icon: Award,
    description: 'Executive & respectful corporate tone',
  },
  {
    action: 'friendly',
    label: 'Make Friendly',
    icon: Smile,
    description: 'Warm & collaborative phrasing',
  },
  {
    action: 'shorter',
    label: 'Make Shorter',
    icon: Minimize2,
    description: 'Concise & punchy without losing details',
  },
  {
    action: 'longer',
    label: 'Make Longer',
    icon: Maximize2,
    description: 'Expand naturally with thorough context',
  },
  {
    action: 'improve_writing',
    label: 'Improve Writing',
    icon: Wand2,
    description: 'Elevate vocabulary, flow & polish',
  },
  {
    action: 'fix_grammar',
    label: 'Fix Grammar',
    icon: CheckCheck,
    description: 'Fix syntax, spelling & punctuation',
  },
];

const TRANSLATION_LANGUAGES: EmailLanguage[] = [
  'English',
  'Hindi',
  'Telugu',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Japanese',
];

export const EmailResult: React.FC<EmailResultProps> = ({
  currentEmail,
  originalRequest,
  onUpdateEmail,
  onSaveEmail,
  onRegenerate,
  onAIImprove,
  onBackToCreate,
  isSaving,
  isRegenerating,
  isImproving,
  improvingAction,
  onCopySuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  const handleCopy = async () => {
    try {
      const fullContent = `Subject: ${currentEmail.subject}\n\n${currentEmail.body}`;
      await navigator.clipboard.writeText(fullContent);
      setIsCopied(true);
      onCopySuccess();
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = `Subject: ${currentEmail.subject}\n\n${currentEmail.body}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      onCopySuccess();
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSave = () => {
    onSaveEmail(currentEmail);
    setIsSavedLocally(true);
  };

  const handleEditorSave = (newSubject: string, newBody: string) => {
    onUpdateEmail({
      subject: newSubject,
      body: newBody,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleTranslateSelect = async (lang: EmailLanguage) => {
    setShowTranslateDropdown(false);
    await onAIImprove('translate', lang);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToCreate}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor / New Email</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {currentEmail.type}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Tone: {currentEmail.tone}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {currentEmail.language}
          </span>
        </div>
      </div>

      {/* Main Email Box */}
      {isImproving ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
          <LoadingState
            customMessage={`Gemini is refining: ${improvingAction || 'Applying improvement'}...`}
          />
        </div>
      ) : isRegenerating ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
          <LoadingState customMessage="Regenerating with Gemini AI..." />
        </div>
      ) : isEditing ? (
        <EmailEditor
          initialSubject={currentEmail.subject}
          initialBody={currentEmail.body}
          onSave={handleEditorSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Header Action Bar */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Generated Email Ready
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Copy complete email to clipboard"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Edit */}
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Directly edit subject and body"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>

              {/* Regenerate */}
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Regenerate email with same context"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
                  isSavedLocally
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isSavedLocally ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{isSavedLocally ? 'Saved to History' : 'Save Email'}</span>
              </button>
            </div>
          </div>

          {/* Email View Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* SUBJECT */}
            <div className="space-y-1.5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                SUBJECT
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white select-all">
                {currentEmail.subject}
              </h3>
            </div>

            {/* EMAIL BODY */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                EMAIL
              </span>
              <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800/80 whitespace-pre-wrap font-sans text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed select-all">
                {currentEmail.body}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Actions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Improvements & Refinements
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Select an AI action to polish, translate, or transform your draft instantly.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {AI_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                type="button"
                onClick={() => onAIImprove(item.action)}
                disabled={isImproving || isRegenerating}
                className="flex flex-col items-start p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all duration-150 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                  {item.description}
                </p>
              </button>
            );
          })}

          {/* Translate Button with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
              disabled={isImproving || isRegenerating}
              className="w-full h-full flex flex-col items-start p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all duration-150 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Translate
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                Translate into Hindi, Telugu & more
              </p>
            </button>

            {/* Translate dropdown */}
            {showTranslateDropdown && (
              <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-30 animate-in fade-in slide-in-from-bottom-2">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Language
                </div>
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslateSelect(lang)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang}</span>
                    {lang === currentEmail.language && (
                      <span className="text-[10px] text-indigo-500">current</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
