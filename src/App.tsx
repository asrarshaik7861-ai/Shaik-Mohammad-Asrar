/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  EmailRecord,
  EmailGenerationRequest,
  AIImprovementAction,
  EmailLanguage,
  UserSettings,
} from './types/email';
import {
  getSavedEmails,
  saveEmailRecord,
  deleteEmailRecord,
  clearAllEmails,
  incrementGenerationCount,
  getUserSettings,
  saveUserSettings,
} from './utils/storage';
import { generateEmailWithAI, improveEmailWithAI } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { CreateEmail } from './pages/CreateEmail';
import { EmailResult } from './pages/EmailResult';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [savedEmails, setSavedEmails] = useState<EmailRecord[]>([]);
  const [currentEmail, setCurrentEmail] = useState<EmailRecord | null>(null);
  const [originalRequest, setOriginalRequest] = useState<EmailGenerationRequest | null>(null);
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Async states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvingAction, setImprovingAction] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setSavedEmails(getSavedEmails());
    setSettings(getUserSettings());
  }, []);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Toast helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: nextTheme as 'light' | 'dark' };
    setSettings(updated);
    saveUserSettings(updated);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
    addToast('success', 'Preferences updated successfully.');
  };

  // Generate Email Handler
  const handleGenerate = async (req: EmailGenerationRequest) => {
    setIsGenerating(true);
    setGenError(null);

    try {
      const response = await generateEmailWithAI(req);
      incrementGenerationCount();

      const newRecord: EmailRecord = {
        id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: req.type,
        recipient: req.recipient || '',
        recipientContext: req.recipientContext || '',
        purpose: req.purpose,
        keyPoints: req.keyPoints || '',
        tone: req.tone,
        length: req.length,
        language: req.language,
        subject: response.subject,
        body: response.fullEmail || response.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentEmail(newRecord);
      setOriginalRequest(req);
      setCurrentTab('result');
      addToast('success', 'Email generated successfully by Gemini AI!');
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Unable to generate the email right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Email Handler
  const handleRegenerate = async () => {
    if (!originalRequest && !currentEmail) return;

    const req: EmailGenerationRequest = originalRequest || {
      type: currentEmail!.type,
      recipient: currentEmail!.recipient,
      recipientContext: currentEmail!.recipientContext,
      purpose: currentEmail!.purpose,
      keyPoints: currentEmail!.keyPoints,
      tone: currentEmail!.tone,
      length: currentEmail!.length,
      language: currentEmail!.language,
    };

    setIsRegenerating(true);
    try {
      const response = await generateEmailWithAI(req);
      incrementGenerationCount();

      const updated: EmailRecord = {
        ...currentEmail!,
        subject: response.subject,
        body: response.fullEmail || response.body,
        updatedAt: new Date().toISOString(),
      };

      setCurrentEmail(updated);
      // If already in saved list, keep in sync
      if (savedEmails.some((e) => e.id === updated.id)) {
        saveEmailRecord(updated);
        setSavedEmails(getSavedEmails());
      }
      addToast('success', 'Email regenerated with fresh phrasing.');
    } catch (err: any) {
      addToast('error', err.message || 'Unable to regenerate email.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // AI Improvement Handler
  const handleAIImprove = async (action: AIImprovementAction, targetLanguage?: EmailLanguage) => {
    if (!currentEmail) return;

    setIsImproving(true);
    setImprovingAction(action);

    try {
      const response = await improveEmailWithAI({
        action,
        subject: currentEmail.subject,
        body: currentEmail.body,
        targetLanguage,
      });

      const updated: EmailRecord = {
        ...currentEmail,
        subject: response.subject || currentEmail.subject,
        body: response.body || currentEmail.body,
        language: targetLanguage || currentEmail.language,
        updatedAt: new Date().toISOString(),
      };

      setCurrentEmail(updated);

      // If it exists in saved emails, update it there too
      if (savedEmails.some((e) => e.id === updated.id)) {
        saveEmailRecord(updated);
        setSavedEmails(getSavedEmails());
      }

      addToast(
        'success',
        action === 'translate'
          ? `Email translated into ${targetLanguage || 'selected language'}.`
          : `Email improved with ${action.replace('_', ' ')}.`
      );
    } catch (err: any) {
      addToast('error', err.message || 'Unable to improve email right now.');
    } finally {
      setIsImproving(false);
      setImprovingAction(null);
    }
  };

  // Save Email Handler
  const handleSaveEmail = (record: EmailRecord) => {
    saveEmailRecord(record);
    setSavedEmails(getSavedEmails());
    addToast('success', 'Email saved successfully to your library.');
  };

  // Delete Email Handler
  const handleDeleteEmail = (id: string) => {
    deleteEmailRecord(id);
    setSavedEmails(getSavedEmails());
    if (currentEmail?.id === id) {
      setCurrentEmail(null);
      if (currentTab === 'result') {
        setCurrentTab('history');
      }
    }
    addToast('info', 'Email removed from history.');
  };

  // Copy Email Handler
  const handleCopyEmail = async (email: EmailRecord) => {
    try {
      const text = `Subject: ${email.subject}\n\n${email.body}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(email.id);
      addToast('success', 'Email copied successfully.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      addToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Open Email in Result Screen
  const handleOpenEmail = (email: EmailRecord) => {
    setCurrentEmail(email);
    setOriginalRequest({
      type: email.type,
      recipient: email.recipient,
      recipientContext: email.recipientContext,
      purpose: email.purpose,
      keyPoints: email.keyPoints,
      tone: email.tone,
      length: email.length,
      language: email.language,
    });
    setCurrentTab('result');
  };

  // Export saved emails as JSON
  const handleExportEmails = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedEmails, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ai_emails_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Email library exported as JSON.');
  };

  // Clear all saved emails
  const handleClearAllEmails = () => {
    clearAllEmails();
    setSavedEmails([]);
    if (currentTab === 'result') {
      setCurrentTab('dashboard');
    }
    addToast('info', 'All saved emails have been cleared.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        savedCount={savedEmails.length}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobile={() => setIsOpenMobile(true)}
          onNavigateCreate={() => setCurrentTab('create')}
          theme={settings.theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              emails={savedEmails}
              onNavigateCreate={() => setCurrentTab('create')}
              onOpenEmail={handleOpenEmail}
              onEditEmail={handleOpenEmail}
              onCopyEmail={handleCopyEmail}
              onDeleteEmail={handleDeleteEmail}
              copiedId={copiedId}
            />
          )}

          {currentTab === 'create' && (
            <CreateEmail
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              error={genError}
              onClearError={() => setGenError(null)}
              initialValues={{
                tone: settings.defaultTone,
                length: settings.defaultLength,
                language: settings.defaultLanguage,
                autoSubject: settings.autoSubject,
              }}
            />
          )}

          {currentTab === 'result' && currentEmail && (
            <EmailResult
              currentEmail={currentEmail}
              originalRequest={originalRequest || undefined}
              onUpdateEmail={(updates) => {
                const updated = { ...currentEmail, ...updates };
                setCurrentEmail(updated);
              }}
              onSaveEmail={handleSaveEmail}
              onRegenerate={handleRegenerate}
              onAIImprove={handleAIImprove}
              onBackToCreate={() => setCurrentTab('create')}
              isSaving={false}
              isRegenerating={isRegenerating}
              isImproving={isImproving}
              improvingAction={improvingAction}
              onCopySuccess={() => addToast('success', 'Email copied successfully.')}
            />
          )}

          {currentTab === 'result' && !currentEmail && (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">No email active to display.</p>
              <button
                onClick={() => setCurrentTab('create')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm"
              >
                Create Email
              </button>
            </div>
          )}

          {currentTab === 'history' && (
            <History
              emails={savedEmails}
              onOpenEmail={handleOpenEmail}
              onEditEmail={handleOpenEmail}
              onCopyEmail={handleCopyEmail}
              onDeleteEmail={handleDeleteEmail}
              onNavigateCreate={() => setCurrentTab('create')}
              copiedId={copiedId}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearAllEmails={handleClearAllEmails}
              savedEmailsCount={savedEmails.length}
              onExportEmails={handleExportEmails}
            />
          )}
        </main>
      </div>
    </div>
  );
}
