import React, { useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-fade-in`}
        style={{ animationDuration: '0.2s' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-bold text-stone-850 tracking-wide font-sans">
            {title}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 rounded-full text-stone-400 hover:text-stone-750 hover:bg-stone-100" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh] text-stone-650">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
