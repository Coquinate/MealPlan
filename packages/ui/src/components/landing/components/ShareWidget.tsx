'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IconShare2, 
  IconBrandFacebook, 
  IconBrandWhatsapp, 
  IconMail, 
  IconCopy, 
  IconCheck 
} from '@tabler/icons-react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { m } from '../../../motion/config';

export interface ShareWidgetProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
}

/**
 * Share widget component with social media sharing buttons.
 * Supports native sharing API and fallback to individual social platforms.
 */
export function ShareWidget({
  url: propUrl,
  className = '',
}: ShareWidgetProps) {
  const { t } = useTranslation('landing');
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(propUrl || '');
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Prevent SSR/Hydration mismatch by setting URL and mounted state after mount
  useEffect(() => {
    setMounted(true);
    if (!propUrl && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [propUrl]);

  const shareData = {
    title: t('share.title'),
    text: t('share.description'),
    url: currentUrl,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.title} - ${currentUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text}\n\n${currentUrl}`)}`,
  };

  // Static variant - no floating animation for maximum button stability
  const staticVariant = {
    initial: { y: 0 },
    animate: { y: 0 } // Completely static positioning for stable click targets
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <m.div 
      className={`relative z-50 ${className}`} // Added z-index for stable positioning above background elements
      variants={staticVariant}
      initial="initial"
      animate="animate"
    >
      <m.p 
        className="text-xs font-semibold mb-3 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('share.help_us')}
      </m.p>

      <m.div 
        className="flex justify-center gap-3 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.1 }}
      >
        {/* Native Share (mobile) - only render after mount to prevent hydration mismatch */}
        {mounted && typeof window !== 'undefined' && 'share' in navigator && (
          <m.button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700"
            aria-label={t('share.share')}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <IconShare2 size={14} aria-hidden="true" />
            {t('share.share')}
          </m.button>
        )}

        {/* Facebook */}
        <m.a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-white rounded-lg text-xs font-medium bg-brand-facebook hover:bg-brand-facebook-hover"
          aria-label={t('share.facebook', 'Partajează pe Facebook')}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <IconBrandFacebook size={14} aria-hidden="true" />
          {t('share.facebook', 'Facebook')}
        </m.a>

        {/* WhatsApp */}
        <m.a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-white rounded-lg text-xs font-medium bg-brand-whatsapp hover:bg-brand-whatsapp-hover"
          aria-label={t('share.whatsapp', 'Partajează pe WhatsApp')}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <IconBrandWhatsapp size={14} aria-hidden="true" />
          {t('share.whatsapp', 'WhatsApp')}
        </m.a>

        {/* Email */}
        <m.a
          href={shareLinks.email}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-xs font-medium hover:bg-gray-700"
          aria-label={t('share.email', 'Trimite prin email')}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <IconMail size={14} aria-hidden="true" />
          {t('share.email', 'Email')}
        </m.a>

        {/* Copy Link */}
        <m.button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 bg-surface-hover border border-border text-text-primary rounded-lg text-xs font-medium hover:bg-surface-hover/80"
          aria-label={copied ? t('share.copied') : t('share.copy')}
          aria-live="polite"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <m.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <IconCheck size={14} className="text-green-600" aria-hidden="true" />
                {t('share.copied')}
              </m.span>
            ) : (
              <m.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <IconCopy size={14} aria-hidden="true" />
                {t('share.copy')}
              </m.span>
            )}
          </AnimatePresence>
        </m.button>
      </m.div>
    </m.div>
  );
}