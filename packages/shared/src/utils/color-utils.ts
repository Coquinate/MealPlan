/**
 * Color utility functions for OKLCH to RGB conversion and contrast calculation
 * Based on WCAG 2.1 AA standards
 */

/**
 * Convert OKLCH to RGB
 * Based on CSS Color Module Level 4 specification
 */
export function oklchToRGB(l: number, c: number, h: number): { r: number; g: number; b: number } {
  // Convert to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Apply gamma correction (sRGB)
  r = gammaCorrect(r);
  g = gammaCorrect(g);
  b_ = gammaCorrect(b_);

  // Clamp to 0-255 range
  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b_ * 255))),
  };
}

/**
 * Apply sRGB gamma correction
 */
function gammaCorrect(channel: number): number {
  if (channel <= 0.0031308) {
    return 12.92 * channel;
  }
  return 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

/**
 * Calculate relative luminance (WCAG 2.1)
 */
export function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function calculateContrastRatio(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number }
): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAG_AA(ratio: number, textSize: 'normal' | 'large' = 'normal'): boolean {
  // Large text: 14pt bold or 18pt regular
  const minRatio = textSize === 'large' ? 3.0 : 4.5;
  return ratio >= minRatio;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAG_AAA(ratio: number, textSize: 'normal' | 'large' = 'normal'): boolean {
  const minRatio = textSize === 'large' ? 4.5 : 7.0;
  return ratio >= minRatio;
}

/**
 * Suggest color adjustment to meet contrast requirements
 */
export function suggestColorAdjustment(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
  targetRatio: number = 4.5
): {
  suggestion: string;
  adjustedColor?: { r: number; g: number; b: number };
} {
  const currentRatio = calculateContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return { suggestion: 'Contrast already meets requirements' };
  }

  // Determine if we should lighten or darken
  const bgLuminance = relativeLuminance(background);
  const shouldLighten = bgLuminance < 0.5;

  // Try adjusting foreground
  let adjustedFg = { ...foreground };
  let attempts = 0;
  const maxAttempts = 20;

  while (calculateContrastRatio(adjustedFg, background) < targetRatio && attempts < maxAttempts) {
    if (shouldLighten) {
      adjustedFg.r = Math.min(255, adjustedFg.r + 10);
      adjustedFg.g = Math.min(255, adjustedFg.g + 10);
      adjustedFg.b = Math.min(255, adjustedFg.b + 10);
    } else {
      adjustedFg.r = Math.max(0, adjustedFg.r - 10);
      adjustedFg.g = Math.max(0, adjustedFg.g - 10);
      adjustedFg.b = Math.max(0, adjustedFg.b - 10);
    }
    attempts++;
  }

  if (calculateContrastRatio(adjustedFg, background) >= targetRatio) {
    return {
      suggestion: shouldLighten ? 'Lighten foreground color' : 'Darken foreground color',
      adjustedColor: adjustedFg,
    };
  }

  return {
    suggestion: 'Consider using a veil overlay or changing the color pairing',
  };
}

/**
 * Parse hex color to RGB
 */
export function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
