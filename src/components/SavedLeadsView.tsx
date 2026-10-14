import React, { useState } from 'react';
import {
  BookmarkCheck,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  CalendarCheck,
  XCircle,
  Building2,
  Edit3,
  Check,
  Plus
} from 'lucide-react';
import { LeadStatus, SavedLead } from '../types';
import Papa from 'papaparse';

interface SavedLeadsViewProps {
  savedLeads: SavedLead[];
  onUpdateLead: (id: string, updates: Partial<SavedLead>) => void;
  onDeleteLead: (id: string) => void;
  onNavigateToFind: () => void;
  onNavigateToCsv: () => void;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; icon: any }> = {
  Prospect: { label: 'Prospect', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', icon: Clock },
  Qualified: { label: 'Qualified', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
  Contacted: { label: 'Contacted', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800', icon: Send },
  'Meeting Booked': { label: 'Meeting Booked', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', icon: CalendarCheck },
  Disqualified: { label: 'Disqualified', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800', icon: XCircle },
};

export const SavedLeadsView: React.FC<SavedLeadsViewProps> = ({
  savedLeads,
  onUpdateLead,
  onDeleteLead,
  onNavigateToFind,
  onNavigateToCsv,
}) => {
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const filteredLeads = savedLeads.filter(lead => {
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        lead.companyName.toLowerCase().includes(q) ||
        (lead.contactName && lead.contactName.toLowerCase().includes(q)) ||
        (lead.jobTitle && lead.jobTitle.toLowerCase().includes(q)) ||
        (lead.industry && lead.industry.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportSavedToCsv = () => {
    if (savedLeads.length === 0) return;
    const exportData = savedLeads.map(l => ({
      'Company Name': l.companyName,
      'Contact Name': l.contactName || '',
      'Job Title': l.jobTitle || '',
      'Website': l.website || '',
      'Industry': l.industry || '',
      'Country': l.country || '',
      'Status': l.status,
      'Fit Category': l.fitCategory || '',
      'Fit Score (%)': l.fitScore ? `${l.fitScore}%` : '',
      'Source': l.source,
      'Notes': l.notes,
      'Saved At': l.savedAt,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadfit-saved-leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditNotes = (lead: SavedLead) => {
    setEditingNotesId(lead.id);
    setTempNotes(lead.notes || '');
  };

  const saveNotes = (id: string) => {
    onUpdateLead(id, { notes: tempNotes });
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Prospect Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Leads & Pipeline ({savedLeads.length})
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Track qualified target accounts, manage outreach statuses, take notes, and export your curated prospect pipeline.
          </p>
        </div>

        {savedLeads.length > 0 && (
          <button
            onClick={exportSavedToCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Pipeline to CSV</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {savedLeads.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-5">
          <BookmarkCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              No saved prospects yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add verified companies from the Google Web Prospect Finder or save High Fit records from your CSV qualification runs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToFind}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              Search Web Prospects
            </button>
            <button
              onClick={onNavigateToCsv}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              Filter CSV Leads
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search saved pipeline..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Statuses ({savedLeads.length})</option>
                <option value="Prospect">Prospect</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Meeting Booked">Meeting Booked</option>
                <option value="Disqualified">Disqualified</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredLeads.length} of {savedLeads.length} leads
            </span>
          </div>

          {/* Pipeline Leads Cards / Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Company & Contact</th>
                    <th className="py-3 px-4">Industry / Location</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Outreach Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredLeads.map(lead => {
                    const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG.Prospect;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Company & Contact */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{lead.companyName}</span>
                            {lead.website && (
                              <a
                                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-600"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {lead.contactName && (
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                              {lead.contactName} {lead.jobTitle ? `• ${lead.jobTitle}` : ''}
                            </div>
                          )}
                        </td>

                        {/* Industry / Location */}
                        <td className="py-3 px-4">
                          <div>{lead.industry || '—'}</div>
                          <div className="text-[11px] text-slate-400">{lead.country || '—'}</div>
                        </td>

                        {/* Source */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                            {lead.source}
                          </span>
                        </td>

                        {/* Status Select */}
                        <td className="py-3 px-4">
                          <select
                            value={lead.status}
                            onChange={e => onUpdateLead(lead.id, { status: e.target.value as LeadStatus })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusInfo.color} focus:outline-none transition-colors cursor-pointer`}
                          >
                            <option value="Prospect">Prospect</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Meeting Booked">Meeting Booked</option>
                            <option value="Disqualified">Disqualified</option>
                          </select>
                        </td>

                        {/* Notes */}
                        <td className="py-3 px-4 max-w-xs">
                          {editingNotesId === lead.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={tempNotes}
                                onChange={e => setTempNotes(e.target.value)}
                                className="w-full p-1 rounded border border-indigo-400 bg-white dark:bg-slate-800 text-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => saveNotes(lead.id)}
                                className="p-1 rounded bg-indigo-600 text-white"
                                title="Save note"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditNotes(lead)}
                              className="group flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer py-1"
                              title="Click to edit notes"
                            >
                              <span className="truncate max-w-[200px]">
                                {lead.notes || <span className="italic text-slate-400">Add note...</span>}
                              </span>
                              <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                            </div>
                          )}
                        </td>

                        {/* Delete */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Remove lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
