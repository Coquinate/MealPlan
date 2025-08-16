'use client';

import { useEffect } from 'react';
import { initGlassMorphism } from '../../utils/glass-morphism-detection';

/**
 * Modern Hearth Glass Morphism Initializer
 * Client component that detects glass morphism support on mount
 * Applies appropriate CSS class to body element for fallback handling
 */
export function GlassMorphismInit() {
  useEffect(() => {
    // Initialize glass morphism detection
    initGlassMorphism();
  }, []);

  // This component doesn't render anything
  return null;
}
