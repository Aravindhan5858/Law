import { useState, useEffect } from 'react';
import '../styles/LogoDisplay.css';

export default function LogoDisplay() {
  const [open, setOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Trigger fade-in animation on component mount
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close only if clicking the overlay, not the image
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="logo-container">
      {!imageError ? (
        <img
          src="/assets/legal_logo.svg"
          alt="Legal Case Advisor"
          className={`logo ${fadeIn ? 'fade-in' : ''}`}
          onClick={() => setOpen(true)}
          onError={handleImageError}
        />
      ) : (
        <div className={`logo-placeholder ${fadeIn ? 'fade-in' : ''}`}>
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="95" stroke="#d4af37" strokeWidth="3" fill="#1a1a1a" />
            <text x="100" y="90" textAnchor="middle" fill="#d4af37" fontSize="20" fontWeight="bold">
              Legal Case
            </text>
            <text x="100" y="115" textAnchor="middle" fill="#d4af37" fontSize="20" fontWeight="bold">
              Advisor
            </text>
            <text x="100" y="145" textAnchor="middle" fill="#999" fontSize="12">
              Logo Missing
            </text>
          </svg>
          <p className="logo-missing-text">
            Please add: /public/assets/legal_logo.png
          </p>
        </div>
      )}
      
      {open && !imageError && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <button 
              className="modal-close" 
              onClick={() => setOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <img 
              src="/assets/legal_logo.svg" 
              alt="Legal Case Advisor Logo Enlarged" 
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
