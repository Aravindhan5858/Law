/**
 * API Service for Legal Search
 * Connects to backend /api/search endpoint
 */

interface SearchResult {
  section_number: string;
  act: string;
  title: string;
  description: string;
  punishment: string;
  example_case: string;
  related_cases: string[];
  match_score: number;
  match_type: 'exact' | 'semantic' | 'keyword';
}

interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

interface SearchStats {
  total_sections: number;
  unique_terms: number;
  indexed: boolean;
  acts_covered: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class SearchAPI {
  /**
   * Search for legal sections
   */
  static async search(query: string, limit: number = 5): Promise<SearchResponse> {
    try {
      const url = `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('[SearchAPI] Search error:', error);
      throw new Error(error.message || 'Failed to search');
    }
  }

  /**
   * Get search engine statistics
   */
  static async getStats(): Promise<SearchStats> {
    try {
      const url = `${API_BASE_URL}/search/stats`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('[SearchAPI] Stats error:', error);
      throw new Error(error.message || 'Failed to get stats');
    }
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const url = `${API_BASE_URL}/health`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export type { SearchResult, SearchResponse, SearchStats };
