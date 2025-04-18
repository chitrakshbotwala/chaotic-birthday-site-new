'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import YouTubeAudio from './YouTubeAudio';
import { useYouTubeAudio } from '../hooks/useYouTubeAudio';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

interface AudioControlsProps {
  className?: string;
  defaultVideoId?: string;
  defaultVolume?: number;
  autoPlay?: boolean;
}

export default function AudioControls({
  className = '',
  defaultVideoId = 'jfKfPfyJRdk', // Default to lofi beats
  defaultVolume = 50,
  autoPlay = true,
}: AudioControlsProps) {
  const {
    isPlaying,
    videoId,
    volume,
    isVisible,
    togglePlay,
    changeVolume,
    changeVideo,
    toggleVisibility,
  } = useYouTubeAudio({
    defaultVideoId,
    defaultVolume,
    autoPlay,
  });

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [customVideoId, setCustomVideoId] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Predefined YouTube video IDs for quick selection
  const musicOptions = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Beats' },
    { id: 'n61ULEU7CO0', name: 'Party Mix' },
    { id: '5qap5aO4i9A', name: 'Study Beats' },
    { id: 'fEvM-OUbaKs', name: 'Jazz' },
  ];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeVolume(parseInt(e.target.value));
  };

  const handleVideoIdSubmit = () => {
    if (customVideoId.trim()) {
      try {
        // Basic YouTube URL parser to extract video ID
        let id = customVideoId.trim();
        
        if (id.includes('youtube.com') || id.includes('youtu.be')) {
          // Extract ID from URL if it's a YouTube link
          try {
            const urlParams = new URLSearchParams(new URL(id).search);
            const paramId = urlParams.get('v');
            
            if (paramId) {
              id = paramId;
            } else if (id.includes('youtu.be/')) {
              id = id.split('youtu.be/')[1].split('?')[0];
            }
          } catch (e) {
            console.error('Error parsing YouTube URL:', e);
            // If URL parsing fails, just use the input as is
          }
        }
        
        changeVideo(id);
        setCustomVideoId('');
        setShowSettings(false);
      } catch (e) {
        console.error('Error handling video ID:', e);
        // Show a brief error toast or message
        alert('Invalid YouTube URL or ID');
      }
    }
  };

  return (
    <div className={`audio-controls ${className}`}>
      {/* YouTube player (hidden or visible based on isVisible) */}
      <YouTubeAudio videoId={videoId} volume={volume} isPlaying={isPlaying} isVisible={isVisible} />
      
      <motion.div 
        className="audio-controls-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Play/Pause Button */}
        <motion.button
          className="audio-control-btn play-pause-btn"
          onClick={togglePlay}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </motion.button>
        
        {/* Volume Control */}
        <div className="volume-control" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
          <motion.button 
            className="audio-control-btn volume-btn"
            whileTap={{ scale: 0.9 }}
            onClick={() => volume > 0 ? changeVolume(0) : changeVolume(50)}
          >
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </motion.button>
          
          {showVolumeSlider && (
            <motion.div 
              className="volume-slider-container"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 100 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </motion.div>
          )}
        </div>
        
        {/* Music Options Button */}
        <motion.button
          className="audio-control-btn music-btn"
          onClick={() => setShowSettings(!showSettings)}
          whileTap={{ scale: 0.9 }}
        >
          <MdSettings />
        </motion.button>
        
        {/* Toggle Visibility Button */}
        <motion.button
          className="audio-control-btn visibility-btn"
          onClick={toggleVisibility}
          whileTap={{ scale: 0.9 }}
        >
          <FaMusic />
        </motion.button>
      </motion.div>
      
      {/* Settings Panel */}
      {showSettings && (
        <motion.div 
          className="settings-panel"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h4>Change Music</h4>
          <div className="music-options">
            {musicOptions.map(option => (
              <button
                key={option.id}
                className={`music-option ${videoId === option.id ? 'active' : ''}`}
                onClick={() => changeVideo(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
          
          <div className="custom-video">
            <input
              type="text"
              placeholder="YouTube video ID or URL"
              value={customVideoId}
              onChange={(e) => setCustomVideoId(e.target.value)}
              className="video-id-input"
            />
            <button onClick={handleVideoIdSubmit} className="apply-btn">Apply</button>
          </div>
        </motion.div>
      )}
      
      <style jsx>{`
        .audio-controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .audio-controls-panel {
          display: flex;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          padding: 10px;
          gap: 10px;
        }
        
        .audio-control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .audio-control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .volume-control {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .volume-slider-container {
          margin-left: 10px;
          overflow: hidden;
        }
        
        .volume-slider {
          width: 100%;
          appearance: none;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
        }
        
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .settings-panel {
          position: absolute;
          bottom: 60px;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 15px;
          width: 250px;
          color: white;
        }
        
        .settings-panel h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .music-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .music-option {
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .music-option:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .music-option.active {
          background: rgba(255, 255, 255, 0.3);
          font-weight: bold;
        }
        
        .custom-video {
          display: flex;
          gap: 8px;
        }
        
        .video-id-input {
          flex: 1;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 5px;
          color: white;
        }
        
        .apply-btn {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .apply-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
} 