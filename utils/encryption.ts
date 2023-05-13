import crypto from 'crypto';

// Generate an RSA key pair
export function generateKeyPair(): crypto.KeyPairSyncResult<crypto.RSAKeyPairKeyObjectOptions> {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
}

// Generate a random 256-bit AES key
export function generateAesKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Encrypt data with AES-256-CBC
export function encryptWithAes(data: string, key: string, iv: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt data with AES-256-CBC
export function decryptWithAes(encryptedData: string, key: string, iv: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Encrypt data with RSA-OAEP
export function encryptWithRsa(data: string, publicKey: string): string {
  const buffer = Buffer.from(data, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

// Decrypt data with RSA-OAEP
export function decryptWithRsa(encryptedData: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}

// Sign data with RSA-SHA256
export function signWithRsa(data: string, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  return sign.sign(privateKey, 'base64');
}

// Verify RSA-SHA256 signature
export function verifySignatureWithRsa(data: string, signature: string, publicKey: string): boolean {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  return verify.verify(publicKey, signature, 'base64');
}
