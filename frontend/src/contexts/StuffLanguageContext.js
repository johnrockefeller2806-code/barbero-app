import React, { createContext, useContext, useState, useEffect } from 'react';
import { STUFF_TRANSLATIONS, getStuffTranslation } from '../i18n/stuffTranslations';

const StuffLanguageContext = createContext(null);

export const StuffLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('stuff_lang') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('stuff_lang', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => getStuffTranslation(language, key);

  const changeLanguage = (lang) => {
    if (['pt', 'en', 'es'].includes(lang)) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    translations: STUFF_TRANSLATIONS[language] || STUFF_TRANSLATIONS['en'],
    availableLanguages: [
      { code: 'pt', flag: '🇧🇷', name: 'Português' },
      { code: 'en', flag: '🇬🇧', name: 'English' },
      { code: 'es', flag: '🇪🇸', name: 'Español' }
    ]
  };

  return (
    <StuffLanguageContext.Provider value={value}>
      {children}
    </StuffLanguageContext.Provider>
  );
};

export const useStuffLanguage = () => {
  const context = useContext(StuffLanguageContext);
  if (!context) {
    // Fallback for components not wrapped in provider
    return {
      language: 'pt',
      setLanguage: () => {},
      t: (key) => getStuffTranslation('pt', key),
      translations: STUFF_TRANSLATIONS['pt'],
      availableLanguages: [
        { code: 'pt', flag: '🇧🇷', name: 'Português' },
        { code: 'en', flag: '🇬🇧', name: 'English' },
        { code: 'es', flag: '🇪🇸', name: 'Español' }
      ]
    };
  }
  return context;
};

// Language Selector Component
export const StuffLanguageSelector = ({ className = '' }) => {
  const { language, setLanguage, availableLanguages } = useStuffLanguage();

  return (
    <div className={`flex items-center gap-1 bg-white/10 rounded-full p-1 ${className}`}>
      {availableLanguages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === lang.code 
              ? 'bg-emerald-500 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title={lang.name}
          data-testid={`lang-${lang.code}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
