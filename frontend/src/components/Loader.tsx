import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import loaderConfig from '../config/loaderConfig';
import '../styles/Loader.css';

interface LoaderProps {
  targetPath: string;
  autoRedirect?: boolean;
  autoDelay?: number;
  logoSrc?: string;
  buttonDelay?: number;
  onNavigate?: () => void;
}

const Loader: React.FC<LoaderProps> = ({
  targetPath,
  autoRedirect = false,
  autoDelay = 5000,
  logoSrc = '/assets/legal_logo.svg',
  buttonDelay = loaderConfig.buttonDelay,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const buttonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigatedRef = useRef(false);

  const cancelRedirect = useCallback(() => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  }, []);

  const handleNavigate = useCallback(() => {
    if (hasNavigatedRef.current) return;
    
    hasNavigatedRef.current = true;
    cancelRedirect();
    
    if (onNavigate) {
      onNavigate();
    }
    
    navigate(targetPath);
  }, [navigate, targetPath, cancelRedirect, onNavigate]);

  useEffect(() => {
    // Show button after configured delay
    buttonTimerRef.current = setTimeout(() => {
      setShowButton(true);
    }, buttonDelay);

    // Setup auto-redirect only if enabled
    if (autoRedirect) {
      redirectTimerRef.current = setTimeout(() => {
        handleNavigate();
      }, autoDelay);
    }

    // Keyboard support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showButton) {
        handleNavigate();
      } else if (e.key === 'Escape') {
        cancelRedirect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      if (buttonTimerRef.current) {
        clearTimeout(buttonTimerRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [autoRedirect, autoDelay, buttonDelay, handleNavigate, showButton, cancelRedirect]);

  const handleContinueClick = () => {
    cancelRedirect();
    handleNavigate();
  };

  return (
    <div className="loader-container">
      <motion.div
        className="loader-logo-wrapper"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img
          src={logoSrc}
          alt="Legal Case Advisor"
          className="loader-logo"
        />
      </motion.div>

      {showButton && (
        <motion.button
          className="loader-continue-btn"
          onClick={handleContinueClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Continue to application"
          tabIndex={0}
        >
          Continue →
        </motion.button>
      )}

      <motion.div
        className="loader-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="loader-dots">
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
        {autoRedirect && (
          <motion.p
            className="loader-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Press Enter to continue or ESC to cancel auto-redirect
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Loader;
