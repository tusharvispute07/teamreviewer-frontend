import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-[#09090b] border border-zinc-800 rounded-xl w-full ${maxWidth} overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
