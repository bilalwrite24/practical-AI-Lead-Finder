import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Building2,
  Users,
  MapPin,
  Briefcase,
  Copy,
  ExternalLink,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { CriterionResult, ScoredLead } from '../types';

interface FitBreakdownModalProps {
  scoredLead: ScoredLead | null;
  onClose: () => void;
  onSaveLead: (lead: any) => void;
  isSaved: boolean;
}

export const FitBreakdownModal: React.FC<FitBreakdownModalProps> = ({
  scoredLead,
  onClose,
  onSaveLead,
  isSaved,
}) => {
  if (!scoredLead) return null;

  const { lead, score } = scoredLead;

  const renderCriterionStatus = (criterionName: string, icon: React.ReactNode, result: CriterionResult) => {
    let badgeBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    let StatusIcon = HelpCircle;

    if (result.status === 'match') {
      badgeBg = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      StatusIcon = CheckCircle2;
    } else if (result.status === 'partial') {
      badgeBg = 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      StatusIcon = AlertCircle;
    } else if (result.status === 'unknown') {
      badgeBg = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      StatusIcon = HelpCircle;
    } else {
      badgeBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      StatusIcon = XCircle;
    }

    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">{icon}</span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{criterionName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{result.status}</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {result.score}/{result.maxScore} pts
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
          {result.reason}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lead.name || 'Unknown Contact'}
              </h3>
              {lead.company && (
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  @ {lead.company}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lead.jobTitle || 'No Title'} • {lead.website || lead.domain || 'No Website'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Fit Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-50/50 dark:from-slate-800 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Qualification Assessment
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {score.fitCategory}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-600 text-white">
                  {score.overallScore}% ICP Fit
                </span>
              </div>
            </div>

            <button
              onClick={() => onSaveLead(lead)}
              disabled={isSaved}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Leads</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Save to Leads</span>
                </>
              )}
            </button>
          </div>

          {/* Duplicate Warning if flagged */}
          {score.isDuplicate && (
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4" />
                Duplicate Record Detected
              </span>
              <p>{score.duplicateReason}</p>
            </div>
          )}

          {/* Unknown Notice if flagged */}
          {score.hasUnknowns && (
            <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/80 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                <HelpCircle className="w-4 h-4" />
                Missing Information Flagged (Needs Review)
              </span>
              <p>
                The following criteria could not be evaluated due to missing input fields: {score.unknownFields.join(', ')}.
                LeadFit AI strictly marks missing data as Unknown rather than penalizing as an automatic mismatch.
              </p>
            </div>
          )}

          {/* Criteria Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Detailed Criteria Breakdown
            </h4>

            {renderCriterionStatus('Job Title & Seniority', <Briefcase className="w-4 h-4" />, score.criteria.title)}
            {renderCriterionStatus('Industry / Sector', <Building2 className="w-4 h-4" />, score.criteria.industry)}
            {renderCriterionStatus('Company Size (Employees)', <Users className="w-4 h-4" />, score.criteria.companySize)}
            {renderCriterionStatus('Country / Geography', <MapPin className="w-4 h-4" />, score.criteria.country)}
          </div>

          {/* Raw record inspection */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Original Record Attributes
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(lead.raw).map(([k, v]) => (
                <div key={k} className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-semibold text-slate-400 block truncate">{k}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 break-words">{v || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
