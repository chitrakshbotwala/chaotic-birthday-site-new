'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface EmojiRainProps {
  enabled?: boolean;
  intensity?: number; // 1-10, controls frequency of emoji appearance
  duration?: number; // How long the animation lasts in ms
}

export default function EmojiRain({
  enabled = true,
  intensity = 5,
  duration = 10000,
}: EmojiRainProps) {
  const [emojis, setEmojis] = useState<
    Array<{ id: number; emoji: string; x: number; duration: number; delay: number; size: number }>
  >([]);

  // The emoji pool - Gen Z memes and favorites - wrapped in useMemo to avoid recreating on every render
  const emojiPool = useMemo(() => [
    '💀', '😭', '✨', '💅', '👁️👄👁️', '🤡', '👀', '🔥', '🥺', '💯', 
    '⚡', '🧠', '😂', '🙄', '💩', '🏆', '👽', '🐻‍❄️', '🤔', '💖', 
    '🦄', '🏳️‍🌈', '👑', '🎯', '🧢', '🧟', '🌟', '🦋', '🍦', '🎮'
  ], []);

  // Create a new emoji at a random position
  const createEmoji = useCallback(() => {
    const id = Date.now();
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    const x = Math.random() * 100; // Random horizontal position (0-100%)
    const fallDuration = Math.random() * 3 + 3; // 3-6 seconds to fall
    const delay = Math.random() * 2; // 0-2 second delay before falling
    const size = Math.random() * 2 + 1; // Random size between 1-3em
    
    return { id, emoji: randomEmoji, x, duration: fallDuration, delay, size };
  }, [emojiPool]);

  // Add new emojis periodically
  useEffect(() => {
    if (!enabled) return;

    // Initial batch of emojis
    const initialEmojis = Array.from({ length: intensity }).map(() => createEmoji());
    setEmojis(initialEmojis);

    // Add new emojis on interval
    const interval = setInterval(() => {
      setEmojis(prev => {
        const newEmojis = [...prev, createEmoji()];
        // Clean up old emojis to prevent memory issues
        return newEmojis.length > 100 ? newEmojis.slice(-50) : newEmojis;
      });
    }, 10000 / intensity); // Frequency based on intensity

    // Clean up
    const cleanup = setTimeout(() => {
      clearInterval(interval);
      setEmojis([]);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(cleanup);
    };
  }, [enabled, intensity, duration, createEmoji]);

  if (!enabled || emojis.length === 0) return null;

  return (
    <div className="emoji-rain">
      {emojis.map(emoji => (
        <motion.div
          key={emoji.id}
          className="emoji"
          initial={{ top: -50, left: `${emoji.x}%` }}
          animate={{ top: '110vh' }}
          transition={{
            duration: emoji.duration,
            delay: emoji.delay,
            ease: 'linear',
          }}
          style={{
            fontSize: `${emoji.size}em`,
          }}
          onAnimationComplete={() => {
            // Remove this emoji when animation is complete
            setEmojis(prev => prev.filter(e => e.id !== emoji.id));
          }}
        >
          {emoji.emoji}
        </motion.div>
      ))}
    </div>
  );
} 