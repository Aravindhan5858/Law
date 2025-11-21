import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface LegalAnalysis {
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

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Voice recognition
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize voice recognition on component mount
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US'; // Default to English
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
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
          setError('Microphone permission denied. Please enable microphone access.');
        } else {
          setError(`Voice recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      setError('Voice recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
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
    setError(null);
    setAnalysis(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${API_URL}/api/legal-analysis/analyze`, {
        complaint: text.trim()
      });
      
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        setError('Failed to analyze complaint. Please try again.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to analyze. Please check your connection and try again.');
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
            <div className="button-group">
              <button 
                className="voice-btn"
                onClick={toggleVoiceInput}
                type="button"
              >
                {isListening ? (
                  <>
                    <span className="pulse-icon">🎤</span>
                    <span className="btn-text">Listening...</span>
                  </>
                ) : (
                  <>
                    🎤 <span className="btn-text">Voice Input</span>
                  </>
                )}
              </button>
              <button 
                className="example-btn"
                onClick={loadExample}
                type="button"
              >
                <span className="btn-text">Load Example</span>
              </button>
            </div>
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

        {/* Error Message */}
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px',
              color: '#c33'
            }}
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            className="analysis-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: '40px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              color: 'var(--primary-color)'
            }}>
              📋 Legal Analysis Report
            </h2>

            {/* Case Classification */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '8px'
              }}>
                🎯 Case Classification
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Category:</strong>
                  <p style={{ marginTop: '8px', fontSize: '16px', fontWeight: '500' }}>
                    {analysis.caseClassification.primaryCategory}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Type:</strong>
                  <p style={{ marginTop: '8px', fontSize: '16px', fontWeight: '500' }}>
                    {analysis.caseClassification.subcategory}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Severity:</strong>
                  <p style={{ 
                    marginTop: '8px', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: analysis.caseClassification.severity === 'High' ? '#e74c3c' : 
                           analysis.caseClassification.severity === 'Medium' ? '#f39c12' : '#27ae60'
                  }}>
                    {analysis.caseClassification.severity}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Jurisdiction:</strong>
                  <p style={{ marginTop: '8px', fontSize: '16px', fontWeight: '500' }}>
                    {analysis.caseClassification.jurisdiction}
                  </p>
                </div>
              </div>
            </div>

            {/* Applicable Sections */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '8px'
              }}>
                📚 Applicable Legal Sections
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {analysis.applicableSections.map((section, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      padding: '20px', 
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      borderLeft: '4px solid var(--primary-color)'
                    }}
                  >
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--primary-color)'
                    }}>
                      {section.act} - Section {section.section}
                    </h4>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: '500', 
                      marginBottom: '12px',
                      color: 'var(--text-primary)'
                    }}>
                      {section.title}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      marginBottom: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong>Description:</strong> {section.description}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}>
                      <strong>Relevance:</strong> {section.relevance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Punishment Details */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '8px'
              }}>
                ⚖️ Punishment Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {analysis.punishmentDetails.criminal && (
                  <div style={{ 
                    backgroundColor: '#fff5f5', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #ffcccc'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#c33' }}>
                      🔴 Criminal Penalties
                    </h4>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '14px', 
                      lineHeight: '1.8',
                      fontFamily: 'inherit',
                      margin: 0
                    }}>
                      {analysis.punishmentDetails.criminal}
                    </pre>
                  </div>
                )}
                {analysis.punishmentDetails.civil && (
                  <div style={{ 
                    backgroundColor: '#f0f8ff', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #cce5ff'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#0066cc' }}>
                      📜 Civil Remedies
                    </h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                      {analysis.punishmentDetails.civil}
                    </p>
                  </div>
                )}
                {analysis.punishmentDetails.compensation && (
                  <div style={{ 
                    backgroundColor: '#f0fff4', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #c6f6d5'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#2d7a3e' }}>
                      💰 Compensation Breakdown
                    </h4>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '14px', 
                      lineHeight: '1.8',
                      fontFamily: 'inherit',
                      margin: 0
                    }}>
                      {analysis.punishmentDetails.compensation}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Action Steps */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '8px'
              }}>
                ⚡ Recommended Action Steps
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {analysis.actionSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      padding: '20px', 
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: '16px'
                    }}
                  >
                    <div style={{ 
                      backgroundColor: 'var(--primary-color)', 
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {step.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.6', 
                        marginBottom: '12px',
                        color: 'var(--text-primary)'
                      }}>
                        {step.action}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '24px', 
                        fontSize: '13px',
                        color: 'var(--text-secondary)'
                      }}>
                        <div>
                          <strong>Timeline:</strong> {step.timeline}
                        </div>
                        <div>
                          <strong>Authority:</strong> {step.authority}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Outcome */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '8px'
              }}>
                🎯 Expected Outcome
              </h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                <div style={{ 
                  backgroundColor: '#f0fff4', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #c6f6d5'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2d7a3e' }}>
                    ✅ Best Case Scenario
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {analysis.expectedOutcome.bestCase}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#fff5f5', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #ffcccc'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#c33' }}>
                    ⚠️ Worst Case Scenario
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {analysis.expectedOutcome.worstCase}
                  </p>
                </div>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    ⏱️ Timeline
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {analysis.expectedOutcome.timeline}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    📊 Success Probability
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {analysis.expectedOutcome.successProbability}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {analysis.additionalNotes && (
              <div style={{ 
                backgroundColor: '#fffbeb', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#92400e'
                }}>
                  💡 Important Tips
                </h3>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '14px', 
                  lineHeight: '1.8',
                  fontFamily: 'inherit',
                  margin: 0,
                  color: '#78350f'
                }}>
                  {analysis.additionalNotes}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
