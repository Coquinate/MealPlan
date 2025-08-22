'use client';

import React from 'react';

interface SiteFooterProps {
  copyrightText?: string;
  privacyPolicyLabel?: string;
}

export function SiteFooter({
  copyrightText = '© 2025 Coquinate. Dezvoltat cu pasiune pentru familiile din România.',
  privacyPolicyLabel = 'Politică de Confidențialitate',
}: SiteFooterProps) {
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Îți place ideea? Ajută-ne să ajungem la mai multe familii!');
    const body = encodeURIComponent(`Descoperă Coquinate - planificarea meselor făcută ușor pentru familiile din România!\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="bg-dark-surface py-12 text-center">
      <div className="mx-auto max-w-container px-8">
        {/* Share text and buttons */}
        <p className="text-text-light opacity-70 text-sm mb-4">
          Îți place ideea? Ajută-ne să ajungem la mai multe familii!
        </p>
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={handleEmailShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/30 hover:bg-surface-secondary/50 text-text-light rounded-lg transition-colors duration-200 text-sm"
            aria-label="Email"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </button>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/30 hover:bg-surface-secondary/50 text-text-light rounded-lg transition-colors duration-200 text-sm"
            aria-label="Copiază link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copiază link
          </button>
        </div>

        {/* Logo */}
        <div className="font-display text-footer-logo font-bold text-primary mb-4 opacity-80">
          Coquinate
        </div>

        {/* Copyright */}
        <p className="text-sm text-text-light opacity-70 mb-4">{copyrightText}</p>

        {/* Links */}
        <div className="mt-4">
          <a
            href="/politica-de-confidentialitate"
            target="_blank"
            className="text-sm text-text-light opacity-70 hover:opacity-100 transition-opacity no-underline"
            aria-label={privacyPolicyLabel}
          >
            {privacyPolicyLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}
