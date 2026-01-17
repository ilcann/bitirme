export const lngs = {
  en: { nativeName: 'English' },
  tr: { nativeName: 'Türkçe' }
} as const;

export type LangKey = keyof typeof lngs;

export const languageOptions = Object.entries(lngs).map(([code, { nativeName }]) => ({
  code,
  nativeName
}));