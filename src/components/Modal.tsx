'use client';

import { ReactNode } from 'react';
import { playSound } from '@/utils/soundUtils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  playSoundOnOpen?: string;
  playSoundOnClose?: string;
  gradient?: 'purple' | 'blue' | 'green' | 'none';
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  width = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  playSoundOnOpen,
  playSoundOnClose = 'click',
  gradient = 'purple',
}: ModalProps) {
  // If not open, don't render anything
  if (!isOpen) return null;
  
  // Play sound on open if specified
  if (isOpen && playSoundOnOpen) {
    // We need to call this outside of useEffect to ensure it plays when the modal opens
    try {
      playSound(playSoundOnOpen);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }
  
  const handleClose = () => {
    if (playSoundOnClose) {
      try {
        playSound(playSoundOnClose);
      } catch (error) {
        console.error('Failed to play sound:', error);
      }
    }
    onClose();
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      handleClose();
    }
  };
  
  // Width mapping
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };
  
  // Gradient mapping
  const gradientClasses = {
    purple: 'bg-gradient-to-r from-indigo-900 to-purple-900',
    blue: 'bg-gradient-to-r from-blue-900 to-cyan-800',
    green: 'bg-gradient-to-r from-green-900 to-emerald-800',
    none: 'bg-slate-900'
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`${gradientClasses[gradient]} p-4 rounded-xl w-full ${widthClasses[width]}`}
      >
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center mb-4">
            {title && (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button 
                onClick={handleClose}
                className="text-white hover:text-red-300"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
} 