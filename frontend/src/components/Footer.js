import React from 'react';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 shadow-lg">
        <a 
          href="https://emergentagent.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#10B981"/>
            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-zinc-400">Made with</span>
          <span className="text-emerald-500 font-medium">Emergent</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
