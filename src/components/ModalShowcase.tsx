'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import PhotoFilter from './PhotoFilter';
import FilterOverlay from './FilterOverlay';
import { playSound } from '@/utils/soundUtils';

export default function ModalShowcase() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Sample placeholder image - use a fallback if needed
  const [sampleImage, setSampleImage] = useState('/assets/sample-image.jpg');
  
  // Check if sample image exists, if not use a fallback
  useEffect(() => {
    const checkImage = (url: string) => {
      const img = new Image();
      img.onload = () => {
        setSampleImage(url);
      };
      img.onerror = () => {
        console.warn(`Sample image not found at ${url}, using fallback`);
        // Use a polar bear image as fallback
        setSampleImage('https://placebear.com/800/600');
      };
      img.src = url;
    };
    
    checkImage('/assets/sample-image.jpg');
  }, []);
  
  // Modal handlers
  const openModal = (modalType: string) => {
    setActiveModal(modalType);
    playSound('rizz');
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Modal Components Showcase
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Basic Modal */}
        <div className="p-4 border border-gray-200 rounded-xl shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-2">Basic Modal</h3>
          <p className="text-gray-600 mb-4">A simple modal with customizable width and gradient</p>
          <button 
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => openModal('basic')}
          >
            Open Basic Modal
          </button>
        </div>
        
        {/* Photo Filter Modal */}
        <div className="p-4 border border-gray-200 rounded-xl shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-2">Photo Filter</h3>
          <p className="text-gray-600 mb-4">Apply fun filters to images with sound effects</p>
          <button 
            className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            onClick={() => openModal('photoFilter')}
          >
            Open Photo Filter
          </button>
        </div>
        
        {/* Filter Overlay Modal */}
        <div className="p-4 border border-gray-200 rounded-xl shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-2">Filter Overlay</h3>
          <p className="text-gray-600 mb-4">Advanced image filters with blend modes</p>
          <button 
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => openModal('filterOverlay')}
          >
            Open Filter Overlay
          </button>
        </div>
      </div>
      
      {/* Modals */}
      
      {/* Basic Modal */}
      <Modal
        isOpen={activeModal === 'basic'}
        onClose={closeModal}
        title="Welcome to the Basic Modal"
        width="md"
        gradient="green"
        playSoundOnOpen="slay"
        playSoundOnClose="bruh"
      >
        <div className="p-4 bg-white rounded-lg">
          <p className="mb-4">
            This is a simple modal that demonstrates the base Modal component.
            It supports different widths, gradients, sound effects, and more.
          </p>
          <p className="mb-4">
            The Modal component is reused across the application to ensure
            consistent design and behavior for all overlay interfaces.
          </p>
          <button
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => {
              playSound('vine_boom');
              closeModal();
            }}
          >
            Close Modal
          </button>
        </div>
      </Modal>
      
      {/* Photo Filter Modal */}
      <PhotoFilter
        isOpen={activeModal === 'photoFilter'}
        onClose={closeModal}
        imageUrl={sampleImage}
      />
      
      {/* Filter Overlay Modal */}
      <FilterOverlay
        isModal={true}
        isOpen={activeModal === 'filterOverlay'}
        onClose={closeModal}
        imageUrl={sampleImage}
        onFilterApplied={(filteredUrl, filterName) => {
          console.log(`Applied ${filterName} filter`);
          playSound('oof');
        }}
      />
    </div>
  );
} 