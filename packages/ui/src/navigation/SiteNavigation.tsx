import React from 'react';

interface SiteNavigationProps {
  showLaunchBadge?: boolean;
  comingSoonLabel?: string;
}

export function SiteNavigation({
  showLaunchBadge = false,
  comingSoonLabel = 'În curând',
}: SiteNavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-3xl font-bold text-primary-warm hover:text-primary-warm-dark transition-colors tracking-tight"
          >
            Coquinate
          </a>

          {/* Launch Badge */}
          {showLaunchBadge && (
            <div className="flex items-center gap-3 rounded-full bg-surface px-5 py-2.5 mr-2">
              <span className="h-2 w-2 rounded-full bg-accent-coral animate-pulse" />
              <span className="text-sm text-text-secondary font-medium">{comingSoonLabel}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
