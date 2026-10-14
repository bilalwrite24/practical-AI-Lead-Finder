export type FitCategory = 'High Fit' | 'Medium Fit' | 'Low Fit' | 'Needs Review';

export type CriterionStatus = 'match' | 'partial' | 'mismatch' | 'unknown';

export interface CriterionResult {
  score: number;
  maxScore: number;
  status: CriterionStatus;
  reason: string;
  matchedValue?: string;
}

export interface ICPDefinition {
  name: string;
  targetIndustries: string[];
  targetCountries: string[];
  minEmployees: number;
  maxEmployees: number;
  targetJobTitles: string[];
  negativeKeywords: string[];
  weights: {
    title: number;
    industry: number;
    companySize: number;
    country: number;
  };
}

export interface ColumnMapping {
  name: string;
  company: string;
  website: string;
  jobTitle: string;
  industry: string;
  country: string;
  employeeCount: string;
  email: string;
  linkedin: string;
}

export interface RawLeadRow {
  id: string;
  [key: string]: any;
}

export interface NormalizedLead {
  id: string;
  name: string;
  company: string;
  website: string;
  domain: string;
  jobTitle: string;
  industry: string;
  country: string;
  employeeCount: string;
  parsedEmployees?: number | null;
  email: string;
  linkedin: string;
  raw: Record<string, string>;
}

export interface LeadScoreBreakdown {
  leadId: string;
  overallScore: number;
  fitCategory: FitCategory;
  criteria: {
    title: CriterionResult;
    industry: CriterionResult;
    companySize: CriterionResult;
    country: CriterionResult;
  };
  hasUnknowns: boolean;
  unknownFields: string[];
  isDuplicate: boolean;
  duplicateReason?: string;
  duplicateGroup?: string;
}

export interface ScoredLead {
  lead: NormalizedLead;
  score: LeadScoreBreakdown;
}

export interface ProspectSearchParams {
  industry: string;
  country: string;
  companySize?: string;
  jobTitles: string;
  keywords?: string;
  limit?: number;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ProspectSearchResult {
  id: string;
  companyName: string;
  website: string;
  sourceUrl: string;
  description: string;
  industry: string;
  country: string;
  estimatedEmployees: string;
  keyExecutives: string[];
  publicDetails: string;
  retrievedAt: string;
  groundingSources: GroundingSource[];
  isVerifiedWebResult: boolean;
}

export type LeadStatus = 'Prospect' | 'Qualified' | 'Contacted' | 'Meeting Booked' | 'Disqualified';

export interface SavedLead {
  id: string;
  companyName: string;
  contactName?: string;
  website?: string;
  jobTitle?: string;
  industry?: string;
  country?: string;
  source: 'Web Finder' | 'CSV Upload' | 'Manual' | 'LinkedIn Discovery';
  status: LeadStatus;
  fitCategory?: FitCategory;
  fitScore?: number;
  notes: string;
  sourceUrl?: string;
  savedAt: string;
  tags: string[];
}

export interface DeveloperProfile {
  name: string;
  title: string;
  avatarUrl?: string;
  skills: string[];
  freelancerUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  email: string;
  bio: string;
}
