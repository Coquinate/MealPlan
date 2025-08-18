/**
 * TypeScript interfaces for image handling
 */

export interface RecipeImageProps {
  recipeId: string;
  imageUrl?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallbackUrl?: string;
}

export interface ImageOptimizationConfig {
  quality: number;
  formats: ('webp' | 'avif' | 'jpeg')[];
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface RecipeImageMetadata {
  originalUrl: string;
  optimizedUrl: string;
  blurDataUrl: string;
  altTextRo: string;
  altTextEn: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ImageUploadProgress {
  progress: number;
  isUploading: boolean;
  error?: string;
}

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  path?: string;
}

export interface ImageValidationRules {
  maxSize: number; // in bytes
  allowedFormats: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface StorageImageInfo {
  path: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  quality: 85,
  formats: ['webp', 'avif', 'jpeg'],
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1200,
  },
};

export const RECIPE_IMAGE_VALIDATION: ImageValidationRules = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
  minWidth: 320,
  minHeight: 214,
  maxWidth: 2048,
  maxHeight: 1365,
};
