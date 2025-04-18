'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '@/utils/soundUtils';

interface EasterEggGameProps {
  isOpen: boolean;
  onClose: () => void;
  onWin: () => void;
}

export default function EasterEggGame({ isOpen, onClose, onWin }: EasterEggGameProps) {
  const [bearPosition, setBearPosition] = useState({ x: 50, y: 50 });
  const [cakePosition, setCakePosition] = useState({ x: 75, y: 75 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Calculate distance between bear and cake
  const getDistance = useCallback(() => {
    const dx = bearPosition.x - cakePosition.x;
    const dy = bearPosition.y - cakePosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, [bearPosition, cakePosition]);
  
  // Move the cake to a random position
  const moveCake = useCallback(() => {
    setCakePosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
  }, []);
  
  // Start the game
  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    moveCake();
    playSound('vine_boom');
  }, [moveCake]);
  
  // Check collision with cake
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const distance = getDistance();
    if (distance < 10) {
      setScore(prev => prev + 1);
      playSound('oof');
      moveCake();
    }
  }, [bearPosition, gameStarted, gameOver, getDistance, moveCake]);
  
  // Timer for the game
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          if (score >= 5) {
            playSound('skibidi');
            onWin();
          } else {
            playSound('windows_error');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score, onWin]);
  
  // Handle arrow key presses
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 5;
      switch (e.key) {
        case 'ArrowUp':
          setBearPosition(prev => ({
            ...prev,
            y: Math.max(0, prev.y - step)
          }));
          break;
        case 'ArrowDown':
          setBearPosition(prev => ({
            ...prev,
            y: Math.min(90, prev.y + step)
          }));
          break;
        case 'ArrowLeft':
          setBearPosition(prev => ({
            ...prev,
            x: Math.max(0, prev.x - step)
          }));
          break;
        case 'ArrowRight':
          setBearPosition(prev => ({
            ...prev,
            x: Math.min(90, prev.x + step)
          }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      >
        <motion.div 
          className="bg-gradient-to-r from-purple-800 to-pink-800 p-6 rounded-xl w-[90vw] max-w-lg"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {gameOver 
                ? (score >= 5 ? "🎉 You Win! 🎉" : "❌ You Lose! ❌") 
                : "🐻‍❄️ Polar Bear Cake Hunt 🎂"}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          {!gameStarted && !gameOver && (
            <div className="text-center py-6">
              <p className="text-white mb-4">
                Help the polar bear find cake! Use arrow keys to move.
                <br />Collect 5 cakes in 15 seconds to win!
              </p>
              <button 
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Start Game
              </button>
            </div>
          )}
          
          {(gameStarted || gameOver) && (
            <>
              <div className="flex justify-between text-white mb-2">
                <span>Score: {score}/5</span>
                <span>Time: {timeLeft}s</span>
              </div>
              
              <div className="relative bg-blue-900 h-80 rounded-lg overflow-hidden">
                {/* Game area */}
                <motion.div
                  className="absolute text-3xl"
                  style={{
                    left: `${bearPosition.x}%`,
                    top: `${bearPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🐻‍❄️
                </motion.div>
                
                <motion.div
                  className="absolute text-3xl"
                  style={{
                    left: `${cakePosition.x}%`,
                    top: `${cakePosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🎂
                </motion.div>
                
                {gameOver && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col">
                    <p className="text-white text-2xl mb-4">
                      {score >= 5 
                        ? "You collected enough cake! Unlocked a secret!" 
                        : "Not enough cake! Try again!"}
                    </p>
                    <button 
                      onClick={startGame}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-bold"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile controls for touch devices */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="col-start-2">
                  <button 
                    className="w-full h-12 bg-gray-700 rounded-lg text-2xl text-white"
                    onClick={() => setBearPosition(prev => ({
                      ...prev,
                      y: Math.max(0, prev.y - 5)
                    }))}
                  >
                    ⬆️
                  </button>
                </div>
                <div className="col-start-1 row-start-2">
                  <button 
                    className="w-full h-12 bg-gray-700 rounded-lg text-2xl text-white"
                    onClick={() => setBearPosition(prev => ({
                      ...prev,
                      x: Math.max(0, prev.x - 5)
                    }))}
                  >
                    ⬅️
                  </button>
                </div>
                <div className="col-start-3 row-start-2">
                  <button 
                    className="w-full h-12 bg-gray-700 rounded-lg text-2xl text-white"
                    onClick={() => setBearPosition(prev => ({
                      ...prev,
                      x: Math.min(90, prev.x + 5)
                    }))}
                  >
                    ➡️
                  </button>
                </div>
                <div className="col-start-2 row-start-2">
                  <div className="h-12"></div>
                </div>
                <div className="col-start-2 row-start-3">
                  <button 
                    className="w-full h-12 bg-gray-700 rounded-lg text-2xl text-white"
                    onClick={() => setBearPosition(prev => ({
                      ...prev,
                      y: Math.min(90, prev.y + 5)
                    }))}
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 