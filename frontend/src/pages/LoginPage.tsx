import React from 'react';
import { motion } from 'framer-motion';
import { SignIn } from '@clerk/clerk-react';

const LoginPage: React.FC = () => {
  return (
    <div className="modern-auth-page">
      {/* Decorative gradient circle */}
      <div className="gradient-circle"></div>
      
      {/* Floating accent dots */}
      <div className="floating-dots">
        <span className="dot dot-1"></span>
        <span className="dot dot-2"></span>
        <span className="dot dot-3"></span>
        <span className="dot dot-4"></span>
        <span className="dot dot-5"></span>
        <span className="dot dot-6"></span>
      </div>

      {/* Glass-morphism login card */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-header">
          <h1 className="login-title">Sign in to Home</h1>
          <div className="title-underline"></div>
          <p className="login-subtitle">Welcome back! Please sign in to continue</p>
        </div>

        <SignIn 
          routing="virtual"
          signUpUrl="/signup"
          afterSignInUrl="/home"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent modern-clerk-card",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              header: "hidden",
              socialButtonsBlockButton: "modern-social-btn",
              socialButtonsBlockButtonText: "font-semibold text-sm",
              formButtonPrimary: "modern-submit-btn",
              footerActionLink: "modern-link",
              identityPreviewEditButton: "modern-link",
              formFieldInput: "modern-input",
              formFieldLabel: "modern-label",
              dividerRow: "modern-divider-row",
              dividerText: "modern-divider-text",
              dividerLine: "modern-divider-line",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;
