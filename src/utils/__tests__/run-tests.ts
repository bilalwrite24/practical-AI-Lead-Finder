import {
  DEFAULT_ICP,
  detectDuplicates,
  evaluateLead,
  exportScoredLeadsToCsv,
  normalizeLeadRow,
  processCsvData,
} from '../icpScorer';
import { ColumnMapping, ICPDefinition, NormalizedLead, ScoredLead } from '../../types';

function runSuite() {
  console.log('--- Running LeadFit AI Core Verification Tests ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    }
  }

  // TEST 1: Exact ICP match scores High Fit
  {
    const lead: NormalizedLead = {
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

    const score = evaluateLead(lead, DEFAULT_ICP);
    assert(score.overallScore >= 80, 'Exact match scores >= 80% (High Fit)', `got ${score.overallScore}`);
    assert(score.fitCategory === 'High Fit', 'Exact match categorized as High Fit', `got ${score.fitCategory}`);
    assert(score.criteria.title.status === 'match', 'Title marked as match');
    assert(score.criteria.industry.status === 'match', 'Industry marked as match');
    assert(score.criteria.companySize.status === 'match', 'Company size marked as match');
    assert(score.criteria.country.status === 'match', 'Country marked as match');
  }

  // TEST 2: CRITICAL - Missing data marked Unknown / Needs Review and NOT penalized as mismatch
  {
    const missingIndustryLead: NormalizedLead = {
      id: 'test-2',
      name: 'Alex Rivera',
      company: 'Quantum Dynamics',
      website: 'https://quantum.com',
      domain: 'quantum.com',
      jobTitle: 'CEO',
      industry: '', // MISSING!
      country: 'Canada',
      employeeCount: '80',
      parsedEmployees: 80,
      email: 'alex@quantum.com',
      linkedin: '',
      raw: {},
    };

    const score = evaluateLead(missingIndustryLead, DEFAULT_ICP);
    assert(score.criteria.industry.status === 'unknown', 'Missing industry is tagged status: unknown');
    assert(score.hasUnknowns === true, 'Record hasUnknowns is true');
    assert(score.unknownFields.includes('Industry'), 'Industry included in unknownFields list');
    assert(score.fitCategory === 'Needs Review', 'Lead with missing critical info categorized as Needs Review', `got ${score.fitCategory}`);
    assert(score.criteria.industry.reason.startsWith('Unknown'), 'Reason clearly states Unknown rather than Mismatch');
  }

  // TEST 3: Negative keyword disqualifies title
  {
    const internLead: NormalizedLead = {
      id: 'test-3',
      name: 'Tom Student',
      company: 'Apex Software',
      website: 'apex.com',
      domain: 'apex.com',
      jobTitle: 'Sales Intern', // Contains negative keyword 'intern'
      industry: 'Software',
      country: 'United States',
      employeeCount: '150',
      parsedEmployees: 150,
      email: 'tom@apex.com',
      linkedin: '',
      raw: {},
    };

    const score = evaluateLead(internLead, DEFAULT_ICP);
    assert(score.criteria.title.status === 'mismatch', 'Negative keyword title is mismatched');
    assert(score.criteria.title.reason.includes('Disqualified by negative keyword'), 'Disqualification reason noted');
    assert(score.fitCategory === 'Low Fit', 'Disqualified lead marked Low Fit');
  }

  // TEST 4: Duplicate detection by domain, email, and name+company
  {
    const leads: ScoredLead[] = [
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
          parsedEmployees: 100,
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
          website: 'http://www.acme.com/about', // Same domain!
          domain: 'acme.com',
          jobTitle: 'Director',
          industry: 'Software',
          country: 'US',
          employeeCount: '100',
          parsedEmployees: 100,
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
          parsedEmployees: 100,
          email: 'jane@acme.com', // Duplicate email!
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

    const deduplicated = detectDuplicates(leads);
    assert(!deduplicated[0].score.isDuplicate, 'First lead is not marked duplicate');
    assert(deduplicated[1].score.isDuplicate, 'Second lead with same domain marked duplicate');
    assert(deduplicated[1].score.duplicateReason?.includes('Domain') === true, 'Duplicate reason identifies domain');
    assert(deduplicated[2].score.isDuplicate, 'Third lead with same email marked duplicate');
  }

  // TEST 5: CSV Parsing & Export
  {
    const sampleCsv = `Name,Company,Website,Title,Industry,Country,Employees
David Miller,TechPulse,https://techpulse.io,Founder & CEO,B2B SaaS,United States,45
Lisa Wong,InnoHealth,https://innohealth.com,VP of Sales,,United Kingdom,250
Mark Evans,Old Corp,https://oldcorp.com,Intern,Manufacturing,Brazil,10`;

    const processed = processCsvData(sampleCsv);
    assert(processed.totalRows === 3, 'Processed 3 rows from CSV text');
    assert(processed.stats.highFit >= 1, 'Contains High Fit lead');
    assert(processed.stats.needsReview >= 1, 'Contains Needs Review lead for missing industry data');

    const csvOutput = exportScoredLeadsToCsv(processed.scoredLeads, { includeBreakdown: true });
    assert(csvOutput.includes('ICP Fit Category'), 'Export CSV contains ICP Fit Category');
    assert(csvOutput.includes('David Miller'), 'Export CSV contains contact name');
    assert(csvOutput.includes('Title Reason'), 'Export CSV contains scoring breakdown columns');
  }

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runSuite();
