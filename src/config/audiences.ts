export const audiences = {
  department: {
    key: 'department',
    translationKey: 'common.audience.department',
  },
  common: {
    key: 'common',
    translationKey: 'common.audience.common',
  },
} as const;

export type AudienceKey = keyof typeof audiences;