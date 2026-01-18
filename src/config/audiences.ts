export const audiences = {
  department: {
    key: 'department',
    translationKey: 'common.audience.department',
  },
  pool: {
    key: 'pool',
    translationKey: 'common.audience.pool',
  },
} as const;

export type AudienceKey = keyof typeof audiences;