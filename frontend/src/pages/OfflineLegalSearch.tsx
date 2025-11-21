import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLegalSearch } from '../hooks/useLegalSearch';

export default function OfflineLegalSearch() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Offline Legal Search
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-6"
        >
          <form onSubmit={handleSearch}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  🔍
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="Search by section number, keyword, or legal topic..."
                  className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-slate-300 
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                           outline-none text-lg transition-all shadow-sm
                           placeholder:text-slate-400"
                  disabled={!isReady || isIndexing}
                />
              </div>
              <button
                type="submit"
                disabled={!isReady || isIndexing || !query.trim() || isSearching}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white rounded-xl font-bold text-lg
                         hover:from-blue-700 hover:to-purple-700 
                         disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                         transition-all shadow-lg hover:shadow-xl transform hover:scale-105
                         active:scale-95 disabled:transform-none"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🔍</span>
                    Search
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 
                       border-l-4 border-red-500 rounded-xl shadow-lg"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-bold text-red-800 mb-1">Error</h4>
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 text-2xl font-bold
                           hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center
                           transition-all"
                >
                  ✕
                </button>
              </div>
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
              className="space-y-5"
            >
              <div className="text-gray-700 mb-6 text-lg flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Found <span className="font-bold text-blue-600">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''} 
                for <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">"{lastQuery}"</span>
              </div>

              {searchResults.map((result, index) => (
                <motion.div
                  key={`${result.law.act_name}-${result.law.section_number}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl 
                           transition-all border border-gray-100 
                           hover:border-blue-300 overflow-hidden hover:scale-[1.01]"
                >
                  {/* Result Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 border-b-2 border-blue-200">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-4 py-1.5 bg-white/20 backdrop-blur text-white rounded-full 
                                       text-sm font-bold shadow-lg">
                            #{result.rank}
                          </span>
                          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">📜</span>
                            Section {result.law.section_number}
                          </h2>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-100 mb-2">
                          {result.law.title}
                        </h3>
                        <p className="text-sm text-blue-200 font-medium flex items-center gap-2">
                          <span>📚</span>
                          {result.law.act_name}
                        </p>
                      </div>
                      
                      <div className="text-right bg-white/20 backdrop-blur rounded-xl p-4 shadow-lg">
                        <div className="text-sm text-blue-100 mb-1 font-medium">Match Score</div>
                        <div className="text-4xl font-bold text-white">
                          {Math.round(result.score * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result Body */}
                  <div className="p-6 space-y-5">
                    {/* Definition */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <span className="text-lg">📋</span> Definition
                      </h4>
                      <p className="text-gray-800 leading-relaxed text-base">
                        {result.law.text}
                      </p>
                    </div>

                    {/* Punishment */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border-l-4 border-red-500 shadow-sm">
                      <h4 className="text-sm font-bold text-red-800 uppercase mb-3 flex items-center gap-2">
                        <span className="text-lg">⚖️</span> Punishment
                      </h4>
                      <p className="text-red-900 font-medium leading-relaxed">
                        {result.law.punishment}
                      </p>
                    </div>

                    {/* Example Case */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border-l-4 border-amber-500 shadow-sm">
                      <h4 className="text-sm font-bold text-amber-800 uppercase mb-3 flex items-center gap-2">
                        <span className="text-lg">💼</span> Example Case
                      </h4>
                      <p className="text-amber-900 leading-relaxed">
                        {result.law.example_case}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
