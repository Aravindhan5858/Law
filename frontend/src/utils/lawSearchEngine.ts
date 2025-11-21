// TF-IDF and Cosine Similarity Implementation for Law Search

export interface LawData {
  section_number: string;
  act_name: string;
  title: string;
  definition: string;
  punishment: string;
  example: string;
}

export interface VectorizedLaw extends LawData {
  vector: number[];
  combinedText: string;
}

// Stop words to remove
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
  'or', 'any', 'such', 'shall', 'may', 'under', 'who', 'which', 'this', 'been',
  'but', 'have', 'if', 'not', 'other', 'than', 'when', 'where', 'whether', 'into'
]);

// Tokenize and preprocess text
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Calculate term frequency
function calculateTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const totalTokens = tokens.length;
  
  tokens.forEach(token => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });
  
  // Normalize by total tokens
  tf.forEach((count, token) => {
    tf.set(token, count / totalTokens);
  });
  
  return tf;
}

// Calculate inverse document frequency
function calculateIDF(documents: string[][]): Map<string, number> {
  const idf = new Map<string, number>();
  const totalDocs = documents.length;
  const docFreq = new Map<string, number>();
  
  // Count document frequency for each term
  documents.forEach(tokens => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    });
  });
  
  // Calculate IDF
  docFreq.forEach((freq, token) => {
    idf.set(token, Math.log(totalDocs / freq));
  });
  
  return idf;
}

// Build vocabulary from all documents
function buildVocabulary(documents: string[][]): string[] {
  const vocabSet = new Set<string>();
  documents.forEach(tokens => {
    tokens.forEach(token => vocabSet.add(token));
  });
  return Array.from(vocabSet).sort();
}

// Create TF-IDF vector
function createTFIDFVector(
  tokens: string[],
  vocabulary: string[],
  idf: Map<string, number>
): number[] {
  const tf = calculateTF(tokens);
  const vector: number[] = [];
  
  vocabulary.forEach(term => {
    const tfValue = tf.get(term) || 0;
    const idfValue = idf.get(term) || 0;
    vector.push(tfValue * idfValue);
  });
  
  return vector;
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) return 0;
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (mag1 * mag2);
}

// Main class for ML-based law search
export class LawSearchEngine {
  private laws: VectorizedLaw[] = [];
  private vocabulary: string[] = [];
  private idf: Map<string, number> = new Map();
  private isReady: boolean = false;

  // Load and preprocess dataset
  async loadDataset(lawsData: LawData[]): Promise<void> {
    console.log('Loading dataset...', lawsData.length, 'laws');
    
    // Combine all text fields for better matching
    const combinedTexts = lawsData.map(law => {
      return `${law.section_number} ${law.title} ${law.definition} ${law.punishment} ${law.example} ${law.act_name}`;
    });
    
    // Tokenize all documents
    const allTokens = combinedTexts.map(text => tokenize(text));
    
    // Build vocabulary and calculate IDF
    this.vocabulary = buildVocabulary(allTokens);
    this.idf = calculateIDF(allTokens);
    
    console.log('Vocabulary size:', this.vocabulary.length);
    
    // Vectorize each law
    this.laws = lawsData.map((law, index) => ({
      ...law,
      combinedText: combinedTexts[index],
      vector: createTFIDFVector(allTokens[index], this.vocabulary, this.idf)
    }));
    
    this.isReady = true;
    console.log('Dataset loaded and vectorized successfully!');
  }

  // Search for laws based on query
  search(query: string, threshold: number = 0.1): { law: VectorizedLaw; score: number } | null {
    if (!this.isReady) {
      console.error('Search engine not ready. Call loadDataset() first.');
      return null;
    }
    
    // Tokenize query
    const queryTokens = tokenize(query);
    console.log('Query tokens:', queryTokens);
    
    if (queryTokens.length === 0) {
      return null;
    }
    
    // Create query vector
    const queryVector = createTFIDFVector(queryTokens, this.vocabulary, this.idf);
    
    // Calculate similarity with all laws
    const matches: Array<{ law: VectorizedLaw; score: number }> = [];
    
    this.laws.forEach(law => {
      const score = cosineSimilarity(queryVector, law.vector);
      
      if (score > threshold) {
        matches.push({ law, score });
      }
    });
    
    // Sort by score descending and get best match
    matches.sort((a, b) => b.score - a.score);
    const bestMatch = matches.length > 0 ? matches[0] : null;
    
    if (bestMatch) {
      console.log('Best match:', bestMatch.law.section_number, 'Score:', bestMatch.score.toFixed(3));
    } else {
      console.log('No match found above threshold:', threshold);
    }
    
    return bestMatch;
  }

  // Get statistics
  getStats() {
    return {
      totalLaws: this.laws.length,
      vocabularySize: this.vocabulary.length,
      isReady: this.isReady
    };
  }
}
