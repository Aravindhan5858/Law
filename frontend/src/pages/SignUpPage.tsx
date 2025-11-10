import React from 'react';
import { motion } from 'framer-motion';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="auth-page">
      <motion.div
        className="auth-container clerk-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUp 
          routing="virtual"
          signInUrl="/login"
          afterSignUpUrl="/home"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold",
              socialButtonsBlockButtonText: "font-semibold",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
              identityPreviewEditButton: "text-blue-600",
              formFieldInput: "border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500",
              formFieldLabel: "text-gray-700 font-semibold",
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
