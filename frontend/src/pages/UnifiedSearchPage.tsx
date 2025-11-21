/**
 * Unified Legal Search Page
 * Searches 1000+ sections across all acts using backend API
 * Shows only results, no landing page elements
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchAPI, SearchResult } from '../services/searchAPI';
import { Search, X } from 'lucide-react';

export default function UnifiedSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total_sections: number; acts_covered: string[] } | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  // Load stats on mount
  useEffect(() => {
    SearchAPI.getStats()
      .then(setStats)
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setShowLanding(false); // Hide landing page on search

    try {
      const response = await SearchAPI.search(query, 5);
      setResults(response.results);

      if (response.results.length === 0) {
        setError('No results found. Try different keywords or section number.');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Legal Search Corpus
          </h1>
          {stats && (
            <p className="text-gray-600">
              {stats.total_sections.toLocaleString()} sections across {stats.acts_covered.length} acts
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by section number, keyword, or case name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
            >
              <p className="text-red-700">{error}</p>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landing Page (hidden after first search) */}
        {showLanding && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Enter a section number, keyword, or case name to start searching</p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="text-gray-400">Examples:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <kbd className="px-3 py-1 bg-gray-100 rounded border border-gray-300">378</kbd>
                <kbd className="px-3 py-1 bg-gray-100 rounded border border-gray-300">theft</kbd>
                <kbd className="px-3 py-1 bg-gray-100 rounded border border-gray-300">defamation</kbd>
                <kbd className="px-3 py-1 bg-gray-100 rounded border border-gray-300">66A</kbd>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results - ONLY SHOW RESULTS */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {results.map((result, index) => (
                <motion.div
                  key={`${result.section_number}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                >
                  {/* Section Header */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Section {result.section_number}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.match_type === 'exact' ? 'bg-green-100 text-green-700' :
                          result.match_type === 'semantic' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {result.match_type === 'exact' ? 'Exact Match' : 
                           result.match_type === 'semantic' ? 'Semantic Match' : 'Keyword Match'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          Score: {(result.match_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-1">
                      {result.title}
                    </h3>
                    <p className="text-sm text-gray-500">{result.act}</p>
                  </div>

                  {/* Description */}
                  {result.description && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Definition:</h4>
                      <p className="text-gray-600 leading-relaxed">{result.description}</p>
                    </div>
                  )}

                  {/* Punishment */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Punishment:</h4>
                    <p className="text-gray-600">{result.punishment}</p>
                  </div>

                  {/* Example Case */}
                  {result.example_case && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Example/Case Law:</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {result.example_case}
                      </p>
                    </div>
                  )}

                  {/* Related Cases */}
                  {result.related_cases && result.related_cases.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Related Cases:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {result.related_cases.map((relatedCase, idx) => (
                          <li key={idx}>{relatedCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
