import { DeveloperProfile, SavedLead } from '../types';

const SAVED_LEADS_KEY = 'leadfit_saved_leads';
const DEVELOPER_PROFILE_KEY = 'leadfit_developer_profile';
const THEME_KEY = 'leadfit_theme';

export const DEFAULT_DEVELOPER_PROFILE: DeveloperProfile = {
  name: 'Bilal Iqbal',
  title: 'Digital Marketing & Lead Generation Specialist',
  avatarUrl: 'image.png',
  skills: [
    'B2B Lead Generation',
    'Prospect Research',
    'ICP-based Qualification',
    'Email Marketing',
    'SEO',
    'Cold Outreach',
    'List Building & Cleansing',
    'Market Intelligence'
  ],
  freelancerUrl: 'https://www.freelancer.com/u/BilalSeoplogo',
  linkedinUrl: 'https://www.linkedin.com/in/bilal-iqbal-jutt/',
  portfolioUrl: 'https://bilaliqbal.marketing',
  email: 'bilalwrite24@gmail.com',
  bio: 'Results-driven B2B Lead Generation and Digital Marketing Specialist with a sharp focus on ideal customer profile (ICP) precision, data enrichment, prospect discovery, and targeted outreach pipelines. Dedicated to helping high-growth SaaS, agencies, and enterprise sales teams identify verified decision-makers and convert high-fit accounts.',
};

export function getSavedLeads(): SavedLead[] {
  try {
    const raw = localStorage.getItem(SAVED_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading saved leads', e);
    return [];
  }
}

export function saveLead(lead: Omit<SavedLead, 'id' | 'savedAt'>): SavedLead {
  const existing = getSavedLeads();
  // Check if already saved by website or company
  const match = existing.find(l => 
    (lead.website && l.website && lead.website.toLowerCase() === l.website.toLowerCase()) ||
    (lead.companyName && l.companyName && lead.companyName.toLowerCase() === l.companyName.toLowerCase())
  );

  if (match) {
    // Update existing notes / status if provided
    const updated = existing.map(l => l.id === match.id ? { ...l, ...lead } : l);
    localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(updated));
    return match;
  }

  const newLead: SavedLead = {
    ...lead,
    id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    savedAt: new Date().toISOString(),
  };

  const updated = [newLead, ...existing];
  localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(updated));
  return newLead;
}

export function updateSavedLead(id: string, updates: Partial<SavedLead>): void {
  const existing = getSavedLeads();
  const updated = existing.map(l => l.id === id ? { ...l, ...updates } : l);
  localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(updated));
}

export function deleteSavedLead(id: string): void {
  const existing = getSavedLeads();
  const updated = existing.filter(l => l.id !== id);
  localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(updated));
}

export function getDeveloperProfile(): DeveloperProfile {
  try {
    const raw = localStorage.getItem(DEVELOPER_PROFILE_KEY);
    if (!raw) return DEFAULT_DEVELOPER_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DEVELOPER_PROFILE,
      ...parsed,
      freelancerUrl: parsed.freelancerUrl?.includes('bilaliqbal') && !parsed.freelancerUrl?.includes('BilalSeoplogo')
        ? DEFAULT_DEVELOPER_PROFILE.freelancerUrl
        : parsed.freelancerUrl || DEFAULT_DEVELOPER_PROFILE.freelancerUrl,
      linkedinUrl: parsed.linkedinUrl?.includes('bilal-iqbal-leads')
        ? DEFAULT_DEVELOPER_PROFILE.linkedinUrl
        : parsed.linkedinUrl || DEFAULT_DEVELOPER_PROFILE.linkedinUrl,
      avatarUrl: 'image.png',
    };
  } catch {
    return DEFAULT_DEVELOPER_PROFILE;
  }
}

export function saveDeveloperProfile(profile: DeveloperProfile): void {
  try {
    localStorage.setItem(DEVELOPER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving developer profile', e);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light') return theme;
  } catch {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Error saving theme', e);
  }
}
