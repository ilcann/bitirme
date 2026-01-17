import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AudienceKey } from '@/config/audiences';

type AudienceState = { 
  audience: AudienceKey; 
  setAudience: (a: AudienceKey) => void 
};

const initial: AudienceState = { 
  audience: 'math_engineering' as AudienceKey, 
  setAudience: () => {} 
};

const AudienceContext = createContext<AudienceState>(initial);

export function AudienceProvider({
  children,
  defaultAudience = 'math_engineering',
  storageKey = 'app-audience'
}: {
  children: React.ReactNode;
  defaultAudience?: AudienceKey;
  storageKey?: string;
}) {
  const [audience, setAudienceState] = useState<AudienceKey>(
    () => (localStorage.getItem(storageKey) as AudienceKey) || (defaultAudience as AudienceKey)
  );

  useEffect(() => {
    localStorage.setItem(storageKey, audience);
  }, [audience, storageKey]);

  return (
    <AudienceContext.Provider value={{ audience, setAudience: setAudienceState }}>
      {children}
    </AudienceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAudience = () => {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used within AudienceProvider');
  return ctx;
};