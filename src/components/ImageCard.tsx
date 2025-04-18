'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImageItem } from '@/utils/imageUtils';
import { playSound } from '@/utils/soundUtils';
import DirectImage from './DirectImage';

interface ImageCardProps {
  image: ImageItem;
  onClick?: () => void;
  index: number;
}

export default function ImageCard({ image, onClick, index }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [randomRotation] = useState(() => Math.random() * 10 - 5); // Random rotation between -5 and 5 degrees
  const [randomScale] = useState(() => 0.95 + Math.random() * 0.1); // Random scale between 0.95 and 1.05
  
  // Determine which animation to apply
  const [animationClass] = useState(() => {
    const animations = ['', 'floating', 'pulsing'];
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
  });
  
  // Random caption positioning (top, bottom, or both)
  const [captionPosition] = useState(() => {
    const positions = ['top', 'bottom', 'both'];
    return positions[Math.floor(Math.random() * positions.length)];
  });
  
  // Randomly activate glitch effect
  useEffect(() => {
    // If image is marked as hacked, add glitch effects periodically
    if (image.isHacked) {
      const glitchInterval = setInterval(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 200 + Math.random() * 500);
      }, 2000 + Math.random() * 5000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [image.isHacked]);

  // Handle click event
  const handleClick = () => {
    // 30% chance to play a sound on click (increased from 15%)
    if (Math.random() < 0.3) {
      playSound(['bruh', 'vine_boom', 'oof', 'emotional_damage', 'jumpscare1', 'jumpscare2'][
        Math.floor(Math.random() * 6)
      ]);
    }
    
    // 10% chance to trigger a glitch effect
    if (Math.random() < 0.1) {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 800);
    }
    
    if (onClick) onClick();
  };

  // Handle image load error - try alternate URLs if available
  const onImageError = () => {
    // Log the error for debugging
    console.error(`Failed to load image: ${imageUrl || 'undefined'}`);
    
    // Try with alternative URLs if available
    if (image.altUrl && Array.isArray(image.altUrl) && currentUrlIndex < image.altUrl.length) {
      console.log(`Trying alternative URL ${currentUrlIndex + 1}/${image.altUrl.length} for image ${image.id}`);
      setCurrentUrlIndex(currentUrlIndex + 1);
      return;
    }
    
    // If this is a friend image and we've exhausted the altUrls, try one more direct path approach
    if (image.type === 'friend' && currentUrlIndex === (image.altUrl ? image.altUrl.length : 0)) {
      if (imageUrl && typeof imageUrl === 'string') {
        const filename = imageUrl.split('/').pop();
        if (filename) {
          const directPath = `/assets/friends/${filename}`;
          console.log(`Trying direct path as last resort: ${directPath}`);
          setCurrentUrlIndex(currentUrlIndex + 1);
          return;
        }
      }
    }
    
    // If all else fails, show error image
    console.error(`All image loading attempts failed for ${image.id}`);
    setImageError(true);
  };

  // Determine which URL to use
  const imageUrl = imageError 
    ? "/assets/glitch.svg" 
    : currentUrlIndex === 0 
      ? image.url 
      : image.altUrl && Array.isArray(image.altUrl) && currentUrlIndex <= image.altUrl.length
        ? image.altUrl[currentUrlIndex - 1]
        : `/assets/friends/${image.url.split('/').pop()}`;
      
  // Log the URL being used for debugging
  useEffect(() => {
    console.log(`Rendering image with URL: ${imageUrl} (index: ${currentUrlIndex})`);
  }, [imageUrl, currentUrlIndex]);

  // Create an array of all possible paths to try for the image
  const imagePaths = useMemo(() => {
    // For friend images, try multiple path formats
    if (image.type === 'friend') {
      return [
        // Simple path that works in production
        `/assets/friends/${imageUrl && imageUrl.split ? imageUrl.split('/').pop() || '' : ''}`,
        // Various path options for production
        `/assets/friends/${imageUrl && imageUrl.split ? encodeURIComponent(imageUrl.split('/').pop() || '') : ''}`,
        `/friends/${imageUrl && imageUrl.split ? imageUrl.split('/').pop() || '' : ''}`,
        // Try original URL
        imageUrl || '/assets/glitch.svg',
        // Try alternative URLs if available
        ...(image.altUrl && Array.isArray(image.altUrl) ? image.altUrl.filter(url => url) : []),
        // Fallback
        '/assets/glitch.svg'
      ];
    }
    
    // For meme, polar bear, or jumpscare images (external URLs)
    // Just use the original URL without all the fallbacks
    return [
      imageUrl || '/assets/glitch.svg',
      '/assets/glitch.svg'
    ];
  }, [image.type, imageUrl, image.altUrl]);

  return (
    <motion.div
      className={`gallery-item ${animationClass} ${glitchEffect ? 'glitch' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotate: glitchEffect ? randomRotation * 3 : randomRotation,
        scale: glitchEffect ? randomScale * 1.1 : randomScale,
        filter: glitchEffect ? 'hue-rotate(90deg) contrast(200%)' : 'none'
      }}
      transition={{ 
        delay: index * 0.05, 
        duration: glitchEffect ? 0.1 : 0.3,
        ease: glitchEffect ? 'linear' : 'easeOut'
      }}
      whileHover={{ 
        scale: randomScale * 1.05,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-lg">
        {/* The image */}
        <DirectImage
          src={imagePaths}
          alt={image.caption || "Image"}
          className="w-full h-full"
          style={{ 
            filter: image.isHacked && !glitchEffect ? 'saturate(1.2) contrast(1.1)' : 'none',
            mixBlendMode: image.isHacked ? 'hard-light' : 'normal'
          }}
          onError={onImageError}
        />
        
        {/* Hacked overlay for hacked images */}
        {image.isHacked && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/10 to-blue-500/20 mix-blend-overlay pointer-events-none"></div>
        )}
        
        {/* Glitch effect for random intervals */}
        {glitchEffect && (
          <div className="absolute inset-0 bg-black/20 z-10 glitch-lines pointer-events-none"></div>
        )}
        
        {/* Meme caption overlay(s) */}
        {(captionPosition === 'top' || captionPosition === 'both') && image.caption && (
          <div className={`meme-overlay meme-overlay-top ${image.isHacked ? 'text-red-500 font-glitch' : ''}`}>
            {image.caption.split('|')[0]}
          </div>
        )}
        
        {(captionPosition === 'bottom' || captionPosition === 'both') && image.caption && (
          <div className={`meme-overlay meme-overlay-bottom ${image.isHacked ? 'text-red-500 font-glitch' : ''}`}>
            {image.caption.split('|')[1] || image.caption}
          </div>
        )}
        
        {/* "HACKED" text on hovered hacked images */}
        {image.isHacked && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-red-500 bg-black/50 px-4 py-2 transform -rotate-12 font-glitch animate-pulse">
              HACKED
            </span>
          </div>
        )}
        
        {/* Extra Gen Z effects on hover */}
        {isHovered && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30" />
            
            {Math.random() > 0.5 && (
              <div className="absolute top-2 right-2 text-xl">✨</div>
            )}
            
            {Math.random() > 0.7 && (
              <span className="absolute bottom-10 text-white text-xl font-bold shadow-text transform rotate-12">
                SLAY
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 