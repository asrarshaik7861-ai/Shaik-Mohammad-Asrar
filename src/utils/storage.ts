import { EmailRecord, UserSettings } from '../types/email';

const EMAILS_KEY = 'ai_email_generator_emails_v1';
const GEN_COUNTER_KEY = 'ai_email_generator_gen_count_v1';
const SETTINGS_KEY = 'ai_email_generator_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultTone: 'Professional',
  defaultLength: 'Medium',
  defaultLanguage: 'English',
  autoSubject: true,
  theme: 'system',
};

export function getSavedEmails(): EmailRecord[] {
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to read emails from storage:', e);
    return [];
  }
}

export function saveEmailRecord(record: EmailRecord): void {
  try {
    const existing = getSavedEmails();
    const index = existing.findIndex((e) => e.id === record.id);
    let updated: EmailRecord[];

    if (index >= 0) {
      updated = [...existing];
      updated[index] = {
        ...record,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updated = [
        {
          ...record,
          updatedAt: new Date().toISOString(),
        },
        ...existing,
      ];
    }

    localStorage.setItem(EMAILS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save email to storage:', e);
  }
}

export function deleteEmailRecord(id: string): void {
  try {
    const existing = getSavedEmails();
    const filtered = existing.filter((e) => e.id !== id);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete email from storage:', e);
  }
}

export function clearAllEmails(): void {
  try {
    localStorage.removeItem(EMAILS_KEY);
  } catch (e) {
    console.error('Failed to clear emails:', e);
  }
}

export function incrementGenerationCount(): number {
  try {
    const current = getStoredGenerationCount();
    const updated = current + 1;
    localStorage.setItem(GEN_COUNTER_KEY, updated.toString());
    return updated;
  } catch {
    return 1;
  }
}

export function getStoredGenerationCount(): number {
  try {
    const raw = localStorage.getItem(GEN_COUNTER_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export interface CalculatedStats {
  totalGenerated: number;
  totalSaved: number;
  generatedThisWeek: number;
}

export function getEmailStats(): CalculatedStats {
  const emails = getSavedEmails();
  const rawGenCount = getStoredGenerationCount();
  const totalSaved = emails.length;

  // Real calculation: totalGenerated is at least the number of saved emails, or raw counter if higher
  const totalGenerated = Math.max(totalSaved, rawGenCount);

  // Calculate emails created within the last 7 days from actual stored timestamps
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const generatedThisWeek = emails.filter((item) => {
    try {
      const created = new Date(item.createdAt);
      return created >= sevenDaysAgo;
    } catch {
      return false;
    }
  }).length;

  return {
    totalGenerated,
    totalSaved,
    generatedThisWeek,
  };
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
