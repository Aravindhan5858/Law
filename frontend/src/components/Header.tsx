import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ 
      background: 'var(--bg)', 
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '12px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div>
          <Link to="/home" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-primary)', 
            fontSize: '1.1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <img 
              src="/assets/legal_logo.svg" 
              alt="Legal Case Advisor" 
              style={{ 
                width: '45px', 
                height: '45px',
                filter: theme === 'dark' 
                  ? 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))' 
                  : 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.3)) brightness(0.95)',
                padding: '4px',
                transition: 'filter 0.3s ease'
              }} 
            />
            Legal Case Advisor
          </Link>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/home" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>Home</Link>
          <Link to="/analyze" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>Analyze</Link>
          <Link to="/offline-search" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>Offline Search</Link>
          <Link to="/about" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>About</Link>
          <Link to="/contact" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>Contact</Link>
          
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)'
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
