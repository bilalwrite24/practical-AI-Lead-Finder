export interface LinkedInQueryBuilderParams {
  jobTitles: string[];
  companies?: string[];
  industry?: string;
  country?: string;
  keywords?: string[];
  negativeKeywords?: string[];
}

export interface LinkedInSearchLinks {
  directPeopleUrl: string;
  directCompanyUrl: string;
  googleXrayProfilesUrl: string;
  googleXrayCompaniesUrl: string;
  rawBooleanQuery: string;
  googleXrayQuery: string;
}

/**
 * Builds optimized Boolean query string for LinkedIn search and Google X-ray
 */
export function buildLinkedInQueries(params: LinkedInQueryBuilderParams): LinkedInSearchLinks {
  const titleParts = params.jobTitles
    .filter(t => t.trim().length > 0)
    .map(t => `"${t.trim()}"`);

  const titleGroup = titleParts.length > 0
    ? titleParts.length === 1 ? titleParts[0] : `(${titleParts.join(' OR ')})`
    : '';

  const companyParts = (params.companies || [])
    .filter(c => c.trim().length > 0)
    .map(c => `"${c.trim()}"`);

  const companyGroup = companyParts.length > 0
    ? companyParts.length === 1 ? companyParts[0] : `(${companyParts.join(' OR ')})`
    : '';

  const keywordParts = (params.keywords || [])
    .filter(k => k.trim().length > 0)
    .map(k => k.includes(' ') ? `"${k.trim()}"` : k.trim());

  const negativeParts = (params.negativeKeywords || [])
    .filter(nk => nk.trim().length > 0)
    .map(nk => `NOT "${nk.trim()}"`);

  // 1. Boolean query for LinkedIn People search bar
  const queryTokens: string[] = [];
  if (titleGroup) queryTokens.push(titleGroup);
  if (params.industry && params.industry.trim()) {
    queryTokens.push(`"${params.industry.trim()}"`);
  }
  if (params.country && params.country.trim()) {
    queryTokens.push(`"${params.country.trim()}"`);
  }
  if (companyGroup) queryTokens.push(companyGroup);
  if (keywordParts.length > 0) queryTokens.push(keywordParts.join(' AND '));
  if (negativeParts.length > 0) queryTokens.push(negativeParts.join(' '));

  const rawBooleanQuery = queryTokens.join(' AND ');

  // 2. Google X-Ray Search for Profiles
  // Syntax: site:linkedin.com/in/ ("Title 1" OR "Title 2") "Industry" "Location" -intitle:intern
  const xrayTokens: string[] = ['site:linkedin.com/in/'];
  if (titleGroup) xrayTokens.push(titleGroup);
  if (params.industry && params.industry.trim()) xrayTokens.push(`"${params.industry.trim()}"`);
  if (params.country && params.country.trim()) xrayTokens.push(`"${params.country.trim()}"`);
  if (companyGroup) xrayTokens.push(companyGroup);
  if (keywordParts.length > 0) xrayTokens.push(keywordParts.join(' '));
  if (params.negativeKeywords && params.negativeKeywords.length > 0) {
    for (const nk of params.negativeKeywords) {
      if (nk.trim()) xrayTokens.push(`-"${nk.trim()}"`);
    }
  }

  const googleXrayQuery = xrayTokens.join(' ');

  // 3. Google X-Ray Search for Companies
  const xrayCompanyTokens: string[] = ['site:linkedin.com/company/'];
  if (params.industry && params.industry.trim()) xrayCompanyTokens.push(`"${params.industry.trim()}"`);
  if (params.country && params.country.trim()) xrayCompanyTokens.push(`"${params.country.trim()}"`);
  if (keywordParts.length > 0) xrayCompanyTokens.push(keywordParts.join(' '));

  const googleXrayCompanyQuery = xrayCompanyTokens.join(' ');

  // Direct URLs
  const directPeopleUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(rawBooleanQuery)}`;
  const directCompanyUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(
    [params.industry, params.country, (params.keywords || []).join(' ')].filter(Boolean).join(' ')
  )}`;
  const googleXrayProfilesUrl = `https://www.google.com/search?q=${encodeURIComponent(googleXrayQuery)}`;
  const googleXrayCompaniesUrl = `https://www.google.com/search?q=${encodeURIComponent(googleXrayCompanyQuery)}`;

  return {
    directPeopleUrl,
    directCompanyUrl,
    googleXrayProfilesUrl,
    googleXrayCompaniesUrl,
    rawBooleanQuery,
    googleXrayQuery,
  };
}
