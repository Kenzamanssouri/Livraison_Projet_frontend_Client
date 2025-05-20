export const Colors = {
  primary: {
    default: '#E2725B', // Terracotta
    light: '#EBA696',
    dark: '#BA4C3B',
  },
  secondary: {
    default: '#3EB489', // Mint
    light: '#8AD2B9',
    dark: '#2A8965',
  },
  accent: {
    default: '#D4AF37', // Gold
    light: '#E6CD7B',
    dark: '#AA8C1C',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: {
    default: '#22C55E',
    light: '#86EFAC',
    dark: '#15803D',
  },
  warning: {
    default: '#F59E0B',
    light: '#FCD34D',
    dark: '#B45309',
  },
  error: {
    default: '#EF4444',
    light: '#FCA5A5',
    dark: '#B91C1C',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const ColorTheme = {
  light: {
    text: Colors.neutral[900],
    textSecondary: Colors.neutral[600],
    background: Colors.white,
    card: Colors.white,
    cardAlt: Colors.neutral[50],
    border: Colors.neutral[200],
  },
  dark: {
    text: Colors.white,
    textSecondary: Colors.neutral[300],
    background: Colors.neutral[900],
    card: Colors.neutral[800],
    cardAlt: Colors.neutral[700],
    border: Colors.neutral[700],
  },
};