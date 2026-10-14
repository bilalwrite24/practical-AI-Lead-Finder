import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { providerRegistry } from './src/server/providers/index';
import { ProspectSearchParams } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Health check & configuration status
app.get('/api/health', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const providers = providerRegistry.listProviders();

  res.json({
    status: 'ok',
    version: '1.0.0',
    providers,
    hasGeminiKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API: List search providers
app.get('/api/providers', (_req: Request, res: Response) => {
  res.json(providerRegistry.listProviders());
});

// API: Real-world prospect search using modular provider (Google Search Grounding)
app.post('/api/prospects/search', async (req: Request, res: Response) => {
  try {
    const { industry, country, companySize, jobTitles, keywords, providerId, limit } = req.body;

    if (!industry && !jobTitles && !keywords) {
      return res.status(400).json({
        error: 'Please specify at least an Industry, Target Job Titles, or Keywords to perform prospect research.',
      });
    }

    const provider = providerRegistry.getProvider(providerId);

    if (!provider.isConfigured()) {
      return res.status(503).json({
        error: provider.getMissingConfigHelp(),
        providerName: provider.name,
        code: 'MISSING_API_KEY',
      });
    }

    const searchParams: ProspectSearchParams = {
      industry: String(industry || '').trim(),
      country: String(country || '').trim(),
      companySize: companySize ? String(companySize).trim() : undefined,
      jobTitles: String(jobTitles || '').trim(),
      keywords: keywords ? String(keywords).trim() : undefined,
      limit: limit ? Math.min(Math.max(parseInt(String(limit), 10), 1), 15) : 8,
    };

    const results = await provider.search(searchParams);

    return res.json({
      success: true,
      provider: provider.name,
      results,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during prospect search:', error);
    let errorMessage = error.message || 'An error occurred while researching prospects. Please try again.';

    // Clean up Google GenAI JSON error strings if present
    if (typeof errorMessage === 'string' && (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota'))) {
      errorMessage = 'Google Search provider rate limit reached (API quota exceeded). Please wait a moment before running another search, or configure a paid/higher-quota GEMINI_API_KEY in your environment.';
    } else if (typeof errorMessage === 'string' && errorMessage.startsWith('{')) {
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error && parsed.error.message) {
          errorMessage = parsed.error.message;
        }
      } catch {}
    }

    return res.status(500).json({
      error: errorMessage,
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LeadFit AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
