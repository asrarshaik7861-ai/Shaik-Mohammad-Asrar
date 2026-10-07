export type EmailType =
  | 'Job Application'
  | 'Job Follow-up'
  | 'Leave Request'
  | 'Meeting Request'
  | 'Meeting Follow-up'
  | 'Customer Support'
  | 'Complaint'
  | 'Thank You'
  | 'Apology'
  | 'Business Proposal'
  | 'Resignation'
  | 'Personal'
  | 'Custom';

export type EmailTone =
  | 'Professional'
  | 'Formal'
  | 'Friendly'
  | 'Polite'
  | 'Confident'
  | 'Persuasive'
  | 'Apologetic';

export type EmailLength = 'Short' | 'Medium' | 'Detailed';

export type EmailLanguage =
  | 'English'
  | 'Hindi'
  | 'Telugu'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Arabic'
  | 'Japanese';

export type AIImprovementAction =
  | 'formal'
  | 'friendly'
  | 'shorter'
  | 'longer'
  | 'improve_writing'
  | 'fix_grammar'
  | 'translate';

export interface EmailRecord {
  id: string;
  type: EmailType;
  recipient: string;
  recipientContext: string;
  purpose: string;
  keyPoints: string;
  tone: EmailTone;
  length: EmailLength;
  language: EmailLanguage;
  subject: string;
  body: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface EmailGenerationRequest {
  type: EmailType;
  recipient?: string;
  recipientContext?: string;
  purpose: string;
  keyPoints?: string;
  tone: EmailTone;
  length: EmailLength;
  language: EmailLanguage;
  autoSubject?: boolean;
}

export interface EmailGenerationResponse {
  subject: string;
  greeting?: string;
  body: string;
  closing?: string;
  signature?: string;
  fullEmail: string;
}

export interface EmailImproveRequest {
  action: AIImprovementAction;
  subject: string;
  body: string;
  targetLanguage?: EmailLanguage;
}

export interface EmailImproveResponse {
  subject: string;
  body: string;
}

export interface UserSettings {
  defaultTone: EmailTone;
  defaultLength: EmailLength;
  defaultLanguage: EmailLanguage;
  autoSubject: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SystemHealth {
  status: string;
  hasApiKey: boolean;
  model: string;
}
