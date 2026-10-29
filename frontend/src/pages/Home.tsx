import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

export default function Home() {
  const { user } = useUser();
  
  const userName = user?.fullName || user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

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
    <main className="dashboard dashboard-home">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="dashboard-kicker">LEGAL CASE ADVISOR / WORKSPACE</span>
          <h1>Good to see you, {userName}.</h1>
          <p>Turn a difficult legal question into a clearer next step.</p>
        </div>
        <div className="system-status" aria-label="Legal search system status">
          <span className="status-dot" />
          <span>Search system online</span>
        </div>
      </motion.div>

      <motion.div
        className="dashboard-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        <div>
          <span className="intro-label">START HERE</span>
          <h2>What do you need to resolve?</h2>
        </div>
        <span className="intro-meta">154 sections indexed · 8 Acts covered</span>
      </motion.div>

      <motion.div
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link to="/analyze" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="dashboard-card analyze-card">
              <div className="card-glow-effect"></div>
              <div className="card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>Analyze Case</h3>
              <p>Describe your legal situation and get instant analysis with relevant IPC sections and recommendations.</p>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/offline-search" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="dashboard-card laws-card">
              <div className="card-glow-effect"></div>
              <div className="card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3>Browse Laws</h3>
              <p>Explore the complete database of IPC sections, punishments, and legal provisions.</p>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="dashboard-card about-card">
              <div className="card-glow-effect"></div>
              <div className="card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3>About</h3>
              <p>Learn more about how our AI-powered legal advisor works and how it can help you.</p>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="dashboard-card contact-card">
              <div className="card-glow-effect"></div>
              <div className="card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Contact Us</h3>
              <p>Have questions or need support? Get in touch with our team for assistance.</p>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="how-it-works">
          <span className="section-eyebrow">A SIMPLE THREE-STEP FLOW</span>
          <h3>From situation to direction</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>Describe</strong><span>Explain the situation in plain language.</span></li>
            <li><strong>Understand</strong><span>Review relevant sections and context.</span></li>
            <li><strong>Decide</strong><span>Use the findings to plan your next conversation.</span></li>
          </ol>
        </div>

        <div className="disclaimer" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
          <strong>Disclaimer:</strong> This tool provides general legal information and should not be considered as legal advice. 
          Always consult with a qualified legal professional for your specific situation.
        </div>
      </motion.div>
    </main>
  );
}
