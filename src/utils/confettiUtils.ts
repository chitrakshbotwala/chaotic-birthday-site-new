import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import React-Confetti to avoid SSR issues
export const DynamicConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

// Confetti configuration types
export interface ConfettiConfig {
  numberOfPieces?: number;
  recycle?: boolean;
  duration?: number;  // Duration in milliseconds
  colors?: string[];
  gravity?: number;
  wind?: number;
}

// Default confetti configurations
export const confettiConfigs = {
  default: {
    numberOfPieces: 500,
    recycle: false,
    duration: 5000,
    colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'],
    gravity: 0.5,
    wind: 0
  },
  birthday: {
    numberOfPieces: 700,
    recycle: false,
    duration: 7000,
    colors: ['#ffb6c1', '#add8e6', '#90ee90', '#ffa07a', '#dda0dd'],
    gravity: 0.3,
    wind: 0.05
  },
  intense: {
    numberOfPieces: 1000,
    recycle: false,
    duration: 6000,
    colors: ['#ff0000', '#ff00ff', '#ffff00', '#00ff00', '#00ffff'],
    gravity: 0.7,
    wind: 0.1
  }
};

// Hook for managing confetti state
export const useConfetti = (initialConfig: keyof typeof confettiConfigs = 'default') => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [config, setConfig] = useState(confettiConfigs[initialConfig]);
  
  // Start confetti with optional custom config and duration
  const startConfetti = useCallback((
    configType: keyof typeof confettiConfigs = 'default',
    customDuration?: number
  ) => {
    const selectedConfig = confettiConfigs[configType];
    const duration = customDuration || selectedConfig.duration;
    
    setConfig(selectedConfig);
    setShowConfetti(true);
    
    // Auto-hide confetti after duration
    if (duration) {
      setTimeout(() => setShowConfetti(false), duration);
    }
  }, []);
  
  // Stop confetti
  const stopConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);
  
  // Random chance to start confetti
  const randomConfetti = useCallback((
    chance = 0.1, 
    configType: keyof typeof confettiConfigs = 'default'
  ) => {
    if (Math.random() < chance) {
      startConfetti(configType);
      return true;
    }
    return false;
  }, [startConfetti]);
  
  // Custom confetti configuration
  const customConfetti = useCallback((customConfig: Partial<ConfettiConfig>) => {
    setConfig(current => ({...current, ...customConfig}));
    setShowConfetti(true);
    
    if (customConfig.duration) {
      setTimeout(() => setShowConfetti(false), customConfig.duration);
    }
  }, []);
  
  return {
    showConfetti,
    config,
    startConfetti,
    stopConfetti,
    randomConfetti,
    customConfetti
  };
}; 