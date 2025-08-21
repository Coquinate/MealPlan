import { cva } from 'class-variance-authority';

/**
 * Container styles pentru fiecare variantă de EmailCapture
 */
export const emailCaptureContainerVariants = cva('', {
  variants: {
    variant: {
      glass: 'max-w-md mx-auto relative',
      simple: '',
      inline: '',
      mockup: 'max-w-lg mx-auto',
    },
  },
  defaultVariants: {
    variant: 'glass',
  },
});

/**
 * Form wrapper styles pentru fiecare variantă
 */
export const emailCaptureFormVariants = cva('', {
  variants: {
    variant: {
      glass: 'space-y-4',
      simple: 'space-y-4',
      inline: 'flex gap-2 items-end',
      mockup: 'space-y-4',
    },
  },
  defaultVariants: {
    variant: 'glass',
  },
});

/**
 * Input field styles pentru fiecare variantă
 */
export const emailInputVariants = cva('', {
  variants: {
    variant: {
      glass: 'glass-input w-full focus-glass text-text placeholder:text-text-muted/60 placeholder:font-normal transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed',
      simple: 'w-full px-6 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-warm focus:border-primary-warm transition-all duration-200 disabled:opacity-60 placeholder:text-text-muted/60 placeholder:font-normal',
      inline: 'w-full px-5 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-warm focus:border-primary-warm transition-all duration-200 disabled:opacity-60 placeholder:text-text-muted/60 placeholder:font-normal',
      mockup: 'flex-1 px-5 py-[0.875rem] border-2 border-border-subtle rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)] transition-all duration-200 disabled:opacity-60 placeholder:text-text-muted-secondary placeholder:opacity-60 placeholder:font-normal text-base text-text-high-contrast',
    },
  },
  defaultVariants: {
    variant: 'glass',
  },
});

/**
 * Submit button base styles
 */
export const submitButtonBaseVariants = cva(
  'font-semibold rounded-md flex items-center justify-center transition-all duration-300 focus-premium-warm disabled:hover:shadow-none',
  {
    variants: {
      variant: {
        glass: 'w-full h-11 px-6 font-display',
        simple: 'w-full px-6 py-3 rounded-md transition-all duration-200',
        inline: 'px-4 py-2 font-medium whitespace-nowrap transition-all duration-200',
        mockup: 'px-8 py-[0.875rem] rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'glass',
    },
  }
);

/**
 * Submit button state styles
 */
export const getSubmitButtonStateStyles = (
  variant: 'glass' | 'simple' | 'inline' | 'mockup',
  isLoading: boolean,
  isSuccess: boolean,
  isDisabled: boolean
) => {
  const baseStyles: Record<string, string> = {
    glass: 'bg-gradient-to-r from-primary-warm to-primary-warm-light text-white hover:shadow-sm',
    simple: 'bg-primary-warm text-white hover:bg-primary-dark',
    inline: 'bg-primary-warm text-white hover:bg-primary-dark',
    mockup: 'bg-primary text-white hover:bg-primary-600',
  };

  if (isLoading) {
    return variant === 'glass' ? 'bg-primary-warm/70 cursor-wait' : 'cursor-wait opacity-75';
  }

  if (isSuccess) {
    return 'bg-success-600 text-white';
  }

  if (isDisabled) {
    return variant === 'mockup' 
      ? 'bg-[#cccccc] cursor-not-allowed'
      : 'opacity-50 cursor-not-allowed';
  }

  return baseStyles[variant];
};

/**
 * Status message styles pentru fiecare variantă
 */
export const statusMessageVariants = cva('text-sm text-center', {
  variants: {
    variant: {
      glass: 'text-romanian',
      simple: '',
      inline: 'absolute top-full left-0 mt-1',
      mockup: 'font-medium',
    },
    type: {
      error: 'text-danger-600 font-medium',
      success: 'text-success-600 font-medium',
      idle: 'text-text-muted',
    },
  },
  defaultVariants: {
    variant: 'glass',
    type: 'idle',
  },
});

/**
 * Glass container specific styles
 */
export const glassContainerStyles = {
  container: 'glass glass-elevated rounded-card p-6 sm:p-8 relative z-10 hover-lift',
  innerGlow: 'absolute inset-0 bg-gradient-to-br from-primary-warm/5 to-accent-coral/5 rounded-card pointer-events-none',
  contentWrapper: 'relative z-10',
  ctaText: 'text-lg text-text-secondary mb-6 text-center font-display text-romanian',
};

/**
 * Mockup container specific styles
 */
export const mockupContainerStyles = {
  container: 'bg-white border-2 border-border-light rounded-xl p-8 shadow-email-card',
  title: 'font-display text-form-title font-semibold mb-4 text-text-high-contrast leading-relaxed',
  formRow: 'flex gap-3 mb-2',
  benefitsList: 'mt-4 flex flex-col gap-2 text-sm text-text-muted-secondary',
  benefitItem: 'flex items-center gap-2',
  checkIcon: 'text-accent-coral font-bold',
};