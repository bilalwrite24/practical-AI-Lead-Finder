import { GoogleGenAI } from '@google/genai';
import { GroundingSource, ProspectSearchParams, ProspectSearchResult } from '../../types';
import { ISearchProvider } from './types';

export class GoogleGroundingProvider implements ISearchProvider {
  id = 'google-grounding';
  name = 'Google Search Grounding (Live Web)';

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  getMissingConfigHelp(): string {
    return 'GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in your environment or Google AI Studio Secrets panel to enable live Google Search web prospect discovery.';
  }

  async search(params: ProspectSearchParams): Promise<ProspectSearchResult[]> {
    if (!this.isConfigured()) {
      throw new Error(this.getMissingConfigHelp());
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const limit = params.limit || 8;

    const searchQueryPrompt = `
You are a professional B2B lead generation researcher. Use the Google Search tool to find REAL, currently operating companies matching the following B2B prospect criteria:

- Target Industry / Sector: ${params.industry || 'B2B Software'}
- Target Country / Location: ${params.country || 'Global'}
- Company Size / Headcount: ${params.companySize || 'Any'}
- Target Decision Maker Roles: ${params.jobTitles || 'Founders, VP of Sales, Head of Marketing'}
${params.keywords ? `- Additional Keywords: ${params.keywords}` : ''}

CRITICAL RULES:
1. ONLY return REAL companies and verified public web information retrieved from Google Search.
2. NEVER fabricate company names, websites, or contact details.
3. If public details about key executives are verified on official sources or Google Search, include them; otherwise leave keyExecutives empty.
4. Output your response as a STRICT JSON ARRAY of ${limit} companies matching the schema below. Do not wrap in markdown quotes if possible, or use \`\`\`json block.

JSON Schema for each object:
{
  "companyName": "string (Real company legal or trade name)",
  "website": "string (Valid URL e.g. https://example.com)",
  "sourceUrl": "string (Source URL from your search grounding)",
  "description": "string (Accurate 1-2 sentence description of what they do)",
  "industry": "string (Specific sector)",
  "country": "string (Country/HQ location)",
  "estimatedEmployees": "string (e.g. '50-100' or '120')",
  "keyExecutives": ["string (e.g. 'Jane Doe (Founder & CEO)')"],
  "publicDetails": "string (Public offering, target audience, business model)"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: searchQueryPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract real web grounding sources
    const extractedSources: GroundingSource[] = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          extractedSources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri,
          });
        }
      }
    }

    const textContent = response.text || '';
    if (!textContent) {
      return [];
    }

    // Parse JSON from text response
    let rawItems: any[] = [];
    try {
      const cleaned = textContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const jsonStart = cleaned.indexOf('[');
      const jsonEnd = cleaned.lastIndexOf(']');

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
        rawItems = JSON.parse(jsonStr);
      } else {
        // Fallback: try parsing entire string
        rawItems = JSON.parse(cleaned);
      }
    } catch (parseError) {
      console.warn('Failed to parse structured JSON from search grounding response:', parseError, textContent);
      throw new Error('Search provider returned an invalid data format. Please retry your query.');
    }

    if (!Array.isArray(rawItems)) {
      return [];
    }

    const timestamp = new Date().toISOString();

    const results: ProspectSearchResult[] = rawItems
      .filter(item => item && item.companyName && (item.website || item.sourceUrl))
      .slice(0, limit)
      .map((item, index) => {
        // Find relevant grounding sources for this company if available
        const domain = (item.website || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        const matchingSources = extractedSources.filter(s => 
          s.url.toLowerCase().includes(domain) || 
          s.title.toLowerCase().includes((item.companyName || '').toLowerCase())
        );

        const companySources = matchingSources.length > 0 
          ? matchingSources 
          : extractedSources.slice(0, 2);

        return {
          id: `prospect-${Date.now()}-${index}`,
          companyName: String(item.companyName).trim(),
          website: String(item.website || '').trim(),
          sourceUrl: String(item.sourceUrl || item.website || '').trim(),
          description: String(item.description || '').trim(),
          industry: String(item.industry || params.industry || '').trim(),
          country: String(item.country || params.country || '').trim(),
          estimatedEmployees: String(item.estimatedEmployees || 'Unknown').trim(),
          keyExecutives: Array.isArray(item.keyExecutives) ? item.keyExecutives.map((e: any) => String(e).trim()).filter(Boolean) : [],
          publicDetails: String(item.publicDetails || '').trim(),
          retrievedAt: timestamp,
          groundingSources: companySources,
          isVerifiedWebResult: true,
        };
      });

    return results;
  }
}
