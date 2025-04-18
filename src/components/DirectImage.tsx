'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface DirectImageProps {
  src: string | string[];
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function DirectImage({
  src,
  alt,
  className = '',
  style = {},
  onLoad,
  onError
}: DirectImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [urlIndex, setUrlIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imagePath, setImagePath] = useState('');
  
  // Memoize sources array to avoid re-creating on every render
  const sources = useMemo(() => Array.isArray(src) ? src : [src], [src]);
  
  // Extract filename from path
  const getFilename = useCallback((path: string): string => {
    if (!path || typeof path !== 'string') return '';
    return path.split('/').pop() || path.split('\\').pop() || path;
  }, []);
  
  // Direct file paths to try if all else fails
  const fallbackPaths = useMemo(() => [
    // Production-friendly paths
    `/assets/friends/${getFilename(currentSrc)}`,
    `/assets/friends/${encodeURIComponent(getFilename(currentSrc))}`,
    `/friends/${getFilename(currentSrc)}`,
    // Simple filename
    `/${getFilename(currentSrc)}`,
    // Final fallback
    '/assets/glitch.svg'
  ], [currentSrc, getFilename]);
  
  useEffect(() => {
    if (sources && sources.length > 0) {
      const initialSrc = sources[0];
      if (initialSrc) {
        setCurrentSrc(initialSrc);
        setImagePath(getFilename(initialSrc));
      }
    }
  }, [sources, getFilename]);
  
  // Handle image load error
  const handleError = () => {
    console.error(`Failed to load image: ${currentSrc}`);
    console.log(`Current fallback paths available:`, fallbackPaths);
    
    // Check if this is an external URL (starts with http)
    const isExternalUrl = currentSrc && typeof currentSrc === 'string' && 
                        (currentSrc.startsWith('http://') || currentSrc.startsWith('https://'));
    
    // For external URLs, don't try as many fallbacks
    if (isExternalUrl) {
      console.log('External URL failed to load, showing error state');
      setError(true);
      if (onError) onError();
      return;
    }
    
    // Try the next URL in the sources array
    if (urlIndex < sources.length - 1) {
      setUrlIndex(prev => prev + 1);
      const nextSrc = sources[urlIndex + 1];
      console.log(`Trying next source URL: ${nextSrc}`);
      setCurrentSrc(nextSrc);
      setImagePath(getFilename(nextSrc));
      return;
    }
    
    // Try fallback paths if all sources fail
    const fallbackIndex = urlIndex - sources.length;
    if (fallbackIndex < fallbackPaths.length - 1) {
      const nextPath = fallbackPaths[fallbackIndex];
      console.log(`Trying fallback path #${fallbackIndex + 1}: ${nextPath}`);
      setUrlIndex(prev => prev + 1);
      setCurrentSrc(nextPath);
      return;
    }
    
    // If all fail, show error state
    console.error('All image loading attempts failed. Showing error state.');
    setError(true);
    if (onError) onError();
  };
  
  // Handle successful load
  const handleLoad = () => {
    console.log(`Successfully loaded image: ${currentSrc}`);
    setLoaded(true);
    if (onLoad) onLoad();
  };
  
  return (
    <div className={`relative ${className}`} style={style}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-2"></div>
          <div className="text-sm text-center px-2">
            <p className="text-purple-300">Loading image...</p>
            <p className="text-xs text-gray-300 mt-1 max-w-[200px] truncate">{imagePath}</p>
          </div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/50 text-white p-2">
          <p className="font-bold mb-1">Image Not Found</p>
          <p className="text-xs text-gray-300 mb-2 max-w-[200px] truncate">{imagePath}</p>
          <p className="text-xs text-gray-300 text-center">
            Make sure images are in:<br />
            <span className="text-yellow-200">public/assets/friends</span>
          </p>
        </div>
      ) : (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.2s' }}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
} 