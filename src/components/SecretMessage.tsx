'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { playSound } from '@/utils/soundUtils';

interface SecretMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  unlockMessage?: string;
}

export default function SecretMessage({ isOpen, onClose, message, unlockMessage }: SecretMessageProps) {
  const [revealed, setRevealed] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Type out the message letter by letter
  useEffect(() => {
    if (!revealed) return;
    
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setTypedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Play typing sound for every 3rd character
        if (currentIndex % 3 === 0) {
          try {
            playSound('skibidi');
          } catch (e) {
            console.error('Failed to play sound', e);
          }
        }
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      // Message fully typed
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [revealed, currentIndex, message]);
  
  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setRevealed(false);
      setTypedText('');
      setCurrentIndex(0);
      setShowConfetti(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        
        <motion.div 
          className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl w-[90vw] max-w-md"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white neon-pink-text">
              {revealed ? "🎁 Secret Message" : "🔒 Locked Content"}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          {!revealed ? (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-6"
              >
                🔒
              </motion.div>
              
              <p className="text-white mb-6">
                {unlockMessage || "You've discovered a secret message! Unlock it to view?"}
              </p>
              
              <button 
                onClick={() => {
                  setRevealed(true);
                  playSound('vine_boom');
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-bold"
              >
                Unlock
              </button>
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-black/30 p-4 rounded-lg min-h-[150px] font-mono text-lg">
                <span className="neon-green-text">{typedText}</span>
                <span className="animate-pulse">|</span>
              </div>
              
              {currentIndex >= message.length && (
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button 
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    Got it!
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 