'use client';

import { useState } from 'react';
import Image from 'next/image';
import { playSound } from '@/utils/soundUtils';
import Modal from './Modal';

interface PhotoFilterProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function PhotoFilter({ isOpen, onClose, imageUrl }: PhotoFilterProps) {
  const [activeFilter, setActiveFilter] = useState('');
  
  // List of available filters
  const filters = [
    { id: 'normal', name: 'Normal', style: {} },
    { id: 'glitch', name: 'Glitch', style: { filter: 'hue-rotate(90deg) contrast(160%) brightness(110%)', animation: 'glitch-shake 0.2s infinite' } },
    { id: 'retro', name: 'Retro', style: { filter: 'sepia(80%) saturate(70%) brightness(110%)' } },
    { id: 'zombie', name: 'Zombie', style: { filter: 'hue-rotate(90deg) saturate(200%) brightness(85%)' } },
    { id: 'alien', name: 'Alien', style: { filter: 'hue-rotate(180deg) saturate(150%) brightness(120%)' } },
    { id: 'party', name: 'Party', style: { filter: 'saturate(200%) brightness(120%) contrast(130%)' } },
    { id: 'hacker', name: 'Hacker', style: { filter: 'hue-rotate(120deg) brightness(80%) contrast(160%)', mixBlendMode: 'screen', background: 'black' } },
    { id: 'matrix', name: 'Matrix', style: { filter: 'brightness(110%) contrast(140%) saturate(150%) hue-rotate(85deg)' } },
    { id: 'deepfry', name: 'Deep Fried', style: { filter: 'contrast(200%) brightness(110%) saturate(300%)' } },
  ];
  
  // Apply the selected filter
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    playSound('bruh');
  };
  
  // Download the filtered image (not actually implemented - just shows a message)
  const handleDownload = () => {
    playSound('vine_boom');
    alert('Image saved to your meme collection!');
  };
  
  // Find the current filter
  const currentFilter = filters.find(f => f.id === activeFilter) || filters[0];
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`🎭 Filter Studio - ${currentFilter.name}`}
      width="xl"
      gradient="purple"
      playSoundOnOpen="windows_error"
      playSoundOnClose="click"
    >
      {/* Image preview with filter */}
      <div className="relative w-full aspect-square max-h-[400px] overflow-hidden rounded-lg bg-black mb-4">
        <div
          className="w-full h-full relative"
          style={currentFilter.style as React.CSSProperties}
        >
          {imageUrl.startsWith('/') || imageUrl.startsWith('data:') ? (
            <Image
              src={imageUrl}
              alt="Filter preview"
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          ) : (
            // Handle local machine file paths, which Next.js Image doesn't support directly
            // Instead display with a regular img tag
            <img
              src={imageUrl}
              alt="Filter preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/image-error.svg';
                console.error('Failed to load image:', imageUrl);
              }}
            />
          )}
          
          {activeFilter === 'glitch' && (
            <div className="absolute inset-0 glitch-lines pointer-events-none"></div>
          )}
          
          {activeFilter === 'matrix' && (
            <div className="absolute inset-0 matrix-overlay pointer-events-none"></div>
          )}
        </div>
      </div>
      
      {/* Filter options */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`p-2 rounded-lg text-sm ${
              activeFilter === filter.id 
                ? 'bg-pink-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveFilter('normal')}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
        
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 flex items-center"
        >
          <span className="mr-2">Save</span>
          <span>💾</span>
        </button>
      </div>
    </Modal>
  );
} 