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

  return (
    <div className="page-container">
      <motion.div
        className="content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1>Case Analysis Result</h1>
          <p>Comprehensive legal analysis of your complaint</p>
        </div>

        {/* Original Complaint */}
        {originalComplaint && (
          <div className="result-section complaint-section">
            <h3>📝 Your Complaint</h3>
            <p className="complaint-text">{originalComplaint}</p>
          </div>
        )}

        {/* Case Analysis */}
        {top ? (
          <>
            {/* Case Type Classification */}
            <div className="result-section">
              <h3>🔍 Case Classification</h3>
              <div className="classification-badge">
                {top.title.toLowerCase().includes('cyber') || top.title.toLowerCase().includes('information technology') ? (
                  <span className="badge badge-cyber">Cyber Crime</span>
                ) : top.title.toLowerCase().includes('consumer') ? (
                  <span className="badge badge-consumer">Consumer Complaint</span>
                ) : (
                  <span className="badge badge-criminal">Criminal Case</span>
                )}
              </div>
            </div>

            {/* Applicable Legal Sections */}
            <div className="result-section">
              <h3>⚖️ Applicable Legal Provisions</h3>
              <div className="legal-card">
                <div className="section-header">
                  <h4>Section {top.ipc_section}</h4>
                  <span className="confidence-badge">{(top.confidence * 100).toFixed(0)}% Match</span>
                </div>
                <p className="section-title">{top.title}</p>
                <div className="rationale">
                  <strong>Why this applies:</strong>
                  <p>{top.rationale}</p>
                </div>
              </div>

              {result.recommendations && result.recommendations.length > 1 && (
                <div className="additional-sections">
                  <h4>Other Relevant Sections:</h4>
                  {result.recommendations.slice(1, 4).map((rec, idx) => (
                    <div key={idx} className="mini-legal-card">
                      <div>
                        <strong>Section {rec.ipc_section}</strong> - {rec.title}
                      </div>
                      <span className="mini-confidence">{(rec.confidence * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Punishment Details */}
            <div className="result-section">
              <h3>⚡ Possible Punishment</h3>
              <div className="punishment-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>{top.punishment}</p>
              </div>
            </div>

            {/* Steps to File Complaint */}
            <div className="result-section">
              <h3>📋 How to File a Complaint</h3>
              <div className="procedure-card">
                <div className="procedure-content">
                  {top.procedure.split('.').filter(s => s.trim()).map((step, idx) => (
                    <div key={idx} className="procedure-step">
                      <div className="step-number">{idx + 1}</div>
                      <p>{step.trim()}.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filing Options */}
              <div className="filing-options">
                <div className="filing-option">
                  <h4>🏛️ Consumer Court</h4>
                  <p>For consumer-related disputes and e-commerce fraud</p>
                  <a href="https://edaakhil.nic.in/edaakhil/" target="_blank" rel="noopener noreferrer" className="link-btn">
                    Visit Consumer Forum
                  </a>
                </div>
                <div className="filing-option">
                  <h4>💻 Cyber Crime Portal</h4>
                  <p>For online fraud, cyber crimes, and digital offenses</p>
                  <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="link-btn">
                    Report Cyber Crime
                  </a>
                </div>
                <div className="filing-option">
                  <h4>🚔 Police FIR</h4>
                  <p>For criminal cases requiring police investigation</p>
                  <a href="https://www.india.gov.in/topics/law-justice/police" target="_blank" rel="noopener noreferrer" className="link-btn">
                    File FIR
                  </a>
                </div>
              </div>
            </div>

            {/* Probable Outcome */}
            <div className="result-section">
              <h3>🎯 Probable Outcome</h3>
              <div className="outcome-card">
                <div className="outcome-item">
                  <strong>For the Complainant:</strong>
                  <ul>
                    <li>Refund of the paid amount</li>
                    <li>Compensation for mental agony and harassment</li>
                    <li>Interest on the amount from the date of payment</li>
                    <li>Legal costs may be recovered</li>
                  </ul>
                </div>
                <div className="outcome-item">
                  <strong>For the Accused:</strong>
                  <ul>
                    <li>Penalty as per {top.punishment}</li>
                    <li>Obligation to refund the customer</li>
                    <li>Possible business license implications</li>
                    <li>Criminal liability if fraud is proven</li>
                  </ul>
                </div>
              </div>
            </div>

          </>
        ) : (
          <div className="result-section">
            <div className="no-match-card">
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
          <div className="disclaimer-card">
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
