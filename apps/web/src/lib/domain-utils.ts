/**
 * Domain utilities for handling multiple domains
 * Supports both coquinate.ro and coquinate.com
 */

import { ReadonlyHeaders } from 'next/headers';

export function getDomain(headers?: ReadonlyHeaders): 'ro' | 'com' {
  if (!headers) {
    // Default to .ro in development
    return 'ro';
  }

  const host = headers.get('host') || '';
  
  if (host.includes('coquinate.com')) {
    return 'com';
  }
  
  // Default to .ro (includes localhost, coquinate.ro, etc.)
  return 'ro';
}

export function getCanonicalUrl(pathname: string, domain?: 'ro' | 'com'): string {
  const baseDomain = domain === 'com' 
    ? 'https://coquinate.com' 
    : 'https://coquinate.ro';
  
  return `${baseDomain}${pathname}`;
}

export function getAlternateUrls(pathname: string): { ro: string; com: string } {
  return {
    ro: `https://coquinate.ro${pathname}`,
    com: `https://coquinate.com${pathname}`,
  };
}

export function shouldRedirectDomain(headers: ReadonlyHeaders): boolean {
  // În viitor, poți implementa logică pentru a redirecționa
  // utilizatorii români automat la .ro
  // Pentru acum, ambele domenii funcționează independent
  return false;
}

export type DomainConfig = {
  domain: 'ro' | 'com';
  language: 'ro' | 'en';
  currency: 'RON' | 'EUR';
  country: 'RO' | 'EU';
  locale: 'ro-RO' | 'en-EU';
};

export function getDomainConfig(domain: 'ro' | 'com'): DomainConfig {
  if (domain === 'com') {
    return {
      domain: 'com',
      language: 'en',
      currency: 'EUR',
      country: 'EU',
      locale: 'en-EU',
    };
  }
  
  return {
    domain: 'ro',
    language: 'ro',
    currency: 'RON',
    country: 'RO',
    locale: 'ro-RO',
  };
}

export function getCurrencyForDomain(domain: 'ro' | 'com'): string {
  return domain === 'com' ? 'EUR' : 'RON';
}

export function getDefaultLocaleForDomain(domain: 'ro' | 'com'): string {
  return domain === 'com' ? 'en' : 'ro';
}

export function formatCurrency(amount: number, domain: 'ro' | 'com'): string {
  const config = getDomainConfig(domain);
  
  if (config.currency === 'RON') {
    return `${amount} RON`;
  } else {
    return `€${amount}`;
  }
}

export function getDomainFromHeaders(headers: ReadonlyHeaders): 'ro' | 'com' {
  return getDomain(headers);
}