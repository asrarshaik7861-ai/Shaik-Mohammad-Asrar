import React, { useState, useMemo } from 'react';
import { EmailRecord, EmailType } from '../types/email';
import { EmailCard } from '../components/EmailCard';
import {
  Search,
  Filter,
  Inbox,
  PlusCircle,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HistoryProps {
  emails: EmailRecord[];
  onOpenEmail: (email: EmailRecord) => void;
  onEditEmail: (email: EmailRecord) => void;
  onCopyEmail: (email: EmailRecord) => void;
  onDeleteEmail: (id: string) => void;
  onNavigateCreate: () => void;
  copiedId: string | null;
}

const FILTER_TYPES: string[] = [
  'All Types',
  'Job Application',
  'Job Follow-up',
  'Leave Request',
  'Meeting Request',
  'Meeting Follow-up',
  'Business Proposal',
  'Customer Support',
  'Thank You',
  'Personal',
];

export const History: React.FC<HistoryProps> = ({
  emails,
  onOpenEmail,
  onEditEmail,
  onCopyEmail,
  onDeleteEmail,
  onNavigateCreate,
  copiedId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');

  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      // Type filter
      if (selectedType !== 'All Types' && item.type !== selectedType) {
        return false;
      }

      // Search query: subject, email type, recipient
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchSubject = item.subject.toLowerCase().includes(query);
        const matchType = item.type.toLowerCase().includes(query);
        const matchRecipient = (item.recipient || '').toLowerCase().includes(query);
        const matchBody = (item.body || '').toLowerCase().includes(query);

        return matchSubject || matchType || matchRecipient || matchBody;
      }

      return true;
    });
  }, [emails, searchQuery, selectedType]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Email History
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse, search, and manage your saved AI-generated emails.
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>New Email</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, email type, or recipient..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter select */}
        <div className="relative w-full sm:w-56 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-xs"
          >
            {FILTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {emails.length === 0 ? (
        /* Empty state: No saved emails yet */
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-14 text-center bg-white/50 dark:bg-slate-900/40">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            No saved emails yet.
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5 mb-6">
            Whenever you generate an email and click "Save Email", it will be securely preserved right here.
          </p>
          <button
            onClick={onNavigateCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Email</span>
          </button>
        </div>
      ) : filteredEmails.length === 0 ? (
        /* Empty search results */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center bg-white dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No emails match your search or filter.
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Try adjusting your search terms or selecting "All Types".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All Types');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onOpen={onOpenEmail}
              onEdit={onEditEmail}
              onCopy={onCopyEmail}
              onDelete={onDeleteEmail}
              isCopied={copiedId === email.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
