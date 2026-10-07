import {
  EmailGenerationRequest,
  EmailGenerationResponse,
  EmailImproveRequest,
  EmailImproveResponse,
  SystemHealth,
} from '../types/email';

export async function checkSystemHealth(): Promise<SystemHealth> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { status: 'error', hasApiKey: false, model: 'gemini-3.8-flash' };
    }
    return await res.json();
  } catch (error) {
    return { status: 'offline', hasApiKey: false, model: 'gemini-3.8-flash' };
  }
}

export async function generateEmailWithAI(
  req: EmailGenerationRequest
): Promise<EmailGenerationResponse> {
  const response = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to generate the email right now. Please try again.');
  }

  return data;
}

export async function improveEmailWithAI(
  req: EmailImproveRequest
): Promise<EmailImproveResponse> {
  const response = await fetch('/api/gemini/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to improve the email right now. Please try again.');
  }

  return data;
}
