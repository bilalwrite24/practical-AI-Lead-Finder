import React, { useState, useEffect } from 'react';
import {
  Compass,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  ShieldCheck,
  Building,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { buildLinkedInQueries, LinkedInSearchLinks } from '../utils/linkedinDiscovery';

interface LinkedInDiscoveryViewProps {
  initialCompany?: string;
  initialIndustry?: string;
  initialCountry?: string;
}

export const LinkedInDiscoveryView: React.FC<LinkedInDiscoveryViewProps> = ({
  initialCompany = '',
  initialIndustry = 'B2B SaaS',
  initialCountry = 'United States',
}) => {
  const [jobTitlesInput, setJobTitlesInput] = useState('Founder, CEO, VP of Sales, Head of Marketing, CRO');
  const [companiesInput, setCompaniesInput] = useState(initialCompany);
  const [industry, setIndustry] = useState(initialIndustry);
  const [country, setCountry] = useState(initialCountry);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [negativesInput, setNegativesInput] = useState('Intern, Student, Freelancer, Retired');

  const [queries, setQueries] = useState<LinkedInSearchLinks>({
    directPeopleUrl: '',
    directCompanyUrl: '',
    googleXrayProfilesUrl: '',
    googleXrayCompaniesUrl: '',
    rawBooleanQuery: '',
    googleXrayQuery: '',
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialCompany) setCompaniesInput(initialCompany);
    if (initialIndustry) setIndustry(initialIndustry);
    if (initialCountry) setCountry(initialCountry);
  }, [initialCompany, initialIndustry, initialCountry]);

  useEffect(() => {
    const titles = jobTitlesInput.split(',').map(s => s.trim()).filter(Boolean);
    const comps = companiesInput.split(',').map(s => s.trim()).filter(Boolean);
    const kws = keywordsInput.split(',').map(s => s.trim()).filter(Boolean);
    const negs = negativesInput.split(',').map(s => s.trim()).filter(Boolean);

    const generated = buildLinkedInQueries({
      jobTitles: titles,
      companies: comps,
      industry,
      country,
      keywords: kws,
      negativeKeywords: negs,
    });

    setQueries(generated);
  }, [jobTitlesInput, companiesInput, industry, country, keywordsInput, negativesInput]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Compliant Sales Prospecting</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          LinkedIn Prospect Discovery
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Generate high-precision Boolean queries and Google X-Ray search links based on your ICP criteria. Open LinkedIn results manually with zero scraping risk or account bans.
        </p>
      </div>

      {/* Compliance Notice */}
      <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 dark:text-sky-300 leading-relaxed">
          <span className="font-bold">100% Policy-Compliant Architecture: </span>
          LeadFit AI generates direct manual search strings and Google X-Ray index links. We never automate session cookies, inject browser bots, or scrape LinkedIn.
        </div>
      </div>

      {/* Query Parameters Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-500" />
          <span>ICP Boolean Criteria Builder</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Job Titles */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Target Job Titles (Comma-separated)
            </label>
            <input
              type="text"
              value={jobTitlesInput}
              onChange={e => setJobTitlesInput(e.target.value)}
              placeholder="e.g. Founder, CEO, VP of Sales, Head of Marketing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Automatically converted into Boolean groups like `("Founder" OR "CEO" OR "VP of Sales")`.
            </p>
          </div>

          {/* Target Companies */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Target Companies (Optional - Comma-separated)
            </label>
            <input
              type="text"
              value={companiesInput}
              onChange={e => setCompaniesInput(e.target.value)}
              placeholder="e.g. Stripe, Figma, Datadog (Leave blank for all)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Restricts search to specific target accounts for Account-Based Marketing (ABM).
            </p>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Target Industry / Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. B2B SaaS, FinTech, Cyber Security"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Country / Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Location / Country
            </label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="e.g. United States, United Kingdom, Canada"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Positive Keywords */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Required Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              placeholder="e.g. B2B, Enterprise, Series A, Remote"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Negative / Exclude Keywords */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Negative Keywords to Exclude
            </label>
            <input
              type="text"
              value={negativesInput}
              onChange={e => setNegativesInput(e.target.value)}
              placeholder="e.g. Intern, Student, Freelancer, Retired"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Prefixed with `NOT` or `-` to filter out irrelevant leads.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Search Discovery Links */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Generated Prospect Discovery Channels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Channel 1: Google X-Ray for LinkedIn Profiles */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Top Recommended
                </span>
                <span className="text-xs text-slate-400">Bypasses LinkedIn Commercial Limits</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Google X-Ray LinkedIn Profiles
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Searches Google's public index of verified LinkedIn profile pages directly (`site:linkedin.com/in/`). Completely free and unrestricted.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 break-all border border-slate-200/80 dark:border-slate-700">
                {queries.googleXrayQuery}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={queries.googleXrayProfilesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                <span>Open Google X-Ray Profiles</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => copyToClipboard(queries.googleXrayQuery, 'xray-prof')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy query string"
              >
                {copiedKey === 'xray-prof' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Channel 2: Direct LinkedIn People Search */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Native Platform
                </span>
                <span className="text-xs text-slate-400">Direct LinkedIn App</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                LinkedIn Native People Search
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly opens LinkedIn People Search with full Boolean keyword filtering applied to the query parameters.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 break-all border border-slate-200/80 dark:border-slate-700">
                {queries.rawBooleanQuery}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={queries.directPeopleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors"
              >
                <span>Open in LinkedIn Search</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => copyToClipboard(queries.rawBooleanQuery, 'direct-people')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy Boolean string"
              >
                {copiedKey === 'direct-people' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Channel 3: Google X-Ray for LinkedIn Companies */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Company Pages
              </span>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Google X-Ray LinkedIn Companies
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Searches indexed LinkedIn company overview pages (`site:linkedin.com/company/`) in your vertical.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={queries.googleXrayCompaniesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                <span>Open X-Ray Company Pages</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Channel 4: Native LinkedIn Company Search */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Direct Organization Search
              </span>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                LinkedIn Company Search
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly opens the LinkedIn Companies directory with your industry and geography tags.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={queries.directCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                <span>Open LinkedIn Company Search</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
