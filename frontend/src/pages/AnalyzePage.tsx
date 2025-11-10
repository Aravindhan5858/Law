import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Example complaint pre-filled
  const exampleComplaint = `A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given.`;

  const loadExample = () => {
    setText(exampleComplaint);
  };

  async function submit() {
    if (!text.trim() || text.trim().length < 10) {
      alert('Please provide a detailed description of your complaint (at least 10 characters).');
      return;
    }

    setLoading(true);
    try {
      // Construct the analysis prompt with the exact structured format
      const analysisPrompt = `Analyze the given complaint and display the final result with these fields:

Case Classification – criminal / consumer / cyber

Applicable Legal Sections – IPC / IT Act / Consumer Protection Act

Punishment – imprisonment or fine details if applicable

Action Steps – how the victim can file a complaint and get a remedy

Expected Outcome – refund, penalty, legal result

Complaint:
${text.trim()}

Output Format (must show directly):

Case Classification:

Applicable Sections:

Punishment:

Action Steps:

Expected Outcome:

The response must be clean, bullet-based, responsive, and readable on mobile and desktop.`;

      const body = { text: analysisPrompt };
      const res = await axios.post('/api/laws/analyze', body);
      
      // Navigate to result with state
      navigate('/result', { 
        state: { 
          result: res.data,
          originalComplaint: text.trim()
        } 
      });
    } catch (err: any) {
      console.error(err);
      alert('Failed to analyze. Please try again or check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <motion.div
        className="content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1>Case Analysis</h1>
          <p>Describe your legal complaint or issue in detail for comprehensive analysis</p>
        </div>

        <div className="analyze-card">
          <div className="analyze-header">
            <label htmlFor="complaint-text" className="analyze-label">
              Your Complaint
            </label>
            <button 
              className="example-btn"
              onClick={loadExample}
              type="button"
            >
              Load Example
            </button>
          </div>

          <textarea
            id="complaint-text"
            className="complaint-textarea"
            placeholder="Example: A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
          />

          <div className="char-count">
            {text.length} characters
          </div>

          <div className="analyze-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p>
              You will receive a structured analysis with: <strong>Case Classification</strong>, <strong>Applicable Legal Sections</strong>, 
              <strong>Punishment Details</strong>, <strong>Action Steps</strong>, and <strong>Expected Outcome</strong>.
            </p>
          </div>

          <motion.button
            className="analyze-submit-btn"
            onClick={submit}
            disabled={loading || text.trim().length < 10}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Analyze Case
              </>
            )}
          </motion.button>
        </div>

        <div className="analysis-features">
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h3>Case Classification</h3>
            <p>Identify if it's criminal, consumer, or cyber case</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚖️</div>
            <h3>Legal Provisions</h3>
            <p>Get applicable IPC, IT Act, or Consumer Act sections</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📋</div>
            <h3>Action Steps</h3>
            <p>Clear steps on how to file your complaint</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Expected Outcome</h3>
            <p>Understand possible punishments and results</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
