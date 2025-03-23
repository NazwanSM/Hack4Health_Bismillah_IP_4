"use client";

import React, { ReactNode, useEffect } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  variant?: 'info' | 'success' | 'warning' | 'error';
  autoClose?: number; // waktu dalam ms untuk auto close
}

const Popup: React.FC<PopupProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  variant = 'info',
  autoClose 
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Variant styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'info':
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-brightness-75 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className={`bg-white rounded-xl w-[90%] max-w-sm shadow-2xl transform transition-all pointer-events-auto border-l-4 ${getVariantStyles()}`}>
          {/* Header if title exists */}
          {title && (
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold font-['Nunito_Sans']">{title}</h2>
              {showCloseButton && (
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-transform active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-4 flex flex-col items-center">
            {getIcon()}
            <div className="text-center">{children}</div>
            
            {/* Action buttons */}
            <div className="w-full mt-4 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#364c84] text-white rounded-md transition-transform active:scale-95 hover:bg-[#2a3b68]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;