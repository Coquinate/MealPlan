/**
 * RecipeImage Component
 * Optimized image component for recipe photos using Next.js Image with Supabase Storage
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '../utils/cn';
import { generateBlurDataUrl, isSupabaseImageUrl } from '../utils/image.utils';
import type { RecipeImageProps } from '../types/image.types';

// Default fallback image path
const DEFAULT_FALLBACK = '/images/defaults/recipe-placeholder.svg';

export function RecipeImage({
  recipeId,
  imageUrl,
  alt,
  priority = false,
  sizes = '(min-width: 1200px) 400px, (min-width: 768px) 300px, 280px',
  className,
  fallbackUrl = DEFAULT_FALLBACK,
}: RecipeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl || fallbackUrl);
  const [failureCount, setFailureCount] = useState(0);

  // Generate blur placeholder
  const blurDataUrl = generateBlurDataUrl();

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    const newFailureCount = failureCount + 1;
    setFailureCount(newFailureCount);

    // Only try fallback once and if we haven't exceeded max attempts
    if (currentImageUrl !== fallbackUrl && newFailureCount <= 2) {
      setCurrentImageUrl(fallbackUrl);
      setHasError(false); // Reset error state to try fallback
    }
    // If we've failed too many times, stop trying and show error state
  };

  const imageClasses = cn(
    'object-cover transition-opacity duration-300',
    isLoading ? 'opacity-0' : 'opacity-100',
    className
  );

  const containerClasses = cn(
    'relative overflow-hidden bg-gray-100',
    'before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-50 before:to-gray-100',
    isLoading && 'animate-pulse'
  );

  return (
    <div className={containerClasses}>
      <Image
        src={currentImageUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        className={imageClasses}
        onLoad={handleLoadComplete}
        onError={handleError}
        // Ensure we use Vercel Image Optimization for Supabase URLs
        unoptimized={!isSupabaseImageUrl(currentImageUrl)}
      />

      {/* Loading skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          <div className="absolute inset-4 bg-white/20 rounded-lg" />
        </div>
      )}

      {/* Error state indicator (for development) */}
      {hasError && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
}

/**
 * Recipe Image Card - Component with aspect ratio container
 */
interface RecipeImageCardProps extends RecipeImageProps {
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  width?: number;
  height?: number;
  className?: string;
}

export function RecipeImageCard({
  aspectRatio = 'landscape',
  width,
  height,
  className,
  ...imageProps
}: RecipeImageCardProps) {
  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
  };

  const cardClasses = cn(
    'relative rounded-lg overflow-hidden',
    aspectClasses[aspectRatio],
    className
  );

  // If explicit dimensions are provided, use them
  if (width && height) {
    return (
      <div
        className={cn('relative rounded-lg overflow-hidden', className)}
        style={{ width, height }}
      >
        <RecipeImage {...imageProps} />
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <RecipeImage {...imageProps} />
    </div>
  );
}

/**
 * Recipe Hero Image - Large banner image for recipe detail pages
 */
interface RecipeHeroImageProps extends RecipeImageProps {
  showOverlay?: boolean;
  overlayOpacity?: number;
  className?: string;
}

export function RecipeHeroImage({
  showOverlay = false,
  overlayOpacity = 0.3,
  className,
  ...imageProps
}: RecipeHeroImageProps) {
  const heroClasses = cn('relative h-[400px] md:h-[500px] lg:h-[600px] w-full', className);

  return (
    <div className={heroClasses}>
      <RecipeImage
        {...imageProps}
        priority={true} // Hero images should load with priority
        sizes="100vw" // Full width hero image
      />

      {/* Optional overlay for text readability */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

export type { RecipeImageProps, RecipeImageCardProps, RecipeHeroImageProps };
