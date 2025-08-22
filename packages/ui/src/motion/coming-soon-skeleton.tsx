'use client';

import { LazyMotion, domAnimation } from 'motion/react';
import { Skeleton } from './loading';

/**
 * Skeleton loader for the coming-soon page navigation
 */
export function NavigationSkeleton() {
  return (
    <LazyMotion features={domAnimation} strict>
      <nav className="fixed top-0 w-full bg-surface z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo skeleton */}
            <Skeleton width="120px" height="32px" variant="rectangular" />
            
            {/* Nav items skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              <Skeleton width="80px" height="20px" />
              <Skeleton width="100px" height="20px" />
              <Skeleton width="90px" height="20px" />
            </div>
            
            {/* Launch badge skeleton */}
            <Skeleton width="140px" height="28px" variant="rectangular" />
          </div>
        </div>
      </nav>
    </LazyMotion>
  );
}

/**
 * Skeleton loader for the hero section
 */
export function HeroSectionSkeleton() {
  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-surface-hover pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Headline skeleton */}
            <div className="text-center mb-8">
              <Skeleton width="80%" height="48px" className="mx-auto mb-4" />
              <Skeleton width="60%" height="48px" className="mx-auto" />
            </div>
            
            {/* Subtitle skeleton */}
            <div className="text-center mb-12">
              <Skeleton width="70%" height="24px" className="mx-auto mb-2" />
              <Skeleton width="50%" height="24px" className="mx-auto" />
            </div>
            
            {/* Email capture form skeleton */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton width="100%" height="48px" variant="rectangular" className="flex-1" />
                <Skeleton width="120px" height="48px" variant="rectangular" />
              </div>
            </div>
            
            {/* Workflow visualization skeleton */}
            <div className="relative h-64 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-8">
                  <Skeleton width="100px" height="100px" variant="circular" />
                  <Skeleton width="100px" height="100px" variant="circular" />
                  <Skeleton width="100px" height="100px" variant="circular" />
                  <Skeleton width="100px" height="100px" variant="circular" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/**
 * Skeleton loader for the features section
 */
export function FeaturesSectionSkeleton() {
  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          {/* Section title skeleton */}
          <div className="text-center mb-12">
            <Skeleton width="300px" height="36px" className="mx-auto mb-4" />
            <Skeleton width="500px" height="20px" className="mx-auto" />
          </div>
          
          {/* Features grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface-hover rounded-lg p-6">
                {/* Icon skeleton */}
                <Skeleton width="48px" height="48px" variant="circular" className="mb-4" />
                
                {/* Title skeleton */}
                <Skeleton width="150px" height="24px" className="mb-2" />
                
                {/* Description skeleton */}
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="90%" height="16px" className="mb-2" />
                <Skeleton width="75%" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/**
 * Skeleton loader for the CTA section
 */
export function CTASectionSkeleton() {
  return (
    <LazyMotion features={domAnimation} strict>
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          {/* CTA title skeleton */}
          <Skeleton width="400px" height="36px" className="mx-auto mb-4" />
          
          {/* CTA description skeleton */}
          <Skeleton width="600px" height="20px" className="mx-auto mb-8" />
          
          {/* CTA buttons skeleton */}
          <div className="flex justify-center space-x-4">
            <Skeleton width="160px" height="48px" variant="rectangular" />
            <Skeleton width="140px" height="48px" variant="rectangular" />
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/**
 * Skeleton loader for the footer
 */
export function FooterSkeleton() {
  return (
    <LazyMotion features={domAnimation} strict>
      <footer className="bg-surface-hover border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton width="120px" height="20px" className="mb-4" />
                <div className="space-y-2">
                  <Skeleton width="100px" height="16px" />
                  <Skeleton width="90px" height="16px" />
                  <Skeleton width="110px" height="16px" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom bar skeleton */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Skeleton width="200px" height="16px" />
              <div className="flex space-x-4">
                <Skeleton width="32px" height="32px" variant="circular" />
                <Skeleton width="32px" height="32px" variant="circular" />
                <Skeleton width="32px" height="32px" variant="circular" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </LazyMotion>
  );
}

/**
 * Complete skeleton loader for the coming-soon page
 * Includes all sections with proper layout
 */
export function ComingSoonPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <NavigationSkeleton />
      <HeroSectionSkeleton />
      <FeaturesSectionSkeleton />
      <CTASectionSkeleton />
      <FooterSkeleton />
    </div>
  );
}

/**
 * Export all coming-soon skeleton components
 */
export const comingSoonSkeletons = {
  NavigationSkeleton,
  HeroSectionSkeleton,
  FeaturesSectionSkeleton,
  CTASectionSkeleton,
  FooterSkeleton,
  ComingSoonPageSkeleton
};