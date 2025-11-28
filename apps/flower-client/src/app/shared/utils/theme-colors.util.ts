/**
 * Theme Colors Utility
 * 
 * Converts CSS custom properties (theme variables) to RGB/RGBA values
 * that Chart.js can understand, since Chart.js doesn't support CSS variables.
 */

/**
 * Get computed CSS variable value as RGB string
 */
export function getThemeColor(cssVar: string, fallback: string = '#000000'): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }

  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
  
  if (!value) {
    return fallback;
  }

  // If already RGB/RGBA, return as-is
  if (value.startsWith('rgb')) {
    return value;
  }

  // If hex color, convert to RGB
  if (value.startsWith('#')) {
    return hexToRgb(value) || fallback;
  }

  return value;
}

/**
 * Get theme color with opacity
 */
export function getThemeColorWithOpacity(
  cssVar: string,
  opacity: number = 1,
  fallback: string = '#000000'
): string {
  const rgb = getThemeColor(cssVar, fallback);
  
  // If already rgba, replace opacity
  if (rgb.startsWith('rgba')) {
    return rgb.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  
  // If rgb, convert to rgba
  if (rgb.startsWith('rgb(')) {
    return rgb.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  
  // Fallback: try to parse and convert
  const rgbMatch = rgb.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    return `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
  }
  
  return fallback;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : null;
}

/**
 * Predefined theme color getters for Chart.js
 * These map to our design system colors
 */
export const ChartThemeColors = {
  // Primary colors
  primary: () => getThemeColor('--primary', '#e91e63'),
  primaryLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--primary', opacity, '#e91e63'),
  
  // Semantic colors
  destructive: () => getThemeColor('--destructive', '#ef4444'),
  destructiveLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--destructive', opacity, '#ef4444'),
  destructiveMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--destructive', opacity, '#ef4444'),
  
  success: () => getThemeColor('--success', '#10b981'),
  successLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--success', opacity, '#10b981'),
  successMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--success', opacity, '#10b981'),
  
  // KPI colors
  kpiBlue: () => getThemeColor('--kpi-blue', '#3b82f6'),
  kpiBlueLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--kpi-blue', opacity, '#3b82f6'),
  kpiBlueMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--kpi-blue', opacity, '#3b82f6'),
  
  kpiPurple: () => getThemeColor('--kpi-purple', '#a855f7'),
  kpiPurpleLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--kpi-purple', opacity, '#a855f7'),
  kpiPurpleMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--kpi-purple', opacity, '#a855f7'),
  
  kpiOrange: () => getThemeColor('--kpi-orange', '#f97316'),
  kpiOrangeLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--kpi-orange', opacity, '#f97316'),
  kpiOrangeMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--kpi-orange', opacity, '#f97316'),
  
  kpiIndigo: () => getThemeColor('--kpi-indigo', '#6366f1'),
  kpiIndigoLight: (opacity: number = 0.1) => getThemeColorWithOpacity('--kpi-indigo', opacity, '#6366f1'),
  kpiIndigoMedium: (opacity: number = 0.8) => getThemeColorWithOpacity('--kpi-indigo', opacity, '#6366f1'),
  
  // Chart-specific colors (matching dashboard)
  chartRed: () => 'rgb(239, 68, 68)', // red-500
  chartRedLight: () => 'rgba(239, 68, 68, 0.1)',
  chartRedMedium: () => 'rgba(239, 68, 68, 0.8)',
  
  chartGreen: () => 'rgb(34, 197, 94)', // green-500
  chartGreenLight: () => 'rgba(34, 197, 94, 0.1)',
  chartGreenMedium: () => 'rgba(34, 197, 94, 0.8)',
  
  chartBlue: () => 'rgb(59, 130, 246)', // blue-500
  chartBlueLight: () => 'rgba(59, 130, 246, 0.1)',
  chartBlueMedium: () => 'rgba(59, 130, 246, 0.8)',
  
  chartPurple: () => 'rgb(168, 85, 247)', // purple-500
  chartPurpleLight: () => 'rgba(168, 85, 247, 0.1)',
  chartPurpleMedium: () => 'rgba(168, 85, 247, 0.8)',
  
  chartAmber: () => 'rgb(251, 191, 36)', // amber-400
  chartAmberMedium: () => 'rgba(251, 191, 36, 0.8)',
  
  // Sales by day colors
  chartRed300: () => 'rgba(252, 165, 165, 0.8)', // red-300
  chartBlue300: () => 'rgba(165, 212, 252, 0.8)', // blue-300
  chartGreen300: () => 'rgba(165, 252, 178, 0.8)', // green-300
};

