// theme.ts
// Centralized theme configuration for fonts, colors, spacing, and border radius used throughout the app.
export const theme = {
  // Font families for primary and secondary text
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Arial, sans-serif'
  },
  // Font sizes for various text elements
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
    xxlarge: '20px'
  },
  // Color palette for UI elements
  colors: {
    primary: '#D2691E',
    secondary: '#f5f5f5',
    text: '#333333',
    textLight: '#666666',
    background: '#ffffff',
    border: '#e0e0e0',
    success: '#4CAF50'
  },
  // Spacing values for margins and paddings
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  // Border radius values for rounded corners
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
};