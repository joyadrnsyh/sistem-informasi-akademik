import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * A reusable modal component with animations and glassmorphic backdrop.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true,
  footer,
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-md transition-opacity duration-300">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white border border-stone-200/80 rounded-2xl shadow-2xl flex flex-col z-10 animate-modal-pop`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 tracking-wide font-sans">
            {title}
          </h3>
          <button 
            type="button"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-50 hover:border-stone-200 border border-transparent transition-all duration-200 cursor-pointer" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh] text-stone-600">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4.5 border-t border-stone-100 bg-stone-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
