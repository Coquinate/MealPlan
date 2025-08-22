'use client';

import React, { useState, useEffect } from 'react';
import { 
  IconBrandFacebook, 
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandWhatsapp,
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
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

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

  const encodedPageUrl = encodeURIComponent(pageUrl);
  const shareText = encodeURIComponent("Descoperă Coquinate, platforma inteligentă de planificare a meselor!");

  const socialLinks = [
    { 
      icon: IconBrandFacebook, 
      label: 'Facebook', 
      hoverColor: 'hover:text-blue-400',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`,
      title: 'Distribuie pe Facebook'
    },
    { 
      icon: IconBrandTwitter, 
      label: 'Twitter / X', 
      hoverColor: 'hover:text-sky-400',
      href: `https://twitter.com/intent/tweet?url=${encodedPageUrl}&text=${shareText}`,
      title: 'Distribuie pe X'
    },
    { 
      icon: IconBrandLinkedin, 
      label: 'LinkedIn', 
      hoverColor: 'hover:text-blue-500',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPageUrl}`,
      title: 'Distribuie pe LinkedIn'
    },
    {
      icon: IconBrandWhatsapp,
      label: 'WhatsApp',
      hoverColor: 'hover:text-green-400',
      href: `https://api.whatsapp.com/send?text=${shareText} ${encodedPageUrl}`,
      title: 'Distribuie pe WhatsApp'
    },
  ];

  return (
    <footer className="bg-dark-surface text-text-light py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {showEasterEgg && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-coral via-primary-warm to-accent-coral opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
            🍳✨🥘
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          onClick={handleLogoClick}
          className={`font-display text-xl sm:text-2xl font-bold text-primary mb-6 sm:mb-8 opacity-80 cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 select-none ${
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

        <h4 className="text-lg font-semibold text-text-light opacity-90 mb-4">
          Răspândește vestea!
        </h4>

        <div className="flex justify-center gap-4 mb-6 sm:mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={social.label}
              href={pageUrl ? social.href : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full bg-surface-white/10 backdrop-blur-sm border border-surface-white/20 transition-all duration-300 hover:bg-surface-white/20 hover:transform hover:-translate-y-1 ${social.hoverColor} group`}
              title={social.title}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={social.title}
              onClick={(e) => { if (!pageUrl) e.preventDefault(); }}
            >
              <social.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </div>

        <p className="opacity-70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
          {copyrightText}
        </p>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <a
            href="/politica-de-confidentialitate"
            target="_blank"
            rel="noreferrer"
            className="text-text-light opacity-70 no-underline text-xs sm:text-sm hover:opacity-100 transition-all duration-200 py-1 px-1 inline-block hover:text-accent-coral"
            aria-label={privacyPolicyLabel}
          >
            {privacyPolicyLabel}
          </a>
          
          <span className="hidden sm:inline opacity-50">|</span>

          <a
            href="mailto:contact@coquinate.ro"
            className="text-text-light opacity-70 no-underline text-xs sm:text-sm hover:opacity-100 transition-all duration-200 py-1 px-1 inline-flex items-center gap-2 hover:text-accent-coral"
            aria-label="Contactează-ne prin email"
          >
            <IconMail size={16} />
            <span>Contactează-ne</span>
          </a>
        </div>

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
