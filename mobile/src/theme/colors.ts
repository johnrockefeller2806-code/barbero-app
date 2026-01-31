// QuickCut - Ultra Modern 2025 Design System
export const colors = {
  // Primary - Electric Violet/Purple
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Secondary - Neon Cyan
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Accent - Hot Pink/Magenta
  accent: {
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
  },
  // Neon Green (Available)
  neon: {
    green: '#00ff88',
    blue: '#00d4ff',
    purple: '#bf00ff',
    pink: '#ff0080',
  },
  // Dark Mode Optimized Grays
  dark: {
    900: '#0a0a0f',
    800: '#12121a',
    700: '#1a1a24',
    600: '#24242e',
    500: '#2e2e3a',
    400: '#3a3a48',
    300: '#52525e',
    200: '#71717a',
    100: '#a1a1aa',
  },
  // Light Grays
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  // Status
  success: '#00ff88',
  warning: '#ffb800',
  error: '#ff3366',
  info: '#00d4ff',
  // Special
  available: '#00ff88',
  busy: '#ff3366',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
};

export const gradients = {
  // Premium Gradients
  primary: ['#7c3aed', '#a855f7', '#c084fc'],
  secondary: ['#06b6d4', '#22d3ee', '#67e8f9'],
  accent: ['#ec4899', '#f472b6'],
  neon: ['#00ff88', '#00d4ff'],
  sunset: ['#ff3366', '#ff6b35', '#ffb800'],
  aurora: ['#7c3aed', '#06b6d4', '#00ff88'],
  midnight: ['#0a0a0f', '#1a1a24', '#2e2e3a'],
  glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  available: ['#00ff88', '#00d4aa'],
  hero: ['#0a0a0f', '#1a1a24'],
};

export const shadows = {
  neon: {
    purple: {
      shadowColor: '#a855f7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    cyan: {
      shadowColor: '#22d3ee',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    green: {
      shadowColor: '#00ff88',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const blur = {
  light: 10,
  medium: 20,
  heavy: 40,
};
