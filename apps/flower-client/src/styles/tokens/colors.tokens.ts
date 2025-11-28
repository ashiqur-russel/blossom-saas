/**
 * Color Design Tokens
 * Single source of truth for all colors in the application
 */

export const Colors = {
  // Primary brand colors
  primary: {
    50: '#fef7ff',
    100: '#fce7f3',
    500: '#e91e63',
    600: '#c2185b',
    700: '#9f1239',
  },

  // Semantic colors
  semantic: {
    success: '#10b981',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    error: '#ef4444',
    errorForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',
  },

  // Neutral colors
  neutral: {
    50: '#fefefe',
    100: '#fce7f3',
    200: '#f3e8ff',
    300: '#ecfdf5',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#2d1b2e',
  },

  // KPI colors
  kpi: {
    blue: '#3b82f6',
    blueLight: '#eff6ff',
    green: '#10b981',
    greenLight: '#d1fae5',
    purple: '#a855f7',
    purpleLight: '#faf5ff',
    orange: '#f97316',
    orangeLight: '#fff7ed',
    pink: '#ec4899',
    pinkLight: '#fdf2f8',
    indigo: '#6366f1',
    indigoLight: '#eef2ff',
  },

  // Background colors
  background: {
    default: '#fefefe',
    card: '#ffffff',
    muted: '#fce7f3',
    sidebar: '#fef7ff',
  },

  // Text colors
  text: {
    primary: '#2d1b2e',
    secondary: '#6b7280',
    muted: '#9f1239',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    default: '#fce7f3',
    input: '#fce7f3',
    ring: '#e91e63',
  },
} as const;

export type ColorToken = typeof Colors;

