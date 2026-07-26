/**
 * Cryptographic & Security Utilities for Inline Pipeline
 */

// Simulated SHA-256 digest calculation
export function generateSHA256(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${hex}`;
}

// Simulated Digital Signature using RSA-4096 / ECC
export function generateDigitalSignature(data: string, keyId: string): string {
  const time = Date.now();
  const hash = generateSHA256(data + keyId + time);
  return `SIG-RSA4096-${hash.substring(7, 24).toUpperCase()}`;
}

// PII Detection Engine (Regex scanner for SSNs, Credit Cards, Emails, API Keys)
export interface PIIDectionResult {
  hasPII: boolean;
  detectedTypes: string[];
  redactedText: string;
  maskedCount: number;
}

export function detectAndRedactPII(text: string): PIIDectionResult {
  const detectedTypes: string[] = [];
  let redacted = text;
  let maskedCount = 0;

  // SSN Pattern (XXX-XX-XXXX)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  if (ssnRegex.test(text)) {
    detectedTypes.push('Social Security Number (SSN)');
    redacted = redacted.replace(ssnRegex, '[REDACTED SSN ***-**-****]');
    maskedCount++;
  }

  // Credit Card Pattern (16 digits)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  if (ccRegex.test(text)) {
    detectedTypes.push('Credit Card Number (PCI)');
    redacted = redacted.replace(ccRegex, '[REDACTED PCI ****-****-****-****]');
    maskedCount++;
  }

  // Email Pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (emailRegex.test(text)) {
    detectedTypes.push('Personal Email Address');
    redacted = redacted.replace(emailRegex, (match) => {
      const parts = match.split('@');
      return `${parts[0][0]}***@${parts[1]}`;
    });
    maskedCount++;
  }

  // API Key / Secret Key Pattern
  const apiKeyRegex = /\b(sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g;
  if (apiKeyRegex.test(text)) {
    detectedTypes.push('AWS / API Secret Key');
    redacted = redacted.replace(apiKeyRegex, '[REDACTED API SECRET TOKEN]');
    maskedCount++;
  }

  return {
    hasPII: detectedTypes.length > 0,
    detectedTypes,
    redactedText: redacted,
    maskedCount
  };
}

// AES-256 Mock Encryption / Decryption with Base64 Tag
export function encryptAES256(text: string, key: string): { ciphertext: string; iv: string; tag: string } {
  const iv = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const tag = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  
  // Simple obfuscated Base64 simulation for prototype preview
  const encoded = btoa(encodeURIComponent(text));
  const ciphertext = `ENC::AES256-GCM::${iv}::${encoded}::${tag.substring(0, 8)}`;

  return {
    ciphertext,
    iv: `0x${iv}`,
    tag: `0x${tag}`
  };
}

export function decryptAES256(ciphertext: string, key: string): string {
  try {
    if (!ciphertext.startsWith('ENC::AES256-GCM::')) {
      return ciphertext;
    }
    const parts = ciphertext.split('::');
    const encoded = parts[3];
    return decodeURIComponent(atob(encoded));
  } catch (err) {
    return '[DECRYPTION ERROR: Invalid key or corrupted MAC tag]';
  }
}

// Tokenization Helper
export function tokenizeData(value: string, prefix = 'TOKN'): string {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${rand}-SECURE`;
}

// Digital Watermark generator
export function generateWatermark(userEmail: string, ip: string): string {
  const now = new Date().toISOString();
  return `CLASSIFIED - ACCESS BY ${userEmail} (${ip}) - TIMESTAMP ${now} - CLOUD-SECURITY-PLATFORM`;
}
