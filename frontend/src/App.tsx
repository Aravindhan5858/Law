import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LoaderProvider } from './context/LoaderContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultPage from './pages/ResultPage';
import OfflineLegalSearch from './pages/OfflineLegalSearch';
import UnifiedSearchPage from './pages/UnifiedSearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Home from './pages/Home';
import AssaultCaseAssistant from './pages/AssaultCaseAssistant';

export default function App() {
  return (
    <LoaderProvider initialConfig={{ enabled: false, autoRedirect: false }}>
      <ThemeProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Home />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <AnalyzePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <ResultPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/offline-search"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <OfflineLegalSearch />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/unified-search"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <UnifiedSearchPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <AboutPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <ContactPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assault-assistant"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <AssaultCaseAssistant />
                  </>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LoaderProvider>
  );
}
