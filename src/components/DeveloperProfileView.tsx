import React, { useState } from 'react';
import {
  UserCheck,
  Briefcase,
  Globe,
  Linkedin,
  Mail,
  ExternalLink,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { DeveloperProfile } from '../types';
import { DEFAULT_DEVELOPER_PROFILE } from '../utils/storage';

import bilalPortraitImg from '../assets/images/bilal_iqbal_1791946625244.jpg';

interface DeveloperProfileViewProps {
  profile: DeveloperProfile;
  onUpdateProfile: (updated: DeveloperProfile) => void;
}

export const DeveloperProfileView: React.FC<DeveloperProfileViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeveloperProfile>(profile);
  const [savedAlert, setSavedAlert] = useState(false);

  // Inquiry message form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleReset = () => {
    setFormData(DEFAULT_DEVELOPER_PROFILE);
    onUpdateProfile(DEFAULT_DEVELOPER_PROFILE);
    setIsEditing(false);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    // Open email client with pre-filled content
    const subject = encodeURIComponent(`B2B Lead Generation Inquiry from ${inquiryName}`);
    const body = encodeURIComponent(`Hi Bilal,\n\nName: ${inquiryName}\nEmail: ${inquiryEmail}\n\nProject Details:\n${inquiryMessage}\n\nSent via LeadFit AI.`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setInquirySent(true);
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Developer & Lead Generation Specialist</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Developer Profile & Expertise
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Meet Bilal Iqbal, creator of LeadFit AI, specialist in high-precision B2B prospect research and ICP outbound architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedAlert && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile & Links'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Banner with dark crimson accent matching the portrait background */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#4a0e17] via-[#63131d] to-[#1e1b4b] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent_50%)]" />
          <div className="absolute bottom-4 right-6 text-right hidden sm:block">
            <span className="text-xs font-mono tracking-widest text-red-200/60 uppercase">
              LeadFit AI Engine Architect
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-10 pb-10 pt-0">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
            {/* Portrait Photo Container */}
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1.5 bg-white dark:bg-slate-900 shadow-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                <img
                  src={bilalPortraitImg}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top rounded-2xl shadow-inner"
                />
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006399] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <a
                href={profile.freelancerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Freelancer Profile</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Name & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {profile.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Available for Projects</span>
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
              {profile.title}
            </p>
          </div>

          {/* Bio */}
          <div className="mt-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {profile.bio}
          </div>

          {/* Skills Badges */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              <span>Core Skills & Specializations</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Editing Form Modal / Inline Panel */}
      {isEditing && (
        <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-indigo-500" />
              <span>Edit Professional Profile Details</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Freelancer Profile URL
                </label>
                <input
                  type="url"
                  value={formData.freelancerUrl}
                  onChange={e => setFormData({ ...formData, freelancerUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                  Portfolio Website URL
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-1">
                Professional Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services & Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services & Deliverables */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Lead Generation Capabilities</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                B2B Prospect Research & List Building
              </span>
              Hand-curated decision maker sourcing (Founders, C-suite, VPs) with verified contact intelligence.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                ICP-based Qualification & Scoring
              </span>
              Tailoring high-conversion prospect criteria, headcount verification, domain deduplication, and pipeline cleansing.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Cold Email Outreach & Deliverability
              </span>
              Infrastructure setup, secondary domains, SPF/DKIM/DMARC protocols, warm-up schedules, and high-response copy.
            </div>
          </div>
        </div>

        {/* Direct Contact Form */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            <span>Send Direct Message to Bilal</span>
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inquire about lead generation campaigns, CSV enrichment, or bespoke prospect sourcing.
          </p>

          <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={inquiryName}
                onChange={e => setInquiryName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Work Email
              </label>
              <input
                type="email"
                required
                value={inquiryEmail}
                onChange={e => setInquiryEmail(e.target.value)}
                placeholder="e.g. john@company.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Project Details / Target ICP
              </label>
              <textarea
                rows={3}
                required
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                placeholder="Describe your target market, industries, and lead volume needed..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Inquiry to {profile.email}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
