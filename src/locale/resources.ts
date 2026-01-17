import enCommon from './en/common.json';
import trCommon from './tr/common.json';

export const resources = {
  en: { common: enCommon },
  tr: { common: trCommon }
} as const;

export const ns = ['common'] as const;
export type Namespace = typeof ns[number];