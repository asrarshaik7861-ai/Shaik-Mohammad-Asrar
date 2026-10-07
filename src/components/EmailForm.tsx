import React, { useState } from 'react';
import {
  EmailType,
  EmailTone,
  EmailLength,
  EmailLanguage,
  EmailGenerationRequest,
} from '../types/email';
import { ToneSelector } from './ToneSelector';
import { LengthSelector } from './LengthSelector';
import { LanguageSelector } from './LanguageSelector';
import { validateEmailForm } from '../utils/validation';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  Wand2,
  CheckCircle2,
  Flame,
} from 'lucide-react';

interface EmailFormProps {
  initialValues?: Partial<EmailGenerationRequest>;
  onSubmit: (data: EmailGenerationRequest) => void;
  isLoading: boolean;
}

const EMAIL_TYPES: EmailType[] = [
  'Job Application',
  'Job Follow-up',
  'Leave Request',
  'Meeting Request',
  'Meeting Follow-up',
  'Customer Support',
  'Complaint',
  'Thank You',
  'Apology',
  'Business Proposal',
  'Resignation',
  'Personal',
  'Custom',
];

const QUICK_TEMPLATES = [
  {
    label: 'Job Application (Python Dev)',
    type: 'Job Application' as EmailType,
    recipient: 'HR Manager',
    recipientContext: 'Hiring Team at ABC Technologies',
    purpose: 'I want to apply for the Python Developer position.',
    keyPoints: 'B.Tech graduate, 2 years Python and SQL experience, available immediately, attached resume.',
    tone: 'Professional' as EmailTone,
    length: 'Medium' as EmailLength,
    language: 'English' as EmailLanguage,
  },
  {
    label: 'Meeting Request (Client Pitch)',
    type: 'Meeting Request' as EmailType,
    recipient: 'Sarah Jenkins',
    recipientContext: 'VP of Marketing at Acme Corp',
    purpose: 'Request a brief 20-minute introductory call to explore marketing automation synergies.',
    keyPoints: 'We helped similar brands boost conversion by 35%, open next Tuesday or Thursday afternoon, 15-20 min max.',
    tone: 'Persuasive' as EmailTone,
    length: 'Short' as EmailLength,
    language: 'English' as EmailLanguage,
  },
  {
    label: 'Leave Request (Vacation)',
    type: 'Leave Request' as EmailType,
    recipient: 'Team Lead',
    recipientContext: 'Engineering Department',
    purpose: 'Request paid time off for 3 days next week for family obligations.',
    keyPoints: 'Dates: Oct 14 to Oct 16. Current sprint tasks are ahead of schedule. John will cover urgent on-call issues.',
    tone: 'Polite' as EmailTone,
    length: 'Short' as EmailLength,
    language: 'English' as EmailLanguage,
  },
];

export const EmailForm: React.FC<EmailFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const [type, setType] = useState<EmailType>(initialValues?.type || 'Job Application');
  const [recipient, setRecipient] = useState(initialValues?.recipient || '');
  const [recipientContext, setRecipientContext] = useState(
    initialValues?.recipientContext || ''
  );
  const [purpose, setPurpose] = useState(initialValues?.purpose || '');
  const [keyPoints, setKeyPoints] = useState(initialValues?.keyPoints || '');
  const [tone, setTone] = useState<EmailTone>(initialValues?.tone || 'Professional');
  const [length, setLength] = useState<EmailLength>(initialValues?.length || 'Medium');
  const [language, setLanguage] = useState<EmailLanguage>(
    initialValues?.language || 'English'
  );
  const [autoSubject, setAutoSubject] = useState(
    initialValues?.autoSubject !== undefined ? initialValues.autoSubject : true
  );

  const [errors, setErrors] = useState<{ type?: string; purpose?: string }>({});

  const handleApplyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    setType(tmpl.type);
    setRecipient(tmpl.recipient);
    setRecipientContext(tmpl.recipientContext);
    setPurpose(tmpl.purpose);
    setKeyPoints(tmpl.keyPoints);
    setTone(tmpl.tone);
    setLength(tmpl.length);
    setLanguage(tmpl.language);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmailForm({ type, purpose });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    onSubmit({
      type,
      recipient: recipient.trim(),
      recipientContext: recipientContext.trim(),
      purpose: purpose.trim(),
      keyPoints: keyPoints.trim(),
      tone,
      length,
      language,
      autoSubject,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
      {/* Quick Example Presets */}
      <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Quick Fill Presets (Click to test instantly):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200/70 dark:border-indigo-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-colors shadow-2xs cursor-pointer"
            >
              ⚡ {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Type <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as EmailType);
                if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              {EMAIL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {errors.type && (
            <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.type}</span>
            </p>
          )}
        </div>

        {/* Recipient & Recipient Context row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recipient <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., HR Manager / Sarah Jenkins"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recipient Context <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={recipientContext}
              onChange={(e) => setRecipientContext(e.target.value)}
              placeholder="e.g., Hiring Manager at ABC Technologies"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Purpose of Email <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">What are you looking to achieve?</span>
          </div>
          <textarea
            rows={3}
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value);
              if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: undefined }));
            }}
            placeholder="e.g., I want to apply for a Python Developer position at your company."
            className={`w-full p-4 rounded-xl border bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y ${
              errors.purpose
                ? 'border-rose-400 dark:border-rose-700 ring-1 ring-rose-400'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.purpose && (
            <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.purpose}</span>
            </p>
          )}
        </div>

        {/* Key Points */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Key Points to Mention <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-[11px] text-slate-400">Facts, dates, skills, requirements</span>
          </div>
          <textarea
            rows={3}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="e.g., B.Tech graduate, Python skills, SQL knowledge, internship experience, available immediately."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
          />
        </div>

        {/* Tone Selector */}
        <ToneSelector value={tone} onChange={setTone} />

        {/* Length Selector */}
        <LengthSelector value={length} onChange={setLength} />

        {/* Language Selector */}
        <LanguageSelector value={language} onChange={setLanguage} />

        {/* Auto-Subject Toggle */}
        <div className="pt-2 flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/60">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              Generate Subject Automatically
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Let Gemini AI craft an engaging, high-open-rate subject line.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSubject}
              onChange={(e) => setAutoSubject(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Generate Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
            <span>{isLoading ? 'Generating with Gemini AI...' : '✨ Generate Email'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
