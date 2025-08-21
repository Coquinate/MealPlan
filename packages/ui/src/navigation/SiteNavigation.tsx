'use client';

import React, { useEffect, useState } from 'react';

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
      
      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (winScroll / height) * 100;
      setScrollProgress(scrolledPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-100 transition-all duration-300 ${
      scrolled 
        ? 'bg-surface-white/80 backdrop-blur-lg shadow-hover' 
        : 'bg-surface-white shadow-[0_1px_0_oklch(90%_0_0)]'
    }`}>
      <div className="mx-auto max-w-container px-8">
        <div className="flex h-header items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-logo font-bold text-primary no-underline tracking-[-0.02em]"
          >
            Coquinate
          </a>

          {/* Launch Badge */}
          {showLaunchBadge && (
            <div className="flex items-center gap-3 rounded-full bg-surface-eggshell px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-accent-coral animate-[subtle-pulse_3s_ease-in-out_infinite]" />
              <span className="text-sm text-text-medium-contrast">{comingSoonLabel}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-progress-bar w-full bg-border-light/20">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent-coral transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}
