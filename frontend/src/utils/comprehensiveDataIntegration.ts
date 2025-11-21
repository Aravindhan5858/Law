/**
 * Comprehensive Legal Data Integration System
 * 
 * This module provides a scalable architecture for integrating ALL sections
 * from 8 major Indian Acts into the ML engine.
 * 
 * Total Sections: 2000+
 * - IPC: 511 sections
 * - CrPC: 484 sections
 * - Evidence Act: 167 sections
 * - IT Act: 94 sections
 * - Contract Act: 266 sections
 * - Companies Act: 470 sections
 * - Motor Vehicles Act: 217 sections
 * - RTI Act: 31 sections
 */

import type { LawSection, LawSectionWithAct } from '../types/law.types';

/**
 * Structured data format for ML engine integration
 */
export interface MLLawEntry {
  // Unique identifier
  id: string;
  
  // Act information
  act_name: string;
  act_year: number;
  act_short_name: string;
  
  // Section details
  section_number: string;
  section_title: string;
  section_text: string;
  
  // Legal metadata
  chapter?: string;
  chapter_number?: number;
  punishment?: string;
  example_case?: string;
  
  // ML features
  keywords?: string[];
  category?: string;
  subcategory?: string;
  
  // Cross-references
  related_sections?: string[];
  amendments?: string[];
  
  // Search optimization
  searchable_text: string;
  tokens?: string[];
}

/**
 * Act metadata structure
 */
export interface ActMetadata {
  name: string;
  short_name: string;
  year: number;
  total_sections: number;
  chapters: string[];
  description: string;
}

/**
 * Comprehensive act metadata
 */
export const ACT_METADATA: Record<string, ActMetadata> = {
  IPC: {
    name: 'Indian Penal Code',
    short_name: 'IPC',
    year: 1860,
    total_sections: 511,
    chapters: [
      'Introduction',
      'General Explanations',
      'Of Punishments',
      'General Exceptions',
      'Of Abetment',
      'Of Criminal Conspiracy',
      'Of Offences Against the State',
      'Of Offences Relating to the Army, Navy and Air Force',
      'Of Offences Against the Public Tranquility',
      'Of Offences by or Relating to Public Servants',
      'Of False Evidence and Offences Against Public Justice',
      'Of Offences Relating to Coin and Government Stamps',
      'Of Offences Relating to Weights and Measures',
      'Of Offences Affecting the Public Health, Safety, Convenience, Decency and Morals',
      'Of Offences Relating to Religion',
      'Of Offences Affecting the Human Body',
      'Of Offences Against Property',
      'Of Criminal Misappropriation of Property',
      'Of Criminal Breach of Trust',
      'Of the Receiving of Stolen Property',
      'Of Cheating',
      'Of Fraudulent Deeds and Dispositions of Property',
      'Of Mischief',
      'Of Criminal Trespass',
      'Of Offences Relating to Documents and to Property Marks',
      'Of Marriage Offences',
      'Of Defamation',
      'Of Criminal Intimidation, Insult and Annoyance',
      'Of Attempts to Commit Offences'
    ],
    description: 'The main criminal code of India covering all substantive criminal offences'
  },
  
  CRPC: {
    name: 'Code of Criminal Procedure',
    short_name: 'CrPC',
    year: 1973,
    total_sections: 484,
    chapters: [
      'Preliminary',
      'Constitution of Criminal Courts and Offices',
      'Powers of Courts',
      'Processes to Compel Appearance',
      'Arrest of Persons',
      'Processes to Compel the Production of Things',
      'Search-warrants',
      'Security for Keeping the Peace and for Good Behaviour',
      'Information to the Police and their Powers to Investigate',
      'Jurisdiction of the Criminal Courts in Inquiries and Trials',
      'Conditions Requisite for Initiation of Proceedings',
      'Complaints to Magistrates',
      'Commencement and Transfer of Criminal Cases',
      'General Provisions as to Inquiries and Trials',
      'Trial of Cases by Magistrates',
      'Summary Trials',
      'Trial of Warrant-cases by Magistrates',
      'Trial of Summons-cases by Magistrates',
      'Disposal of Cases after Commitment',
      'Trial Before a Court of Session',
      'Sentences',
      'Probation of Offenders',
      'Provisions as to Bail and Bonds',
      'Provisions Relating to Offences Affecting the Administration of Justice',
      'Appeals',
      'Reference and Revision',
      'Transfer',
      'Execution, Suspension, Remission and Commutation of Sentences',
      'Miscellaneous'
    ],
    description: 'Procedural law governing criminal investigation, trial, and appeals'
  },
  
  EVIDENCE: {
    name: 'Indian Evidence Act',
    short_name: 'Evidence Act',
    year: 1872,
    total_sections: 167,
    chapters: [
      'Preliminary',
      'Of the Relevancy of Facts',
      'Of Facts which need not be Proved',
      'Of Oral Evidence',
      'Of Documentary Evidence',
      'Of the Exclusion of Oral by Documentary Evidence',
      'Of Extrinsic Evidence',
      'Of the Burden of Proof',
      'Of Estoppel',
      'Of Witnesses',
      'Of Examination of Witnesses',
      'Of Improper Admission and Rejection of Evidence'
    ],
    description: 'Law governing admissibility and proof of evidence in courts'
  },
  
  IT_ACT: {
    name: 'Information Technology Act',
    short_name: 'IT Act',
    year: 2000,
    total_sections: 94,
    chapters: [
      'Preliminary',
      'Digital Signature and Electronic Signature',
      'Electronic Governance',
      'Attribution, Acknowledgment and Dispatch of Electronic Records',
      'Secure Electronic Records and Secure Digital Signatures',
      'Regulation of Certifying Authorities',
      'Digital Signature Certificates',
      'Duties of Subscribers',
      'Penalties, Compensation and Adjudication',
      'The Cyber Appellate Tribunal',
      'Offences',
      'Intermediaries Not to be Liable in Certain Cases',
      'Miscellaneous'
    ],
    description: 'Law governing cyber crimes, electronic records, and digital transactions'
  },
  
  CONTRACT: {
    name: 'Indian Contract Act',
    short_name: 'Contract Act',
    year: 1872,
    total_sections: 266,
    chapters: [
      'Preliminary',
      'Of the Communication, Acceptance and Revocation of Proposals',
      'Of Contingent Contracts',
      'Of the Performance of Contracts',
      'Of Quasi Contracts',
      'Of the Consequences of Breach of Contract',
      'Of Indemnity and Guarantee',
      'Of Bailment',
      'Of Agency',
      'Of Partnership'
    ],
    description: 'Law governing formation and enforcement of contracts'
  },
  
  COMPANIES: {
    name: 'Companies Act',
    short_name: 'Companies Act',
    year: 2013,
    total_sections: 470,
    chapters: [
      'Preliminary',
      'Incorporation of Company and Matters Incidental thereto',
      'Prospectus and Allotment of Securities',
      'Share Capital and Debentures',
      'Acceptance of Deposits by Companies',
      'Registration of Charges',
      'Management and Administration',
      'Declaration and Payment of Dividend',
      'Accounts of Companies',
      'Audit and Auditors',
      'Companies Incorporated Outside India',
      'Government Companies',
      'Finance, Accounts and Audit',
      'Inspection, Inquiry and Investigation',
      'Compromises, Arrangements and Amalgamations',
      'Prevention of Oppression and Mismanagement',
      'Winding Up',
      'Companies Authorised to Register under this Act',
      'Nidhis',
      'Miscellaneous'
    ],
    description: 'Law governing incorporation and regulation of companies'
  },
  
  MV_ACT: {
    name: 'Motor Vehicles Act',
    short_name: 'MV Act',
    year: 1988,
    total_sections: 217,
    chapters: [
      'Preliminary',
      'Licensing of Drivers of Motor Vehicles',
      'Licensing of Conductors of Stage Carriages',
      'Registration of Motor Vehicles',
      'Control of Motor Vehicles through Fitness and Certification',
      'Control of Traffic',
      'Insurance of Motor Vehicles against Third Party Risks',
      'Liability without Fault in Certain Cases',
      'Liability in Other Cases',
      'Claims Tribunals',
      'Offences, Penalties and Procedure',
      'Miscellaneous'
    ],
    description: 'Law governing motor vehicles, licensing, and traffic regulations'
  },
  
  RTI: {
    name: 'Right to Information Act',
    short_name: 'RTI Act',
    year: 2005,
    total_sections: 31,
    chapters: [
      'Preliminary',
      'Right to Information and Obligations of Public Authorities',
      'The Central Information Commission',
      'The State Information Commission',
      'Powers and Functions of the Information Commissions',
      'Miscellaneous'
    ],
    description: 'Law providing citizens right to access government information'
  }
};

/**
 * Convert law section to ML-ready format
 */
export function convertToMLFormat(
  section: LawSection,
  actShortName: string
): MLLawEntry {
  const actMeta = Object.values(ACT_METADATA).find(
    meta => meta.short_name === actShortName
  );
  
  if (!actMeta) {
    throw new Error(`Unknown act: ${actShortName}`);
  }
  
  // Create searchable text by combining all fields
  const searchableText = [
    section.section_number,
    section.title,
    section.text,
    section.punishment,
    section.example_case,
    actMeta.name,
    actMeta.short_name
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  
  return {
    id: `${actShortName}-${section.section_number}`,
    act_name: actMeta.name,
    act_year: actMeta.year,
    act_short_name: actMeta.short_name,
    section_number: section.section_number,
    section_title: section.title,
    section_text: section.text,
    punishment: section.punishment,
    example_case: section.example_case,
    searchable_text: searchableText,
    keywords: extractKeywords(searchableText),
    category: categorizeSection(section, actShortName)
  };
}

/**
 * Extract keywords from text using simple frequency analysis
 */
function extractKeywords(text: string, topN: number = 10): string[] {
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'shall', 'any', 'or', 'which', 'this'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word));
  
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top N
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Categorize section based on content
 */
function categorizeSection(section: LawSection, actShortName: string): string {
  const text = (section.title + ' ' + section.text).toLowerCase();
  
  // Category mapping based on keywords
  const categories: Record<string, string[]> = {
    'Criminal': ['murder', 'theft', 'assault', 'robbery', 'rape', 'kidnapping', 'hurt'],
    'Cyber': ['computer', 'cyber', 'internet', 'electronic', 'hacking', 'data'],
    'Procedural': ['procedure', 'trial', 'arrest', 'bail', 'investigation', 'court'],
    'Evidence': ['evidence', 'proof', 'witness', 'admission', 'confession'],
    'Contract': ['contract', 'agreement', 'breach', 'consideration', 'void'],
    'Corporate': ['company', 'director', 'shareholder', 'dividend', 'audit'],
    'Traffic': ['vehicle', 'driving', 'licence', 'traffic', 'accident'],
    'Rights': ['information', 'disclosure', 'appeal', 'complaint']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

/**
 * Batch processing for large datasets
 */
export async function processSectionsInBatches(
  sections: LawSection[],
  actShortName: string,
  batchSize: number = 100
): Promise<MLLawEntry[]> {
  const results: MLLawEntry[] = [];
  
  for (let i = 0; i < sections.length; i += batchSize) {
    const batch = sections.slice(i, i + batchSize);
    const processed = batch.map(section => convertToMLFormat(section, actShortName));
    results.push(...processed);
    
    // Allow UI to remain responsive
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}

/**
 * Get statistics for all acts
 */
export function getComprehensiveStats() {
  const stats = {
    totalActs: Object.keys(ACT_METADATA).length,
    totalSections: Object.values(ACT_METADATA).reduce(
      (sum, meta) => sum + meta.total_sections,
      0
    ),
    actWiseBreakdown: Object.values(ACT_METADATA).map(meta => ({
      name: meta.name,
      shortName: meta.short_name,
      year: meta.year,
      sections: meta.total_sections,
      chapters: meta.chapters.length
    }))
  };
  
  return stats;
}

export default {
  ACT_METADATA,
  convertToMLFormat,
  processSectionsInBatches,
  getComprehensiveStats
};
