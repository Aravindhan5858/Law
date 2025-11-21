/**
 * Search Engine Initializer
 * Loads data and builds search index on startup
 */

import { vectorSearchService } from './vectorSearchService';
import { dataLoaderService } from './dataLoaderService';

/**
 * Initialize the search engine
 */
export async function initializeSearchEngine(): Promise<void> {
  try {
    console.log('[SearchInit] Starting search engine initialization...');
    
    // Load all legal sections from all acts
    const allSections = await dataLoaderService.loadAllSections();
    
    if (allSections.length === 0) {
      throw new Error('No sections loaded from data files');
    }

    // Build search index
    await vectorSearchService.loadDocuments(allSections);
    
    const stats = vectorSearchService.getStats();
    console.log('[SearchInit] Search engine ready!');
    console.log(`[SearchInit] Total sections: ${stats.total_sections}`);
    console.log(`[SearchInit] Unique terms: ${stats.unique_terms}`);
    console.log(`[SearchInit] Acts covered: ${stats.acts_covered.length}`);
    
  } catch (error: any) {
    console.error('[SearchInit] Initialization failed:', error.message);
    throw error;
  }
}

