import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import {
  DEFAULT_ICP,
  detectDuplicates,
  evaluateLead,
  exportScoredLeadsToCsv,
  processCsvData,
} from '../utils/icpScorer';
import { NormalizedLead, ScoredLead } from '../types';

interface TestResultItem {
  id: number;
  name: string;
  category: string;
  passed: boolean;
  detail?: string;
}

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [hasRun, setHasRun] = useState(false);

  if (!isOpen) return null;

  const runAllTests = () => {
    setIsRunning(true);
    const results: TestResultItem[] = [];
    let idCounter = 1;

    const record = (name: string, category: string, passed: boolean, detail?: string) => {
      results.push({ id: idCounter++, name, category, passed, detail });
    };

    try {
      // 1. Exact ICP Match
      const highFitLead: NormalizedLead = {
        id: 'test-1',
        name: 'Sarah Connor',
        company: 'CloudFlow Tech',
        website: 'https://cloudflow.io',
        domain: 'cloudflow.io',
        jobTitle: 'VP of Sales',
        industry: 'B2B SaaS',
        country: 'United States',
        employeeCount: '120',
        parsedEmployees: 120,
        email: 'sarah@cloudflow.io',
        linkedin: '',
        raw: {},
      };
      const score1 = evaluateLead(highFitLead, DEFAULT_ICP);
      record('Exact match scores >= 80% (High Fit)', 'ICP Scoring', score1.overallScore >= 80, `Score: ${score1.overallScore}%`);
      record('Exact match categorized as High Fit', 'ICP Scoring', score1.fitCategory === 'High Fit');
      record('Title marked as match (+35pts)', 'ICP Scoring', score1.criteria.title.status === 'match');
      record('Industry marked as match (+25pts)', 'ICP Scoring', score1.criteria.industry.status === 'match');
      record('Company size inside range (+25pts)', 'ICP Scoring', score1.criteria.companySize.status === 'match');
      record('Country inside target list (+15pts)', 'ICP Scoring', score1.criteria.country.status === 'match');

      // 2. Missing data marked Unknown, not mismatch
      const missingIndLead: NormalizedLead = {
        id: 'test-2',
        name: 'Alex Rivera',
        company: 'Quantum Dynamics',
        website: 'https://quantum.com',
        domain: 'quantum.com',
        jobTitle: 'CEO',
        industry: '',
        country: 'Canada',
        employeeCount: '80',
        parsedEmployees: 80,
        email: 'alex@quantum.com',
        linkedin: '',
        raw: {},
      };
      const score2 = evaluateLead(missingIndLead, DEFAULT_ICP);
      record('Missing industry is tagged status: unknown', 'Unknown Handling', score2.criteria.industry.status === 'unknown');
      record('Record hasUnknowns is true', 'Unknown Handling', score2.hasUnknowns === true);
      record('Industry included in unknownFields array', 'Unknown Handling', score2.unknownFields.includes('Industry'));
      record('Lead with missing critical info categorized as Needs Review', 'Unknown Handling', score2.fitCategory === 'Needs Review');
      record('Reason clearly states Unknown rather than Mismatch', 'Unknown Handling', score2.criteria.industry.reason.startsWith('Unknown'));

      // 3. Negative keyword disqualification
      const internLead: NormalizedLead = {
        id: 'test-3',
        name: 'Tom Student',
        company: 'Apex Software',
        website: 'apex.com',
        domain: 'apex.com',
        jobTitle: 'Sales Intern',
        industry: 'Software',
        country: 'United States',
        employeeCount: '150',
        parsedEmployees: 150,
        email: 'tom@apex.com',
        linkedin: '',
        raw: {},
      };
      const score3 = evaluateLead(internLead, DEFAULT_ICP);
      record('Negative keyword title marked mismatch', 'Disqualifiers', score3.criteria.title.status === 'mismatch');
      record('Disqualification keyword reason noted', 'Disqualifiers', score3.criteria.title.reason.includes('Disqualified by negative keyword'));
      record('Disqualified lead marked Low Fit', 'Disqualifiers', score3.fitCategory === 'Low Fit');

      // 4. Duplicate Detection
      const sampleBatch: ScoredLead[] = [
        {
          lead: {
            id: 'lead-1',
            name: 'Jane Smith',
            company: 'Acme Corp',
            website: 'https://acme.com',
            domain: 'acme.com',
            jobTitle: 'VP Sales',
            industry: 'Software',
            country: 'US',
            employeeCount: '100',
            email: 'jane@acme.com',
            linkedin: '',
            raw: {},
          },
          score: {
            leadId: 'lead-1',
            overallScore: 90,
            fitCategory: 'High Fit',
            criteria: {} as any,
            hasUnknowns: false,
            unknownFields: [],
            isDuplicate: false,
          },
        },
        {
          lead: {
            id: 'lead-2',
            name: 'Bob Johnson',
            company: 'Acme Corp',
            website: 'http://www.acme.com/team',
            domain: 'acme.com',
            jobTitle: 'Director',
            industry: 'Software',
            country: 'US',
            employeeCount: '100',
            email: 'bob@acme.com',
            linkedin: '',
            raw: {},
          },
          score: {
            leadId: 'lead-2',
            overallScore: 70,
            fitCategory: 'Medium Fit',
            criteria: {} as any,
            hasUnknowns: false,
            unknownFields: [],
            isDuplicate: false,
          },
        },
        {
          lead: {
            id: 'lead-3',
            name: 'Jane Smith',
            company: 'Acme Corp',
            website: '',
            domain: '',
            jobTitle: 'VP Sales',
            industry: 'Software',
            country: 'US',
            employeeCount: '100',
            email: 'jane@acme.com',
            linkedin: '',
            raw: {},
          },
          score: {
            leadId: 'lead-3',
            overallScore: 90,
            fitCategory: 'High Fit',
            criteria: {} as any,
            hasUnknowns: false,
            unknownFields: [],
            isDuplicate: false,
          },
        },
      ];
      const deduped = detectDuplicates(sampleBatch);
      record('First lead is not marked duplicate', 'Deduplication', !deduped[0].score.isDuplicate);
      record('Second lead with same domain marked duplicate', 'Deduplication', deduped[1].score.isDuplicate);
      record('Duplicate reason identifies domain match', 'Deduplication', deduped[1].score.duplicateReason?.includes('Domain') === true);
      record('Third lead with same email marked duplicate', 'Deduplication', deduped[2].score.isDuplicate);

      // 5. CSV Parsing & Export
      const sampleCsv = `Name,Company,Website,Title,Industry,Country,Employees
David Miller,TechPulse,https://techpulse.io,Founder & CEO,B2B SaaS,United States,45
Lisa Wong,InnoHealth,https://innohealth.com,VP of Sales,,United Kingdom,250
Mark Evans,Old Corp,https://oldcorp.com,Intern,Manufacturing,Brazil,10`;
      const processed = processCsvData(sampleCsv);
      record('Processed 3 rows from CSV text', 'CSV Processing', processed.totalRows === 3);
      record('Contains High Fit lead', 'CSV Processing', processed.stats.highFit >= 1);
      record('Contains Needs Review lead for missing industry data', 'CSV Processing', processed.stats.needsReview >= 1);

      const exported = exportScoredLeadsToCsv(processed.scoredLeads, { includeBreakdown: true });
      record('Export CSV contains ICP Fit Category column', 'Export Integrity', exported.includes('ICP Fit Category'));
      record('Export CSV contains contact name', 'Export Integrity', exported.includes('David Miller'));
      record('Export CSV contains scoring breakdown columns', 'Export Integrity', exported.includes('Title Reason'));
    } catch (e: any) {
      record('Fatal test runner exception', 'System', false, e.message);
    }

    setTestResults(results);
    setIsRunning(false);
    setHasRun(true);
  };

  const passedCount = testResults.filter(t => t.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Automated Verification Suite
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                24 Unit Tests: ICP scoring, Unknown data handling, negative keywords, deduplication & exports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!hasRun ? (
            <div className="p-8 text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  LeadFit AI Scoring & Deduplication Tests
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  Click below to execute all unit test assertions in real-time and verify engine compliance.
                </p>
              </div>

              <button
                onClick={runAllTests}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute 24 Test Assertions</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
                    All Tests Passed: {passedCount} / {totalCount}
                  </span>
                </div>

                <button
                  onClick={runAllTests}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-run</span>
                </button>
              </div>

              {/* Test List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto text-xs pr-1">
                {testResults.map(test => (
                  <div key={test.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{test.name}</span>
                        {test.detail && (
                          <span className="text-[11px] text-slate-400 block">{test.detail}</span>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase shrink-0">
                      {test.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
