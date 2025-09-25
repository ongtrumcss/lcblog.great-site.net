import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // This effect resets the animation state when the modal is re-opened.
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingOut(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    // Wait for animation to finish before calling the parent's onClose
    setTimeout(() => {
      onClose();
    }, 300); // Must match animation duration
  };
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]); // Re-run effect when isOpen changes

  if (!isOpen) {
    return null;
  }
  
  const backdropClass = isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in';
  const modalContentClass = isAnimatingOut ? 'animate-slide-down-fade-out' : 'animate-slide-up-fade-in';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 z-[999] flex justify-center items-center p-4 ${backdropClass}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 transform ${modalContentClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 id="modal-title" className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Đóng modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slide-up-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slide-down-fade-out {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-out { animation: fade-out 0.3s ease-in forwards; }
        .animate-slide-up-fade-in { animation: slide-up-fade-in 0.3s ease-out forwards; }
        .animate-slide-down-fade-out { animation: slide-down-fade-out 0.3s ease-in forwards; }
      `}</style>
    </div>
  );
};

export default Modal;