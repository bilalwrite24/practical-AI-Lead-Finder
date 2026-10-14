import React from 'react';
import {
  Compass,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  Users,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { NavTab } from './Navbar';
import { DEFAULT_ICP } from '../utils/icpScorer';
import bilalPortraitImg from '../assets/images/bilal_iqbal_1791946625244.jpg';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  savedCount: number;
  onOpenTests: () => void;
  onLoadSampleCsv: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  savedCount,
  onOpenTests,
  onLoadSampleCsv,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-10 rounded-3xl bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-indigo-100/60 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Built by Bilal Iqbal • B2B Lead Generation Specialist</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Real B2B Prospect Research &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Precision ICP Filtering
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            LeadFit AI solves real prospecting workflows. Find live companies using Google Search grounding, generate surgical LinkedIn Boolean queries, and qualify CSV lists with granular, explainable ICP rules.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('find')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all hover:translate-y-[-1px] focus:outline-none"
            >
              <Search className="w-4 h-4" />
              <span>Search Real Web Prospects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('csv')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition-all focus:outline-none"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Filter & Score CSV Leads</span>
            </button>

            <button
              onClick={() => onNavigate('linkedin')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors"
            >
              <Compass className="w-4 h-4 text-sky-500" />
              <span>LinkedIn Boolean Discovery</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Fabricated Data or Fake Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Explainable ICP Match Criteria</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Automatic Duplicate Detection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Policy-Compliant Discovery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Web Prospect Finder */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Google/Web Prospect Finder
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Target specific industries, countries, company sizes, and keywords. Queries real-time public web information with live Google Search grounding and verifiable URL sources.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Live verified company domains & official URLs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Retrieval timestamp and source grounding citations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Zero fake contacts or simulated records
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('find')}
            className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-indigo-600 dark:text-indigo-300 font-semibold text-xs transition-colors"
          >
            <span>Launch Web Finder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 2: CSV ICP Qualification */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              CSV Lead Qualification
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload lead lists, map columns effortlessly, and score records as High Fit, Medium Fit, Low Fit, or Needs Review with full criterion explainability.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Missing info marked Unknown, not mismatch
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Duplicate detection across domains, emails & contacts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Custom weights and negative keyword filters
              </li>
            </ul>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={() => onNavigate('csv')}
              className="flex-1 inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-emerald-600 dark:text-emerald-300 font-semibold text-xs transition-colors"
            >
              <span>Upload CSV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoadSampleCsv}
              title="Load pre-built sample lead list with mixed fit categories"
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              Try Sample
            </button>
          </div>
        </div>

        {/* Module 3: LinkedIn Discovery */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              LinkedIn Prospect Discovery
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate structured Boolean queries and Google X-Ray search URLs tailored to your ICP criteria. Open LinkedIn results manually without risky scraping.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Targeted job titles with Boolean OR/AND syntax
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Google X-Ray links (`site:linkedin.com/in/`)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Strictly policy-compliant manual exploration
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('linkedin')}
            className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-sky-600 dark:text-sky-300 font-semibold text-xs transition-colors"
          >
            <span>Open Boolean Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ICP Overview & Developer Profile Callout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ICP Snapshot */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Active ICP Profile Snapshot
              </h3>
            </div>
            <button
              onClick={() => onNavigate('csv')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Customize Rules →
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            LeadFit AI scores records by evaluating four distinct criteria against your ideal customer profile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Industries ({DEFAULT_ICP.weights.industry} pts)
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {DEFAULT_ICP.targetIndustries.slice(0, 5).map(ind => (
                  <span key={ind} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[11px]">
                    {ind}
                  </span>
                ))}
                <span className="text-slate-400 self-center">+{DEFAULT_ICP.targetIndustries.length - 5} more</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Company Size Range ({DEFAULT_ICP.weights.companySize} pts)
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-1 font-semibold text-sm">
                {DEFAULT_ICP.minEmployees} – {DEFAULT_ICP.maxEmployees} employees
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Smart parser handles '50-200', '1,200', '10k', and '500+' formats.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Job Titles ({DEFAULT_ICP.weights.title} pts)
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {DEFAULT_ICP.targetJobTitles.slice(0, 4).map(title => (
                  <span key={title} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[11px]">
                    {title}
                  </span>
                ))}
                <span className="text-slate-400 self-center">+{DEFAULT_ICP.targetJobTitles.length - 4} more</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Countries ({DEFAULT_ICP.weights.country} pts)
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {DEFAULT_ICP.targetCountries.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Developer Profile Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/30 shadow-md shrink-0">
                <img
                  src={bilalPortraitImg}
                  alt="Bilal Iqbal"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Bilal Iqbal</h4>
                <p className="text-xs text-indigo-300 font-medium">Digital Marketing & Lead Gen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Specialist in B2B lead generation, prospect research, ICP qualification, cold outreach architecture, and verified sales intelligence.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-medium text-slate-200">
                B2B Lead Gen
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-medium text-slate-200">
                ICP Qualification
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-medium text-slate-200">
                Prospect Research
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-medium text-slate-200">
                Email Marketing
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Hire for Lead Gen</span>
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-cyan-200"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Verification Suite Quick Bar */}
      <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Verified Lead Scoring Engine & Suite
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              24 automated test assertions verify exact ICP matching, missing-data 'Needs Review' tagging, negative keyword disqualifiers, and duplicate detection.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenTests}
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          View Verification Suite
        </button>
      </section>
    </div>
  );
};
