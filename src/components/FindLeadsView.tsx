import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  BookmarkCheck,
  Check,
  Building2,
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  Download,
  KeyRound,
  Compass,
  Sparkles,
  Link2
} from 'lucide-react';
import { ProspectSearchParams, ProspectSearchResult, SavedLead } from '../types';
import Papa from 'papaparse';

interface FindLeadsViewProps {
  onSaveLead: (lead: Omit<SavedLead, 'id' | 'savedAt'>) => void;
  savedLeads: SavedLead[];
  onNavigateToLinkedIn: (company: string, industry: string, country: string) => void;
  isBackendReady: boolean;
}

const INDUSTRY_PRESETS = [
  'B2B SaaS',
  'FinTech',
  'Cybersecurity',
  'HealthTech',
  'AI & Machine Learning',
  'E-commerce Logistics',
  'Marketing Agencies'
];

const COUNTRY_PRESETS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany'
];

export const FindLeadsView: React.FC<FindLeadsViewProps> = ({
  onSaveLead,
  savedLeads,
  onNavigateToLinkedIn,
  isBackendReady,
}) => {
  const [industry, setIndustry] = useState('B2B SaaS');
  const [country, setCountry] = useState('United States');
  const [companySize, setCompanySize] = useState('51-200');
  const [jobTitles, setJobTitles] = useState('Founder, CEO, VP of Sales, Head of Marketing');
  const [keywords, setKeywords] = useState('');
  const [limit, setLimit] = useState(8);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProspectSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/prospects/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          country,
          companySize,
          jobTitles,
          keywords,
          limit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search prospects.');
      }

      setResults(data.results || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while connecting to the search provider.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (prospect: ProspectSearchResult) => {
    onSaveLead({
      companyName: prospect.companyName,
      website: prospect.website,
      industry: prospect.industry,
      country: prospect.country,
      source: 'Web Finder',
      status: 'Prospect',
      notes: `Public Details: ${prospect.description}. ${prospect.publicDetails ? `Intelligence: ${prospect.publicDetails}` : ''}`,
      sourceUrl: prospect.sourceUrl || prospect.website,
      tags: ['Google Search', prospect.industry].filter(Boolean),
    });

    setSavedIds(prev => new Set([...prev, prospect.id]));
  };

  const isSaved = (prospect: ProspectSearchResult) => {
    if (savedIds.has(prospect.id)) return true;
    return savedLeads.some(l => 
      (prospect.website && l.website && prospect.website.toLowerCase().includes(l.website.toLowerCase())) ||
      (prospect.companyName && l.companyName && prospect.companyName.toLowerCase() === l.companyName.toLowerCase())
    );
  };

  const exportSearchResults = () => {
    if (results.length === 0) return;
    const exportData = results.map(r => ({
      'Company Name': r.companyName,
      'Website': r.website,
      'Source URL': r.sourceUrl,
      'Industry': r.industry,
      'Country': r.country,
      'Estimated Employees': r.estimatedEmployees,
      'Key Executives': r.keyExecutives.join(', '),
      'Description': r.description,
      'Public Details': r.publicDetails,
      'Retrieved At': r.retrievedAt,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-prospects-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-World Prospect Research</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Google/Web Prospect Finder
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Discover verified, operating companies matching your ideal customer profile using real-time Google Search grounding. No fabricated businesses, hallucinated emails, or simulated records.
        </p>
      </div>

      {/* Search Filter Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Target Industry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Industry / Sector *
              </label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. B2B SaaS, FinTech, Cybersecurity"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {INDUSTRY_PRESETS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setIndustry(p)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                      industry === p
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Country / Region *
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. United States, United Kingdom, Canada"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {COUNTRY_PRESETS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCountry(c)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                      country === c
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Company Size / Headcount
              </label>
              <select
                value={companySize}
                onChange={e => setCompanySize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Any">Any Size</option>
                <option value="1-10">1 – 10 employees (Early Seed / Boutique)</option>
                <option value="11-50">11 – 50 employees (Startup)</option>
                <option value="51-200">51 – 200 employees (Growth / Scale-up)</option>
                <option value="201-500">201 – 500 employees (Mid-Market)</option>
                <option value="500+">500+ employees (Enterprise)</option>
              </select>
            </div>

            {/* Target Job Titles */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Decision Maker Titles
              </label>
              <input
                type="text"
                value={jobTitles}
                onChange={e => setJobTitles(e.target.value)}
                placeholder="e.g. Founder, CEO, VP of Sales, Head of Marketing, CRO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Used to research public leadership and prepare custom LinkedIn discovery queries.
              </p>
            </div>

            {/* Keywords & Limit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Keywords (Optional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="e.g. Series A, B2B, AI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Results Limit
                </label>
                <select
                  value={limit}
                  onChange={e => setLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                >
                  <option value={5}>5 Verified Companies</option>
                  <option value={8}>8 Verified Companies</option>
                  <option value={12}>12 Verified Companies</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Provider: Google Search Grounding with Gemini 3.8 Flash</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus:outline-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Researching Web Prospects...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Live Prospects</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Missing API Key or Error Alert */}
      {error && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-6 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-bold text-sm">Search Configuration Notice</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {error}
              </p>
              <div className="text-xs bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-amber-900 font-mono">
                <code>GEMINI_API_KEY="your-api-key-here"</code>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                LeadFit AI strictly relies on real search grounding and does not fabricate leads or contacts when credentials are missing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Executing Live Web Grounding
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Connecting to Google Search to retrieve operating {industry} companies in {country}. Verifying public domains and business data...
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Live Web Prospects ({results.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified public companies matching your target criteria.
              </p>
            </div>

            <button
              onClick={exportSearchResults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export {results.length} Prospects to CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((prospect) => {
              const alreadySaved = isSaved(prospect);
              return (
                <div
                  key={prospect.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Company Name & Links */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {prospect.companyName}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Verified Web
                          </span>
                        </div>

                        {prospect.website && (
                          <a
                            href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5"
                          >
                            <span>{prospect.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleSave(prospect)}
                        disabled={alreadySaved}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          alreadySaved
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}
                      >
                        {alreadySaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>Save Lead</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {prospect.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{prospect.industry}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{prospect.country}</span>
                      </div>
                      {prospect.estimatedEmployees && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{prospect.estimatedEmployees} staff</span>
                        </div>
                      )}
                    </div>

                    {/* Public details / Intelligence */}
                    {prospect.publicDetails && (
                      <div className="text-[11px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Business Intel: </span>
                        {prospect.publicDetails}
                      </div>
                    )}

                    {/* Key Executives */}
                    {prospect.keyExecutives && prospect.keyExecutives.length > 0 && (
                      <div className="text-[11px]">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Public Leadership: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prospect.keyExecutives.map((exec, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium border border-indigo-100 dark:border-indigo-900">
                              {exec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounding Source Citations */}
                    {prospect.groundingSources && prospect.groundingSources.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Google Search Grounding Citations:
                        </span>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          {prospect.groundingSources.map((source, sIdx) => (
                            <a
                              key={sIdx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline max-w-[200px] truncate"
                            >
                              <Link2 className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{source.title || new URL(source.url).hostname}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: LinkedIn Action & Timestamp */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Retrieved: {new Date(prospect.retrievedAt).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => onNavigateToLinkedIn(prospect.companyName, prospect.industry, prospect.country)}
                      className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Find on LinkedIn</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State before search */}
      {!isLoading && hasSearched && results.length === 0 && !error && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No exact matching companies found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try broadening your industry or location criteria to allow the search provider to locate relevant businesses.
          </p>
        </div>
      )}
    </div>
  );
};
