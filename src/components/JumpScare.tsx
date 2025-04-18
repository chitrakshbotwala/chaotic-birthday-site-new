'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageItem } from '@/utils/imageUtils';

interface JumpScareProps {
  image: ImageItem | null;
  duration?: number;
  onClose: () => void;
}

export default function JumpScare({ image, duration = 2000, onClose }: JumpScareProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!image) return;
    
    // Set a timer to automatically close the jump scare
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Give time for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [image, duration, onClose]);

  if (!image) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="jumpscare"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-3/4 h-3/4">
            <Image
              src={image.url}
              alt="JUMPSCARE!"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
            
            {/* Optional caption */}
            {image.caption && (
              <div className="absolute top-5 left-0 w-full text-center">
                <motion.div
                  className="meme-overlay"
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {image.caption}
                </motion.div>
              </div>
            )}
            
            {/* Extra chaotic elements */}
            <motion.div
              className="absolute inset-0"
              animate={{ 
                boxShadow: ['0 0 20px rgba(255,0,0,0.7)', '0 0 50px rgba(255,0,0,0.9)', '0 0 20px rgba(255,0,0,0.7)']
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            
            {/* Random emojis */}
            {Array.from({ length: 10 }).map((_, i) => {
              const emojis = ['😱', '💀', '👻', '👹', '⚡', '🔥', '😈', '☠️'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              const randomX = Math.random() * 100;
              const randomY = Math.random() * 100;
              
              return (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{ top: `${randomY}%`, left: `${randomX}%` }}
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity
                  }}
                >
                  {randomEmoji}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 