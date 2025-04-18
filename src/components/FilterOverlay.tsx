import React, { useState, useCallback, useMemo, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

export interface FilterOverlayProps {
  imageUrl: string;
  onFilterApplied?: (filteredImageUrl: string, filterName: string) => void;
  className?: string;
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

type FilterType = {
  name: string;
  filter: string;
  overlayColor?: string;
  overlayOpacity?: number;
  mixBlendMode?: CSSProperties['mixBlendMode'];
};

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  imageUrl,
  onFilterApplied,
  className = '',
  isModal = false,
  isOpen = false,
  onClose = () => {},
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Normal');
  
  // Use useMemo for filters array to avoid unnecessary re-renders
  const filters = useMemo<FilterType[]>(() => [
    { name: 'Normal', filter: 'none' },
    { name: 'Cyberpunk', filter: 'hue-rotate(180deg) saturate(1.7)', overlayColor: '#0ff', overlayOpacity: 0.2, mixBlendMode: 'color-dodge' },
    { name: 'Noir', filter: 'grayscale(1) contrast(1.4)', overlayColor: '#000', overlayOpacity: 0.1 },
    { name: 'Vintage', filter: 'sepia(0.5) contrast(0.9) brightness(0.9)', overlayColor: '#997950', overlayOpacity: 0.1 },
    { name: 'Glitch', filter: 'hue-rotate(90deg) contrast(1.5) brightness(1.2) saturate(2)', overlayColor: '#f0f', overlayOpacity: 0.1, mixBlendMode: 'exclusion' },
    { name: 'Vaporwave', filter: 'saturate(1.5) contrast(1.2) hue-rotate(220deg)', overlayColor: '#f0f', overlayOpacity: 0.15, mixBlendMode: 'color-dodge' },
    { name: 'Blueprint', filter: 'brightness(1.1) grayscale(1)', overlayColor: '#00f', overlayOpacity: 0.3, mixBlendMode: 'screen' },
    { name: 'Radioactive', filter: 'sepia(0.4) hue-rotate(100deg) saturate(1.6)', overlayColor: '#0f0', overlayOpacity: 0.15, mixBlendMode: 'screen' }
  ], []);
  
  // Get the active filter object
  const getActiveFilterObject = useCallback(() => {
    return filters.find(f => f.name === activeFilter) || filters[0];
  }, [activeFilter, filters]);
  
  // Handle filter selection
  const handleFilterSelect = useCallback((filterName: string) => {
    setActiveFilter(filterName);
    
    // Create a temp canvas to apply the filter and get the filtered image URL
    if (onFilterApplied && imageUrl) {
      const filter = filters.find(f => f.name === filterName);
      if (filter) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Apply CSS filter to canvas
            ctx.filter = filter.filter;
            ctx.drawImage(img, 0, 0);
            
            // Apply overlay if specified
            if (filter.overlayColor && filter.overlayOpacity) {
              // Convert mixBlendMode to GlobalCompositeOperation where possible
              // or use a reasonable default
              let compositeOperation: GlobalCompositeOperation = 'source-over';
              if (filter.mixBlendMode === 'overlay') compositeOperation = 'overlay';
              else if (filter.mixBlendMode === 'multiply') compositeOperation = 'multiply';
              else if (filter.mixBlendMode === 'screen') compositeOperation = 'screen';
              else if (filter.mixBlendMode === 'color-dodge') compositeOperation = 'color-dodge';
              else if (filter.mixBlendMode === 'exclusion') compositeOperation = 'exclusion';
              
              ctx.globalCompositeOperation = compositeOperation;
              ctx.fillStyle = filter.overlayColor;
              ctx.globalAlpha = filter.overlayOpacity;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Get filtered image URL
            const filteredImageUrl = canvas.toDataURL('image/jpeg');
            onFilterApplied(filteredImageUrl, filterName);
          }
        };
        
        img.src = imageUrl;
      }
    }
  }, [filters, imageUrl, onFilterApplied]);
  
  const activeFilterObj = getActiveFilterObject();
  
  // The actual filter content to render
  const filterContent = (
    <div className={`filter-overlay-container ${className}`}>
      <div className="filter-preview relative w-full">
        <div 
          className="image-container relative overflow-hidden rounded-lg"
          style={{ aspectRatio: '1/1' }}
        >
          {/* Base image */}
          <img 
            src={imageUrl} 
            alt="Original" 
            className="w-full h-full object-cover"
            style={{ filter: activeFilterObj.filter }}
          />
          
          {/* Overlay for blend effects */}
          {activeFilterObj.overlayColor && (
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundColor: activeFilterObj.overlayColor,
                opacity: activeFilterObj.overlayOpacity || 0.1,
                mixBlendMode: activeFilterObj.mixBlendMode || 'overlay'
              }}
            />
          )}
        </div>
      </div>
      
      <div className="filter-options mt-4 flex flex-wrap gap-2 justify-center">
        {filters.map(filter => (
          <motion.button
            key={filter.name}
            onClick={() => handleFilterSelect(filter.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeFilter === filter.name
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
  
  // Conditionally render as modal or regular component
  if (isModal) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`🖼️ Apply Filter - ${activeFilterObj.name}`}
        width="lg"
        gradient="blue"
        playSoundOnOpen="jumpscare2"
      >
        {filterContent}
      </Modal>
    );
  }
  
  // Default render as a regular component
  return filterContent;
};

export default FilterOverlay; 