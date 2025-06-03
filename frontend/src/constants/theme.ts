// Color Palette
export const colors = {
  // Primary Colors
  primary: '#3B82F6', // Blue
  primaryDark: '#2563EB',
  primaryLight: '#93C5FD',
  
  // Secondary Colors
  secondary: '#10B981', // Green
  secondaryDark: '#059669',
  secondaryLight: '#6EE7B7',
  
  // Accent Colors
  accent: '#F59E0B', // Amber
  accentDark: '#D97706',
  accentLight: '#FCD34D',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
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
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  softBlue: '#EBF4FF',
  
  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  darkBlue: '#1E3A8A',
  slate: '#64748B',
};

// Typography
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
};

// Layout
export const layout = {
  screenPadding: 24,
  containerMaxWidth: 400,
  headerHeight: 60,
  tabBarHeight: 80,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
};
