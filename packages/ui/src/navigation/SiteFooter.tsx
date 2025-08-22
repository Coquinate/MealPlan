'use client';

import React, { useState } from 'react';
import { 
  IconBrandFacebook, 
  IconBrandInstagram, 
  IconBrandTwitter, 
  IconMail, 
  IconHeart 
} from '@tabler/icons-react';

interface SiteFooterProps {
  copyrightText?: string;
  privacyPolicyLabel?: string;
}

export function SiteFooter({
  copyrightText = '© 2025 Coquinate. Dezvoltat cu pasiune pentru familiile din România.',
  privacyPolicyLabel = 'Politică de Confidențialitate',
}: SiteFooterProps) {
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = () => {
    const newClicks = easterEggClicks + 1;
    setEasterEggClicks(newClicks);

    if (newClicks === 5) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setEasterEggClicks(0);
      }, 3000);
    }
  };

  const socialLinks = [
    { 
      icon: IconBrandFacebook, 
      href: '#', 
      label: 'Facebook', 
      hoverColor: 'hover:text-blue-400' 
    },
    { 
      icon: IconBrandInstagram, 
      href: '#', 
      label: 'Instagram', 
      hoverColor: 'hover:text-pink-400' 
    },
    { 
      icon: IconBrandTwitter, 
      href: '#', 
      label: 'Twitter', 
      hoverColor: 'hover:text-sky-400' 
    },
    { 
      icon: IconMail, 
      href: 'mailto:contact@coquinate.ro', 
      label: 'Email', 
      hoverColor: 'hover:text-accent-coral' 
    },
  ];

  return (
    <footer className="bg-dark-surface text-text-light py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Easter Egg Overlay */}
      {showEasterEgg && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-coral via-primary-warm to-accent-coral opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
            🍳✨🥘
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo with Easter Egg */}
        <div
          onClick={handleLogoClick}
          className={`font-display text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4 opacity-80 cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 select-none ${
            showEasterEgg ? 'animate-bounce text-accent-coral' : ''
          }`}
        >
          Coquinate
          {showEasterEgg && (
            <div className="text-xs mt-1 text-accent-coral animate-pulse">
              Mulțumim că ne iubești! <IconHeart size={12} className="inline animate-pulse" />
            </div>
          )}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-4 sm:mb-6">
          {socialLinks.map((social, index) => (
            <a
              key={social.label}
              href={social.href}
              className={`p-2 rounded-full bg-surface-white/10 backdrop-blur-sm border border-surface-white/20 transition-all duration-300 hover:bg-surface-white/20 hover:transform hover:-translate-y-1 ${social.hoverColor} group`}
              title={social.label}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={social.label}
            >
              <social.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="opacity-70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
          {copyrightText}
        </p>

        {/* Privacy Policy Link */}
        <div className="mt-3 sm:mt-4">
          <a
            href="/politica-de-confidentialitate"
            target="_blank"
            rel="noreferrer"
            className="text-text-light opacity-70 no-underline text-xs sm:text-sm hover:opacity-100 transition-all duration-200 py-2 px-1 inline-block hover:text-accent-coral"
            aria-label={privacyPolicyLabel}
          >
            {privacyPolicyLabel}
          </a>
        </div>

        {/* Made with Love in Romania */}
        <div className="mt-8 pt-6 border-t border-border/10">
          <p className="text-base font-semibold text-white flex items-center justify-center gap-1">
            Făcut cu 
            <span className="inline-block mx-1 relative">
              <IconHeart 
                size={24} 
                className="text-accent-coral animate-pulse fill-accent-coral" 
                style={{ 
                  filter: 'drop-shadow(0 0 12px rgba(255, 107, 107, 0.8))',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </span>
            în România
          </p>
        </div>
      </div>
    </footer>
  );
}
