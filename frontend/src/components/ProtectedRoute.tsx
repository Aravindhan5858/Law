import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setHasTimedOut(false);
      return;
    }

    const timeout = window.setTimeout(() => setHasTimedOut(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [isLoaded]);

  if (!isLoaded && !hasTimedOut) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#2563eb" strokeWidth="4" strokeDasharray="28 28" />
          </svg>
        </motion.div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoaded && hasTimedOut) {
    return (
      <div className="loading-screen">
        <p>Authentication is unavailable. Check your Clerk configuration and reload the page.</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
