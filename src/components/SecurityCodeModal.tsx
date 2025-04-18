'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { playSound } from '@/utils/soundUtils';

interface SecurityCodeModalProps {
  onCodeSuccess: () => void;
}

export default function SecurityCodeModal({ onCodeSuccess }: SecurityCodeModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [codeInput, setCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [shakeInput, setShakeInput] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const CORRECT_CODE = '1804';
  
  useEffect(() => {
    // Show modal on mount
    setIsOpen(true);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (codeInput === CORRECT_CODE) {
      // Success
      playSound('vine_boom');
      setErrorMessage('');
      setIsOpen(false);
      onCodeSuccess();
    } else {
      // Failed attempt
      playSound('windows_error');
      setAttempts(prev => prev + 1);
      setErrorMessage('Invalid security code. Try again.');
      setShakeInput(true);
      
      // Reset shake animation after it completes
      setTimeout(() => {
        setShakeInput(false);
      }, 500);
      
      // After 3 failed attempts, give a hint
      if (attempts >= 2) {
        setErrorMessage('Hint: The Haitian Revolution ended in 1804.');
      }
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing by escape or clicking outside
      closeOnBackdropClick={false}
      showCloseButton={false}
      width="md"
      gradient="blue"
      playSoundOnOpen="jumpscare1"
    >
      <div className="p-4 bg-white rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Verification</h2>
          <p className="text-gray-600">Enter the security code to proceed</p>
        </div>
        
        <div className="relative w-full aspect-square max-h-[300px] mb-6 overflow-hidden rounded-lg border-2 border-gray-300">
          {!imageError ? (
            <img
              src="/assets/p-diddy.jpg"
              alt="Security Verification"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-600 text-center p-4">
                Image not found. Please verify the security code: 1804
              </p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-1">
              Security Code:
            </label>
            <input
              type="text"
              id="securityCode"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                shakeInput ? 'animate-shake' : ''
              }`}
              placeholder="Enter 4-digit code"
              maxLength={4}
              required
            />
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verify
          </button>
        </form>
      </div>
    </Modal>
  );
} 