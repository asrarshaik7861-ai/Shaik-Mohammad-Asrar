import React from 'react';
import { EmailRecord } from '../types/email';
import { getEmailStats } from '../utils/storage';
import { StatsCard } from '../components/StatsCard';
import { EmailCard } from '../components/EmailCard';
import {
  Sparkles,
  Inbox,
  BookmarkCheck,
  CalendarDays,
  PlusCircle,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  emails: EmailRecord[];
  onNavigateCreate: () => void;
  onOpenEmail: (email: EmailRecord) => void;
  onEditEmail: (email: EmailRecord) => void;
  onCopyEmail: (email: EmailRecord) => void;
  onDeleteEmail: (id: string) => void;
  copiedId: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  emails,
  onNavigateCreate,
  onOpenEmail,
  onEditEmail,
  onCopyEmail,
  onDeleteEmail,
  copiedId,
}) => {
  const stats = getEmailStats();
  const recentEmails = emails.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl shadow-indigo-950/20 border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini 3.8 Flash Powered</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI Email Generator
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-200/90 leading-relaxed font-normal">
            "Create professional emails in seconds with the power of AI."
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateCreate}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>+ Create New Email</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Real Statistics Grid (calculated from stored emails) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Activity & Performance
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Live storage metrics
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatsCard
            title="Emails Generated"
            value={stats.totalGenerated}
            icon={Send}
            description="Total AI email generations recorded"
            color="indigo"
          />
          <StatsCard
            title="Emails Saved"
            value={stats.totalSaved}
            icon={BookmarkCheck}
            description="Drafts saved in your local library"
            color="emerald"
          />
          <StatsCard
            title="Generated This Week"
            value={stats.generatedThisWeek}
            icon={CalendarDays}
            description="Emails created in the past 7 days"
            color="blue"
          />
        </div>
      </div>

      {/* Recent Emails Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Emails
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly resume, edit, or copy your most recent emails
            </p>
          </div>
          {emails.length > 5 && (
            <button
              onClick={() => onOpenEmail(emails[0])}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentEmails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEmails.map((email) => (
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
        ) : (
          /* Realistic Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/40">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No recent emails found
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              You haven't generated or saved any emails yet. Fill out a simple brief to get your first AI-written email.
            </p>
            <button
              onClick={onNavigateCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Email</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
