import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AuthModal from "@/components/organisms/AuthModal";
import AskQuestionForm from "@/components/organisms/AskQuestionForm";
const AskPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Lock" size={40} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-secondary mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to ask a question
            </p>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogIn" size={16} />
              Log In to Continue
            </Button>
          </motion.div>
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => setIsAuthenticated(true)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AskQuestionForm />
      </div>
    </div>
  );
};

export default AskPage;