import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors ${className}`}
      data-testid="language-toggle"
      title={language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
    >
      <Globe className="w-4 h-4 text-amber-500" />
      <span className="text-white font-medium text-sm uppercase">
        {language === 'en' ? '🇬🇧 EN' : '🇧🇷 PT'}
      </span>
    </button>
  );
};

export default LanguageToggle;
