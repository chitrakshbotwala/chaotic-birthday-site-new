'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <motion.div
        className="relative p-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className="w-16 h-16 border-t-4 border-b-4 border-purple-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.h3
            className="text-xl font-bold text-gray-800"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ['#1f2937', '#7e22ce', '#1f2937']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Awesomeness...
          </motion.h3>
          <p className="text-gray-600 text-center text-sm">
            It&apos;s worth the wait, trust me 🚀
          </p>
        </div>
      </motion.div>
    </div>
  );
} 