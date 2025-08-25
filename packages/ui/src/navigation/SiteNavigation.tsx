'use client';

import React, { useEffect, useState } from 'react';
import { LogoWeeklyRhythm } from '../components/brand';
import { cn } from '../utils/cn';

interface SiteNavigationProps {
  showLaunchBadge?: boolean;
  comingSoonLabel?: string;
}

export function SiteNavigation({
  showLaunchBadge = false,
  comingSoonLabel = 'În curând',
}: SiteNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      
      // Calculate scroll progress - improved calculation from v0
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolledPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-100 transition-all duration-300 relative ${
      scrolled 
        ? 'bg-surface-eggshell bg-opacity-60 backdrop-blur-xl shadow-xl border-b border-accent-coral/15 dark:bg-black-60 dark:backdrop-blur-xl dark:border-gray-700/30' 
        : 'bg-surface-eggshell bg-opacity-95 backdrop-blur-sm border-b border-accent-coral/20 dark:bg-black dark:border-gray-800'
    }`}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-header items-center justify-between py-2 md:py-3 relative">
          {/* Logo with brand lockup - split layout on mobile, normal on desktop */}
          <a
            href="/"
            className="no-underline cursor-pointer group flex sm:flex items-center sm:gap-4 w-full sm:w-auto"
          >
            {/* Icon with rotation on hover - left on mobile, smaller size */}
            <div className="transition-transform duration-300 group-hover:rotate-12 flex-shrink-0 absolute left-0 sm:relative w-8 h-8 sm:w-auto sm:h-auto">
              <LogoWeeklyRhythm size="xxs" variant="animated" />
            </div>
            
            {/* Text - centered on mobile, next to icon on desktop */}
            <span className={cn(
              'font-display font-bold text-xl sm:text-3xl transition-colors duration-300',
              'text-primary group-hover:text-accent-coral',
              'w-full text-center sm:w-auto sm:text-left'
            )}>
              Co<span className={cn(
                'transition-colors duration-300',
                'text-accent-coral group-hover:text-primary'
              )}>q</span>uinate
            </span>
          </a>

          {/* Enhanced Launch Badge - positioned absolutely on mobile */}
          {showLaunchBadge && (
            <>
              {/* Desktop version */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-surface-raised dark:bg-gray-900 rounded-full text-sm text-text-medium-contrast dark:text-gray-300 transition-all duration-300 hover:bg-surface-hover dark:hover:bg-gray-800 hover:shadow-hover cursor-pointer">
                <span className="w-2 h-2 bg-accent-coral rounded-full animate-[subtle-pulse_3s_ease-in-out_infinite]" />
                <span className="transition-colors duration-300 hover:text-text dark:hover:text-white">
                  {comingSoonLabel}
                </span>
              </div>
              
              {/* Mobile version - positioned to the right */}
              <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-surface-raised dark:bg-gray-900 rounded-full text-xs text-text-medium-contrast dark:text-gray-300 transition-all duration-300 hover:bg-surface-hover dark:hover:bg-gray-800 hover:shadow-hover cursor-pointer absolute right-4 sm:relative sm:right-auto">
                <span className="w-1.5 h-1.5 bg-accent-coral rounded-full animate-[subtle-pulse_3s_ease-in-out_infinite]" />
                <span className="transition-colors duration-300 hover:text-text dark:hover:text-white">
                  {comingSoonLabel}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Enhanced Progress Bar - v0-inspired gradient */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-border-light/10 dark:bg-gray-700/10">
        <div 
          className="h-full bg-gradient-to-r from-accent-coral to-primary-warm transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}