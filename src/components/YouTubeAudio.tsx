'use client';

import { useEffect, useRef } from 'react';

interface YouTubeAudioProps {
  videoId: string;
  volume?: number;
  isPlaying?: boolean;
  isVisible?: boolean;
}

// Define proper types for YouTube API
interface YouTubePlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
}

interface YouTubeEvent {
  target: YouTubePlayer;
  data: number;
}

export default function YouTubeAudio({ 
  videoId, 
  volume = 50,
  isPlaying = true,
  isVisible = false
}: YouTubeAudioProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the YouTube API script if it's not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize the YouTube player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (containerRef.current && window.YT) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            loop: 1,
            controls: isVisible ? 1 : 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playlist: videoId, // Required for looping
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
          },
        });
      }
    };

    // When player is ready, set volume and play
    const onPlayerReady = (event: YouTubeEvent) => {
      event.target.setVolume(volume);
      if (isPlaying) {
        event.target.playVideo();
      } else {
        event.target.pauseVideo();
      }
      console.log('YouTube audio player ready');
    };

    // Handle player state changes to ensure continuous playback
    const onPlayerStateChange = (event: YouTubeEvent) => {
      // If video ends (YT.PlayerState.ENDED = 0), restart it
      if (event.data === 0) {
        event.target.playVideo();
      }
    };

    // Handle any errors
    const onPlayerError = (event: YouTubeEvent) => {
      console.error('YouTube player error:', event.data);
      // Try to restart player on error
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.playVideo();
        }
      }, 5000);
    };

    // Initialize player when YouTube API is ready
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Otherwise wait for API to load
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    // Clean up
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, volume, isPlaying, isVisible]);

  // Control player when isPlaying changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.playVideo?.();
    } else {
      playerRef.current.pauseVideo?.();
    }
  }, [isPlaying]);
  
  // Update volume when it changes
  useEffect(() => {
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  return (
    <div 
      className="youtube-audio-container" 
      style={{ 
        display: isVisible ? 'block' : 'none',
        width: isVisible ? '320px' : '1px',
        height: isVisible ? '180px' : '1px',
        overflow: 'hidden'
      }}
    >
      <div ref={containerRef} id="youtube-audio-player"></div>
    </div>
  );
}

// Add TypeScript declaration for YouTube IFrame API
declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, config: object) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
} 