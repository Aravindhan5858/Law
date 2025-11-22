import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>About Legal Case Advisor</h1>
        <p>AI-powered legal assistance for understanding your rights and navigating legal matters</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: '2rem' }}
      >
        <motion.div 
          variants={itemVariants}
          className="info-card"
        >
          <div className="info-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3>Our Mission</h3>
          <p>
            This project helps users identify likely applicable IPC sections and provides a suggested course of action. 
            We use advanced AI technology combined with rule-based matching to analyze your legal situation and provide 
            accurate, actionable guidance.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="info-card"
        >
          <div className="info-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3>Data & References</h3>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Indian Penal Code (IPC) - Comprehensive criminal law coverage</li>
            <li>Code of Criminal Procedure (CrPC) - Procedural guidelines</li>
            <li>Information Technology Act - For cyber offences and digital crimes</li>
            <li>Regularly updated legal database</li>
          </ul>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="info-card"
        >
          <div className="info-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h3>How It Works</h3>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Describe your legal situation in plain language</li>
            <li>Our AI analyzes your case using advanced pattern matching</li>
            <li>Receive detailed analysis with applicable IPC sections</li>
            <li>Get actionable recommendations and next steps</li>
            <li>Consult with legal professionals for expert guidance</li>
          </ol>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="disclaimer-box"
          style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'var(--surface)', 
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Important Disclaimer</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                This tool is informational only and does not constitute legal advice. The analysis provided is based 
                on general legal principles and should not be relied upon as a substitute for professional legal counsel. 
                Always consult a qualified lawyer for guidance specific to your situation.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
