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
    <footer className="bg-dark-surface text-text-light py-8">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="font-display text-2xl font-bold text-primary-warm opacity-80 mb-4">
          Coquinate
        </div>

        {/* Copyright */}
        <p className="text-sm opacity-70 mb-4">{copyrightText}</p>

        {/* Links */}
        <div className="flex justify-center gap-6">
          <a
            href="/politica-de-confidentialitate"
            className="text-sm text-text-light opacity-70 hover:opacity-100 transition-opacity"
            aria-label={privacyPolicyLabel}
          >
            {privacyPolicyLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}
