import type {
  LawSectionWithAct,
  ProcessedDocument,
  TFIDFVector,
  SearchResult,
  SearchConfig
} from '../types/law.types';

/**
 * Common English stopwords to filter out
 */
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'shall', 'any', 'or', 'which', 'this',
  'such', 'may', 'been', 'have', 'not', 'but', 'if', 'when', 'all',
  'so', 'would', 'there', 'their', 'what', 'them', 'than', 'other'
]);

/**
 * Tokenize and preprocess text
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Calculate Term Frequency (TF)
 */
function calculateTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const totalTokens = tokens.length;

  tokens.forEach(token => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });

  // Normalize by total tokens
  tf.forEach((count, term) => {
    tf.set(term, count / totalTokens);
  });

  return tf;
}

/**
 * Calculate Inverse Document Frequency (IDF)
 */
function calculateIDF(documents: ProcessedDocument[]): Map<string, number> {
  const idf = new Map<string, number>();
  const totalDocs = documents.length;

  // Count documents containing each term
  const docFreq = new Map<string, number>();
  
  documents.forEach(doc => {
    const uniqueTokens = new Set(doc.tokens);
    uniqueTokens.forEach(token => {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    });
  });

  // Calculate IDF
  docFreq.forEach((freq, term) => {
    idf.set(term, Math.log(totalDocs / freq));
  });

  return idf;
}

/**
 * Build vocabulary from all documents
 */
export function buildVocabulary(documents: ProcessedDocument[]): string[] {
  const vocab = new Set<string>();
  
  documents.forEach(doc => {
    doc.tokens.forEach(token => vocab.add(token));
  });

  return Array.from(vocab).sort();
}

/**
 * Create TF-IDF vector for a document
 */
export function createTFIDFVector(
  tokens: string[],
  idf: Map<string, number>,
  vocabulary: string[]
): TFIDFVector {
  const tf = calculateTF(tokens);
  const vector: TFIDFVector = {};

  vocabulary.forEach(term => {
    const tfValue = tf.get(term) || 0;
    const idfValue = idf.get(term) || 0;
    vector[term] = tfValue * idfValue;
  });

  return vector;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vec1: TFIDFVector, vec2: TFIDFVector): number {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  allTerms.forEach(term => {
    const v1 = vec1[term] || 0;
    const v2 = vec2[term] || 0;
    
    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;
  });

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Preprocess all laws into documents with tokens
 */
export function preprocessLaws(laws: LawSectionWithAct[]): ProcessedDocument[] {
  return laws.map((law, index) => {
    // Combine all text fields for comprehensive search
    const fullText = [
      law.section_number,
      law.title,
      law.text,
      law.punishment,
      law.example_case,
      law.act_name
    ].join(' ');

    return {
      id: `${law.act_name}-${law.section_number}`,
      tokens: tokenize(fullText),
      originalLaw: law
    };
  });
}

/**
 * Build TF-IDF vectors for all documents
 */
export function buildTFIDFVectors(documents: ProcessedDocument[]): {
  documents: ProcessedDocument[];
  vocabulary: string[];
  idf: Map<string, number>;
} {
  const idf = calculateIDF(documents);
  const vocabulary = buildVocabulary(documents);

  const documentsWithVectors = documents.map(doc => ({
    ...doc,
    tfidfVector: createTFIDFVector(doc.tokens, idf, vocabulary)
  }));

  return {
    documents: documentsWithVectors,
    vocabulary,
    idf
  };
}

/**
 * Search laws using TF-IDF and cosine similarity
 */
export function searchLaws(
  query: string,
  documents: ProcessedDocument[],
  vocabulary: string[],
  idf: Map<string, number>,
  config: SearchConfig = {
    minScore: 0.05,
    maxResults: 3,
    stopwords: STOPWORDS
  }
): SearchResult[] {
  // Preprocess query
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  // Create query vector
  const queryVector = createTFIDFVector(queryTokens, idf, vocabulary);

  // Calculate similarity scores
  const results: Array<{ law: LawSectionWithAct; score: number }> = [];

  documents.forEach(doc => {
    if (!doc.tfidfVector) return;

    const score = cosineSimilarity(queryVector, doc.tfidfVector);

    if (score >= config.minScore) {
      results.push({
        law: doc.originalLaw,
        score
      });
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Return top N results
  return results.slice(0, config.maxResults).map((result, index) => ({
    ...result,
    rank: index + 1
  }));
}

/**
 * Check if query is a section number
 */
export function isSectionNumberQuery(query: string): boolean {
  // Check for patterns like "302", "66A", "2(1)(d)", etc.
  return /^[\d]+[A-Z]?(\([a-z0-9]+\))*$/i.test(query.trim());
}

/**
 * Exact section number search
 */
export function searchBySection(
  sectionNumber: string,
  laws: LawSectionWithAct[]
): LawSectionWithAct | null {
  const normalized = sectionNumber.trim().toLowerCase();
  
  return laws.find(law => 
    law.section_number.toLowerCase() === normalized
  ) || null;
}
