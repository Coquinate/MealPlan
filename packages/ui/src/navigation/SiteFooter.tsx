import React from 'react';

interface SiteFooterProps {
  copyrightText?: string;
  privacyPolicyLabel?: string;
}

export function SiteFooter({
  copyrightText = '© 2025 Coquinate. Dezvoltat cu pasiune pentru familiile din România.',
  privacyPolicyLabel = 'Politică de Confidențialitate',
}: SiteFooterProps) {
  return (
    <footer className="bg-dark-surface py-12 text-center">
      <div className="mx-auto max-w-container px-8">
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
