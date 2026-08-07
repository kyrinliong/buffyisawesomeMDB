import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-warm-brown/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card-white rounded-card shadow-card-hover max-w-4xl w-full max-h-[90vh] overflow-auto z-10">
        <div className="flex items-center justify-between p-4 border-b border-pale-blush">
          {title && (
            <h3 className="font-cursive text-2xl text-rosy-pink">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="btn-icon ml-auto"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
