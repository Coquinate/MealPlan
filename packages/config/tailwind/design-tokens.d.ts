/**
 * TypeScript declarations for design-tokens module
 */

export interface NumberFormat {
  locale: string;
  decimal: string;
  thousands: string;
  precision: number;
}

export interface CurrencyFormat {
  locale: string;
  currency: string;
  symbol: string;
  position: 'prefix' | 'suffix';
  spacing: boolean;
}

export interface DateFormat {
  locale: string;
  weekStartsOn: number;
  formats: {
    short: string;
    long: string;
    dayMonth: string;
    weekday: string;
    time: string;
  };
}

export interface TimeFormat {
  use24Hour: boolean;
  separator: string;
}

export interface RomanianFormats {
  numberFormat: NumberFormat;
  currencyFormat: CurrencyFormat;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
}

export interface ContextColors {
  [key: string]: Record<string, string>;
}

export interface DesignTokens {
  colors: {
    [key: string]: string | ContextColors | Record<string, string>;
    context: ContextColors;
    freshness: Record<string, string>;
  };
  fontFamily: Record<string, string[]>;
  fontSize: Record<string, [string, { lineHeight?: string; fontWeight?: string }]>;
  fontWeight: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  animation: Record<string, string>;
  screens: Record<string, string>;
  zIndex: Record<string, string>;
  opacity: Record<string, string>;
  width: Record<string, string>;
  ringWidth: Record<string, string>;
  ringOffsetWidth: Record<string, string>;
  lineClamp: Record<string, string>;
  scale: Record<string, string>;
  rotate: Record<string, string>;
  blur: Record<string, string>;
  maxWidth: Record<string, string>;
  aspectRatio: Record<string, string>;
  gridTemplateColumns: Record<string, string>;
  gridTemplateRows: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
  romanian: RomanianFormats;
}

export declare const semanticColors: Record<string, string>;
export declare const darkModeColors: Record<string, string>;
export declare const contextColors: ContextColors;
export declare const freshnessColors: Record<string, string>;
export declare const fontFamily: Record<string, string[]>;
export declare const fontSize: Record<
  string,
  [string, { lineHeight?: string; fontWeight?: string }]
>;
export declare const fontWeight: Record<string, string>;
export declare const spacing: Record<string, string>;
export declare const borderRadius: Record<string, string>;
export declare const boxShadow: Record<string, string>;
export declare const animation: Record<string, string>;
export declare const screens: Record<string, string>;
export declare const zIndex: Record<string, string>;
export declare const opacity: Record<string, string>;
export declare const width: Record<string, string>;
export declare const ringWidth: Record<string, string>;
export declare const ringOffsetWidth: Record<string, string>;
export declare const lineClamp: Record<string, string>;
export declare const scale: Record<string, string>;
export declare const rotate: Record<string, string>;
export declare const blur: Record<string, string>;
export declare const maxWidth: Record<string, string>;
export declare const aspectRatio: Record<string, string>;
export declare const gridTemplateColumns: Record<string, string>;
export declare const gridTemplateRows: Record<string, string>;
export declare const transitionDuration: Record<string, string>;
export declare const transitionTimingFunction: Record<string, string>;
export declare const romanianFormats: RomanianFormats;
export declare const designTokens: DesignTokens;

export declare const romanianUtils: RomanianFormats;

declare const _default: DesignTokens;
export default _default;
