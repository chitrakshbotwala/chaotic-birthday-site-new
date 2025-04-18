'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import YouTubeAudio from '@/components/YouTubeAudio';

// Components
import ImageCard from '@/components/ImageCard';
import JumpScare from '@/components/JumpScare';
import EmojiRain from '@/components/EmojiRain';
import FavouritePhrase from '@/components/FavouritePhrase';

// Utils
import { 
  ImageItem,
  getFriendImages, 
  getMemeImages, 
  getPolarBearImages, 
  getJumpScareImages,
  mixAndRandomizeImages 
} from '@/utils/imageUtils';
import { JumpScareManager } from '@/utils/jumpscareUtils';
import { playSound, preloadSounds } from '@/utils/soundUtils';

export default function HomePage() {
  // State for images
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Add a useEffect that logs the current index when it changes
  useEffect(() => {
    if (currentIndex > 0) {
      console.log('Current image index:', currentIndex);
    }
  }, [currentIndex]);
  
  // Jump scare state
  const [jumpScareImage, setJumpScareImage] = useState<ImageItem | null>(null);
  const jumpScareManagerRef = useRef<JumpScareManager | null>(null);
  
  // State for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State for story mode
  const [storyMode, setStoryMode] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  
  // State for errors
  const [error, setError] = useState<string | null>(null);
  
  // Hacked effects
  const [isHacked, setIsHacked] = useState(false);
  const [hackedFlicker, setHackedFlicker] = useState(false);
  const [showMatrixOverlay, setShowMatrixOverlay] = useState(false);
  const [cursorHaunted, setCursorHaunted] = useState(false);
  
  // Random jumpscare timer
  const jumpscareTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add haunted cursor effect
  useEffect(() => {
    if (cursorHaunted) {
      document.body.classList.add('haunted-cursor');
      
      // Remove effect after 20 seconds
      const timer = setTimeout(() => {
        document.body.classList.remove('haunted-cursor');
        setCursorHaunted(false);
      }, 20000);
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('haunted-cursor');
      };
    }
  }, [cursorHaunted]);
  
  // Setup random jumpscare timer
  useEffect(() => {
    // 10% chance every 30-120 seconds to show a jumpscare
    const setupJumpscareTimer = () => {
      // Clear any existing timer
      if (jumpscareTimerRef.current) {
        clearTimeout(jumpscareTimerRef.current);
      }
      
      // Set random time between 30-120 seconds
      const randomTime = 30000 + Math.random() * 90000;
      
      jumpscareTimerRef.current = setTimeout(() => {
        // 10% chance to trigger a jumpscare
        if (Math.random() < 0.1 && jumpScareManagerRef.current && !jumpScareImage && !loading) {
          playSound('jumpscare1');
          jumpScareManagerRef.current.triggerJumpScare();
          
          // Add hacked effect sometimes
          if (Math.random() < 0.3) {
            triggerHackedMode();
          }
        }
        
        // Setup next timer
        setupJumpscareTimer();
      }, randomTime);
    };
    
    if (!loading && !storyMode) {
      setupJumpscareTimer();
    }
    
    return () => {
      if (jumpscareTimerRef.current) {
        clearTimeout(jumpscareTimerRef.current);
      }
    };
  }, [loading, storyMode, jumpScareImage]);
  
  // Function to trigger hacked mode
  const triggerHackedMode = () => {
    setIsHacked(true);
    setShowMatrixOverlay(true);
    
    // Start flickering effect
    const flickerInterval = setInterval(() => {
      setHackedFlicker(prev => !prev);
    }, 100 + Math.random() * 500);
    
    // Make cursor haunted
    setCursorHaunted(true);
    
    // Play a sound
    playSound('windows_error');
    
    // Reset after 10-20 seconds
    setTimeout(() => {
      setIsHacked(false);
      setShowMatrixOverlay(false);
      setHackedFlicker(false);
      clearInterval(flickerInterval);
    }, 10000 + Math.random() * 10000);
  };

  // Load all images and setup
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setLoading(true);
        
        // Preload sounds but don't start background music since we're using YouTube
        try {
          preloadSounds();
        } catch (soundError) {
          console.error('Error preloading sounds:', soundError);
        }
        
        // Log current information about file paths
        console.log('Current working directory:', window.location.href);
        console.log('Looking for images in:', '/assets/friends');
        console.log('Looking for sounds in:', '/assets/sounds');
        
        // Get images from different sources - handle errors for each API separately
        let friendImages: ImageItem[] = [];
        let polarBearImages: ImageItem[] = [];
        let memeImages: ImageItem[] = [];
        let jumpScareImages: ImageItem[] = [];
        
        try {
          friendImages = getFriendImages();
          console.log('Friend images loaded:', friendImages.length);
          
          if (friendImages.length === 0) {
            alert('No friend images found! Please check the console for details.');
          }
        } catch (error) {
          console.error('Error getting friend images:', error);
          alert('Error loading friend images. Check console for details.');
          friendImages = []; // Use empty array if failed
        }
        
        try {
          polarBearImages = await getPolarBearImages(8);
        } catch (error) {
          console.error('Error getting polar bear images:', error);
          polarBearImages = []; // Use empty array if failed
        }
        
        try {
          memeImages = await getMemeImages(8);
        } catch (error) {
          console.error('Error getting meme images:', error);
          memeImages = []; // Use empty array if failed
        }
        
        try {
          jumpScareImages = await getJumpScareImages(3);
        } catch (error) {
          console.error('Error getting jumpscare images:', error);
          jumpScareImages = []; // Use empty array if failed
        }
        
        // Make sure we have at least some images
        if (friendImages.length === 0 && polarBearImages.length === 0 && memeImages.length === 0) {
          // Create some placeholder images if all APIs fail
          const placeholders = Array(10).fill(null).map((_, i) => ({
            id: `placeholder-${i}`,
            url: `https://picsum.photos/800/600?random=${i}`,
            type: 'meme' as const,
            caption: 'API Error - Using placeholder',
          }));
          
          memeImages = placeholders;
        }
        
        // Mix and randomize all images
        const allImages = mixAndRandomizeImages(
          friendImages,
          memeImages,
          polarBearImages,
          jumpScareImages
        );
        
        setImages(allImages);
        
        // Initialize jump scare manager if we have jumpscare images
        if (jumpScareImages.length > 0) {
          jumpScareManagerRef.current = new JumpScareManager(
            jumpScareImages,
            (image) => {
              setJumpScareImage(image);
            }
          );
        }
        
        // Play welcome sound after a delay (ignore errors)
        try {
          playSound('vine_boom');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } catch (_error) {
          console.error('Error playing welcome sound');
        }
        
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Failed to load images. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllImages();
    
    // Clean up
    return () => {
      if (jumpScareManagerRef.current) {
        jumpScareManagerRef.current.cleanup();
      }
    };
  }, []);

  // Handle image click
  const handleImageClick = (_image: ImageItem, idx: number) => {
    // Use the image and index parameters to prevent unused variable warnings
    setCurrentIndex(idx);
    
    // Register the click with the jump scare manager
    if (jumpScareManagerRef.current) {
      jumpScareManagerRef.current.handleClick();
    }
    
    // If in story mode, advance the story
    if (storyMode) {
      setStoryStep(prev => prev + 1);
    }
    
    // 15% chance to trigger emoji rain
    if (Math.random() < 0.15) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    
    // 5% chance to trigger hacked mode
    if (Math.random() < 0.05) {
      triggerHackedMode();
    }
  };

  // Close the jump scare
  const handleCloseJumpScare = () => {
    setJumpScareImage(null);
  };

  // Toggle story mode
  const toggleStoryMode = () => {
    setStoryMode(prev => !prev);
    setStoryStep(0);
    try {
      playSound('skibidi');
    } catch (_error) {
      console.error('Error playing mode toggle sound');
    }

    // Show a confetti effect regardless if the sound plays or not
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Render the main content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="text-6xl mb-4">🐻‍❄️</div>
          <h2 className="text-2xl neon-text">Loading the chaos...</h2>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="text-red-500 text-2xl mb-4">😭 {error}</div>
          <p className="mb-4 text-white">Images should be in: <code className="bg-black/50 p-1 rounded">C:/code/atharv/chaotic-birthday-site-new/public/assets/friends</code></p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Story mode content with reduced animations
    if (storyMode) {
      const storyContent = [
        {
          title: "📖 Chapter 1: The Beginning",
          text: "Once upon a time, there was a birthday person who loved polar bears more than anything in the world. Some say their obsession was borderline concerning...",
          emoji: "🐻‍❄️"
        },
        {
          title: "📖 Chapter 2: The Adventure",
          text: "They embarked on a journey filled with memes and chaotic energy. Their fashion sense was questionable, but their dedication to polar bears never wavered.",
          emoji: "🎒"
        },
        {
          title: "📖 Chapter 3: Polar Bear Kingdom",
          text: "They discovered a hidden kingdom ruled by polar bears with gen Z humor. The bears took one look at them and said 'looking like a default character that nobody picked'.",
          emoji: "👑"
        },
        {
          title: "📖 Chapter 4: Birthday Surprise",
          text: "The polar bears, despite their roasting, threw the most chaotic birthday party ever. They said it was 'giving main character energy but in a Disney Channel original movie about homework'.",
          emoji: "🎂"
        },
        {
          title: "📖 The End",
          text: "And they lived happily ever after with their polar bear friends! Though the bears continued to roast them mercilessly about their personality being just 'liking polar bears'.",
          emoji: "❤️"
        }
      ];

      const currentStory = storyContent[Math.min(storyStep, storyContent.length - 1)];
      
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div
            className={`bg-black/70 p-8 rounded-xl max-w-2xl ${hackedFlicker ? 'flicker' : ''}`}
          >
            <div className="text-6xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className={`text-3xl neon-pink-text font-bold mb-4 text-center ${isHacked ? 'font-glitch' : ''}`}>{currentStory.title}</h2>
            <p className={`text-xl neon-green-text mb-6 text-center ${isHacked ? 'font-glitch' : ''}`}>{currentStory.text}</p>
            
            {storyStep < storyContent.length - 1 ? (
              <button 
                onClick={() => {
                  setStoryStep(prev => prev + 1);
                  try { 
                    playSound('vine_boom'); 
                  } catch (_unusedError) {
                    console.log('Error playing sound');
                  }
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mx-auto block"
              >
                Continue Story
              </button>
            ) : (
              <button 
                onClick={() => {
                  setStoryMode(false);
                  try { 
                    playSound('vine_boom'); 
                  } catch (_unusedError) {
                    console.log('Error playing sound');
                  }
                }}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mx-auto block"
              >
                Back to Gallery
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        {renderImageFallbackText()}
        <div className={`gallery-container ${hackedFlicker ? 'flicker' : ''}`}>
          {images.length === 0 ? (
            <div className="text-center p-12 w-full">
              <h2 className="text-2xl text-white mb-4">No Images Found</h2>
              <p className="text-purple-300 mb-2">Please add images to the following directory:</p>
              <code className="bg-black/50 p-2 rounded block mx-auto max-w-md text-yellow-200 mb-4 text-sm">
                C:/code/atharv/chaotic-birthday-site-new/public/assets/friends
              </code>
              <p className="text-white">Then refresh this page</p>
            </div>
          ) : (
            images.map((image, index) => (
              <ImageCard
                key={`${image.id}-${index}`}
                image={image}
                index={index}
                onClick={() => handleImageClick(image, index)}
              />
            ))
          )}
        </div>
      </>
    );
  };

  // Chaotic header with animations
  const renderHeader = () => {
    return (
      <header
        className={`sticky top-0 z-50 p-4 chaotic-bg ${isHacked ? 'font-glitch' : ''}`}
      >
        <div className="container mx-auto flex flex-col items-center">
          <h1 
            className={`text-4xl md:text-6xl font-bold text-white mb-2 ${isHacked ? 'font-glitch text-red-500' : 'neon-pink-text'}`}
          >
            {isHacked ? '🚨 SYSTEM COMPROMISED 🚨' : '🔥 Happy Birthday Bestie! 🐻‍❄️'}
          </h1>
          
          <p 
            className={`text-xl text-white ${isHacked ? 'font-glitch text-red-300' : 'neon-green-text'}`}
          >
            {isHacked ? 'YOUR DEVICE HAS BEEN HACKED' : 'This birthday is giving extremely unserious vibes'}
          </p>
          
          <div className="mt-4">
            <button 
              onClick={toggleStoryMode}
              className={`px-4 py-2 ${isHacked ? 'bg-red-600' : 'bg-purple-600'} text-white rounded-lg hover:${isHacked ? 'bg-red-700' : 'bg-purple-700'} mx-2`}
            >
              {storyMode ? "Exit Story Mode" : "Enter Story Mode"}
            </button>
            
            <button 
              onClick={() => {
                try {
                  playSound('emotional_damage');
                } catch (error) {
                  console.error('Error playing sound:', error);
                }
                
                // Only show confetti, no hacked mode to reduce lag
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2000);
              }}
              className={`px-4 py-2 ${isHacked ? 'bg-red-500' : 'bg-pink-500'} text-white rounded-lg hover:${isHacked ? 'bg-red-600' : 'bg-pink-600'} mx-2`}
            >
              {isHacked ? 'SYSTEM OVERRIDE' : 'Emotional Damage'}
            </button>
          </div>
        </div>
      </header>
    );
  };

  // Add this function to ensure images have proper fallback text
  const renderImageFallbackText = () => {
    if (loading || images.length > 0 || error) return null;
    
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">{"We couldn't load the images"}</h2>
        <p className="text-xl mb-4">{"But that won't stop the party!"}</p>
        <p className="text-xl mb-2">Try refreshing the page or check your connection.</p>
      </div>
    );
  };

  // Hidden YouTube background music component
  const YouTubeBackgroundMusic = () => (
    <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: '1px', width: '1px', overflow: 'hidden' }}>
      <YouTubeAudio
        videoId="mSqKm4c4JnY" // Birthday song
        volume={30}
        isPlaying={!isHacked}
        isVisible={false}
      />
    </div>
  );

  return (
    <div className={`min-h-screen overflow-x-hidden ${isHacked ? 'glitch' : ''}`} onClick={() => jumpScareManagerRef.current?.handleClick()}>
      {/* Background music */}
      <YouTubeBackgroundMusic />
      
      {/* Favourite phrase popup */}
      <FavouritePhrase triggerInterval={30000} duration={5000} />
      
      {/* Matrix overlay for hacked effect */}
      {showMatrixOverlay && (
        <div className="matrix-overlay"></div>
      )}
      
      {/* Confetti effect */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Emoji rain for extra chaos */}
      <EmojiRain enabled={!loading} intensity={isHacked ? 8 : 3} />
      
      {/* Header */}
      {renderHeader()}
      
      {/* Main content */}
      <main>
        {renderContent()}
      </main>
      
      {/* Jump scare overlay */}
      <AnimatePresence>
        {jumpScareImage && (
          <JumpScare 
            image={jumpScareImage} 
            onClose={handleCloseJumpScare} 
          />
        )}
      </AnimatePresence>
      
      {/* Floating bears on the sides for extra polar bear goodness */}
      <div className="fixed top-1/4 left-0 z-20 hidden lg:block">
        <motion.div
          animate={{ x: [-50, -20, -50], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <span className={`text-8xl ${isHacked ? 'font-glitch' : ''}`}>🐻‍❄️</span>
        </motion.div>
      </div>
      
      <div className="fixed top-2/3 right-0 z-20 hidden lg:block">
        <motion.div
          animate={{ x: [50, 20, 50], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <span className={`text-8xl ${isHacked ? 'font-glitch' : ''}`}>🐻‍❄️</span>
        </motion.div>
      </div>
      
      {/* Footer with credits */}
      <footer className={`p-6 text-center chaotic-bg ${hackedFlicker ? 'flicker' : ''}`}>
        <p className={`text-white ${isHacked ? 'font-glitch' : ''}`}>
          {isHacked ? 'SECURITY BREACH DETECTED' : 'Created with chaotic energy for a special friend who loves polar bears 💖'}
        </p>
        <p className={`text-sm ${isHacked ? 'text-red-300 font-glitch' : 'text-pink-300'} mt-2`}>
          {isHacked ? 'SYSTEM COMPROMISED - DATA LEAK IN PROGRESS' : 'Add more images in the /public/assets/friends folder!'}
        </p>
        <motion.p 
          className="text-yellow-200 font-bold mt-3 favourite-phrase"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          AAND PAV KHAYEGA?
        </motion.p>
      </footer>
    </div>
  );
}
