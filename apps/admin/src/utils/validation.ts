/**
 * Input validation utilities for admin forms
 */

/**
 * Validate 2FA token format
 */
export function validate2FAToken(token: string): {
  isValid: boolean;
  error?: string;
} {
  // Remove any spaces or dashes
  const cleanToken = token.replace(/[\s-]/g, '');

  // Check if empty
  if (!cleanToken) {
    return {
      isValid: false,
      error: 'Codul de verificare este obligatoriu',
    };
  }

  // Check length
  if (cleanToken.length !== 6) {
    return {
      isValid: false,
      error: 'Codul trebuie să aibă exact 6 cifre',
    };
  }

  // Check if all characters are digits
  if (!/^\d{6}$/.test(cleanToken)) {
    return {
      isValid: false,
      error: 'Codul trebuie să conțină doar cifre',
    };
  }

  // Check for common invalid patterns
  if (cleanToken === '000000' || cleanToken === '123456') {
    return {
      isValid: false,
      error: 'Cod invalid',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Sanitize 2FA token input
 */
export function sanitize2FAToken(token: string): string {
  // Remove any non-digit characters
  return token.replace(/\D/g, '').slice(0, 6);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return {
      isValid: false,
      error: 'Email-ul este obligatoriu',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Format email invalid',
    };
  }

  // Check for common test/fake emails
  const blockedDomains = ['test.com', 'example.com', 'temp-mail.org'];
  const domain = email.split('@')[1];
  if (blockedDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Domeniu email invalid',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (!password) {
    return {
      isValid: false,
      strength,
      errors: ['Parola este obligatorie'],
    };
  }

  if (password.length < 8) {
    errors.push('Parola trebuie să aibă cel puțin 8 caractere');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mare');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mică');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o cifră');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin un caracter special');
  }

  // Calculate strength
  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Validate and sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): {
  isValid: boolean;
  error?: string;
} {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Fișierul este prea mare. Maxim ${sizeMB}MB`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tip de fișier invalid',
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Extensie invalidă. Permise: ${allowedExtensions.join(', ')}`,
    };
  }

  return {
    isValid: true,
  };
}
