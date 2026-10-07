import React from 'react';
import { Menu, Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenMobile: () => void;
  onNavigateCreate: () => void;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobile,
  onNavigateCreate,
  theme,
  onToggleTheme,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'create':
        return 'Create New Email';
      case 'result':
        return 'Generated Email';
      case 'history':
        return 'Saved Email History';
      case 'settings':
        return 'Preferences & Settings';
      default:
        return 'AI Email Generator';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {getTabTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
            AI Email Generator • Powered by Gemini 3.8 Flash
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light / Dark mode"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {currentTab !== 'create' && currentTab !== 'result' && (
          <button
            onClick={onNavigateCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Email</span>
            <span className="sm:hidden">Write</span>
          </button>
        )}
      </div>
    </header>
  );
};
