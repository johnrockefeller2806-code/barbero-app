import React from 'react';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 py-2 px-4 z-40">
      <div className="flex items-center justify-center gap-2">
        <span className="text-zinc-500 text-xs">Made with</span>
        <a 
          href="https://emergentagent.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#10B981"/>
            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-emerald-500 text-xs font-medium">Emergent</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
