import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Health / Status endpoint (Never exposes secret API keys)
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
  });
});

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to sanitize and format generated email
function assembleEmailBody(greeting?: string, body?: string, closing?: string, signature?: string): string {
  const parts: string[] = [];
  if (greeting && greeting.trim()) {
    parts.push(greeting.trim());
  }
  if (body && body.trim()) {
    parts.push(body.trim());
  }
  if (closing && closing.trim()) {
    const sign = signature && signature.trim() ? `\n${signature.trim()}` : '\n[Your Name]';
    parts.push(`${closing.trim()}${sign}`);
  }
  return parts.join('\n\n');
}

// Helper to execute generation with automatic retry & model resilience
async function generateWithResilience(
  ai: GoogleGenAI,
  contents: string,
  config: any
) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        // If transient 503 or 429, wait briefly
        const isTransient =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('quota');

        if (isTransient && attempt === 0) {
          await new Promise((r) => setTimeout(r, 1200));
          continue;
        }
        // If still failing, try next model in loop
        break;
      }
    }
  }

  throw lastError || new Error('Failed to generate content with Gemini API');
}

// POST /api/gemini/generate
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const {
      type,
      recipient,
      recipientContext,
      purpose,
      keyPoints,
      tone,
      length,
      language,
      autoSubject = true,
    } = req.body;

    if (!type || !type.trim() || !purpose || !purpose.trim()) {
      return res.status(400).json({
        error: 'Validation Error: Email Type and Purpose are required.',
      });
    }

    const ai = getGenAI();

    const lengthGuide =
      length === 'Short'
        ? 'Short and concise: 1 to 2 crisp paragraphs, approximately 50-100 words.'
        : length === 'Detailed'
        ? 'Detailed and comprehensive: 3 to 4 well-structured paragraphs with clear details or bullet points where appropriate, approximately 200-350 words.'
        : 'Medium length: 2 to 3 balanced paragraphs, approximately 100-200 words.';

    const systemInstruction = `You are an elite, executive-level communication and email writing assistant.
You craft well-written, authentic emails that achieve their objective.

CRITICAL INSTRUCTIONS:
1. Adhere strictly to the requested Tone: "${tone || 'Professional'}".
2. Follow the requested Length: "${length || 'Medium'}" (${lengthGuide}).
3. Write completely in the requested Language: "${language || 'English'}".
4. Strictly incorporate the user's provided Purpose and Key Points.
5. GROUNDING & TRUTH: Never fabricate fake credentials, unverified dates, fictional previous employers, or unmentioned facts. If details are minimal, write a clear, polite message relying only on the provided context.
6. The subject line must be compelling, clear, and relevant to the email type (${autoSubject ? 'optimized automatically' : 'standard'}).
7. Return ONLY clean structured JSON adhering to the specified schema. No markdown wrapping or conversational commentary.`;

    const userPrompt = `Generate a complete email with the following specifications:
- Email Type: ${type}
- Recipient: ${recipient || 'Not specified (use appropriate professional salutation)'}
- Recipient Context/Company: ${recipientContext || 'None provided'}
- Purpose: ${purpose}
- Key Points to Include: ${keyPoints || 'None provided; write a direct, polite message based on purpose'}
- Desired Tone: ${tone || 'Professional'}
- Desired Length: ${length || 'Medium'}
- Target Language: ${language || 'English'}`;

    const response = await generateWithResilience(ai, userPrompt, {
      systemInstruction,
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: {
            type: Type.STRING,
            description: 'Clear, modern email subject line',
          },
          greeting: {
            type: Type.STRING,
            description: 'Appropriate greeting or salutation (e.g., Dear Mr. Miller, / Hi Alex,)',
          },
          body: {
            type: Type.STRING,
            description: 'The complete email body paragraphs without salutation or sign-off',
          },
          closing: {
            type: Type.STRING,
            description: 'Professional sign-off phrase (e.g., Best regards, / Sincerely,)',
          },
          signature: {
            type: Type.STRING,
            description: 'Sender placeholder (e.g., [Your Name]\\n[Your Title or Contact Info])',
          },
        },
        required: ['subject', 'greeting', 'body', 'closing'],
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('EMPTY_RESPONSE');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('MALFORMED_JSON');
      }
    }

    const fullEmail = assembleEmailBody(
      parsed.greeting,
      parsed.body,
      parsed.closing,
      parsed.signature || '[Your Name]'
    );

    return res.json({
      subject: parsed.subject || 'Follow-up regarding your request',
      greeting: parsed.greeting || '',
      body: parsed.body || '',
      closing: parsed.closing || '',
      signature: parsed.signature || '[Your Name]',
      fullEmail,
    });
  } catch (error: any) {
    console.error('Error generating email:', error);
    if (error.message === 'MISSING_API_KEY') {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in AI Studio Secrets.',
      });
    }
    if (error?.status === 503 || error?.message?.includes('high demand')) {
      return res.status(503).json({
        error: 'Gemini is currently experiencing high demand. Please try again in a few moments.',
      });
    }
    return res.status(500).json({
      error: 'Unable to generate the email right now. Please try again.',
    });
  }
});

// POST /api/gemini/improve
app.post('/api/gemini/improve', async (req, res) => {
  try {
    const { action, subject, body, targetLanguage } = req.body;

    if (!action || !body || !body.trim()) {
      return res.status(400).json({
        error: 'Validation Error: Action and Email Body are required.',
      });
    }

    const ai = getGenAI();

    let instructionDetails = '';
    switch (action) {
      case 'formal':
        instructionDetails =
          'Rewrite the email in a formal, sophisticated, and polished executive tone. Ensure all facts, points, and requests remain unchanged.';
        break;
      case 'friendly':
        instructionDetails =
          'Rewrite the email in a warm, personable, friendly, and approachable tone while maintaining professional decorum.';
        break;
      case 'shorter':
        instructionDetails =
          'Make the email significantly shorter, concise, and punchy. Trim unnecessary fillers, fluff, and wordiness while strictly retaining all essential action items and context.';
        break;
      case 'longer':
        instructionDetails =
          'Expand and elaborate on the points naturally with smoother transitions, courteous phrasing, and thorough explanations, without inventing fictional credentials or false facts.';
        break;
      case 'improve_writing':
        instructionDetails =
          'Significantly enhance clarity, vocabulary, sentence variety, persuasiveness, and overall impact. Elevate the writing to executive standard.';
        break;
      case 'fix_grammar':
        instructionDetails =
          'Thoroughly correct all grammar, spelling, punctuation, capitalization, and syntax errors. Do not alter the tone or meaning.';
        break;
      case 'translate':
        instructionDetails = `Accurately translate both the subject and the entire email body into ${
          targetLanguage || 'English'
        }. Maintain natural native phrasing, professional etiquette, and the original tone.`;
        break;
      default:
        instructionDetails = 'Improve the email flow, phrasing, and clarity.';
    }

    const systemInstruction = `You are a professional email editor and refinement expert.
Task: ${instructionDetails}
CRITICAL RULES:
1. Preserve all specific facts, dates, names, links, or contact details.
2. Return ONLY clean structured JSON adhering to the specified schema.
3. The response body MUST be the complete revised email ready to send (including salutation, main body paragraphs, sign-off, and signature placeholder).`;

    const userPrompt = `Current Email Subject:
${subject || '(No subject provided)'}

Current Email Body:
${body}

Action requested: ${action} ${targetLanguage ? `(Target Language: ${targetLanguage})` : ''}

Refine the email according to the instructions.`;

    const response = await generateWithResilience(ai, userPrompt, {
      systemInstruction,
      temperature: 0.6,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: {
            type: Type.STRING,
            description: 'Revised or translated subject line',
          },
          body: {
            type: Type.STRING,
            description: 'Complete refined email body including salutation and sign-off',
          },
        },
        required: ['subject', 'body'],
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('EMPTY_RESPONSE');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('MALFORMED_JSON');
      }
    }

    return res.json({
      subject: parsed.subject || subject || 'Updated Email',
      body: parsed.body || body,
    });
  } catch (error: any) {
    console.error('Error improving email:', error);
    if (error.message === 'MISSING_API_KEY') {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in AI Studio Secrets.',
      });
    }
    if (error?.status === 503 || error?.message?.includes('high demand')) {
      return res.status(503).json({
        error: 'Gemini is currently experiencing high demand. Please try again in a few moments.',
      });
    }
    return res.status(500).json({
      error: 'Unable to improve the email right now. Please try again.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Email Generator server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
