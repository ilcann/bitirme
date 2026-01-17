export const audiences = {
  math_engineering: {
    key: 'math_engineering',
    translationKey: 'audience_toggle.math_engineering',
  },
  other_engineering: {
    key: 'other_engineering',
    translationKey: 'audience_toggle.other_engineering',
  },
} as const;

export type AudienceKey = keyof typeof audiences;