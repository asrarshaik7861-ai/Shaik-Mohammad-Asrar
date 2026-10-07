# AI Email Generator

> **"Write better emails in seconds with AI."**

A modern, production-grade AI-powered email writing assistant built with Google's **Gemini 3.8 Flash** model, React 19, TypeScript, Express, and Tailwind CSS.

---

## 1. Project Overview

**AI Email Generator** transforms brief notes, bullet points, or intents into professional, impeccably structured emails. Designed with enterprise-grade aesthetics, intuitive workflows, and a secure server-side architecture, the app empowers professionals, job seekers, and business owners to draft, edit, refine, and manage emails with zero friction.

### Highlights
- **100% Server-Side AI**: Gemini API keys are never exposed in browser JavaScript.
- **Real AI Generation & Editing**: Authentic completions powered by Google Gemini 3.8 Flash.
- **Accurate Grounding**: Strict anti-hallucination prompting ensures no fake credentials, fictional employers, or untrue facts are fabricated.
- **No Mock Statistics**: Live metrics are calculated dynamically from actual stored emails.
- **Instant AI Improvements**: Make formal, friendly, shorter, longer, fix grammar, or translate into multiple languages with one click.
- **Zero Configuration Storage**: Instant local persistence using LocalStorage with JSON backup export.

---

## 2. Features

### 📨 Smart Email Generation
- **13 Specialized Email Types**: Job Application, Job Follow-up, Leave Request, Meeting Request, Meeting Follow-up, Customer Support, Complaint, Thank You, Apology, Business Proposal, Resignation, Personal, and Custom.
- **Contextual Input Fields**: Specify recipient name, company/role context, core purpose, and key bullet points.
- **7 Tones of Voice**: Professional, Formal, Friendly, Polite, Confident, Persuasive, and Apologetic.
- **Adjustable Length Profiles**:
  - *Short*: 1–2 concise paragraphs (~50–100 words).
  - *Medium*: 2–3 structured paragraphs (~100–200 words).
  - *Detailed*: Comprehensive sections with clear bullet points (~200–350 words).
- **Multilingual Support**: Generate natively in **English, Hindi, Telugu**, Spanish, French, German, Arabic, or Japanese.
- **Auto-Generate Subject Toggle**: Generates high-open-rate subject lines automatically.

### ✍️ Generated Email Workspace
- **Distraction-Free Reading Pane**: Clean presentation of Subject and formatted Email Body.
- **Direct Email Editor**: In-place editor allowing manual adjustments to the subject line and body with word & character counters.
- **Regenerate**: Instantly request an alternative version from Gemini AI with the original criteria intact.
- **One-Click Copy**: Copies subject and body to clipboard with clear confirmation feedback.
- **Local Library Saving**: Save completed emails to your personal history.

### ⚡ AI Action Enhancements
- **Make Formal**: Rewrite with polished, executive-level corporate etiquette.
- **Make Friendly**: Infuse warmth and approachable phrasing while staying professional.
- **Make Shorter**: Condense fluff while preserving all key facts, names, and requests.
- **Make Longer**: Elaborate naturally with smooth transitions and courteous context.
- **Improve Writing**: Elevate flow, impact, and vocabulary.
- **Fix Grammar**: Eliminate spelling, syntax, and punctuation issues with surgical precision.
- **Translate**: Translate both the subject line and email body into target languages (including Hindi and Telugu).

### 📊 Dashboard & History Management
- **Live Statistics**:
  - *Emails Generated*: Count of generations processed.
  - *Emails Saved*: Count of stored drafts.
  - *Generated This Week*: Count of emails produced in the last 7 days.
- **Search & Filter**: Search emails by subject, email type, or recipient; filter by category.
- **Data Management**: Export library as JSON, or clear history with safe confirmation.
- **Theme Support**: Seamless Light, Dark, and System theme preferences.

---

## 3. Technology Stack

- **Frontend**:
  - React 19 (`react`, `react-dom`)
  - TypeScript (`tsc`)
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - Lucide Icons (`lucide-react`)
  - Motion (`motion`)
- **Backend**:
  - Node.js 22
  - Express 4 (`express`)
  - `@google/genai` (Official Google Gen AI SDK)
  - `dotenv` (Environment variable management)
  - `tsx` (TypeScript runtime)
- **AI Model**:
  - `gemini-3.8-flash` (Fast, highly accurate reasoning and structured output)

---

## 4. Architecture

```
ai-email-generator/
├── server.ts                    # Full-stack Express server + Gemini AI endpoints
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # Responsive navigation & theme toggles
│   │   ├── Header.tsx           # Page header, breadcrumb & model status
│   │   ├── EmailForm.tsx        # Generation form with presets & validation
│   │   ├── ToneSelector.tsx     # Tone selection buttons
│   │   ├── LengthSelector.tsx   # Length profile cards
│   │   ├── LanguageSelector.tsx # Multilingual selection
│   │   ├── EmailEditor.tsx      # Subject & body manual editor
│   │   ├── EmailCard.tsx        # History and recent emails card
│   │   ├── StatsCard.tsx        # Real metrics visual cards
│   │   ├── LoadingState.tsx     # Animated progress and writing steps
│   │   └── Toast.tsx            # Toast notification container
│   ├── pages/
│   │   ├── Dashboard.tsx        # Overview, metrics & recent drafts
│   │   ├── CreateEmail.tsx      # Main form creation workflow
│   │   ├── EmailResult.tsx      # Generated email view & AI action tools
│   │   ├── History.tsx          # Saved emails library with search & filter
│   │   └── Settings.tsx         # Tone/length defaults, dark mode, health
│   ├── services/
│   │   └── geminiService.ts     # Client fetch wrapper to backend API
│   ├── utils/
│   │   ├── storage.ts           # LocalStorage CRUD and statistics engine
│   │   └── validation.ts        # Form validation rules
│   ├── types/
│   │   └── email.ts             # TypeScript definitions & interfaces
│   ├── App.tsx                  # Root state & tab routing
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind CSS v4 styles
├── metadata.json                # Project capabilities metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

### Security Pipeline
```
[Browser Client]
       │
       ▼  (POST /api/gemini/generate)
[Express Server (server.ts)]
       │
       ▼  (Calls @google/genai with process.env.GEMINI_API_KEY)
[Google Gemini 3.8 Flash API]
       │
       ▼  (Validates JSON schema, formats email)
[Browser Client Displays Result]
```
*At no point is the `GEMINI_API_KEY` sent to or accessible within the browser.*

---

## 5. Environment Variables & Gemini API Setup

### Environment Variables
Configure the following variable in your `.env` file (or through the **Secrets** panel in Google AI Studio):

```bash
# GEMINI_API_KEY: Required for Gemini AI API calls
GEMINI_API_KEY="your-gemini-api-key-here"

# PORT: Optional port for server (default 3000)
PORT=3000
```

### How to Get and Configure `GEMINI_API_KEY`
1. Visit [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click **Get API key** in the left navigation.
3. Click **Create API key** (select a Google Cloud project if prompted).
4. Copy the generated key.
5. In your local project root:
   - Create a file named `.env`
   - Add: `GEMINI_API_KEY="your_copied_key"`
6. In **AI Studio Build environment**:
   - The key is automatically injected or configured via the **Secrets** panel.

---

## 6. Installation & Running Locally

### Prerequisites
- Node.js 20+ (Node.js 22 recommended)
- npm 9+

### Steps
1. **Clone or download the project repository**:
   ```bash
   git clone <repo-url>
   cd ai-email-generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual GEMINI_API_KEY
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Build Instructions

To build the project for production:

```bash
npm run build
```

This compiles the frontend into the `dist/` folder.

To start the production server:
```bash
npm start
```
The server will automatically serve the built static assets from `dist/` and handle API requests.

---

## 8. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Gemini API key is not configured"** | Missing `GEMINI_API_KEY` in environment | Add `GEMINI_API_KEY` in `.env` or in AI Studio Secrets panel. |
| **"Unable to generate the email right now"** | Transient network error or API rate limit | Click "Regenerate" or wait a few seconds before retrying. |
| **Validation Error on Submit** | Missing required Email Type or Purpose | Ensure both Email Type and a brief Purpose (at least 5 characters) are filled in. |
| **Dark mode not sticking** | Browser LocalStorage blocked | Enable LocalStorage in browser privacy settings. |

---

## 9. Future Improvements

- **Rich Text / HTML Export**: Download formatted HTML emails ready for Outlook, Gmail, or Apple Mail.
- **Direct Mailto / Gmail Link**: One-click opening directly into a Gmail draft compose window.
- **Custom Tone Presets**: Allow users to save custom tone styles (e.g., "Executive Founder", "Casual Creative").
- **Email Reply Assistant**: Paste incoming emails to generate smart context-aware replies.
