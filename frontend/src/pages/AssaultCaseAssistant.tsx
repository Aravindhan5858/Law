import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

interface LegalSection {
  section: string;
  short_desc: string;
}

interface AssaultResponse {
  sections: LegalSection[];
  complaint_text: string;
  recommended_actions: string[];
  evidence_checklist: string[];
}

export default function AssaultCaseAssistant() {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('Na shop pakkam nadandhutu irundhapo oruthan inga vandhu enna reason illaama adichuttan. Indha incident la enakku physical hurt aachu. CCTV irukkum');
  const [response, setResponse] = useState<AssaultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'tanglish' | 'english'>('tanglish');

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResponse(null);

    const systemPrompt = `You are a legal-assistant AI helping a user in India craft a police complaint (FIR) and give practical next steps for an assault incident. Output JSON with keys: sections (array of {section,short_desc}), complaint_text (string), recommended_actions (array), evidence_checklist (array). Keep language ${language === 'tanglish' ? 'in Tanglish (Tamil-English mix)' : 'in English'}.`;

    const userPrompt = `User description:\n${inputText}\n\nRespond strictly in JSON with keys: sections, complaint_text, recommended_actions, evidence_checklist. complaint_text must be a ready-to-copy ${language === 'tanglish' ? 'Tanglish' : 'English'} complaint suitable for giving to a police station, 3–6 short sentences.`;

    const payload = {
      systemPrompt,
      userPrompt,
      incidentDescription: inputText,
      language
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await axios.post(`${API_URL}/api/assault-assistant`, payload);

      if (res.data && res.data.response) {
        setResponse(res.data.response);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to generate complaint');
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Assault Case Assistant</h1>
        <p>Generate FIR complaint text and get practical legal guidance for assault incidents</p>
      </motion.div>

      <div className="assault-container">
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="disclaimer-box assault-disclaimer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <strong>Important Notice:</strong> This tool provides suggested complaint text and actions only. 
            For legal advice, consult a qualified lawyer. Do not submit this as an official complaint without review.
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="assault-card"
        >
          <div className="assault-header">
            <h2>Incident Description</h2>
            <div className="language-toggle">
              <button
                className={language === 'tanglish' ? 'active' : ''}
                onClick={() => setLanguage('tanglish')}
              >
                Tanglish
              </button>
              <button
                className={language === 'english' ? 'active' : ''}
                onClick={() => setLanguage('english')}
              >
                English
              </button>
            </div>
          </div>

          <label className="assault-label">
            Describe the assault incident in detail (Tanglish or English)
          </label>
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="form-textarea assault-textarea"
            placeholder="Example: Na shop pakkam nadandhutu irundhapo oruthan inga vandhu enna reason illaama adichuttan..."
          />

          <div className="assault-actions">
            <motion.button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className="btn btn-large btn-primary"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Generate Complaint & Actions
                </>
              )}
            </motion.button>
            <button
              onClick={() => {
                setInputText('');
                setResponse(null);
                setError(null);
              }}
              className="btn btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Clear
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-banner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Results Section */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="assault-results"
          >
            {/* IPC Sections */}
            <div className="result-section">
              <h3 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Suggested IPC Sections
              </h3>
              <div className="sections-grid">
                {response.sections?.map((s, i) => (
                  <div key={i} className="section-badge-card">
                    <span className="section-number">Section {s.section}</span>
                    <span className="section-desc">{s.short_desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complaint Text */}
            <div className="result-section">
              <div className="section-title-with-action">
                <h3 className="section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Ready-to-Copy Complaint
                </h3>
                <button
                  onClick={() => copyToClipboard(response.complaint_text)}
                  className="copy-btn"
                  title="Copy to clipboard"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="complaint-box">
                <pre>{response.complaint_text}</pre>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="result-section">
              <h3 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Recommended Actions
              </h3>
              <ol className="action-list">
                {response.recommended_actions?.map((a, i) => (
                  <li key={i}>
                    <span className="action-number">{i + 1}</span>
                    <span className="action-text">{a}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Evidence Checklist */}
            <div className="result-section">
              <h3 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Evidence Checklist
              </h3>
              <ul className="evidence-list">
                {response.evidence_checklist?.map((e, i) => (
                  <li key={i}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {!response && !loading && !error && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <p>Enter the incident description and press Generate to get your complaint text and legal guidance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
