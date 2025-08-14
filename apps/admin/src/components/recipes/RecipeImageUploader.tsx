/**
 * Recipe Image Uploader Component for Admin Dashboard
 * Handles image upload to Supabase Storage with validation and progress tracking
 */

'use client';

import React, { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  uploadRecipeImage,
  validateImageFile,
  generateImagePath,
} from '@mealplan/shared/utils/image.utils';
import type { ImageUploadProgress, ImageUploadResult } from '@mealplan/shared/types/image.types';

interface RecipeImageUploaderProps {
  recipeId: string;
  currentImageUrl?: string | null;
  onImageUploaded: (imageUrl: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export function RecipeImageUploader({
  recipeId,
  currentImageUrl,
  onImageUploaded,
  onError,
  className = '',
}: RecipeImageUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<ImageUploadProgress>({
    progress: 0,
    isUploading: false,
  });
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  // Initialize Supabase client with service role key for admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin service role key
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        onError(validation.error || 'Fișierul nu este valid');
        return;
      }

      setUploadProgress({ progress: 0, isUploading: true });

      try {
        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Simulate upload progress (since Supabase doesn't provide real progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }));
        }, 200);

        // Upload image to Supabase Storage
        const result: ImageUploadResult = await uploadRecipeImage(supabase, {
          file,
          recipeId,
          filename: file.name,
          isMainImage: true,
        });

        clearInterval(progressInterval);

        if (result.success && result.imageUrl) {
          setUploadProgress({ progress: 100, isUploading: false });

          // Update database record with new image URL
          const { error: updateError } = await supabase
            .from('recipes')
            .update({ image_url: result.imageUrl })
            .eq('id', recipeId);

          if (updateError) {
            throw new Error(`Eroare la actualizarea bazei de date: ${updateError.message}`);
          }

          onImageUploaded(result.imageUrl);

          // Clean up object URL
          URL.revokeObjectURL(objectUrl);

          // Reset progress after a short delay
          setTimeout(() => {
            setUploadProgress({ progress: 0, isUploading: false });
          }, 2000);
        } else {
          throw new Error(result.error || 'Eroare la încărcarea imaginii');
        }
      } catch (error) {
        setUploadProgress({ progress: 0, isUploading: false, error: error.message });
        onError(error instanceof Error ? error.message : 'Eroare necunoscută');

        // Reset preview
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(currentImageUrl || null);
        }
      }
    },
    [recipeId, currentImageUrl, onImageUploaded, onError, supabase]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleRemoveImage = useCallback(async () => {
    if (!currentImageUrl) return;

    try {
      // Update database to remove image URL
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: null })
        .eq('id', recipeId);

      if (updateError) {
        throw new Error(`Eroare la actualizarea bazei de date: ${updateError.message}`);
      }

      // If it's a Supabase Storage URL, delete the file
      if (currentImageUrl.includes('.supabase.co/storage/v1/object/public/recipe-images/')) {
        const pathMatch = currentImageUrl.match(/recipe-images\/(.+)$/);
        if (pathMatch) {
          const filePath = pathMatch[1];
          await supabase.storage.from('recipe-images').remove([filePath]);
        }
      }

      setPreviewUrl(null);
      onImageUploaded(''); // Empty string to indicate removal
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Eroare la ștergerea imaginii');
    }
  }, [currentImageUrl, recipeId, onImageUploaded, onError, supabase]);

  return (
    <div className={`recipe-image-uploader ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Imaginea rețetei</label>

        {/* Preview Area */}
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview imagine rețetă"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />

            {/* Upload progress overlay */}
            {uploadProgress.isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-sm">Încărcarea: {uploadProgress.progress}%</div>
                </div>
              </div>
            )}

            {/* Remove button */}
            {!uploadProgress.isUploading && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Șterge imaginea"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          /* Upload Drop Zone */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${uploadProgress.isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-input-${recipeId}`}
              disabled={uploadProgress.isUploading}
            />

            <div className="space-y-2">
              <div className="text-4xl text-gray-400">📸</div>
              <div className="text-lg font-medium text-gray-600">
                Încarcă o imagine pentru rețetă
              </div>
              <div className="text-sm text-gray-500">
                Trage și lasă imaginea aici sau{' '}
                <label
                  htmlFor={`file-input-${recipeId}`}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  selectează un fișier
                </label>
              </div>
              <div className="text-xs text-gray-400">
                JPEG, PNG, WebP sau AVIF • Maxim 5MB • Minim 320x214px
              </div>
            </div>

            {uploadProgress.isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Încărcarea imaginii... {uploadProgress.progress}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {uploadProgress.error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {uploadProgress.error}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-2 text-xs text-gray-500">
          <strong>Sfaturi pentru imagini:</strong> Folosește imagini cu o rețetă românească
          autentică, cu prop-uri tradiționale și o iluminare bună. Dimensiunile ideale sunt
          1200x800px pentru cea mai bună calitate pe toate dispozitivele.
        </div>
      </div>
    </div>
  );
}

export default RecipeImageUploader;
