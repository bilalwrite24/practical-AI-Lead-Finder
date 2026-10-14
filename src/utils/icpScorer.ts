import Papa from 'papaparse';
import {
  ColumnMapping,
  CriterionResult,
  FitCategory,
  ICPDefinition,
  LeadScoreBreakdown,
  NormalizedLead,
  RawLeadRow,
  ScoredLead,
} from '../types';

export const DEFAULT_ICP: ICPDefinition = {
  name: 'Standard B2B Tech / SaaS ICP',
  targetIndustries: [
    'B2B SaaS',
    'Software',
    'Information Technology',
    'FinTech',
    'Cloud Computing',
    'Cybersecurity',
    'Artificial Intelligence',
    'Digital Marketing'
  ],
  targetCountries: [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany'
  ],
  minEmployees: 20,
  maxEmployees: 500,
  targetJobTitles: [
    'Founder',
    'Co-Founder',
    'CEO',
    'Chief Executive Officer',
    'CTO',
    'VP of Sales',
    'Vice President of Sales',
    'Head of Sales',
    'Director of Sales',
    'VP of Marketing',
    'Head of Marketing',
    'Chief Revenue Officer',
    'CRO',
    'Director of Business Development',
    'Head of Growth'
  ],
  negativeKeywords: [
    'intern',
    'student',
    'freelancer',
    'consultant',
    'retired',
    'assistant',
    'contractor'
  ],
  weights: {
    title: 35,
    industry: 25,
    companySize: 25,
    country: 15,
  },
};

/**
 * Standardizes web domain by extracting hostname and stripping www.
 */
export function normalizeDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return '';
  let str = urlOrDomain.trim().toLowerCase();
  // Strip protocol
  str = str.replace(/^https?:\/\//i, '');
  // Strip path & query
  str = str.split('/')[0].split('?')[0].split('#')[0];
  // Strip www.
  str = str.replace(/^www\./i, '');
  // Strip trailing colons/ports
  str = str.split(':')[0];
  return str.trim();
}

/**
 * Normalizes country strings and aliases
 */
const COUNTRY_ALIASES: Record<string, string> = {
  'us': 'united states',
  'usa': 'united states',
  'united states of america': 'united states',
  'u.s.': 'united states',
  'u.s.a.': 'united states',
  'uk': 'united kingdom',
  'u.k.': 'united kingdom',
  'great britain': 'united kingdom',
  'gb': 'united kingdom',
  'england': 'united kingdom',
  'ca': 'canada',
  'can': 'canada',
  'au': 'australia',
  'aus': 'australia',
  'de': 'germany',
  'deutschland': 'germany',
};

export function normalizeCountry(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  return COUNTRY_ALIASES[cleaned] || raw.trim().toLowerCase();
}

/**
 * Parses employee count strings into numeric representation
 * Handles "50-200", "150", "1,200", "500+", "10k", "11-50 employees"
 */
export function parseEmployeeCount(value: string | number | undefined | null): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  
  const str = String(value).trim().toLowerCase().replace(/,/g, '');
  if (!str) return null;

  // Handle "10k", "5k"
  if (str.endsWith('k')) {
    const num = parseFloat(str.replace('k', ''));
    return isNaN(num) ? null : Math.round(num * 1000);
  }

  // Handle range "50-200" or "50 - 200"
  const rangeMatch = str.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1], 10);
    const high = parseInt(rangeMatch[2], 10);
    return Math.round((low + high) / 2);
  }

  // Handle "500+" or "+500"
  const plusMatch = str.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return parseInt(plusMatch[1], 10);
  }

  // Extract first sequence of digits
  const singleMatch = str.match(/\d+/);
  if (singleMatch) {
    return parseInt(singleMatch[0], 10);
  }

  return null;
}

/**
 * Heuristic detector for CSV columns
 */
export function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    name: '',
    company: '',
    website: '',
    jobTitle: '',
    industry: '',
    country: '',
    employeeCount: '',
    email: '',
    linkedin: '',
  };

  const lowerHeaders = headers.map(h => h.trim());

  for (const h of lowerHeaders) {
    const l = h.toLowerCase();
    
    // Name
    if (!mapping.name && (l === 'name' || l === 'full name' || l === 'contact name' || l === 'lead name' || l.includes('person name'))) {
      mapping.name = h;
    }
    // Company
    if (!mapping.company && (l === 'company' || l === 'company name' || l === 'organization' || l === 'account name' || l === 'business')) {
      mapping.company = h;
    }
    // Website
    if (!mapping.website && (l === 'website' || l === 'domain' || l === 'company website' || l === 'url' || l === 'web')) {
      mapping.website = h;
    }
    // Job Title
    if (!mapping.jobTitle && (l === 'job title' || l === 'title' || l === 'role' || l === 'position' || l === 'designation')) {
      mapping.jobTitle = h;
    }
    // Industry
    if (!mapping.industry && (l === 'industry' || l === 'sector' || l === 'vertical' || l === 'category')) {
      mapping.industry = h;
    }
    // Country / Location
    if (!mapping.country && (l === 'country' || l === 'location' || l === 'region' || l === 'headquarters' || l === 'hq')) {
      mapping.country = h;
    }
    // Employee Count
    if (!mapping.employeeCount && (l === 'employees' || l === 'employee count' || l === 'company size' || l === 'size' || l === 'headcount' || l.includes('staff'))) {
      mapping.employeeCount = h;
    }
    // Email
    if (!mapping.email && (l === 'email' || l === 'email address' || l === 'contact email' || l === 'work email')) {
      mapping.email = h;
    }
    // LinkedIn
    if (!mapping.linkedin && (l.includes('linkedin') || l === 'person linkedin' || l === 'profile url')) {
      mapping.linkedin = h;
    }
  }

  return mapping;
}

/**
 * Normalizes raw row data into structured lead object
 */
export function normalizeLeadRow(row: RawLeadRow, mapping: ColumnMapping, index: number): NormalizedLead {
  const website = (mapping.website && row[mapping.website] ? String(row[mapping.website]).trim() : '');
  const domain = normalizeDomain(website);
  const rawEmployees = mapping.employeeCount && row[mapping.employeeCount] ? String(row[mapping.employeeCount]).trim() : '';

  return {
    id: `lead-${index + 1}`,
    name: mapping.name && row[mapping.name] ? String(row[mapping.name]).trim() : '',
    company: mapping.company && row[mapping.company] ? String(row[mapping.company]).trim() : '',
    website,
    domain,
    jobTitle: mapping.jobTitle && row[mapping.jobTitle] ? String(row[mapping.jobTitle]).trim() : '',
    industry: mapping.industry && row[mapping.industry] ? String(row[mapping.industry]).trim() : '',
    country: mapping.country && row[mapping.country] ? String(row[mapping.country]).trim() : '',
    employeeCount: rawEmployees,
    parsedEmployees: parseEmployeeCount(rawEmployees),
    email: mapping.email && row[mapping.email] ? String(row[mapping.email]).trim() : '',
    linkedin: mapping.linkedin && row[mapping.linkedin] ? String(row[mapping.linkedin]).trim() : '',
    raw: Object.fromEntries(Object.entries(row).map(([k, v]) => [k, String(v ?? '')])),
  };
}

/**
 * Scores a single normalized lead against the user-defined ICP.
 * CRITICAL: Missing information is marked Unknown/Needs Review, NOT automatically penalized as mismatch!
 */
export function evaluateLead(lead: NormalizedLead, icp: ICPDefinition): LeadScoreBreakdown {
  const unknownFields: string[] = [];
  const maxTitleScore = icp.weights.title;
  const maxIndustryScore = icp.weights.industry;
  const maxSizeScore = icp.weights.companySize;
  const maxCountryScore = icp.weights.country;

  // 1. Job Title Evaluation
  let titleResult: CriterionResult;
  if (!lead.jobTitle) {
    unknownFields.push('Job Title');
    titleResult = {
      score: 0,
      maxScore: maxTitleScore,
      status: 'unknown',
      reason: 'Unknown: Job Title was not provided in the record',
    };
  } else {
    const titleLower = lead.jobTitle.toLowerCase();
    
    // Check negative keywords (disqualifiers)
    const matchedNegative = icp.negativeKeywords.find(nk => 
      nk.trim() && titleLower.includes(nk.trim().toLowerCase())
    );

    if (matchedNegative) {
      titleResult = {
        score: 0,
        maxScore: maxTitleScore,
        status: 'mismatch',
        reason: `Disqualified by negative keyword: "${matchedNegative}" in title`,
        matchedValue: matchedNegative,
      };
    } else {
      // Check exact or partial match with target titles
      let matchedTarget = '';
      let isExact = false;
      let isPartial = false;

      for (const target of icp.targetJobTitles) {
        const tLower = target.trim().toLowerCase();
        if (!tLower) continue;
        if (titleLower === tLower) {
          isExact = true;
          matchedTarget = target;
          break;
        } else if (titleLower.includes(tLower) || tLower.includes(titleLower)) {
          isPartial = true;
          matchedTarget = target;
        }
      }

      if (isExact) {
        titleResult = {
          score: maxTitleScore,
          maxScore: maxTitleScore,
          status: 'match',
          reason: `Exact title match with target ICP role: "${matchedTarget}"`,
          matchedValue: matchedTarget,
        };
      } else if (isPartial) {
        titleResult = {
          score: Math.round(maxTitleScore * 0.75),
          maxScore: maxTitleScore,
          status: 'partial',
          reason: `Relevant title aligned with target: "${matchedTarget}"`,
          matchedValue: matchedTarget,
        };
      } else {
        titleResult = {
          score: 0,
          maxScore: maxTitleScore,
          status: 'mismatch',
          reason: `Title "${lead.jobTitle}" does not match target ICP decision makers`,
        };
      }
    }
  }

  // 2. Industry Evaluation
  let industryResult: CriterionResult;
  if (!lead.industry) {
    unknownFields.push('Industry');
    industryResult = {
      score: 0,
      maxScore: maxIndustryScore,
      status: 'unknown',
      reason: 'Unknown: Industry was not specified in the record',
    };
  } else {
    const indLower = lead.industry.toLowerCase();
    let matchedInd = '';
    let isIndMatch = false;

    for (const target of icp.targetIndustries) {
      const tLower = target.trim().toLowerCase();
      if (!tLower) continue;
      if (indLower === tLower || indLower.includes(tLower) || tLower.includes(indLower)) {
        isIndMatch = true;
        matchedInd = target;
        break;
      }
    }

    if (isIndMatch) {
      industryResult = {
        score: maxIndustryScore,
        maxScore: maxIndustryScore,
        status: 'match',
        reason: `Matched target ICP industry: "${matchedInd}"`,
        matchedValue: matchedInd,
      };
    } else {
      industryResult = {
        score: 0,
        maxScore: maxIndustryScore,
        status: 'mismatch',
        reason: `Industry "${lead.industry}" is not within target industries list`,
      };
    }
  }

  // 3. Company Size Evaluation
  let sizeResult: CriterionResult;
  if (lead.parsedEmployees === null || lead.parsedEmployees === undefined) {
    unknownFields.push('Company Size');
    sizeResult = {
      score: 0,
      maxScore: maxSizeScore,
      status: 'unknown',
      reason: lead.employeeCount
        ? `Unknown: Could not reliably parse headcount value "${lead.employeeCount}"`
        : 'Unknown: Employee count was not provided in the record',
    };
  } else {
    const count = lead.parsedEmployees;
    if (count >= icp.minEmployees && count <= icp.maxEmployees) {
      sizeResult = {
        score: maxSizeScore,
        maxScore: maxSizeScore,
        status: 'match',
        reason: `Employee count (${count.toLocaleString()}) is inside target ICP range (${icp.minEmployees} - ${icp.maxEmployees})`,
        matchedValue: `${count}`,
      };
    } else {
      // Check if close buffer (within 20% of range boundaries)
      const bufferLow = icp.minEmployees * 0.75;
      const bufferHigh = icp.maxEmployees * 1.35;
      if (count >= bufferLow && count <= bufferHigh) {
        sizeResult = {
          score: Math.round(maxSizeScore * 0.4),
          maxScore: maxSizeScore,
          status: 'partial',
          reason: `Headcount (${count}) is just outside target range (${icp.minEmployees} - ${icp.maxEmployees}) but adjacent`,
          matchedValue: `${count}`,
        };
      } else {
        sizeResult = {
          score: 0,
          maxScore: maxSizeScore,
          status: 'mismatch',
          reason: `Headcount (${count}) is outside target range (${icp.minEmployees} - ${icp.maxEmployees})`,
        };
      }
    }
  }

  // 4. Country Evaluation
  let countryResult: CriterionResult;
  if (!lead.country) {
    unknownFields.push('Country');
    countryResult = {
      score: 0,
      maxScore: maxCountryScore,
      status: 'unknown',
      reason: 'Unknown: Country/Location was not specified in the record',
    };
  } else {
    const normalizedLeadCountry = normalizeCountry(lead.country);
    let matchedCountry = '';
    let isCountryMatch = false;

    for (const target of icp.targetCountries) {
      const normalizedTarget = normalizeCountry(target);
      if (
        normalizedLeadCountry === normalizedTarget ||
        normalizedLeadCountry.includes(normalizedTarget) ||
        normalizedTarget.includes(normalizedLeadCountry)
      ) {
        isCountryMatch = true;
        matchedCountry = target;
        break;
      }
    }

    if (isCountryMatch) {
      countryResult = {
        score: maxCountryScore,
        maxScore: maxCountryScore,
        status: 'match',
        reason: `Matched target ICP geography: "${matchedCountry}"`,
        matchedValue: matchedCountry,
      };
    } else {
      countryResult = {
        score: 0,
        maxScore: maxCountryScore,
        status: 'mismatch',
        reason: `Country "${lead.country}" is outside target geographical scope`,
      };
    }
  }

  // Calculate Overall Score
  const totalEarned = titleResult.score + industryResult.score + sizeResult.score + countryResult.score;
  const maxPossible = maxTitleScore + maxIndustryScore + maxSizeScore + maxCountryScore;
  const overallPercentage = maxPossible > 0 ? Math.round((totalEarned / maxPossible) * 100) : 0;

  // Determine Fit Category
  // If crucial fields are unknown, classify into 'Needs Review'
  let fitCategory: FitCategory;
  const hasUnknowns = unknownFields.length > 0;

  if (titleResult.status === 'mismatch' && titleResult.reason.includes('Disqualified')) {
    fitCategory = 'Low Fit';
  } else if (hasUnknowns && (titleResult.status === 'unknown' || industryResult.status === 'unknown')) {
    // If critical core data like title or industry is missing, it must be flagged for review!
    fitCategory = 'Needs Review';
  } else if (overallPercentage >= 80) {
    fitCategory = 'High Fit';
  } else if (overallPercentage >= 50) {
    fitCategory = 'Medium Fit';
  } else if (hasUnknowns && overallPercentage >= 35) {
    fitCategory = 'Needs Review';
  } else {
    fitCategory = 'Low Fit';
  }

  return {
    leadId: lead.id,
    overallScore: overallPercentage,
    fitCategory,
    criteria: {
      title: titleResult,
      industry: industryResult,
      companySize: sizeResult,
      country: countryResult,
    },
    hasUnknowns,
    unknownFields,
    isDuplicate: false,
  };
}

/**
 * Detects duplicates in a batch of normalized leads.
 * Duplicates can be by:
 * 1. Normalized Domain (same company website)
 * 2. Email Address (exact match)
 * 3. Company Name + Contact Name combination
 */
export function detectDuplicates(scoredLeads: ScoredLead[]): ScoredLead[] {
  const domainMap = new Map<string, string>(); // domain -> first leadId
  const emailMap = new Map<string, string>(); // email -> first leadId
  const nameCompanyMap = new Map<string, string>(); // "company|name" -> first leadId
  const duplicateCounts = new Map<string, number>();

  return scoredLeads.map(({ lead, score }) => {
    let isDuplicate = false;
    let duplicateReason = '';
    let duplicateGroup = '';

    // 1. Email check
    if (lead.email) {
      const lowerEmail = lead.email.toLowerCase().trim();
      if (emailMap.has(lowerEmail)) {
        isDuplicate = true;
        const originalId = emailMap.get(lowerEmail)!;
        duplicateReason = `Duplicate Email address: "${lead.email}" (matches ${originalId})`;
        duplicateGroup = `email-${lowerEmail}`;
      } else {
        emailMap.set(lowerEmail, lead.id);
      }
    }

    // 2. Domain check
    if (!isDuplicate && lead.domain) {
      const dom = lead.domain;
      if (domainMap.has(dom)) {
        isDuplicate = true;
        const originalId = domainMap.get(dom)!;
        duplicateReason = `Duplicate Company Website / Domain: "${dom}" (matches ${originalId})`;
        duplicateGroup = `domain-${dom}`;
      } else {
        domainMap.set(dom, lead.id);
      }
    }

    // 3. Company + Name check
    if (!isDuplicate && lead.company && lead.name) {
      const key = `${lead.company.toLowerCase().trim()}|${lead.name.toLowerCase().trim()}`;
      if (nameCompanyMap.has(key)) {
        isDuplicate = true;
        const originalId = nameCompanyMap.get(key)!;
        duplicateReason = `Duplicate Contact & Company: "${lead.name} @ ${lead.company}" (matches ${originalId})`;
        duplicateGroup = `contact-${key.replace(/[^a-z0-9]/g, '-')}`;
      } else {
        nameCompanyMap.set(key, lead.id);
      }
    }

    if (isDuplicate) {
      duplicateCounts.set(duplicateGroup, (duplicateCounts.get(duplicateGroup) || 1) + 1);
    }

    return {
      lead,
      score: {
        ...score,
        isDuplicate,
        duplicateReason: isDuplicate ? duplicateReason : undefined,
        duplicateGroup: isDuplicate ? duplicateGroup : undefined,
      },
    };
  });
}

/**
 * Parses CSV text, runs column normalization, ICP scoring, and duplicate detection
 */
export function processCsvData(
  csvText: string,
  userMapping?: Partial<ColumnMapping>,
  icp: ICPDefinition = DEFAULT_ICP
): {
  scoredLeads: ScoredLead[];
  headers: string[];
  detectedMapping: ColumnMapping;
  totalRows: number;
  duplicateCount: number;
  stats: {
    highFit: number;
    mediumFit: number;
    lowFit: number;
    needsReview: number;
  };
} {
  const parsed = Papa.parse<RawLeadRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = parsed.meta.fields || [];
  const autoMap = autoDetectColumns(headers);
  const mapping: ColumnMapping = {
    ...autoMap,
    ...(userMapping || {}),
  };

  const rawRows = parsed.data || [];
  const normalized = rawRows.map((row, i) => normalizeLeadRow(row, mapping, i));
  const evaluated = normalized.map(lead => ({
    lead,
    score: evaluateLead(lead, icp),
  }));

  const withDuplicates = detectDuplicates(evaluated);

  const stats = {
    highFit: 0,
    mediumFit: 0,
    lowFit: 0,
    needsReview: 0,
  };

  let duplicateCount = 0;

  for (const item of withDuplicates) {
    if (item.score.isDuplicate) duplicateCount++;
    if (item.score.fitCategory === 'High Fit') stats.highFit++;
    else if (item.score.fitCategory === 'Medium Fit') stats.mediumFit++;
    else if (item.score.fitCategory === 'Low Fit') stats.lowFit++;
    else if (item.score.fitCategory === 'Needs Review') stats.needsReview++;
  }

  return {
    scoredLeads: withDuplicates,
    headers,
    detectedMapping: mapping,
    totalRows: withDuplicates.length,
    duplicateCount,
    stats,
  };
}

/**
 * Generates an enhanced CSV string ready for download
 */
export function exportScoredLeadsToCsv(
  leads: ScoredLead[],
  options: {
    filterCategory?: FitCategory | 'All';
    excludeDuplicates?: boolean;
    includeBreakdown?: boolean;
  } = {}
): string {
  let filtered = leads;

  if (options.filterCategory && options.filterCategory !== 'All') {
    filtered = filtered.filter(l => l.score.fitCategory === options.filterCategory);
  }

  if (options.excludeDuplicates) {
    filtered = filtered.filter(l => !l.score.isDuplicate);
  }

  const exportRows = filtered.map(({ lead, score }) => {
    const base: Record<string, string> = {
      'Lead Name': lead.name,
      'Company Name': lead.company,
      'Website': lead.website,
      'Job Title': lead.jobTitle,
      'Industry': lead.industry,
      'Country': lead.country,
      'Employees': lead.employeeCount,
      'Email': lead.email,
      'LinkedIn': lead.linkedin,
      'ICP Fit Category': score.fitCategory,
      'ICP Fit Score (%)': `${score.overallScore}%`,
      'Is Duplicate': score.isDuplicate ? 'YES' : 'NO',
      'Duplicate Details': score.duplicateReason || '',
      'Has Unknowns': score.hasUnknowns ? 'YES' : 'NO',
      'Missing Fields': score.unknownFields.join(', '),
    };

    if (options.includeBreakdown) {
      base['Title Match Status'] = score.criteria.title.status;
      base['Title Score'] = `${score.criteria.title.score}/${score.criteria.title.maxScore}`;
      base['Title Reason'] = score.criteria.title.reason;

      base['Industry Match Status'] = score.criteria.industry.status;
      base['Industry Score'] = `${score.criteria.industry.score}/${score.criteria.industry.maxScore}`;
      base['Industry Reason'] = score.criteria.industry.reason;

      base['Company Size Status'] = score.criteria.companySize.status;
      base['Company Size Score'] = `${score.criteria.companySize.score}/${score.criteria.companySize.maxScore}`;
      base['Company Size Reason'] = score.criteria.companySize.reason;

      base['Country Match Status'] = score.criteria.country.status;
      base['Country Score'] = `${score.criteria.country.score}/${score.criteria.country.maxScore}`;
      base['Country Reason'] = score.criteria.country.reason;
    }

    // Include original raw columns that might not have been mapped
    for (const [key, value] of Object.entries(lead.raw)) {
      if (!base[key]) {
        base[`Original: ${key}`] = value;
      }
    }

    return base;
  });

  return Papa.unparse(exportRows);
}
