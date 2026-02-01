/**
 * 和モダン カラーパレット
 * Japanese Modern Color Palette
 */

export const Colors = {
  // Primary - 藍色 (Indigo/Navy)
  primary: {
    main: '#1e3a8a',      // 深い藍色
    light: '#3b82f6',     // 明るい藍
    dark: '#1e40af',      // 濃い藍
    contrast: '#ffffff',  // 白（コントラスト用）
  },

  // Accent - 朱色 (Vermillion)
  accent: {
    main: '#dc2626',      // 朱色
    light: '#ef4444',     // 明るい朱
    dark: '#b91c1c',      // 濃い朱
    contrast: '#ffffff',  // 白（コントラスト用）
  },

  // Background - 和紙色
  background: {
    main: '#faf8f5',      // 和紙の温かみのある白
    card: '#ffffff',      // カード背景
    dark: '#f5f3f0',      // 少し濃いめ
  },

  // Text - 墨色
  text: {
    primary: '#1f2937',   // 墨色（濃い）
    secondary: '#6b7280', // グレー
    disabled: '#9ca3af',  // 薄いグレー
    inverse: '#ffffff',   // 白（反転用）
  },

  // Semantic Colors
  success: '#059669',     // 緑（正解）
  error: '#dc2626',       // 赤（不正解）
  warning: '#f59e0b',     // オレンジ（警告）
  info: '#3b82f6',        // 青（情報）

  // Difficulty Colors
  difficulty: {
    easy: '#10b981',      // 緑
    medium: '#f59e0b',    // オレンジ
    hard: '#dc2626',      // 赤
  },

  // Category Colors (和の色)
  category: {
    culture: '#8b5cf6',   // 紫（文化）
    food: '#f59e0b',      // 橙（食べ物）
    history: '#be185d',   // 紅（歴史）
    geography: '#059669', // 緑（地理）
    language: '#0891b2',  // 青（言語）
    tradition: '#7c2d12', // 茶（伝統）
  },

  // Border & Divider
  border: '#e5e7eb',
  divider: '#d1d5db',

  // Shadow (for elevation)
  shadow: {
    color: '#000000',
    opacity: 0.1,
  },
} as const;

export type ColorScheme = typeof Colors;
