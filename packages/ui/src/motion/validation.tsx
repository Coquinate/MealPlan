'use client';

import { m, AnimatePresence } from './config';
import { LazyMotion, domAnimation } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Validation state animations
 * Error shake, success checkmark, warning pulse
 */
const validationVariants = {
  idle: { 
    x: 0,
    borderColor: 'var(--border-color, #e5e7eb)'
  },
  error: {
    x: [0, -10, 10, -10, 10, 0],
    borderColor: 'var(--error-color, #ef4444)',
    transition: {
      x: { 
        duration: 0.4,
        ease: 'easeInOut' as const
      },
      borderColor: { 
        duration: 0.2 
      }
    }
  },
  success: {
    borderColor: 'var(--success-color, #10b981)',
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  },
  warning: {
    borderColor: 'var(--warning-color, #f59e0b)',
    transition: { 
      duration: 0.2 
    }
  },
  focus: {
    borderColor: 'var(--primary-color, #6366f1)',
    transition: { 
      duration: 0.15 
    }
  }
};

/**
 * Message animation variants
 * Smooth enter/exit for validation messages
 */
const messageVariants = {
  initial: { 
    opacity: 0,
    y: -10,
    height: 0
  },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.6, 1] as [number, number, number, number]
    }
  }
};

/**
 * Success checkmark animation
 * SVG path drawing animation
 */
const checkmarkVariants = {
  hidden: { 
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      },
      opacity: { 
        duration: 0.2 
      }
    }
  }
};

interface ValidatedInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  warning?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
}

/**
 * Input component with validation animations
 * Supports error shake, success state, and warning indicators
 */
export function ValidatedInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  warning,
  className = '',
  required = false,
  disabled = false,
  name,
  id
}: ValidatedInputProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine current validation state
  const state = error ? 'error' : 
                success ? 'success' : 
                warning ? 'warning' :
                isFocused ? 'focus' : 'idle';
  
  const message = error || warning;
  const messageType = error ? 'error' : warning ? 'warning' : 'success';
  
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative">
        <m.div
          variants={shouldReduceMotion ? {} : validationVariants}
          animate={state}
          className="relative"
        >
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-2 border-2 rounded-lg
              transition-colors duration-200
              focus:outline-none
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${className}
            `}
            style={{
              borderColor: state === 'error' ? 'var(--error-color, #ef4444)' :
                          state === 'success' ? 'var(--success-color, #10b981)' :
                          state === 'warning' ? 'var(--warning-color, #f59e0b)' :
                          state === 'focus' ? 'var(--primary-color, #6366f1)' :
                          'var(--border-color, #e5e7eb)'
            }}
            required={required}
            disabled={disabled}
            name={name}
            id={id}
            aria-invalid={!!error}
            aria-describedby={message ? `${id}-message` : undefined}
          />
          
          {/* Success checkmark icon */}
          {success && !shouldReduceMotion && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <m.path
                  d="M7 10L9 12L13 8"
                  stroke="var(--success-color, #10b981)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkmarkVariants}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </div>
          )}
        </m.div>
        
        {/* Validation message */}
        <AnimatePresence mode="wait">
          {message && (
            <m.div
              key={message}
              variants={shouldReduceMotion ? {} : messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`
                mt-1 text-sm
                ${messageType === 'error' ? 'text-red-600' : 
                  messageType === 'warning' ? 'text-yellow-600' : 
                  'text-green-600'}
              `}
              id={`${id}-message`}
              role="alert"
            >
              {message}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * Form field wrapper with animated label
 * Floats label on focus/fill
 */
export function FormField({
  label,
  children,
  error,
  required = false,
  className = ''
}: FormFieldProps) {
  const [hasValue, setHasValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const labelVariants = {
    default: {
      y: 0,
      scale: 1,
      color: 'var(--text-secondary, #6b7280)'
    },
    float: {
      y: -24,
      scale: 0.85,
      color: error ? 'var(--error-color, #ef4444)' : 
             isFocused ? 'var(--primary-color, #6366f1)' : 
             'var(--text-secondary, #6b7280)',
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <div className={`relative ${className}`}>
        <m.label
          className="absolute left-4 top-2 origin-left pointer-events-none"
          variants={labelVariants}
          initial="default"
          animate={(hasValue || isFocused) ? "float" : "default"}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </m.label>
        
        <div
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e: any) => {
            const input = e.target as HTMLInputElement;
            setHasValue(!!input.value);
          }}
        >
          {children}
        </div>
        
        <AnimatePresence mode="wait">
          {error && (
            <m.div
              variants={shouldReduceMotion ? {} : messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

/**
 * Password strength indicator with animated bars
 * Visual feedback for password complexity
 */
export function PasswordStrength({
  password,
  className = ''
}: PasswordStrengthProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Calculate password strength (simplified)
  const getStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };
  
  const strength = getStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'var(--error-color, #ef4444)',
    'var(--warning-color, #f59e0b)',
    'var(--info-color, #3b82f6)',
    'var(--success-color, #10b981)'
  ];
  
  const barVariants = {
    empty: { 
      scaleX: 0,
      backgroundColor: '#e5e7eb'
    },
    filled: (i: number) => ({
      scaleX: 1,
      backgroundColor: strengthColors[strength - 1],
      transition: {
        scaleX: {
          duration: shouldReduceMotion ? 0 : 0.3,
          delay: shouldReduceMotion ? 0 : i * 0.1,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
        },
        backgroundColor: {
          duration: 0.2
        }
      }
    })
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <div className={`mt-2 ${className}`}>
        <div className="flex space-x-1 mb-1">
          {[0, 1, 2, 3].map((i) => (
            <m.div
              key={i}
              className="h-1 flex-1 rounded-full origin-left"
              style={{ backgroundColor: '#e5e7eb' }}
              variants={barVariants}
              initial="empty"
              animate={i < strength ? "filled" : "empty"}
              custom={i}
            />
          ))}
        </div>
        {password && (
          <m.p
            className="text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: strengthColors[Math.max(0, strength - 1)] }}
          >
            {strengthLabels[Math.max(0, strength - 1)]}
          </m.p>
        )}
      </div>
    </LazyMotion>
  );
}

interface SubmitButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Submit button with loading and success states
 * Morphs between states with smooth animations
 */
export function SubmitButton({
  children,
  isLoading = false,
  isSuccess = false,
  disabled = false,
  onClick,
  className = ''
}: SubmitButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const buttonVariants = {
    idle: {
      scale: 1,
      backgroundColor: 'var(--primary-color, #6366f1)'
    },
    loading: {
      scale: 0.95,
      backgroundColor: 'var(--primary-color, #6366f1)',
      transition: { duration: 0.2 }
    },
    success: {
      scale: 1,
      backgroundColor: 'var(--success-color, #10b981)',
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.15 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.075 }
    }
  };
  
  const state = isSuccess ? 'success' : isLoading ? 'loading' : 'idle';
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.button
        className={`
          relative px-6 py-2 rounded-lg text-white font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        variants={shouldReduceMotion ? {} : buttonVariants}
        initial="idle"
        animate={state}
        whileHover={disabled || isLoading ? undefined : "hover"}
        whileTap={disabled || isLoading ? undefined : "tap"}
        onClick={disabled || isLoading ? undefined : onClick}
        disabled={disabled || isLoading}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <m.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </m.div>
          ) : isSuccess ? (
            <m.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              ✓
            </m.div>
          ) : (
            <m.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </m.div>
          )}
        </AnimatePresence>
      </m.button>
    </LazyMotion>
  );
}

/**
 * Export all validation components for convenience
 */
export const validationComponents = {
  ValidatedInput,
  FormField,
  PasswordStrength,
  SubmitButton
};