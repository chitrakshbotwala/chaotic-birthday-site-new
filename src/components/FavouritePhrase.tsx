'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, playRandomSound } from '@/utils/soundUtils';

interface FavouritePhraseProps {
  triggerInterval?: number; // How often to show the phrase in ms
  duration?: number; // How long to display the phrase in ms
}

// Define display style type
type DisplayStyle = 'popup' | 'marquee' | 'fullscreen' | 'corner';

export default function FavouritePhrase({ 
  triggerInterval = 30000, // Default 30 seconds
  duration = 5000 // Default 5 seconds
}: FavouritePhraseProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('popup');
  const [randomColor, setRandomColor] = useState('');
  const [randomEmoji, setRandomEmoji] = useState('');

  // Generate random styling elements
  const randomizeStyles = () => {
    // Random display style
    const styles: DisplayStyle[] = ['popup', 'marquee', 'fullscreen', 'corner'];
    setDisplayStyle(styles[Math.floor(Math.random() * styles.length)]);
    
    // Random background color
    const colors = [
      'from-purple-600 to-pink-600',
      'from-blue-600 to-green-600',
      'from-yellow-500 to-red-500',
      'from-pink-500 to-orange-500',
      'from-indigo-700 to-purple-500',
      'from-green-500 to-teal-500'
    ];
    setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
    
    // Random emoji decoration
    const emojis = ['✨', '🔥', '💯', '🎉', '👑', '💅', '🚀', '⚡', '💣', '🥶'];
    setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  };
  
  useEffect(() => {
    // Initial random delay before the first appearance
    const initialDelay = Math.random() * 10000 + 5000; // 5-15 seconds
    
    const initialTimer = setTimeout(() => {
      randomizeStyles();
      setIsVisible(true);
      
      // Play the phrase sound or a random meme sound
      if (Math.random() > 0.3) {
        playSound('aand_pav');
      } else {
        playRandomSound(['jumpscare1', 'jumpscare2', 'bg_music']);
      }
      
      // Hide after duration
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      // Set up recurring timer
      const intervalTimer = setInterval(() => {
        randomizeStyles();
        setIsVisible(true);
        
        // Play the phrase sound or a random meme sound
        if (Math.random() > 0.3) {
          playSound('aand_pav');
        } else {
          playRandomSound(['jumpscare1', 'jumpscare2', 'bg_music']);
        }
        
        // Hide after duration
        setTimeout(() => {
          setIsVisible(false);
        }, duration);
      }, triggerInterval);
      
      return () => clearInterval(intervalTimer);
    }, initialDelay);
    
    return () => clearTimeout(initialTimer);
  }, [duration, triggerInterval]);
  
  // Click handler to dismiss the phrase
  const handleClick = () => {
    setIsVisible(false);
    playSound('vine_boom');
  };
  
  const renderContent = () => {
    switch(displayStyle) {
      case 'popup':
        return (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            onClick={handleClick}
          >
            <div className={`bg-gradient-to-r ${randomColor} px-6 py-3 rounded-lg shadow-lg cursor-pointer`}>
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-white favourite-phrase"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  repeatType: 'loop' 
                }}
              >
                {randomEmoji} AAND PAV KHAYEGA? {randomEmoji}
              </motion.h2>
            </div>
          </motion.div>
        );
        
      case 'marquee':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 left-0 right-0 z-50 overflow-hidden"
            onClick={handleClick}
          >
            <div className={`bg-gradient-to-r ${randomColor} py-2 shadow-lg cursor-pointer`}>
              <h2 className="text-xl md:text-2xl font-bold text-white favourite-phrase marquee-text">
                {randomEmoji} AAND PAV KHAYEGA? {randomEmoji} AAND PAV KHAYEGA? {randomEmoji} AAND PAV KHAYEGA? {randomEmoji}
              </h2>
            </div>
          </motion.div>
        );
        
      case 'fullscreen':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
            onClick={handleClick}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 2 } }}
              className={`bg-gradient-to-r ${randomColor} p-8 rounded-xl shadow-xl`}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white favourite-phrase text-center">
                {randomEmoji} AAND PAV KHAYEGA? {randomEmoji}
              </h1>
            </motion.div>
          </motion.div>
        );
        
      case 'corner':
        return (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [-10, 10, -5, 5, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              rotate: { times: [0, 0.2, 0.4, 0.6, 1], duration: 1 }
            }}
            className="fixed top-5 right-5 z-50"
            onClick={handleClick}
          >
            <div className={`bg-gradient-to-r ${randomColor} p-3 rounded-lg shadow-lg cursor-pointer transform rotate-12`}>
              <p className="text-lg font-bold text-white favourite-phrase whitespace-nowrap">
                {randomEmoji} AAND PAV KHAYEGA?
              </p>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && renderContent()}
    </AnimatePresence>
  );
} 