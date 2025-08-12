import React, { useEffect } from "react";

export default function Modal({ open, onClose, children, title, size = "md" }) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Size variants
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-6xl",
    full: "max-w-[95%]"
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose} // Click backdrop to close
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out animate-modal-in`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 group"
              onClick={onClose}
              type="button"
              aria-label="Đóng modal"
            >
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Close button for modal without title */}
        {!title && (
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 group z-10"
            onClick={onClose}
            type="button"
            aria-label="Đóng modal"
          >
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className={title ? "p-6" : "p-8"}>
          {children}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}