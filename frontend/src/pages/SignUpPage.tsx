import React from 'react';
import { motion } from 'framer-motion';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
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

      {/* Glass-morphism signup card */}
      <motion.div
        className="glass-card glass-card-signup"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-header">
          <h1 className="login-title">Sign up for Home</h1>
          <div className="title-underline"></div>
          <p className="login-subtitle">Join us today! Create your account to get started</p>
        </div>

        <SignUp 
          routing="virtual"
          signInUrl="/login"
          afterSignUpUrl="/home"
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

export default SignUpPage;
