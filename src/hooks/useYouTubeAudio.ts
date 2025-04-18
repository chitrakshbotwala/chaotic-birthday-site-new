'use client';

import { useState, useCallback } from 'react';

interface UseYouTubeAudioProps {
  defaultVideoId?: string;
  defaultVolume?: number;
  autoPlay?: boolean;
}

export function useYouTubeAudio({
  defaultVideoId = '',
  defaultVolume = 50,
  autoPlay = false,
}: UseYouTubeAudioProps = {}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [videoId, setVideoId] = useState<string>(defaultVideoId);
  const [volume, setVolume] = useState<number>(defaultVolume);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const play = useCallback((newVideoId?: string) => {
    if (newVideoId) {
      setVideoId(newVideoId);
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
  }, []);

  const changeVideo = useCallback((newVideoId: string) => {
    setVideoId(newVideoId);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    isPlaying,
    videoId,
    volume,
    isVisible,
    play,
    pause,
    togglePlay,
    changeVolume,
    changeVideo,
    toggleVisibility,
  };
} 