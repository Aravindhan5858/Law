import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLegalSearch } from '../hooks/useLegalSearch';
import { useTheme } from '../context/ThemeContext';

export default function OfflineLegalSearch() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  
  const {
    isReady,
    isIndexing,
    error,
    searchResults,
    isSearching,
    lastQuery,
    search,
    clearError
  } = useLegalSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && isReady) {
      search(query);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Offline Legal Search</h1>
        <p>Search IPC sections by number, keyword, or legal topic</p>
      </motion.div>

      <div className="laws-container">
        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="search-card"
        >
          <form onSubmit={handleSearch}>
            <div className="search-wrapper">
              <div className="search-input-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="Search by section number, keyword, or legal topic..."
                  className="search-input"
                  disabled={!isReady || isIndexing}
                />
              </div>
              <motion.button
                type="submit"
                disabled={!isReady || isIndexing || !query.trim() || isSearching}
                className="btn btn-large btn-primary"
                whileHover={{ scale: (!isReady || isIndexing || !query.trim() || isSearching) ? 1 : 1.02 }}
                whileTap={{ scale: (!isReady || isIndexing || !query.trim() || isSearching) ? 1 : 0.98 }}
              >
                {isSearching ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search Laws
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Status Badge */}
          {!isReady && (
            <div className="status-badge indexing">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner-icon">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {isIndexing ? 'Indexing legal database...' : 'Initializing search...'}
            </div>
          )}
          {isReady && !isIndexing && (
            <div className="status-badge ready">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Search ready • Database indexed
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-banner"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
              <button onClick={clearError} className="error-close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="results-section"
            >
              <div className="results-header-info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                Found <strong>{searchResults.length}</strong> result{searchResults.length !== 1 ? 's' : ''} 
                for <strong className="search-query">"{lastQuery}"</strong>
              </div>

              <div className="search-results-grid">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.law.act_name}-${result.law.section_number}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="law-result-card"
                  >
                    {/* Result Header */}
                    <div className="law-card-header">
                      <div className="law-card-title">
                        <div className="law-badges">
                          <span className="rank-badge">#{result.rank}</span>
                          <span className="section-badge">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            Section {result.law.section_number}
                          </span>
                        </div>
                        <h3 className="law-title">{result.law.title}</h3>
                        <p className="law-act-name">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                          </svg>
                          {result.law.act_name}
                        </p>
                      </div>
                      
                      <div className="score-badge">
                        <span className="score-label">Match</span>
                        <span className="score-value">{Math.round(result.score * 100)}%</span>
                      </div>
                    </div>

                    {/* Result Body */}
                    <div className="law-card-body">
                      {/* Definition */}
                      <div className="law-section">
                        <h4 className="section-heading">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <line x1="10" y1="9" x2="8" y2="9"/>
                          </svg>
                          Definition
                        </h4>
                        <p className="section-content">{result.law.text}</p>
                      </div>

                      {/* Punishment */}
                      <div className="law-section punishment-section">
                        <h4 className="section-heading">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                          Punishment
                        </h4>
                        <p className="section-content">{result.law.punishment}</p>
                      </div>

                      {/* Example Case */}
                      <div className="law-section example-section">
                        <h4 className="section-heading">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          </svg>
                          Example Case
                        </h4>
                        <p className="section-content">{result.law.example_case}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

