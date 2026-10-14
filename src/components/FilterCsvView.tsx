import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  SlidersHorizontal,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Copy,
  ChevronDown,
  Eye,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import {
  ColumnMapping,
  FitCategory,
  ICPDefinition,
  ScoredLead,
  SavedLead,
} from '../types';
import {
  DEFAULT_ICP,
  exportScoredLeadsToCsv,
  processCsvData,
} from '../utils/icpScorer';
import { FitBreakdownModal } from './FitBreakdownModal';

interface FilterCsvViewProps {
  onSaveLead: (lead: Omit<SavedLead, 'id' | 'savedAt'>) => void;
  savedLeads: SavedLead[];
  initialCsvText?: string;
}

const SAMPLE_CSV_DATA = `Full Name,Company Name,Website,Job Title,Industry,Location,Headcount,Work Email
Alex Morgan,HyperScale Cloud,https://hyperscale.io,VP of Sales,B2B SaaS,United States,180,alex@hyperscale.io
Rachel Vance,Nova Security,novasec.com,Chief Executive Officer,Cybersecurity,United Kingdom,95,rachel@novasec.com
David Chen,Apex Logic,https://apexlogic.ai,Founder & CTO,Artificial Intelligence,Canada,45,david@apexlogic.ai
Elena Rostova,FinEdge Software,https://finedge.com,Head of Marketing,FinTech,Germany,120,elena@finedge.com
Marcus Brody,Legacy Manufacturing,https://legacymfg.com,Operations Manager,Industrial Manufacturing,Brazil,1500,marcus@legacymfg.com
Samantha Ray,HyperScale Cloud,http://www.hyperscale.io/team,Director of Sales,B2B SaaS,United States,180,samantha@hyperscale.io
Kevin Wright,CloudFlow Inc,https://cloudflow.io,Head of Growth,,United States,65,kevin@cloudflow.io
Liam Miller,Titan Logistics,titanlogistics.co,Sales Intern,Supply Chain,United States,250,liam@titanlogistics.co
Sophia Taylor,DataPulse,datapulse.io,VP Sales,Software,United States,,sophia@datapulse.io
Rachel Vance,Nova Security,,CEO,Cybersecurity,UK,95,rachel@novasec.com`;

export const FilterCsvView: React.FC<FilterCsvViewProps> = ({
  onSaveLead,
  savedLeads,
  initialCsvText,
}) => {
  const [csvText, setCsvText] = useState(initialCsvText || '');
  const [icp, setIcp] = useState<ICPDefinition>(DEFAULT_ICP);
  const [showIcpEditor, setShowIcpEditor] = useState(false);
  const [userMapping, setUserMapping] = useState<Partial<ColumnMapping>>({});

  const [filterCategory, setFilterCategory] = useState<FitCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dedupMode, setDedupMode] = useState<'all' | 'hideDuplicates' | 'duplicatesOnly'>('all');

  const [selectedLeadForBreakdown, setSelectedLeadForBreakdown] = useState<ScoredLead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute processed data
  const processed = React.useMemo(() => {
    if (!csvText.trim()) return null;
    return processCsvData(csvText, userMapping, icp);
  }, [csvText, userMapping, icp]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setCsvText(content);
      setUserMapping({}); // reset manual mapping for new file
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    setCsvText(SAMPLE_CSV_DATA);
    setUserMapping({});
  };

  const clearData = () => {
    setCsvText('');
    setUserMapping({});
  };

  // Filtered leads based on UI controls
  const displayLeads = React.useMemo(() => {
    if (!processed) return [];
    let items = processed.scoredLeads;

    // Filter by Fit Category
    if (filterCategory !== 'All') {
      items = items.filter(i => i.score.fitCategory === filterCategory);
    }

    // Filter by Duplicate Mode
    if (dedupMode === 'hideDuplicates') {
      items = items.filter(i => !i.score.isDuplicate);
    } else if (dedupMode === 'duplicatesOnly') {
      items = items.filter(i => i.score.isDuplicate);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        i =>
          i.lead.name.toLowerCase().includes(q) ||
          i.lead.company.toLowerCase().includes(q) ||
          i.lead.jobTitle.toLowerCase().includes(q) ||
          i.lead.industry.toLowerCase().includes(q) ||
          i.lead.country.toLowerCase().includes(q) ||
          i.lead.domain.toLowerCase().includes(q)
      );
    }

    return items;
  }, [processed, filterCategory, dedupMode, searchQuery]);

  const handleExport = (exportType: 'all' | 'highFit' | 'deduped') => {
    if (!processed) return;
    let exportCsv = '';

    if (exportType === 'highFit') {
      exportCsv = exportScoredLeadsToCsv(processed.scoredLeads, {
        filterCategory: 'High Fit',
        excludeDuplicates: true,
        includeBreakdown: true,
      });
    } else if (exportType === 'deduped') {
      exportCsv = exportScoredLeadsToCsv(processed.scoredLeads, {
        excludeDuplicates: true,
        includeBreakdown: true,
      });
    } else {
      exportCsv = exportScoredLeadsToCsv(processed.scoredLeads, {
        includeBreakdown: true,
      });
    }

    const blob = new Blob([exportCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadfit-qualified-leads-${exportType}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLeadSaved = (leadId: string) => {
    const scored = processed?.scoredLeads.find(s => s.lead.id === leadId);
    if (!scored) return false;
    return savedLeads.some(
      sl =>
        (scored.lead.website && sl.website && scored.lead.website.toLowerCase() === sl.website.toLowerCase()) ||
        (scored.lead.company && sl.companyName && scored.lead.company.toLowerCase() === sl.companyName.toLowerCase())
    );
  };

  const handleSaveScoredLead = (lead: any) => {
    onSaveLead({
      companyName: lead.company,
      contactName: lead.name,
      website: lead.website,
      jobTitle: lead.jobTitle,
      industry: lead.industry,
      country: lead.country,
      source: 'CSV Upload',
      status: 'Qualified',
      fitCategory: selectedLeadForBreakdown?.score.fitCategory || 'Medium Fit',
      fitScore: selectedLeadForBreakdown?.score.overallScore,
      notes: `CSV Lead: ${lead.jobTitle} at ${lead.company}.`,
      tags: ['CSV Qualified', lead.industry].filter(Boolean),
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ICP Qualification Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CSV Lead Qualification & Scoring
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Upload any B2B contact list. LeadFit AI maps columns, evaluates records against your editable ICP, isolates duplicates, and flags unknown fields for human review.
          </p>
        </div>

        {/* ICP Configuration Trigger */}
        <button
          onClick={() => setShowIcpEditor(!showIcpEditor)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>{showIcpEditor ? 'Close ICP Rules' : 'Edit ICP Rules & Weights'}</span>
        </button>
      </div>

      {/* ICP Rule Customizer Slide-down Panel */}
      {showIcpEditor && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-slate-900/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Customize ICP Evaluation Rules
              </h3>
            </div>
            <button
              onClick={() => setIcp(DEFAULT_ICP)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Target Industries */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Target Industries (Weight: {icp.weights.industry}%)
              </label>
              <textarea
                rows={3}
                value={icp.targetIndustries.join(', ')}
                onChange={e =>
                  setIcp({
                    ...icp,
                    targetIndustries: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Comma separated industries"
              />
            </div>

            {/* Target Job Titles */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Target Titles (Weight: {icp.weights.title}%)
              </label>
              <textarea
                rows={3}
                value={icp.targetJobTitles.join(', ')}
                onChange={e =>
                  setIcp({
                    ...icp,
                    targetJobTitles: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Comma separated target job titles"
              />
            </div>

            {/* Target Countries */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Target Countries (Weight: {icp.weights.country}%)
              </label>
              <textarea
                rows={3}
                value={icp.targetCountries.join(', ')}
                onChange={e =>
                  setIcp({
                    ...icp,
                    targetCountries: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Comma separated countries"
              />
            </div>

            {/* Company Size Range & Negatives */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Headcount Range ({icp.weights.companySize}%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={icp.minEmployees}
                    onChange={e => setIcp({ ...icp, minEmployees: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    className="w-20 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="number"
                    value={icp.maxEmployees}
                    onChange={e => setIcp({ ...icp, maxEmployees: Math.max(1, parseInt(e.target.value, 10) || 500) })}
                    className="w-24 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Negative Disqualifiers
                </label>
                <input
                  type="text"
                  value={icp.negativeKeywords.join(', ')}
                  onChange={e =>
                    setIcp({
                      ...icp,
                      negativeKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="intern, student, freelancer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload & Dropzone Area */}
      {!processed && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Your Prospect CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag and drop your CSV file here, or click to browse. We will automatically detect column headers and normalize record attributes.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              Browse CSV File
            </button>

            <button
              onClick={loadSample}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Load Sample Dataset (10 B2B Leads)
            </button>
          </div>
        </div>
      )}

      {/* Processed Results Dashboard */}
      {processed && (
        <div className="space-y-6">
          {/* File Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Active CSV Dataset ({processed.totalRows} Records)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {processed.headers.length} Columns detected • {processed.duplicateCount} Duplicates identified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Upload Different CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={clearData}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear current data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setFilterCategory('All')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filterCategory === 'All'
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Total Leads
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {processed.totalRows}
              </span>
              <span className="text-[11px] text-slate-400">100% of parsed list</span>
            </button>

            <button
              onClick={() => setFilterCategory('High Fit')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filterCategory === 'High Fit'
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  High Fit (≥80%)
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                {processed.stats.highFit}
              </span>
              <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">
                Priority outreach list
              </span>
            </button>

            <button
              onClick={() => setFilterCategory('Medium Fit')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filterCategory === 'Medium Fit'
                  ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  Medium Fit (50-79%)
                </span>
              </div>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1 block">
                {processed.stats.mediumFit}
              </span>
              <span className="text-[11px] text-amber-600/70 dark:text-amber-400/70">
                Partial criteria matches
              </span>
            </button>

            <button
              onClick={() => setFilterCategory('Needs Review')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filterCategory === 'Needs Review'
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Needs Review
                </span>
              </div>
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 mt-1 block">
                {processed.stats.needsReview}
              </span>
              <span className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70">
                Missing required data
              </span>
            </button>

            <button
              onClick={() => setFilterCategory('Low Fit')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filterCategory === 'Low Fit'
                  ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                  Low Fit (&lt;50%)
                </span>
              </div>
              <span className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1 block">
                {processed.stats.lowFit}
              </span>
              <span className="text-[11px] text-rose-600/70 dark:text-rose-400/70">
                Mismatches / Disqualified
              </span>
            </button>
          </div>

          {/* Filtering, Search & Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search lead, company, role, country..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Deduplication filter selector */}
              <select
                value={dedupMode}
                onChange={e => setDedupMode(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Show All ({processed.totalRows})</option>
                <option value="hideDuplicates">Exclude Duplicates ({processed.totalRows - processed.duplicateCount})</option>
                <option value="duplicatesOnly">Duplicates Only ({processed.duplicateCount})</option>
              </select>
            </div>

            {/* Export Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('highFit')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                title="Download verified High Fit leads with full scoring explanations"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export High Fit ({processed.stats.highFit})</span>
              </button>

              <button
                onClick={() => handleExport('deduped')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>Export Deduplicated</span>
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Contact & Company</th>
                    <th className="py-3 px-4">Role / Title</th>
                    <th className="py-3 px-4">Industry & Country</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">ICP Fit Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {displayLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No leads matching current category or search criteria.
                      </td>
                    </tr>
                  ) : (
                    displayLeads.map(({ lead, score }) => {
                      const saved = isLeadSaved(lead.id);

                      let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                      if (score.fitCategory === 'High Fit') {
                        badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                      } else if (score.fitCategory === 'Medium Fit') {
                        badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                      } else if (score.fitCategory === 'Needs Review') {
                        badgeClass = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
                      } else {
                        badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
                      }

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Name & Company */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{lead.name || 'Unnamed Lead'}</span>
                              {score.isDuplicate && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                                  Duplicate
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>{lead.company || 'Unknown Company'}</span>
                              {lead.website && (
                                <span className="text-slate-400 truncate max-w-[140px]">
                                  • {lead.domain || lead.website}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Role / Title */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lead.jobTitle || (
                                <span className="italic text-indigo-500 dark:text-indigo-400">
                                  Missing Title (Unknown)
                                </span>
                              )}
                            </span>
                          </td>

                          {/* Industry & Country */}
                          <td className="py-3 px-4">
                            <div>{lead.industry || <span className="italic text-indigo-400">Unknown</span>}</div>
                            <div className="text-[11px] text-slate-400">{lead.country || 'Unknown'}</div>
                          </td>

                          {/* Headcount */}
                          <td className="py-3 px-4">
                            {lead.employeeCount ? (
                              <span>{lead.employeeCount}</span>
                            ) : (
                              <span className="italic text-slate-400">Not provided</span>
                            )}
                          </td>

                          {/* Fit Score & Category */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}
                              >
                                {score.fitCategory}
                              </span>
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                {score.overallScore}%
                              </span>
                            </div>
                            {score.hasUnknowns && (
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block mt-0.5">
                                Unknown: {score.unknownFields.join(', ')}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedLeadForBreakdown({ lead, score })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Explain</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedLeadForBreakdown({ lead, score });
                                  handleSaveScoredLead(lead);
                                }}
                                disabled={saved}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                  saved
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                                }`}
                                title={saved ? 'Saved' : 'Save to My Leads'}
                              >
                                {saved ? <Check className="w-3.5 h-3.5" /> : <BookmarkCheck className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fit Breakdown Modal */}
      <FitBreakdownModal
        scoredLead={selectedLeadForBreakdown}
        onClose={() => setSelectedLeadForBreakdown(null)}
        onSaveLead={handleSaveScoredLead}
        isSaved={selectedLeadForBreakdown ? isLeadSaved(selectedLeadForBreakdown.lead.id) : false}
      />
    </div>
  );
};
