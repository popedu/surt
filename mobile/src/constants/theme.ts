import { Platform } from 'react-native';

export const C = {
  bg: '#FBF7F2',
  card: '#FFFFFF',
  ink: '#1F2421',
  muted: '#6B7068',
  line: '#ECE6DD',
  primary: '#E8590C',
  primarySoft: '#FFF0E6',
  primaryLine: '#F3C9A8',
  green: '#2F7D4F',
  greenSoft: '#E7EFE9',
  red: '#C92A2A',
  track: '#EFE9E1',
  blue: '#1C7ED6',
} as const;

export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const R = { card: 18, field: 12, pill: 999 } as const;

// Alçada aproximada de la barra de pestanyes, per no tapar contingut
export const TAB_BAR = Platform.select({ ios: 56, android: 80 }) ?? 0;
