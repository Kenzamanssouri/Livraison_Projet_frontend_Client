import { Platform } from 'react-native';

// Define available font families
export const FontFamily = {
  // For Arabic content - fallback to system font on web
  arabic: Platform.OS === 'web' ? 'DIN Next Arabic, system-ui' : undefined,
  // For Latin content
  latin: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
};

// Font size scale
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Line height multipliers
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Font weights
export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

// Typography styles to use consistently across the app
export const Typography = {
  // Display text (large headings)
  displayLarge: {
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * LineHeight.tight,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.25,
  },

  // Headings
  headingLarge: {
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    fontWeight: FontWeight.semiBold,
  },
  headingMedium: {
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.tight,
    fontWeight: FontWeight.semiBold,
  },
  headingSmall: {
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.tight,
    fontWeight: FontWeight.semiBold,
  },

  // Body text
  bodyLarge: {
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  bodyMedium: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },

  // Labels and small text
  labelLarge: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
};