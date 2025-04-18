'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EpilepsyWarningProps {
  onClose?: () => void;
  timeToShow?: number; // milliseconds to show the warning
}

export default function EpilepsyWarning({ 
  onClose, 
  timeToShow = 5000 
}: EpilepsyWarningProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-dismiss after timeToShow milliseconds
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, timeToShow);
    
    return () => clearTimeout(timer);
  }, [onClose, timeToShow]);
  
  const handleDismiss = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-yellow-100 border-4 border-red-600 rounded-lg p-6 max-w-md mx-4"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <motion.h2 
              className="text-2xl font-extrabold text-red-600 mb-3 text-center"
              animate={{ 
                scale: [1, 1.05, 1],
                color: ['#dc2626', '#ef4444', '#dc2626']
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 1.5 
              }}
            >
              ⚠️ EPILEPSY WARNING ⚠️
            </motion.h2>
            
            <p className="text-gray-800 mb-4">
              This birthday site contains <strong>flashy animations</strong>, <strong>bright colors</strong>, and other effects that might trigger seizures in people with photosensitive epilepsy.
            </p>
            
            <p className="text-gray-800 mb-4">
              Proceed with caution or find yourself a responsible adult to supervise! 
              <span className="text-xs block mt-1">(Results may vary, adults not included)</span>
            </p>
            
            <div className="text-center">
              <motion.button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
                onClick={handleDismiss}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                I Accept The Risk (YOLO)
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 