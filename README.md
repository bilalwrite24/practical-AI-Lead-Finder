# LeadFit AI — B2B Lead Finder & ICP Prospect Qualifier

A lightweight, professional AI-powered B2B Lead Finder built for real-world prospect research, live web search grounding, policy-compliant LinkedIn discovery, and granular ICP-based CSV filtering.

Created by **Bilal Iqbal** — Digital Marketing & Lead Generation Specialist.

---

## 🌟 Key Features

### 1. Google/Web Prospect Finder
- **Real-Time Web Search Grounding**: Powered by Gemini 3.8 Flash with live Google Search tools (`tools: [{ googleSearch: {} }]`).
- **Verifiable Public Intelligence**: Returns operating companies, verified official domains, public descriptions, headquarters locations, estimated headcount, and source citations.
- **Zero Hallucinated Leads**: Strictly retrieves real public web records. If API keys are missing, the UI presents clear configuration steps rather than fabricating fake contacts or mock companies.
- **1-Click Pipeline Addition**: Save verified companies directly to your Saved Leads pipeline with notes and tags.

### 2. LinkedIn Prospect Discovery
- **High-Precision Boolean Query Generator**: Converts ICP target titles, industries, locations, positive keywords, and negative keywords into structured Boolean expressions (`AND`, `OR`, `NOT`, quotes `""`, and grouped parentheses).
- **Google X-Ray Link Architecture**: Generates direct `site:linkedin.com/in/` and `site:linkedin.com/company/` search URLs that bypass LinkedIn commercial search limits.
- **100% Policy Compliant**: No brittle scraping, bot automation, or session hijacking. Users inspect and open links manually with 1-click clipboard copy.

### 3. CSV Lead Qualification & Scoring
- **Intelligent Column Auto-Mapping**: Automatically detects common headers (Name, Company, Website, Title, Industry, Country, Employees, Email, LinkedIn).
- **Configurable ICP Evaluation Rules**:
  - Target Industries (Weight: 25%)
  - Target Decision Maker Titles (Weight: 35%)
  - Target Countries & Normalization (Weight: 15%)
  - Target Company Size / Headcount range (Weight: 25%)
  - Negative Disqualifier Keywords (Intern, Student, Freelancer, etc.)
- **Granular Fit Categorization**:
  - **High Fit (≥80%)**: Matches core decision maker titles, target industries, and company size.
  - **Medium Fit (50% – 79%)**: Partial criteria alignment.
  - **Needs Review**: Missing required attributes (e.g., unspecified industry or title) are strictly marked **Unknown**, NOT penalized as a mismatch!
  - **Low Fit (<50%)**: Mismatches or negative keyword disqualification.
- **Criterion Explainability**: Every single record contains an inspector showing the exact reason why each criterion matched, partially matched, failed, or was marked Unknown.
- **Duplicate Detection**: Identifies duplicates by website domain (normalized), email, or Contact Name + Company combination.
- **Export Filters**: Export High Fit leads only, All Scored Leads with explanations, or Deduplicated lists to clean CSV files.

### 4. Developer Profile: Bilal Iqbal
- Highlights Bilal Iqbal's specializations in B2B lead generation, prospect research, ICP qualification, cold email infrastructure, and SEO.
- Includes his uploaded portrait, direct inquiry messaging, and verified links:
  - **Freelancer**: [https://www.freelancer.com/u/BilalSeoplogo](https://www.freelancer.com/u/BilalSeoplogo)
  - **LinkedIn**: [https://www.linkedin.com/in/bilal-iqbal-jutt/](https://www.linkedin.com/in/bilal-iqbal-jutt/)
  - **Portfolio**: [https://bilaliqbal.marketing](https://bilaliqbal.marketing)
  - **Email**: [bilalwrite24@gmail.com](mailto:bilalwrite24@gmail.com)

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js 18+ (Node 22 recommended)
- Google Gemini API Key (for live Google Search grounding)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd leadfit-ai

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# GEMINI_API_KEY: Required for Gemini AI & Google Search live web grounding
GEMINI_API_KEY="your_gemini_api_key_here"

# PORT: Server port (defaults to 3000)
PORT=3000
```

### Running the Application

```bash
# Start full-stack development server (Express backend + Vite middleware on port 3000)
npm run dev

# Open your browser at http://localhost:3000
```

---

## 🧪 Running Automated Tests

LeadFit AI includes a 24-assertion test suite verifying:
- Exact ICP matching and score calculations
- Unknown data handling (missing fields tagged `Needs Review` and not penalized as mismatch)
- Negative keyword title disqualification
- Duplicate detection across domains, emails, and contact names
- CSV parsing, column mapping, and export formatting

```bash
# Run unit test suite in terminal
npm test
```

You can also run and inspect the test suite directly in the web application by clicking the **"Verify Tests"** button in the top navigation bar.

---

## 📦 Production Build & Deployment

```bash
# Build the Vite frontend into dist/
npm run build

# Start the full-stack production server
npm start
```

### Deploying to Cloud Run / Docker

The application runs a lightweight Express server (`server.ts`) that serves both the `/api/*` endpoints and static frontend assets from `dist/`:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛡️ Privacy & Compliance

- **No Scraping**: No automated bots or LinkedIn Terms of Service violations.
- **Server-Side Security**: API keys are strictly kept server-side in `server.ts` and never exposed to the client.
- **Zero Mock Fabrications**: Search results are grounded via official Google Search APIs.
