import type { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  primaryColor: 'violet',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  defaultRadius: 'lg',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    fontWeight: '700',
  },
  colors: {
    dark: [
      '#f4f4f5',
      '#d4d4d8',
      '#a1a1aa',
      '#71717a',
      '#52525b',
      '#3f3f46',
      '#2e2e3a',
      '#222336',
      '#1a1b26',
      '#12131c',
    ],
  },
  shadows: {
    sm: '0 1px 3px rgba(15, 23, 42, 0.08)',
    md: '0 4px 16px rgba(15, 23, 42, 0.1)',
    lg: '0 12px 40px rgba(124, 58, 237, 0.12)',
  },
  components: {
    Card: { defaultProps: { radius: 'xl', withBorder: true } },
    Button: { defaultProps: { radius: 'xl' } },
    TextInput: { defaultProps: { radius: 'xl' } },
  },
};
