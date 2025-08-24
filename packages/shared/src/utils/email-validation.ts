import { z } from 'zod';

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
 * Validate email with comprehensive checks
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
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
  
  return {
    isValid,
    errors,
    isDisposable,
    isMalicious
  };
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