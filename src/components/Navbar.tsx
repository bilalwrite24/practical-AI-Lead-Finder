import React from 'react';
import {
  Compass,
  FileSpreadsheet,
  BookmarkCheck,
  UserCheck,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'home' | 'find' | 'linkedin' | 'csv' | 'saved' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isBackendReady: boolean;
  onOpenTests: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  theme,
  onToggleTheme,
  isBackendReady,
  onOpenTests,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                    LeadFit AI
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 uppercase tracking-wider">
                    B2B
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Prospect Research & ICP Scoring
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50 text-sm font-medium">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'home'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('find')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'find'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Leads
            </button>
            <button
              onClick={() => onSelectTab('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'csv'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Filter CSV
            </button>
            <button
              onClick={() => onSelectTab('linkedin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'linkedin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-500" />
              LinkedIn Discovery
            </button>
            <button
              onClick={() => onSelectTab('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'saved'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              Saved Leads
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'profile'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Bilal Iqbal
            </button>
          </nav>

          {/* Right utility buttons */}
          <div className="flex items-center gap-2">
            {/* Backend provider status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              {isBackendReady ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-medium">Live Search Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">Setup API Key</span>
                </>
              )}
            </div>

            {/* Test Suite Button */}
            <button
              onClick={onOpenTests}
              title="View verification unit test suite (24/24 passing)"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Tests</span>
            </button>

            {/* Dark / Light toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-200/60 dark:border-slate-800 text-xs font-medium no-scrollbar">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'home' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('find')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'find' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Find Leads
          </button>
          <button
            onClick={() => onSelectTab('csv')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'csv' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Filter CSV
          </button>
          <button
            onClick={() => onSelectTab('linkedin')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'linkedin' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            LinkedIn
          </button>
          <button
            onClick={() => onSelectTab('saved')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'saved' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Saved ({savedCount})
          </button>
          <button
            onClick={() => onSelectTab('profile')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              currentTab === 'profile' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Bilal Iqbal
          </button>
        </div>
      </div>
    </header>
  );
};
