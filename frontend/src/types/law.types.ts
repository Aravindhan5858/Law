/**
 * Core data model for legal sections across different acts
 */
export interface LawSection {
  section_number: string;
  title: string;
  text: string;
  punishment: string;
  example_case: string;
}

/**
 * Extended law section with act name for display
 */
export interface LawSectionWithAct extends LawSection {
  act_name: string;
}

/**
 * Search result with relevance score
 */
export interface SearchResult {
  law: LawSectionWithAct;
  score: number;
  rank: number;
}

/**
 * TF-IDF vector representation
 */
export interface TFIDFVector {
  [term: string]: number;
}

/**
 * Document with preprocessed tokens
 */
export interface ProcessedDocument {
  id: string;
  tokens: string[];
  originalLaw: LawSectionWithAct;
  tfidfVector?: TFIDFVector;
}

/**
 * Search engine configuration
 */
export interface SearchConfig {
  minScore: number;
  maxResults: number;
  stopwords: Set<string>;
}

/**
 * IndexedDB schema for offline storage
 */
export interface LawDatabase {
  laws: LawSectionWithAct[];
  vocabulary: string[];
  documents: ProcessedDocument[];
  lastUpdated: number;
}
