import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    // Auto-redirect after 5 seconds if user doesn't click
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => {
      clearTimeout(buttonTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <motion.div
        className="logo-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          className="logo"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="55" fill="#2563eb" opacity="0.1" />
            <path
              d="M60 20C37.9086 20 20 37.9086 20 60C20 82.0914 37.9086 100 60 100C82.0914 100 100 82.0914 100 60C100 37.9086 82.0914 20 60 20Z"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <path
              d="M45 35L45 85M45 35H60C67.1797 35 73 40.8203 73 48C73 55.1797 67.1797 61 60 61H45M45 61H55"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Legal Case Advisor
        </motion.h1>

        <motion.p
          className="app-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Your AI-Powered Legal Assistant
        </motion.p>
      </motion.div>

      {showButton && (
        <motion.button
          className="continue-btn"
          onClick={handleContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue →
        </motion.button>
      )}

      <motion.div
        className="loading-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="loading-dots">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
