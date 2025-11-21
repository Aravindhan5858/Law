/**
 * Vector Search Service
 * Implements TF-IDF + Cosine Similarity for semantic legal search
 * Handles 1000+ sections across multiple acts
 */

interface LegalSection {
  section_number: string;
  act_name?: string;
  title: string;
  text?: string;
  definition?: string;
  punishment: string;
  example_case?: string;
  example?: string;
  related_cases?: string[];
}

interface SearchResult extends LegalSection {
  score: number;
  match_type: 'exact' | 'semantic' | 'keyword';
}

class VectorSearchService {
  private documents: LegalSection[] = [];
  private documentVectors: Map<number, Map<string, number>> = new Map();
  private idfScores: Map<string, number> = new Map();
  private isIndexed = false;

  /**
   * Load all legal sections from multiple acts
   */
  async loadDocuments(allSections: LegalSection[]): Promise<void> {
    this.documents = allSections;
    await this.buildIndex();
  }

  /**
   * Build TF-IDF index for all documents
   */
  private async buildIndex(): Promise<void> {
    console.log(`[VectorSearch] Indexing ${this.documents.length} legal sections...`);
    
    // Calculate document frequencies
    const docFrequency = new Map<string, number>();
    
    this.documents.forEach((doc, index) => {
      const text = this.getSearchableText(doc);
      const tokens = this.tokenize(text);
      const uniqueTokens = new Set(tokens);
      
      uniqueTokens.forEach(token => {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      });
    });

    // Calculate IDF scores
    const totalDocs = this.documents.length;
    docFrequency.forEach((freq, token) => {
      const idf = Math.log(totalDocs / freq);
      this.idfScores.set(token, idf);
    });

    // Calculate TF-IDF vectors for each document
    this.documents.forEach((doc, index) => {
      const text = this.getSearchableText(doc);
      const tokens = this.tokenize(text);
      const tfVector = this.calculateTF(tokens);
      const tfidfVector = new Map<string, number>();

      tfVector.forEach((tf, token) => {
        const idf = this.idfScores.get(token) || 0;
        tfidfVector.set(token, tf * idf);
      });

      this.documentVectors.set(index, tfidfVector);
    });

    this.isIndexed = true;
    console.log(`[VectorSearch] Indexed ${this.documents.length} sections successfully`);
  }

  /**
   * Get searchable text from document
   */
  private getSearchableText(doc: LegalSection): string {
    return [
      doc.section_number,
      doc.act_name || '',
      doc.title,
      doc.text || doc.definition || '',
      doc.punishment,
      doc.example_case || doc.example || '',
      ...(doc.related_cases || [])
    ].join(' ').toLowerCase();
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2); // Filter out short words
  }

  /**
   * Calculate term frequency
   */
  private calculateTF(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    tokens.forEach(token => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });
    
    // Normalize by document length
    const maxFreq = Math.max(...Array.from(tf.values()));
    tf.forEach((freq, token) => {
      tf.set(token, freq / maxFreq);
    });
    
    return tf;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    const allKeys = new Set([...vec1.keys(), ...vec2.keys()]);
    
    allKeys.forEach(key => {
      const v1 = vec1.get(key) || 0;
      const v2 = vec2.get(key) || 0;
      dotProduct += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    });

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  /**
   * Check if query is a section number
   */
  private isSectionNumber(query: string): boolean {
    // Matches: 378, 66A, 2(1)(d), 498A, etc.
    return /^[\d]+[A-Z]?(\([a-z0-9]+\))*$/i.test(query.trim());
  }

  /**
   * Search by exact section number
   */
  private searchBySection(sectionNumber: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    this.documents.forEach(doc => {
      if (doc.section_number.toLowerCase() === sectionNumber.toLowerCase()) {
        results.push({
          ...doc,
          score: 1.0,
          match_type: 'exact'
        });
      }
    });

    return results;
  }

  /**
   * Search using vector similarity
   */
  private vectorSearch(query: string, maxResults: number = 5): SearchResult[] {
    const queryTokens = this.tokenize(query);
    const queryTF = this.calculateTF(queryTokens);
    const queryVector = new Map<string, number>();

    queryTF.forEach((tf, token) => {
      const idf = this.idfScores.get(token) || 0;
      queryVector.set(token, tf * idf);
    });

    const scores: Array<{ index: number; score: number }> = [];

    this.documentVectors.forEach((docVector, index) => {
      const similarity = this.cosineSimilarity(queryVector, docVector);
      if (similarity > 0.05) { // Minimum threshold
        scores.push({ index, score: similarity });
      }
    });

    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, maxResults).map(({ index, score }) => ({
      ...this.documents[index],
      score,
      match_type: 'semantic' as const
    }));
  }

  /**
   * Main search function
   */
  search(query: string, maxResults: number = 5): SearchResult[] {
    if (!this.isIndexed) {
      throw new Error('Index not built. Call loadDocuments first.');
    }

    const trimmedQuery = query.trim();
    
    // 1. Check for section number
    if (this.isSectionNumber(trimmedQuery)) {
      const exactResults = this.searchBySection(trimmedQuery);
      if (exactResults.length > 0) {
        return exactResults;
      }
    }

    // 2. Vector similarity search
    return this.vectorSearch(trimmedQuery, maxResults);
  }

  /**
   * Get index statistics
   */
  getStats() {
    return {
      total_sections: this.documents.length,
      unique_terms: this.idfScores.size,
      indexed: this.isIndexed,
      acts_covered: [...new Set(this.documents.map(d => d.act_name))].filter(Boolean)
    };
  }
}

export const vectorSearchService = new VectorSearchService();
export default VectorSearchService;
