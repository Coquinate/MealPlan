/**
 * Simple encryption utilities for sensitive data in memory
 * Uses Web Crypto API for client-side encryption
 */

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Encrypt a string value
 */
export async function encryptString(
  text: string,
  key: CryptoKey
): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  return { encrypted, iv };
}

/**
 * Decrypt a string value
 */
export async function decryptString(
  encrypted: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as ArrayBufferView },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Create a session-based encryption context
 */
export class SessionEncryption {
  private key: CryptoKey | null = null;

  async initialize(): Promise<void> {
    this.key = await generateKey();
  }

  async encrypt(text: string): Promise<string> {
    if (!this.key) await this.initialize();

    const { encrypted, iv } = await encryptString(text, this.key!);

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(encryptedBase64: string): Promise<string> {
    if (!this.key) throw new Error('Encryption not initialized');

    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    return await decryptString(encrypted.buffer, iv, this.key);
  }

  // Clear the key from memory
  clear(): void {
    this.key = null;
  }
}
