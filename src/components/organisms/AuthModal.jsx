import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (isOpen && window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      setLoading(true);
      
      const setupAuth = () => {
        try {
          if (activeTab === 'login') {
            ApperUI.showLogin("#auth-container");
          } else {
            ApperUI.showSignup("#auth-container");
          }
        } catch (error) {
          console.error('Error setting up authentication:', error);
        } finally {
          setLoading(false);
        }
      };

      // Small delay to ensure DOM is ready
      setTimeout(setupAuth, 100);
    }
  }, [isOpen, activeTab]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setLoading(true);
  };

  const handleAuthSuccess = (user) => {
    if (user && onAuthSuccess) {
      onAuthSuccess(user);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50"
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 m-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <ApperIcon name="X" size={20} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Join DevExchange
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabSwitch('login')}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => handleTabSwitch('signup')}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === 'signup'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Auth Container */}
          <div className="min-h-[300px] flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : (
              <div id="auth-container" className="w-full" />
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => handleTabSwitch('signup')}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => handleTabSwitch('login')}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;