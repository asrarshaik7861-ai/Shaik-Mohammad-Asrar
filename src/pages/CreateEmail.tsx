import React from 'react';
import { EmailGenerationRequest } from '../types/email';
import { EmailForm } from '../components/EmailForm';
import { LoadingState } from '../components/LoadingState';
import { Sparkles, AlertTriangle } from 'lucide-react';

interface CreateEmailProps {
  onSubmit: (data: EmailGenerationRequest) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  initialValues?: Partial<EmailGenerationRequest>;
}

export const CreateEmail: React.FC<CreateEmailProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  initialValues,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Your Email
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Provide key points, select your desired tone, and let Gemini AI write an immaculate email.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 animate-in shake">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Generation Failed</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={onClearError}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content: Loading or Form */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
          <LoadingState customMessage="AI is writing your email..." />
        </div>
      ) : (
        <EmailForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
