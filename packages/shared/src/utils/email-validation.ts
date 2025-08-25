import { z } from 'zod';

// Global type declaration for Deno (optional)
declare global {
  var Deno: {
    env: {
      get: (key: string) => string | undefined;
    };
  } | undefined;
}

/**
 * RFC 5321 compliant email validation
 * Max email length: 254 characters
 * Max local part: 64 characters
 */
export const MAX_EMAIL_LENGTH = 254;
export const MAX_LOCAL_PART_LENGTH = 64;

/**
 * Comprehensive list of disposable/temporary email domains
 * Updated regularly to block fake email services
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular disposable email services
  '10minutemail.com', '10minutemail.net', '20minutemail.com', '2prong.com',
  '30minutemail.com', '3d-game.com', '4warding.com', '7tags.com',
  'guerillamail.com', 'guerillamail.net', 'guerillamail.org', 'guerillamail.biz',
  'mailinator.com', 'mailinator2.com', 'mailinator.net', 'mailinator.org',
  'tempmail.org', 'temp-mail.org', 'temporary-mail.net', 'throwaway.email',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf',
  'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj',
  'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  'monmail.fr.nf', 'hide.biz.st', 'mymail.infos.st',
  
  // Newer services
  'maildrop.cc', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com',
  'pokemail.net', 'spam4.me', 'bccto.me', 'chacuo.net', 'disposableemailaddresses.com',
  'email60.com', 'emailias.com', 'emailsensei.com', 'emailtemporanea.com',
  'fakeinbox.com', 'get-mail.tk', 'getairmail.com', 'getnada.com',
  'gmailnator.com', 'h8s.org', 'harakirimail.com', 'imails.info',
  'inboxalias.com', 'jetable.com', 'jetable.net', 'jetable.org',
  'link2mail.net', 'm4ilweb.info', 'mail-temporaire.fr', 'mail.by',
  'mail.mezimages.net', 'mailcatch.com', 'maildx.com', 'mailexpire.com',
  'mailfreeonline.com', 'mailguard.me', 'mailimate.com', 'mailin8r.com',
  'mailmetrash.com', 'mailnull.com', 'mailshell.com', 'mailsight.com',
  'mailtemp.info', 'mailtothis.com', 'mailzilla.com', 'mailzilla.org',
  'mbx.cc', 'mintemail.com', 'mt2009.com', 'mx0.wwwnew.eu',
  'mytemp.email', 'neverbox.com', 'no-spam.ws', 'nobugmail.com',
  'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx', 'notmailinator.com',
  'nowmymail.com', 'objectmail.com', 'obobbo.com', 'odaymail.com',
  'one-time.email', 'onewaymail.com', 'ordinaryamerican.net', 'otherinbox.com',
  'ovpn.to', 'owlpic.com', 'pancakemail.com', 'pcusers.otherinbox.com',
  'pjkix.com', 'plexolan.de', 'poofy.org', 'pookmail.com',
  'privacy.net', 'proxymail.eu', 'putthisinyourspamdatabase.com',
  'quickinbox.com', 'rcpt.at', 'recode.me', 'recursor.net',
  'regbypass.com', 'rhyta.com', 'rmqkr.net', 'rppkn.com',
  's0ny.net', 'safe-mail.net', 'safetymail.info', 'safetypost.de',
  'sandelf.de', 'saynotospams.com', 'selfdestructingmail.com',
  'sendspamhere.com', 'shieldedmail.com', 'skeefmail.com',
  'slaskpost.se', 'slopsbox.com', 'smellfear.com', 'snakemail.com',
  'sneakemail.com', 'snkmail.com', 'sofort-mail.de', 'sogetthis.com',
  'soodonims.com', 'spam4.me', 'spamavert.com', 'spambob.net',
  'spambob.org', 'spambog.com', 'spambog.de', 'spambog.ru',
  'spambox.info', 'spamcannon.com', 'spamcannon.net', 'spamcon.org',
  'spamcorptastic.com', 'spamcowboy.com', 'spamcowboy.net',
  'spamcowboy.org', 'spamday.com', 'spamex.com', 'spamfree24.com',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.net', 'spamfree24.org',
  'spamgoes.com', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spamherelots.com', 'spamhereplease.com', 'spamhole.com',
  'spami.spam.co.za', 'spaml.com', 'spaml.de', 'spammotel.com',
  'spamobox.com', 'spamoff.de', 'spamslicer.com', 'spamspot.com',
  'spamthis.co.uk', 'spamthisplease.com', 'spamtrail.com', 'spamtroll.net',
  'speed.1s.fr', 'spoofmail.de', 'stuffmail.de', 'super-auswahl.de',
  'supergreatmail.com', 'supermailer.jp', 'superrito.com',
  'superstachel.de', 'suremail.info', 'talkinator.com', 'tamemail.com',
  'temp-mail.ru', 'temp.emeraldwebmail.com', 'temp.headstrong.de',
  'tempalias.com', 'tempe-mail.com', 'tempemail.biz', 'tempemail.com',
  'tempinbox.co.uk', 'tempinbox.com', 'tempmail.eu', 'tempmaildemo.com',
  'tempmailer.com', 'tempmailer.de', 'tempomail.fr', 'temporarily.de',
  'temporaryemail.net', 'temporaryforwarding.com', 'temporaryinbox.com',
  'temporarymailaddress.com', 'tempthe.net', 'thankyou2010.com',
  'thecloudindex.com', 'themba.co.za', 'thisisnotmyrealemail.com',
  'throam.com', 'throwam.com', 'throwawayemailaddress.com',
  'tilien.com', 'tittbit.in', 'tmailinator.com', 'toiea.com',
  'tradermail.info', 'trash-amil.com', 'trash-mail.at', 'trash-mail.com',
  'trash-mail.de', 'trash2009.com', 'trashdevil.com', 'trashemail.de',
  'trashmail.at', 'trashmail.com', 'trashmail.de', 'trashmail.me',
  'trashmail.net', 'trashmail.org', 'trashmail.ws', 'trashmailer.com',
  'trashymail.com', 'trashymail.net', 'trbvm.com', 'trialmail.de',
  'trillianpro.com', 'tryalert.com', 'turual.com', 'twinmail.de',
  'twoweirdtricks.com', 'tyldd.com', 'u14269.ml', 'ubismail.net',
  'uggsrock.com', 'umail.net', 'upliftnow.com', 'uplipht.com',
  'uroid.com', 'us.af', 'venompen.com', 'veryrealemail.com',
  'viditag.com', 'viewcastmedia.com', 'viewcastmedia.net',
  'viewcastmedia.org', 'vomoto.com', 'vpn.st', 'vsimcard.com',
  'vubby.com', 'wasteland.rfc822.org', 'webemail.me', 'weg-werf-email.de',
  'wegwerf-emails.de', 'wegwerfadresse.de', 'wegwerfemail.de',
  'wegwerfmail.de', 'wegwerfmail.info', 'wegwerfmail.net',
  'wegwerfmail.org', 'wetrainbayarea.com', 'wetrainbayarea.org',
  'wh4f.org', 'whopy.com', 'willhackforfood.biz', 'willselldrugs.com',
  'wuzup.net', 'wuzupmail.net', 'www.e4ward.com', 'www.gishpuppy.com',
  'www.mailinator.com', 'wwwnew.eu', 'x.ip6.li', 'xagloo.com',
  'xemaps.com', 'xents.com', 'xmaily.com', 'xoxy.net',
  'yapped.net', 'yep.it', 'yogamaven.com', 'yomail.info',
  'yuurok.com', 'zehnminutenmail.de', 'zetmail.com', 'zoaxe.com',
  'zoemail.com', 'zoemail.net', 'zoemail.org', 'zombie.js.org',
  
  // Additional recent disposable domains (2024)
  'tmpnator.live', 'tempmail.plus', 'emailnax.com', 'inboxkitten.com',
  'tempmail.ninja', 'emaildrop.io', 'tempail.com', 'anonbox.net',
  'tmailor.com', 'luxusmail.org', 'tempmail.io', 'disposable.style',
]);

/**
 * Known malicious email domains (phishing, spam, malware)
 */
export const MALICIOUS_EMAIL_DOMAINS = new Set([
  // Known phishing domains
  'secure-paypal.com', 'paypal-secure.com', 'amazon-security.com',
  'microsoft-support.com', 'apple-security.com', 'google-security.com',
  'facebook-security.com', 'twitter-security.com', 'instagram-security.com',
  'linkedin-security.com', 'netflix-billing.com', 'spotify-billing.com',
  
  // Known spam domains
  'cheapviagra.com', 'freemoney.com', 'winbigtoday.com', 'lottery-winner.com',
  'miracle-cure.com', 'getrichquick.com', 'workfromhome.com',
  
  // Suspicious TLDs commonly used for malicious purposes
  // Note: These are examples - in production, use threat intelligence feeds
]);

/**
 * Shared email validation schema with comprehensive security
 */
export const EmailValidationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email este necesar')
    .max(MAX_EMAIL_LENGTH, `Email-ul nu poate depăși ${MAX_EMAIL_LENGTH} de caractere`)
    .email('Adresa de email nu este validă')
    .refine((email) => {
      const localPart = email.split('@')[0];
      return localPart && localPart.length <= MAX_LOCAL_PART_LENGTH;
    }, `Partea locală a email-ului nu poate depăși ${MAX_LOCAL_PART_LENGTH} de caractere`)
    .refine((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return domain && !DISPOSABLE_EMAIL_DOMAINS.has(domain);
    }, 'Email-urile temporare nu sunt permise. Te rugăm să folosești o adresă de email permanentă.')
    .refine((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return domain && !MALICIOUS_EMAIL_DOMAINS.has(domain);
    }, 'Acest domeniu de email nu este permis.')
    .transform((email) => email.toLowerCase().trim()),
    
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, 'Consimțământul GDPR este obligatoriu')
});

export type EmailValidation = z.infer<typeof EmailValidationSchema>;

/**
 * Frontend-safe email validation (without domain checks for UX)
 * Use this for real-time validation to avoid blocking user input
 */
export const FrontendEmailValidationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email este necesar')
    .max(MAX_EMAIL_LENGTH, `Email-ul nu poate depăși ${MAX_EMAIL_LENGTH} de caractere`)
    .email('Adresa de email nu este validă')
    .refine((email) => {
      const localPart = email.split('@')[0];
      return localPart && localPart.length <= MAX_LOCAL_PART_LENGTH;
    }, `Partea locală a email-ului nu poate depăși ${MAX_LOCAL_PART_LENGTH} de caractere`)
    .transform((email) => email.toLowerCase().trim()),
    
  gdprConsent: z.boolean()
});

/**
 * Validate email with comprehensive checks (synchronous version)
 * 
 * Implementation follows industry best practices:
 * - Uses ReDoS-safe regex patterns for security
 * - Avoids restrictive domain pattern matching that blocks legitimate custom domains
 * - Focuses on obviously fake domains and common typos only
 * - Allows all legitimate custom domains (like alex@ere.com)
 * - For DNS validation, use validateEmailWithDNS() for async verification
 */
export function validateEmail(email: string): {
  isValid: boolean;
  errors: string[];
  isDisposable: boolean;
  isMalicious: boolean;
} {
  const errors: string[] = [];
  let isValid = true;
  
  // Basic validation
  if (!email || email.length === 0) {
    errors.push('Email este necesar');
    isValid = false;
  }
  
  if (email.length > MAX_EMAIL_LENGTH) {
    errors.push(`Email-ul nu poate depăși ${MAX_EMAIL_LENGTH} de caractere`);
    isValid = false;
  }
  
  // Email format validation with ReDoS-safe regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.push('Adresa de email nu este validă');
    isValid = false;
  }
  
  // Local part validation
  const localPart = email.split('@')[0];
  if (localPart && localPart.length > MAX_LOCAL_PART_LENGTH) {
    errors.push(`Partea locală a email-ului nu poate depăși ${MAX_LOCAL_PART_LENGTH} de caractere`);
    isValid = false;
  }
  
  // Domain checks
  const domain = email.split('@')[1]?.toLowerCase();
  const isDisposable = domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
  const isMalicious = domain ? MALICIOUS_EMAIL_DOMAINS.has(domain) : false;
  
  if (isDisposable) {
    errors.push('Email-urile temporare nu sunt permise. Te rugăm să folosești o adresă de email permanentă.');
    isValid = false;
  }
  
  if (isMalicious) {
    errors.push('Acest domeniu de email nu este permis.');
    isValid = false;
  }
  
  // Basic domain format validation only - no restrictive pattern matching
  if (domain) {
    // Check for obviously invalid formats
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
      errors.push('Domeniul email-ului nu este valid.');
      isValid = false;
    }
    
    // Check for domains that are obviously test/fake
    const obviousTestPatterns = [
      /^test$/,                    // Just "test" domain
      /^example\.(com|org|net)$/,  // Example domains from RFC
      /^localhost$/,               // Localhost
      /^fake$/,                    // Just "fake" domain
      /^spam$/,                    // Just "spam" domain
    ];
    
    for (const pattern of obviousTestPatterns) {
      if (pattern.test(domain)) {
        errors.push('Acest domeniu de email pare să fie fictiv. Te rugăm să folosești o adresă de email validă.');
        isValid = false;
        break;
      }
    }
    
    // Warn about common typos in popular domains
    const popularDomainTypos = [
      { typo: 'gmai.com', correct: 'gmail.com' },
      { typo: 'gmial.com', correct: 'gmail.com' },  
      { typo: 'yahooo.com', correct: 'yahoo.com' },
      { typo: 'hotmial.com', correct: 'hotmail.com' },
      { typo: 'outlok.com', correct: 'outlook.com' },
    ];
    
    for (const { typo, correct } of popularDomainTypos) {
      if (domain === typo) {
        errors.push(`Ai vrut să scrii "${correct}" în loc de "${typo}"?`);
        isValid = false;
        break;
      }
    }
  }
  
  return {
    isValid,
    errors,
    isDisposable,
    isMalicious
  };
}

/**
 * Validate email with comprehensive checks including DNS/MX validation (async version)
 * 
 * This function provides complete email validation including:
 * - All synchronous validations from validateEmail()
 * - DNS/MX record validation for domain verification
 * - Industry-standard approach used by Stripe, Gmail, Mailchimp
 * 
 * Use this for final validation before accepting email addresses.
 */
export async function validateEmailWithDNS(email: string): Promise<{
  isValid: boolean;
  errors: string[];
  isDisposable: boolean;
  isMalicious: boolean;
  domainHasDNS: boolean;
  dnsError?: string;
}> {
  // Start with synchronous validation
  const syncResult = validateEmail(email);
  
  // If sync validation fails, no need to check DNS
  if (!syncResult.isValid) {
    return {
      ...syncResult,
      domainHasDNS: false,
    };
  }
  
  // Extract domain for DNS validation
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) {
    return {
      ...syncResult,
      isValid: false,
      errors: [...syncResult.errors, 'Email domain could not be extracted'],
      domainHasDNS: false,
    };
  }
  
  // Perform DNS validation
  try {
    const domainHasDNS = await validateDomainDNS(domain);
    
    // If domain doesn't exist in DNS, mark as invalid
    if (!domainHasDNS) {
      return {
        ...syncResult,
        isValid: false,
        errors: [...syncResult.errors, 'Domeniul email-ului nu există sau nu poate primi email-uri'],
        domainHasDNS: false,
      };
    }
    
    return {
      ...syncResult,
      domainHasDNS: true,
    };
    
  } catch (error) {
    console.warn('DNS validation error in validateEmailWithDNS:', error);
    
    // On DNS validation errors, we default to valid but flag the error
    // This prevents temporary DNS issues from blocking legitimate emails
    return {
      ...syncResult,
      domainHasDNS: false,
      dnsError: error instanceof Error ? error.message : 'DNS validation failed',
    };
  }
}

/**
 * Check if domain is disposable/temporary
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

/**
 * Check if domain is malicious
 */
export function isMaliciousEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? MALICIOUS_EMAIL_DOMAINS.has(domain) : false;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Frontend-safe regex for real-time validation
 * More permissive to avoid UX friction
 */
// Safe regex pattern to prevent ReDoS attacks - uses more specific character classes
// Avoids catastrophic backtracking by being more explicit about allowed characters
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Strict RFC 5322 compliant regex (use for final validation)
 */
export const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * DNS/MX record validation for domain verification
 * 
 * Implements industry best practices:
 * - Check if domain has valid MX or A records
 * - Used by major platforms like Stripe, Gmail, Mailchimp
 * - Prevents false positives on legitimate custom domains
 * - Works in conjunction with double opt-in verification
 * 
 * @param domain - Domain to validate
 * @returns Promise<boolean> - True if domain has valid DNS records
 */
export async function validateDomainDNS(domain: string): Promise<boolean> {
  try {
    // Get the Supabase URL from environment variables
    const supabaseUrl = typeof window !== 'undefined' 
      ? (window as any).ENV?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis.Deno?.env?.get?.('SUPABASE_URL'));
      
    if (!supabaseUrl) {
      console.warn('Supabase URL not found, skipping DNS validation');
      return true; // Default to valid when environment is not configured
    }
    
    // Call the Edge Function for DNS validation
    const response = await fetch(`${supabaseUrl}/functions/v1/validate-email-domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-function-secret': typeof window !== 'undefined'
          ? '' // Client-side calls don't include secret (handled by RLS)
          : process.env.VALIDATE_DOMAIN_SECRET || (globalThis.Deno?.env?.get?.('VALIDATE_DOMAIN_SECRET')) || '',
      },
      body: JSON.stringify({ domain }),
    });
    
    if (!response.ok) {
      console.warn('DNS validation request failed:', response.status);
      return true; // Default to valid on API errors for resilience
    }
    
    const result = await response.json();
    return result.isValid;
    
  } catch (error) {
    console.warn('DNS validation error:', error);
    // Default to valid on errors to prevent blocking legitimate domains
    // This matches the behavior of major email platforms
    return true;
  }
}