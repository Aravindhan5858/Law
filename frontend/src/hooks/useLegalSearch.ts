import { useState, useEffect, useCallback } from 'react';
import type {
  LawSectionWithAct,
  ProcessedDocument,
  SearchResult,
  LawDatabase
} from '../types/law.types';
import { loadAllLaws } from '../utils/dataLoader';
import {
  preprocessLaws,
  buildTFIDFVectors,
  searchLaws,
  isSectionNumberQuery,
  searchBySection
} from '../utils/tfidfSearch';
import {
  saveLawDatabase,
  loadLawDatabase,
  isIndexedDBAvailable
} from '../utils/indexedDBStorage';

interface UseLegalSearchReturn {
  // State
  isReady: boolean;
  isIndexing: boolean;
  error: string | null;
  searchResults: SearchResult[];
  isSearching: boolean;
  lastQuery: string;
  stats: {
    totalLaws: number;
    vocabularySize: number;
    lastIndexed: Date | null;
  };

  // Actions
  search: (query: string) => void;
  rebuildIndex: () => Promise<void>;
  clearError: () => void;
}

export function useLegalSearch(): UseLegalSearchReturn {
  const [isReady, setIsReady] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  // Internal state
  const [allLaws, setAllLaws] = useState<LawSectionWithAct[]>([]);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [idf, setIdf] = useState<Map<string, number>>(new Map());
  const [lastIndexed, setLastIndexed] = useState<Date | null>(null);

  /**
   * Build or rebuild the search index
   */
  const buildIndex = useCallback(async (forceRebuild = false) => {
    setIsIndexing(true);
    setError(null);

    try {
      // Try to load from IndexedDB first
      if (!forceRebuild && isIndexedDBAvailable()) {
        const cached = await loadLawDatabase();
        
        if (cached && cached.laws && cached.documents) {
          console.log('✅ Loaded search index from IndexedDB');
          setAllLaws(cached.laws);
          setVocabulary(cached.vocabulary);
          setLastIndexed(new Date(cached.lastUpdated));
          
          // Reconstruct documents with vectors
          const { documents: docsWithVectors, idf: calculatedIdf } = 
            buildTFIDFVectors(cached.documents);
          
          setDocuments(docsWithVectors);
          setIdf(calculatedIdf);
          setIsReady(true);
          setIsIndexing(false);
          return;
        }
      }

      // Load fresh data
      console.log('📥 Loading law datasets...');
      const laws = loadAllLaws();
      setAllLaws(laws);

      // Preprocess
      console.log('⚙️ Preprocessing documents...');
      const processedDocs = preprocessLaws(laws);

      // Build TF-IDF vectors
      console.log('🧮 Building TF-IDF vectors...');
      const { documents: docsWithVectors, vocabulary: vocab, idf: calculatedIdf } = 
        buildTFIDFVectors(processedDocs);

      setDocuments(docsWithVectors);
      setVocabulary(vocab);
      setIdf(calculatedIdf);
      setLastIndexed(new Date());

      // Save to IndexedDB
      if (isIndexedDBAvailable()) {
        const dbData: LawDatabase = {
          laws,
          vocabulary: vocab,
          documents: processedDocs, // Save without vectors to reduce size
          lastUpdated: Date.now()
        };
        
        await saveLawDatabase(dbData);
        console.log('💾 Saved search index to IndexedDB');
      }

      console.log(`✅ Index ready: ${laws.length} laws, ${vocab.length} terms`);
      setIsReady(true);
    } catch (err) {
      console.error('❌ Error building index:', err);
      setError(err instanceof Error ? err.message : 'Failed to build search index');
    } finally {
      setIsIndexing(false);
    }
  }, []);

  /**
   * Rebuild index (public API)
   */
  const rebuildIndex = useCallback(async () => {
    await buildIndex(true);
  }, [buildIndex]);

  /**
   * Search function
   */
  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLastQuery('');
      return;
    }

    setIsSearching(true);
    setError(null);
    setLastQuery(query);

    try {
      // Check if it's a section number query
      if (isSectionNumberQuery(query)) {
        const exactMatch = searchBySection(query, allLaws);
        
        if (exactMatch) {
          setSearchResults([{
            law: exactMatch,
            score: 1.0,
            rank: 1
          }]);
        } else {
          setSearchResults([]);
          setError('No matching section found');
        }
      } else {
        // Semantic search using TF-IDF
        const results = searchLaws(query, documents, vocabulary, idf, {
          minScore: 0.05,
          maxResults: 3,
          stopwords: new Set()
        });

        if (results.length === 0) {
          setError('No matching law found. Try different keywords or a section number.');
        }

        setSearchResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [allLaws, documents, vocabulary, idf]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    buildIndex(false);
  }, [buildIndex]);

  return {
    isReady,
    isIndexing,
    error,
    searchResults,
    isSearching,
    lastQuery,
    stats: {
      totalLaws: allLaws.length,
      vocabularySize: vocabulary.length,
      lastIndexed
    },
    search,
    rebuildIndex,
    clearError
  };
}
