import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('barberx_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('barberx_lang', language);
  }, [language]);

  const t = (key) => getTranslation(language, key);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
