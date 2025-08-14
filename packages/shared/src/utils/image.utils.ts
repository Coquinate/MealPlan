/**
 * Image Storage Utility Functions
 * Handles Supabase Storage operations for recipe images
 */

import { createClient } from '@supabase/supabase-js';

// Storage bucket configuration
export const RECIPE_IMAGES_BUCKET = 'recipe-images';

/**
 * Image URL format and naming conventions:
 * - Storage bucket: 'recipe-images'
 * - URL pattern: https://[project].supabase.co/storage/v1/object/public/recipe-images/[recipe-id]/[filename]
 * - Naming convention: [recipe-id]-main.jpg for primary recipe image
 * - Organization structure: /recipe-id/filename for better organization
 */

export interface ImageUploadOptions {
  file: File;
  recipeId: string;
  filename?: string;
  isMainImage?: boolean;
}

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  path?: string;
}

/**
 * Generate standardized image path for storage
 * Uses more permissive filename sanitization for international characters
 */
export function generateImagePath(recipeId: string, filename: string, isMainImage = false): string {
  // More permissive sanitization - allow international characters, spaces become dashes
  // Remove only potentially dangerous characters: \/:*?"<>|
  const sanitizedFilename = filename
    .replace(/[\\/:\*\?"<>\|]/g, '-') // Remove dangerous chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

  const finalFilename = isMainImage
    ? `${recipeId}-main.${getFileExtension(sanitizedFilename)}`
    : sanitizedFilename;
  return `${recipeId}/${finalFilename}`;
}

/**
 * Generate public URL for stored image
 */
export function generateImageUrl(supabaseUrl: string, imagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${RECIPE_IMAGES_BUCKET}/${imagePath}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'jpg';
}

/**
 * Validate image file format and size
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file size (5MB limit as per bucket configuration)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'Fișierul este prea mare. Mărimea maximă permisă este 5MB.' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format de fișier neacceptat. Folosește JPEG, PNG, WebP sau AVIF.',
    };
  }

  return { isValid: true };
}

/**
 * Upload image to Supabase Storage
 * Requires admin authentication
 */
export async function uploadRecipeImage(
  supabase: ReturnType<typeof createClient>,
  options: ImageUploadOptions
): Promise<ImageUploadResult> {
  const { file, recipeId, filename, isMainImage = false } = options;

  // Validate file
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    // Generate storage path
    const imagePath = generateImagePath(recipeId, filename || file.name, isMainImage);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .upload(imagePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true, // Allow overwriting existing files
      });

    if (error) {
      return { success: false, error: `Eroare la încărcarea imaginii: ${error.message}` };
    }

    // Generate public URL using getPublicUrl method
    const { data: urlData } = supabase.storage.from(RECIPE_IMAGES_BUCKET).getPublicUrl(imagePath);

    const imageUrl = urlData.publicUrl;

    return {
      success: true,
      imageUrl,
      path: imagePath,
    };
  } catch (error) {
    return {
      success: false,
      error: `Eroare neașteptată: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
    };
  }
}

/**
 * Delete image from Supabase Storage
 * Requires admin authentication
 */
export async function deleteRecipeImage(
  supabase: ReturnType<typeof createClient>,
  imagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(RECIPE_IMAGES_BUCKET).remove([imagePath]);

    if (error) {
      return { success: false, error: `Eroare la ștergerea imaginii: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Eroare neașteptată: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
    };
  }
}

/**
 * Generate simple blur data URL for placeholder loading
 * Server-safe implementation with static base64 blur placeholder
 */
export function generateBlurDataUrl(): string {
  // Static 20x13 gray blur placeholder that works server-side and client-side
  // This base64 represents a small blurred gray rectangle
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/U6LQWjBcY+yut2iaxjKMY/wDW6M4TBMZz6//Z';
}

/**
 * Extract recipe ID from image path
 */
export function extractRecipeIdFromPath(imagePath: string): string | null {
  const parts = imagePath.split('/');
  return parts.length > 0 ? parts[0] : null;
}

/**
 * Check if image URL is from Supabase Storage
 */
export function isSupabaseImageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/');
}
