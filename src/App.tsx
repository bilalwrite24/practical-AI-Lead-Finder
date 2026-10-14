import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { FindLeadsView } from './components/FindLeadsView';
import { FilterCsvView } from './components/FilterCsvView';
import { LinkedInDiscoveryView } from './components/LinkedInDiscoveryView';
import { SavedLeadsView } from './components/SavedLeadsView';
import { DeveloperProfileView } from './components/DeveloperProfileView';
import { TestRunnerModal } from './components/TestRunnerModal';
import { Footer } from './components/Footer';
import {
  deleteSavedLead,
  getDeveloperProfile,
  getSavedLeads,
  getStoredTheme,
  saveDeveloperProfile,
  saveLead,
  setStoredTheme,
  updateSavedLead,
} from './utils/storage';
import { DeveloperProfile, SavedLead } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile>(getDeveloperProfile());
  const [isBackendReady, setIsBackendReady] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);

  // Pre-fill parameters when jumping from Web Prospect to LinkedIn
  const [linkedInCompanyTarget, setLinkedInCompanyTarget] = useState('');
  const [linkedInIndustryTarget, setLinkedInIndustryTarget] = useState('');
  const [linkedInCountryTarget, setLinkedInCountryTarget] = useState('');

  // Sample CSV trigger
  const [sampleCsvText, setSampleCsvText] = useState<string | undefined>(undefined);

  // Initialize theme and stored leads
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setSavedLeads(getSavedLeads());
    setDeveloperProfile(getDeveloperProfile());

    // Check backend health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsBackendReady(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        setIsBackendReady(false);
      });
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
  };

  const handleSaveLead = (leadData: Omit<SavedLead, 'id' | 'savedAt'>) => {
    saveLead(leadData);
    setSavedLeads(getSavedLeads());
  };

  const handleUpdateSavedLead = (id: string, updates: Partial<SavedLead>) => {
    updateSavedLead(id, updates);
    setSavedLeads(getSavedLeads());
  };

  const handleDeleteSavedLead = (id: string) => {
    deleteSavedLead(id);
    setSavedLeads(getSavedLeads());
  };

  const handleUpdateDeveloperProfile = (updated: DeveloperProfile) => {
    saveDeveloperProfile(updated);
    setDeveloperProfile(updated);
  };

  const handleNavigateToLinkedInFromProspect = (company: string, industry: string, country: string) => {
    setLinkedInCompanyTarget(company);
    setLinkedInIndustryTarget(industry);
    setLinkedInCountryTarget(country);
    setCurrentTab('linkedin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSampleCsvFromHome = () => {
    setSampleCsvText(`Full Name,Company Name,Website,Job Title,Industry,Location,Headcount,Work Email
Alex Morgan,HyperScale Cloud,https://hyperscale.io,VP of Sales,B2B SaaS,United States,180,alex@hyperscale.io
Rachel Vance,Nova Security,novasec.com,Chief Executive Officer,Cybersecurity,United Kingdom,95,rachel@novasec.com
David Chen,Apex Logic,https://apexlogic.ai,Founder & CTO,Artificial Intelligence,Canada,45,david@apexlogic.ai
Elena Rostova,FinEdge Software,https://finedge.com,Head of Marketing,FinTech,Germany,120,elena@finedge.com
Marcus Brody,Legacy Manufacturing,https://legacymfg.com,Operations Manager,Industrial Manufacturing,Brazil,1500,marcus@legacymfg.com
Samantha Ray,HyperScale Cloud,http://www.hyperscale.io/team,Director of Sales,B2B SaaS,United States,180,samantha@hyperscale.io
Kevin Wright,CloudFlow Inc,https://cloudflow.io,Head of Growth,,United States,65,kevin@cloudflow.io
Liam Miller,Titan Logistics,titanlogistics.co,Sales Intern,Supply Chain,United States,250,liam@titanlogistics.co
Sophia Taylor,DataPulse,datapulse.io,VP Sales,Software,United States,,sophia@datapulse.io
Rachel Vance,Nova Security,,CEO,Cybersecurity,UK,95,rachel@novasec.com`);
    setCurrentTab('csv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedLeads.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isBackendReady={isBackendReady}
        onOpenTests={() => setShowTestModal(true)}
      />

      {/* Main Tabbed Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={tab => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedCount={savedLeads.length}
            onOpenTests={() => setShowTestModal(true)}
            onLoadSampleCsv={handleLoadSampleCsvFromHome}
          />
        )}

        {currentTab === 'find' && (
          <FindLeadsView
            onSaveLead={handleSaveLead}
            savedLeads={savedLeads}
            onNavigateToLinkedIn={handleNavigateToLinkedInFromProspect}
            isBackendReady={isBackendReady}
          />
        )}

        {currentTab === 'csv' && (
          <FilterCsvView
            onSaveLead={handleSaveLead}
            savedLeads={savedLeads}
            initialCsvText={sampleCsvText}
          />
        )}

        {currentTab === 'linkedin' && (
          <LinkedInDiscoveryView
            initialCompany={linkedInCompanyTarget}
            initialIndustry={linkedInIndustryTarget}
            initialCountry={linkedInCountryTarget}
          />
        )}

        {currentTab === 'saved' && (
          <SavedLeadsView
            savedLeads={savedLeads}
            onUpdateLead={handleUpdateSavedLead}
            onDeleteLead={handleDeleteSavedLead}
            onNavigateToFind={() => setCurrentTab('find')}
            onNavigateToCsv={() => setCurrentTab('csv')}
          />
        )}

        {currentTab === 'profile' && (
          <DeveloperProfileView
            profile={developerProfile}
            onUpdateProfile={handleUpdateDeveloperProfile}
          />
        )}
      </main>

      {/* Verification Suite Modal */}
      <TestRunnerModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={developerProfile}
      />
    </div>
  );
}
