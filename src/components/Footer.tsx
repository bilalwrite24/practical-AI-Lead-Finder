import React from 'react';
import { Compass, ShieldCheck, Mail, Linkedin, Briefcase, Globe } from 'lucide-react';
import { NavTab } from './Navbar';
import { DeveloperProfile } from '../types';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  profile: DeveloperProfile;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, profile }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs text-xs text-slate-500 dark:text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                LeadFit AI
              </span>
            </div>
            <p className="max-w-md leading-relaxed">
              Simple, reliable B2B Lead Finder built for real-world prospect research, Google Search grounding, compliant LinkedIn discovery, and ICP-based CSV qualification.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero fabricated contacts • Explainable ICP scoring</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Google/Web Prospect Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('csv')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Filter & Score CSV Leads
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('linkedin')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  LinkedIn Boolean Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Saved Pipeline
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Created by Bilal Iqbal
            </h4>
            <p className="text-[11px] leading-relaxed">
              Digital Marketing & Lead Generation Specialist.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href={profile.freelancerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Freelancer"
              >
                <Briefcase className="w-3.5 h-3.5" />
              </a>
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Portfolio"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title={`Email: ${profile.email}`}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} LeadFit AI • Designed for Real B2B Prospecting Workflows
          </div>
          <div>
            Crafted for real-world prospect research & ICP list qualification.
          </div>
        </div>
      </div>
    </footer>
  );
};
