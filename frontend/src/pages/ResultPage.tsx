import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AnalysisResult {
  query?: string;
  recommendations?: Array<{
    ipc_section: string;
    title: string;
    punishment: string;
    confidence: number;
    rationale: string;
    procedure: string;
  }>;
  disclaimer?: string;
}

export default function ResultPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const result = (loc.state as any)?.result as AnalysisResult;
  const originalComplaint = (loc.state as any)?.originalComplaint;

  if (!result) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="no-result-card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>No Analysis Available</h2>
            <p>Please analyze a case first to see the results.</p>
            <button className="primary-btn" onClick={() => navigate('/analyze')}>
              Go to Analyze
            </button>
          </div>
        </div>
      </div>
    );
  }

  const top = result.recommendations?.[0];

  // Determine case type based on the section/title
  const getCaseType = () => {
    if (!top) return 'Consumer';
    const text = (top.title + top.ipc_section).toLowerCase();
    if (text.includes('cyber') || text.includes('information technology') || text.includes('it act') || text.includes('66')) {
      return 'Cyber';
    } else if (text.includes('consumer')) {
      return 'Consumer';
    } else {
      return 'Criminal';
    }
  };

  const caseType = getCaseType();

  return (
    <div className="page-container">
      <motion.div
        className="content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1>Analysis Result</h1>
          <p>Structured legal analysis of your complaint</p>
        </div>

        {/* Original Complaint */}
        {originalComplaint && (
          <div className="structured-section complaint-display">
            <div className="section-icon">📝</div>
            <div className="section-content">
              <h3>Your Complaint</h3>
              <p className="complaint-text">{originalComplaint}</p>
            </div>
          </div>
        )}

        {/* Structured Output */}
        {top ? (
          <div className="structured-result">
            {/* Case Classification */}
            <div className="structured-section">
              <div className="section-icon">🔍</div>
              <div className="section-content">
                <h3>Case Classification</h3>
                <div className="classification-tags">
                  <span className={`classification-tag ${caseType.toLowerCase()}`}>
                    {caseType}
                  </span>
                  {caseType === 'Cyber' && <span className="classification-tag criminal">Criminal</span>}
                </div>
              </div>
            </div>

            {/* Applicable Sections */}
            <div className="structured-section">
              <div className="section-icon">⚖️</div>
              <div className="section-content">
                <h3>Applicable Sections</h3>
                <ul className="sections-list">
                  <li>
                    <strong>Section {top.ipc_section}</strong> - {top.title}
                    <span className="confidence-tag">{(top.confidence * 100).toFixed(0)}% match</span>
                  </li>
                  {result.recommendations && result.recommendations.slice(1, 3).map((rec, idx) => (
                    <li key={idx}>
                      <strong>Section {rec.ipc_section}</strong> - {rec.title}
                      <span className="confidence-tag">{(rec.confidence * 100).toFixed(0)}% match</span>
                    </li>
                  ))}
                </ul>
                <div className="rationale-box">
                  <strong>Why this applies:</strong>
                  <p>{top.rationale}</p>
                </div>
              </div>
            </div>

            {/* Punishment */}
            <div className="structured-section">
              <div className="section-icon">⚡</div>
              <div className="section-content">
                <h3>Punishment</h3>
                <div className="punishment-box">
                  <p>{top.punishment}</p>
                </div>
              </div>
            </div>

            {/* Action Steps */}
            <div className="structured-section">
              <div className="section-icon">📋</div>
              <div className="section-content">
                <h3>Action Steps</h3>
                <div className="steps-list">
                  {top.procedure.split('.').filter(s => s.trim()).map((step, idx) => (
                    <div key={idx} className="step-item">
                      <span className="step-num">{idx + 1}</span>
                      <p>{step.trim()}.</p>
                    </div>
                  ))}
                </div>
                
                {/* Filing Portal Links */}
                <div className="portal-links">
                  <h4>File Your Complaint:</h4>
                  <div className="portal-grid">
                    <a href="https://edaakhil.nic.in/edaakhil/" target="_blank" rel="noopener noreferrer" className="portal-card">
                      <span className="portal-icon">🏛️</span>
                      <strong>Consumer Court</strong>
                      <small>For consumer disputes</small>
                    </a>
                    <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="portal-card">
                      <span className="portal-icon">💻</span>
                      <strong>Cyber Crime</strong>
                      <small>For online fraud</small>
                    </a>
                    <a href="https://www.india.gov.in/topics/law-justice/police" target="_blank" rel="noopener noreferrer" className="portal-card">
                      <span className="portal-icon">🚔</span>
                      <strong>Police FIR</strong>
                      <small>For criminal cases</small>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="structured-section">
              <div className="section-icon">🎯</div>
              <div className="section-content">
                <h3>Expected Outcome</h3>
                <div className="outcome-grid">
                  <div className="outcome-box success">
                    <strong>For Complainant:</strong>
                    <ul>
                      <li>Full refund of paid amount</li>
                      <li>Compensation for harassment</li>
                      <li>Interest on delayed payment</li>
                      <li>Recovery of legal costs</li>
                    </ul>
                  </div>
                  <div className="outcome-box warning">
                    <strong>For Accused:</strong>
                    <ul>
                      <li>Penalty as per {top.punishment}</li>
                      <li>Obligation to refund customer</li>
                      <li>Possible license suspension</li>
                      <li>Criminal liability if fraud proven</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="structured-section">
            <div className="section-content">
              <p>No clear legal match found for your complaint.</p>
              <details>
                <summary>View Raw Response</summary>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </details>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {result.disclaimer && (
          <div className="disclaimer-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p>{result.disclaimer}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="secondary-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <button className="primary-btn" onClick={() => navigate('/analyze')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Analyze New Case
          </button>
        </div>
      </motion.div>
    </div>
  );
}
