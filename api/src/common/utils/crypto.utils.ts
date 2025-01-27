import * as crypto from 'crypto';

const IV_LENGTH = 16; // AES requires a 16-byte IV

export function encryptToken(token: string, secretKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey, 'utf8'),
    iv,
  );

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted; // Combine IV and encrypted data
}

export function decryptToken(
  encryptedToken: string,
  secretKey: string,
): string {
  const [iv, encrypted] = encryptedToken.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey, 'utf8'),
    Buffer.from(iv, 'hex'),
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
