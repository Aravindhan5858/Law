import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoDisplay from '../components/LogoDisplay';

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
      <LogoDisplay />

      {showButton && (
        <motion.button
          className="continue-btn"
          onClick={handleContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ position: 'absolute', bottom: '10%', zIndex: 10 }}
        >
          Continue →
        </motion.button>
      )}

      <motion.div
        className="loading-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ position: 'absolute', bottom: '5%', zIndex: 10 }}
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
