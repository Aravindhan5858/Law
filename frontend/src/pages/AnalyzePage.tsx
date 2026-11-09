import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useTheme } from '../context/ThemeContext';

interface LegalAnalysis {
  complaintTitle?: string;
  incidentSummary?: string;
  legalCategory?: string;
  peopleInvolved?: string[];
  severity?: string;
  severityExplanation?: string;
  importantFacts?: string[];
  missingInformation?: string[];
  evidenceChecklist?: Array<{ item: string; reason: string }>;
  authorityGuidance?: {
    name: string;
    why: string;
    online: string[];
    offline: string;
    escalation: string;
  };
  problemAnalysis?: {
    whatHappened: string;
    possibleLiability: string;
    rights: string[];
    supportingFacts: string[];
    alternativeInterpretations: string[];
  };
  remedies?: string[];
  precautions?: string[];
  legalAid?: string;
  disclaimer?: string;
  caseClassification: {
    primaryCategory: string;
    subcategory: string;
    severity: string;
    jurisdiction: string;
  };
  applicableSections: Array<{
    act: string;
    section: string;
    title: string;
    description: string;
    relevance: string;
  }>;
  punishmentDetails: {
    criminal?: string;
    civil?: string;
    compensation?: string;
  };
  actionSteps: Array<{
    step: number;
    action: string;
    timeline: string;
    authority: string;
  }>;
  expectedOutcome: {
    bestCase: string;
    worstCase: string;
    timeline: string;
    successProbability: string;
  };
  additionalNotes?: string;
}

type ViewMode = 'detailed' | 'flowchart';

export default function AnalyzePage() {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [recognition, setRecognition] = useState<any>(null);
  const [incidentDate, setIncidentDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [evidenceNames, setEvidenceNames] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  // Initialize voice recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setText((prev) => prev + finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone permission denied.');
        }
      };
      
      recognitionInstance.onend = () => setIsListening(false);
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      setError('Voice recognition not supported in this browser.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognition.start();
      setIsListening(true);
    }
  };

  const exampleComplaint = `A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given.`;

  const loadExample = () => setText(exampleComplaint);

  async function submit() {
    if (!text.trim() || text.trim().length < 10) {
      alert('Please provide a detailed description (at least 10 characters).');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/complaints/analyze`, {
        complaint: text.trim(),
        incidentDate: incidentDate || undefined,
        location: location || undefined,
        category: category || undefined,
        evidenceNames,
      });
      
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        setError('Failed to analyze complaint. Please try again.');
      }

      async function submitFollowUp() {
        if (!analysis?.followUpQuestions?.length) return;
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post(`${API_BASE_URL}/complaints/follow-up`, {
            complaint: text.trim(),
            answers: followUpAnswers,
            incidentDate: incidentDate || undefined,
            location: location || undefined,
            category: category || undefined,
            evidenceNames,
          });
          setAnalysis(response.data.analysis);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Follow-up analysis failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Case Analysis</h1>
        <p>Describe your legal complaint or issue in detail for comprehensive analysis</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="analyze-container"
      >
        <div className="analyze-card">
          <div className="analyze-header">
            <label htmlFor="complaint-text" className="analyze-label">
              Your Complaint
            </label>
            <div className="button-group">
              <button 
                className={`icon-btn ${isListening ? 'voice-active' : ''}`}
                onClick={toggleVoiceInput}
                type="button"
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? (
                  <>
                    <span className="pulse-dot"></span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    <span className="btn-text">Listening...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                    <span className="btn-text">Voice Input</span>
                  </>
                )}
              </button>
              <button 
                className="icon-btn"
                onClick={loadExample}
                type="button"
                title="Load example complaint"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span className="btn-text">Load Example</span>
              </button>
            </div>
          </div>

          <textarea
            id="complaint-text"
            className="form-textarea analyze-textarea"
            placeholder="Example: A customer pays for a mobile phone on an e-commerce site. Product is not delivered. The site stops responding and no refund is given."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
          />

          <div className="complaint-metadata-grid">
            <label>
              Incident date (optional)
              <input type="date" value={incidentDate} onChange={event => setIncidentDate(event.target.value)} />
            </label>
            <label>
              Location (optional)
              <input type="text" value={location} onChange={event => setLocation(event.target.value)} placeholder="City, district or state" />
            </label>
            <label>
              Incident category (optional)
              <select value={category} onChange={event => setCategory(event.target.value)}>
                <option value="">Let the system identify it</option>
                <option value="Physical assault">Physical assault</option>
                <option value="Online / consumer issue">Online / consumer issue</option>
                <option value="Threat or harassment">Threat or harassment</option>
                <option value="Theft or property loss">Theft or property loss</option>
              </select>
            </label>
            <label className="evidence-upload">
              Evidence files (optional)
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                multiple
                onChange={event => setEvidenceNames(Array.from(event.target.files || []).map(file => file.name))}
              />
              {evidenceNames.length > 0 && <small>{evidenceNames.length} file name(s) attached for your checklist</small>}
            </label>
          </div>

          <div className="char-count">
            {text.length} characters
          </div>

          <motion.button
            className="btn btn-large btn-primary"
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

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              className="analysis-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="results-header">
                <h2>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Legal Analysis Report
                </h2>
                
                <div className="view-toggle">
                  <button className="toggle-btn" onClick={() => window.print()} type="button" title="Print or save as PDF">
                    Print / PDF
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                    onClick={() => setViewMode('detailed')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6" x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/>
                      <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                    Detailed
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'flowchart' ? 'active' : ''}`}
                    onClick={() => setViewMode('flowchart')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Flowchart
                  </button>
                </div>
              </div>

              {viewMode === 'detailed' ? (
                <DetailedView
                  analysis={analysis}
                  theme={theme}
                  followUpAnswers={followUpAnswers}
                  setFollowUpAnswers={setFollowUpAnswers}
                  submitFollowUp={submitFollowUp}
                />
              ) : (
                <FlowchartView analysis={analysis} theme={theme} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Detailed View Component
const DetailedView: React.FC<{
  analysis: any;
  theme: string;
  followUpAnswers: Record<string, string>;
  setFollowUpAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  submitFollowUp: () => void;
}> = ({ analysis, followUpAnswers, setFollowUpAnswers, submitFollowUp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Case Classification */}
      {analysis.complaintTitle && (
        <div className="complaint-summary-hero">
          <span className="section-badge">AI-assisted legal information</span>
          <h3>{analysis.complaintTitle}</h3>
          <p>{analysis.incidentSummary}</p>
          <div className="classification-tags">
            <span className="classification-tag">{analysis.legalCategory}</span>
            <span className={`classification-tag severity-${(analysis.severity || '').toLowerCase()}`}>{analysis.severity} severity</span>
          </div>
          <p className="section-relevance">{analysis.severityExplanation}</p>
        </div>
      )}

      {analysis.importantFacts?.length > 0 && (
        <div className="result-section">
          <h3 className="section-title">Important facts identified</h3>
          <ul className="plain-list">{analysis.importantFacts.map((fact: string) => <li key={fact}>{fact}</li>)}</ul>
        </div>
      )}

      <div className="result-section">
        <h3 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Case Classification
        </h3>
        <div className="classification-grid">
          <div className="info-box">
            <span className="info-label">Category</span>
            <span className="info-value">{analysis.caseClassification.primaryCategory}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Type</span>
            <span className="info-value">{analysis.caseClassification.subcategory}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Severity</span>
            <span className={`info-value severity-${analysis.caseClassification.severity.toLowerCase()}`}>
              {analysis.caseClassification.severity}
            </span>
          </div>
          <div className="info-box">
            <span className="info-label">Jurisdiction</span>
            <span className="info-value">{analysis.caseClassification.jurisdiction}</span>
          </div>
        </div>
      </div>

      {(analysis.language || analysis.uncertainty) && (
        <div className="result-section">
          <h3 className="section-title">Analysis Confidence &amp; Missing Facts</h3>
          <div className="classification-grid">
            {analysis.language && (
              <div className="info-box">
                <span className="info-label">Detected language</span>
                <span className="info-value">{analysis.language}</span>
              </div>
            )}
            <div className="info-box">
              <span className="info-label">Model confidence</span>
              <span className="info-value">{Math.round((analysis.confidence || 0) * 100)}%</span>
            </div>
          </div>
          {analysis.uncertainty && <p className="section-relevance">{analysis.uncertainty}</p>}
          {analysis.followUpQuestions?.length > 0 && (
            <div className="additional-notes">
              <h4>Questions that can improve this analysis</h4>
              <ul>
                {analysis.followUpQuestions.map((question: string) => <li key={question}>{question}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Applicable Sections */}
      <div className="result-section">
        <h3 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Applicable Legal Sections
        </h3>
        <div className="sections-list">
          {analysis.applicableSections.length > 0 ? analysis.applicableSections.map((section: any, idx: number) => (
            <div key={idx} className="section-card">
              <div className="section-header">
                <h4>{section.act} - Section {section.section}</h4>
                <span className="section-badge">{section.title}</span>
              </div>
              <p className="section-description">{section.description}</p>
              <div className="section-relevance">
                <strong>Relevance:</strong> {section.relevance}
              </div>
              {section.ingredients?.length > 0 && <p className="section-relevance"><strong>Ingredients:</strong> {section.ingredients.join(' • ')}</p>}
              <p className="section-relevance"><strong>Potential consequence:</strong> {section.punishment}</p>
              <div className="legal-meta">
                <span>{section.bailable || 'Bail status: requires verification'}</span>
                <span>{section.cognizable || 'Cognizable status: requires verification'}</span>
                <span className={section.status === 'requires-verification' ? 'verification-warning' : ''}>{section.status === 'possible' ? 'Possible provision' : 'Requires legal verification'}</span>
                <a href={section.officialSource} target="_blank" rel="noreferrer">Official source</a>
              </div>
            </div>
          )) : (
            <p className="section-relevance">No verified section matched the available facts. Answer the follow-up questions and consult a qualified lawyer before relying on a provision.</p>
          )}
        </div>
      </div>

      {/* Punishment Details */}
      <div className="result-section">
        <h3 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Punishment Details
        </h3>
        <div className="punishment-grid">
          {analysis.punishmentDetails.criminal && (
            <div className="punishment-box criminal">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Criminal Penalties
              </h4>
              <pre>{analysis.punishmentDetails.criminal}</pre>
            </div>
          )}
          {analysis.punishmentDetails.civil && (
            <div className="punishment-box civil">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Civil Remedies
              </h4>
              <p>{analysis.punishmentDetails.civil}</p>
            </div>
          )}
          {analysis.punishmentDetails.compensation && (
            <div className="punishment-box compensation">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Compensation Breakdown
              </h4>
              <pre>{analysis.punishmentDetails.compensation}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Action Steps */}
      <div className="result-section">
        <h3 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Recommended Action Steps
        </h3>
        <div className="steps-list">
          {analysis.actionSteps.map((step: any, idx: number) => (
            <div key={idx} className="action-step">
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <p className="step-action">{step.action}</p>
                <div className="step-meta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {step.timeline}
                  </span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {step.authority}
                  </span>
                </div>

                {analysis.problemAnalysis && (
                  <div className="result-section">
                    <h3 className="section-title">Problem analysis</h3>
                    <div className="analysis-copy-grid">
                      <p><strong>What may have happened:</strong> {analysis.problemAnalysis.whatHappened}</p>
                      <p><strong>Possible liability:</strong> {analysis.problemAnalysis.possibleLiability}</p>
                      <p><strong>Rights:</strong> {analysis.problemAnalysis.rights.join(' ')}</p>
                      <p><strong>Alternative interpretations:</strong> {analysis.problemAnalysis.alternativeInterpretations.join(' ')}</p>
                    </div>
                  </div>
                )}

                {analysis.evidenceChecklist?.length > 0 && (
                  <div className="result-section">
                    <h3 className="section-title">Evidence checklist</h3>
                    <ul className="evidence-list">
                      {analysis.evidenceChecklist.map((item: any) => (
                        <li key={item.item}><input type="checkbox" /> <span><strong>{item.item}</strong><small>{item.reason}</small></span></li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.authorityGuidance && (
                  <div className="result-section">
                    <h3 className="section-title">Authority and contact guidance</h3>
                    <div className="authority-card">
                      <h4>{analysis.authorityGuidance.name}</h4>
                      <p>{analysis.authorityGuidance.why}</p>
                      <p><strong>Offline:</strong> {analysis.authorityGuidance.offline}</p>
                      <p><strong>Escalation:</strong> {analysis.authorityGuidance.escalation}</p>
                      <div className="official-links">{analysis.authorityGuidance.online.map((link: string) => <a key={link} href={link} target="_blank" rel="noreferrer">{link}</a>)}</div>
                    </div>
                  </div>
                )}

                {analysis.remedies?.length > 0 && (
                  <div className="result-section">
                    <h3 className="section-title">Remedies and precautions</h3>
                    <ul className="plain-list">{analysis.remedies.map((item: string) => <li key={item}>{item}</li>)}</ul>
                    <ul className="plain-list precaution-list">{analysis.precautions?.map((item: string) => <li key={item}>{item}</li>)}</ul>
                    <p className="legal-disclaimer">{analysis.legalAid}</p>
                  </div>
                )}

                {analysis.followUpQuestions?.length > 0 && (
                  <div className="result-section follow-up-panel">
                    <h3 className="section-title">Questions to improve this analysis</h3>
                    {analysis.followUpQuestions.map((question: string) => (
                      <label key={question}>{question}<input value={followUpAnswers[question] || ''} onChange={event => setFollowUpAnswers(prev => ({ ...prev, [question]: event.target.value }))} /></label>
                    ))}
                    <button className="btn btn-primary" type="button" onClick={submitFollowUp}>Update analysis</button>
                  </div>
                )}

                {analysis.disclaimer && <p className="legal-disclaimer">{analysis.disclaimer}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Outcome */}
      <div className="result-section">
        <h3 className="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Expected Outcome
        </h3>
        <div className="outcome-grid">
          <div className="outcome-box best-case">
            <h4>✅ Best Case Scenario</h4>
            <p>{analysis.expectedOutcome.bestCase}</p>
          </div>
          <div className="outcome-box worst-case">
            <h4>⚠️ Worst Case Scenario</h4>
            <p>{analysis.expectedOutcome.worstCase}</p>
          </div>
          <div className="outcome-box timeline">
            <h4>⏱️ Timeline</h4>
            <p>{analysis.expectedOutcome.timeline}</p>
          </div>
          <div className="outcome-box probability">
            <h4>📊 Success Probability</h4>
            <p>{analysis.expectedOutcome.successProbability}</p>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {analysis.additionalNotes && (
        <div className="result-section">
          <div className="additional-notes">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Important Tips
            </h4>
            <pre>{analysis.additionalNotes}</pre>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Flowchart View Component
const FlowchartView: React.FC<{ analysis: any; theme: string }> = ({ analysis }) => {
  return (
    <motion.div
      className="flowchart-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flowchart">
        {/* Start Node */}
        <div className="flow-node start-node">
          <div className="node-icon">🚀</div>
          <div className="node-content">
            <h4>Case Filed</h4>
            <p>{analysis.caseClassification.primaryCategory}</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        {/* Classification Node */}
        <div className="flow-node classification-node">
          <div className="node-icon">🎯</div>
          <div className="node-content">
            <h4>Case Classification</h4>
            <div className="node-details">
              <span className="detail-badge">{analysis.caseClassification.subcategory}</span>
              <span className={`severity-badge ${analysis.caseClassification.severity.toLowerCase()}`}>
                {analysis.caseClassification.severity} Severity
              </span>
              <span className="detail-badge">{analysis.caseClassification.jurisdiction}</span>
            </div>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        {/* Legal Sections Node */}
        <div className="flow-node sections-node">
          <div className="node-icon">📚</div>
          <div className="node-content">
            <h4>Applicable Laws ({analysis.applicableSections.length})</h4>
            <div className="sections-compact">
              {analysis.applicableSections.map((section: any, idx: number) => (
                <div key={idx} className="compact-section">
                  <strong>{section.act}</strong> - Section {section.section}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        {/* Action Steps Node */}
        <div className="flow-node actions-node">
          <div className="node-icon">⚡</div>
          <div className="node-content">
            <h4>Action Plan ({analysis.actionSteps.length} Steps)</h4>
            <div className="steps-compact">
              {analysis.actionSteps.map((step: any, idx: number) => (
                <div key={idx} className="compact-step">
                  <span className="step-num">{step.step}</span>
                  <div className="step-info">
                    <p>{step.action}</p>
                    <small>{step.timeline} • {step.authority}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        {/* Outcome Node */}
        <div className="flow-node outcome-node">
          <div className="node-icon">🎯</div>
          <div className="node-content">
            <h4>Expected Outcome</h4>
            <div className="outcome-summary">
              <div className="outcome-item success">
                <strong>✅ Best Case:</strong>
                <p>{analysis.expectedOutcome.bestCase}</p>
              </div>
              <div className="outcome-item warning">
                <strong>⚠️ Worst Case:</strong>
                <p>{analysis.expectedOutcome.worstCase}</p>
              </div>
              <div className="outcome-meta">
                <span>⏱️ {analysis.expectedOutcome.timeline}</span>
                <span>📊 {analysis.expectedOutcome.successProbability}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Punishment Node (if applicable) */}
        {(analysis.punishmentDetails.criminal || analysis.punishmentDetails.civil) && (
          <>
            <div className="flow-arrow">↓</div>
            <div className="flow-node punishment-node">
              <div className="node-icon">⚖️</div>
              <div className="node-content">
                <h4>Potential Penalties</h4>
                <div className="punishment-summary">
                  {analysis.punishmentDetails.criminal && (
                    <div className="penalty-item criminal">
                      <strong>🔴 Criminal:</strong>
                      <p>{analysis.punishmentDetails.criminal.substring(0, 150)}...</p>
                    </div>
                  )}
                  {analysis.punishmentDetails.civil && (
                    <div className="penalty-item civil">
                      <strong>📜 Civil:</strong>
                      <p>{analysis.punishmentDetails.civil}</p>
                    </div>
                  )}
                  {analysis.punishmentDetails.compensation && (
                    <div className="penalty-item compensation">
                      <strong>💰 Compensation:</strong>
                      <p>{analysis.punishmentDetails.compensation.substring(0, 150)}...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
