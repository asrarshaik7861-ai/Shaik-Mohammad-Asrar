import React from 'react';
import { EmailRecord } from '../types/email';
import {
  Mail,
  Copy,
  Trash2,
  ExternalLink,
  Edit2,
  Calendar,
  User,
  Check,
} from 'lucide-react';

interface EmailCardProps {
  email: EmailRecord;
  onOpen: (email: EmailRecord) => void;
  onEdit: (email: EmailRecord) => void;
  onCopy: (email: EmailRecord) => void;
  onDelete: (id: string) => void;
  isCopied?: boolean;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  onOpen,
  onEdit,
  onCopy,
  onDelete,
  isCopied = false,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getBadgeColor = (type: string) => {
    if (type.includes('Job')) {
      return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50';
    }
    if (type.includes('Business') || type.includes('Meeting')) {
      return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50';
    }
    if (type.includes('Thank') || type.includes('Friendly')) {
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
    }
    return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  // Preview snippet: first 140 chars of body
  const previewText = email.body.replace(/\n+/g, ' ').slice(0, 150);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(
              email.type
            )}`}
          >
            {email.type}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(email.createdAt)}</span>
          </div>
        </div>

        {/* Subject */}
        <h4
          onClick={() => onOpen(email)}
          className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
          title={email.subject}
        >
          {email.subject}
        </h4>

        {/* Recipient context if available */}
        {email.recipient && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">To: {email.recipient}</span>
          </div>
        )}

        {/* Body snippet */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          {previewText}...
        </p>
      </div>

      {/* Card action buttons */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpen(email)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(email)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit email"
            aria-label="Edit email"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onCopy(email)}
            className={`p-1.5 rounded-lg transition-colors ${
              isCopied
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Copy email to clipboard"
            aria-label="Copy email"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDelete(email.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Delete email"
            aria-label="Delete email"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
