import { Variants } from 'framer-motion';

/**
 * Standard fade variants pentru Framer Motion v12
 */
export const fadeVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

/**
 * Slide up variants cu v12 API
 */
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // easeInOut
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  },
};

/**
 * Scale variants pentru hover effects
 */
export const scaleVariants: Variants = {
  idle: { 
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1], // easeOut
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
};

/**
 * Stagger container pentru liste
 */
export const staggerContainerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
};

/**
 * Stagger item variants
 */
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

/**
 * Float animation pentru particles și floating elements
 */
export const floatVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

/**
 * Rotate variants pentru loading spinners
 */
export const rotateVariants: Variants = {
  initial: { 
    rotate: 0 
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }
  },
};

/**
 * Drawer/Sheet variants pentru mobile navigation
 */
export const drawerVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

/**
 * Modal overlay variants
 */
export const overlayVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    }
  },
};

/**
 * Modal content variants
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.15,
    }
  },
};

/**
 * Workflow step variants pentru timeline animations
 */
export const workflowStepVariants: Variants = {
  inactive: {
    opacity: 0.5,
    scale: 0.95,
  },
  active: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  complete: {
    opacity: 0.8,
    scale: 1,
    transition: {
      duration: 0.2,
    }
  },
};

/**
 * Particle animation variants pentru FloatingParticles
 */
export const particleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: (custom: { x: number; y: number; duration: number }) => ({
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1, 0],
    x: custom.x,
    y: custom.y,
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      ease: 'linear',
    }
  }),
};

/**
 * Share button pulse animation
 */
export const pulseVariants: Variants = {
  initial: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

/**
 * Sound toggle rotation variants
 */
export const soundToggleVariants: Variants = {
  muted: {
    rotate: 0,
    scale: 1,
  },
  unmuted: {
    rotate: [0, -10, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};