import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/locale/i18n';
import type { LangKey } from '@/locale/languages';

type LanguageState = { lang: LangKey; setLang: (l: LangKey) => void };

const initial: LanguageState = { lang: 'tr' as LangKey, setLang: () => {} };

const LanguageContext = createContext<LanguageState>(initial);

export function LanguageProvider({
  children,
  defaultLang = 'tr',
  storageKey = 'app-lang'
}: {
  children: React.ReactNode;
  defaultLang?: LangKey;
  storageKey?: string;
}) {
  const [lang, setLangState] = useState<LangKey>(
    () => (localStorage.getItem(storageKey) as LangKey) || (defaultLang as LangKey)
  );

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem(storageKey, lang);
  }, [lang, storageKey]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};