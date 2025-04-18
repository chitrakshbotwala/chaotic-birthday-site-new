'use client';

import { useState, useEffect } from 'react';
import EpilepsyWarning from './EpilepsyWarning';

export default function WarningWrapper() {
  const [showWarning, setShowWarning] = useState(false);
  
  // Check localStorage on client side only
  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('epilepsyWarningShown');
    if (!hasSeenWarning) {
      setShowWarning(true);
    }
  }, []);
  
  const handleClose = () => {
    setShowWarning(false);
    localStorage.setItem('epilepsyWarningShown', 'true');
  };
  
  if (!showWarning) return null;
  
  return <EpilepsyWarning onClose={handleClose} />;
} 